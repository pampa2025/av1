#define T (iTime*5.)                    // Time scaled up 5x for animation speed
// Rotation matrix generator using mouse input (m)
#define A(v) mat2(cos(m.v*3.1416 + vec4(0, -1.5708, 1.5708, 0)))       // rotate
// Hue to RGB converter - creates color gradients
#define H(v) (cos(((v)+.5)*6.2832 + radians(vec3(60, 0, -60)))*.5+.5)  // hue

float map(vec3 u)
{
    float t = T,    // Animation speed based on time
          l = 5.,   // Loop count to reduce z-fighting artifacts
          w = 40.,  // Z-axis warp magnitude
          s = .4,   // Maximum object size
          f = 1e20, i = 0., y, z; // Distance field, counters, temp vars
    
    u.yz = -u.zy;    // Swap Y/Z axes and invert for alternative coordinate space
    u.xy = vec2(atan(u.x, u.y), length(u.xy));  // Convert XY to polar coordinates (angle, radius)
    u.x += t/6.;     // Animate rotation over time (1 full rotation every 6*2π ≈ 37.7 seconds)
    
    vec3 p; // Temporary position vector
    for (; i++<l;) { // Create 5 layered geometric structures (l=5)
        p = u; // Store base position for this iteration
        // Vertical segmentation creates stacked layers:
        y = round(max(p.y-i, 0.)/l)*l+i;  // Quantize Y into discrete rows
        p.x *= y; // Stretch X dimension proportionally to row height
        p.x -= sqrt(y*t*t*2.); // Horizontal movement with sqrt(time) growth
        p.x -= round(p.x/6.2832)*6.2832; // Wrap X using 2π periodicity
        p.y -= y; // Remove quantization offset for clean positioning
        p.z += sqrt(y/w)*w; // Parabolic Z displacement (w=40 controls curve)
        z = cos(y*t/50.)*.5+.5; // Time-varying wave (frequency y/50)
        p.z += z*2.; // Amplify wave effect on Z position
        p = abs(p); // Mirror space to create symmetrical patterns
        f = min(f, max(p.x, max(p.y, p.z)) - s*z); // Cube SDF with wave modulation
    }
    
    return f;
}

// Main shader function - executes per pixel
void mainImage( out vec4 C, in vec2 U )
{
    float l = 50.,  // Max raymarch steps (quality/performance balance)
          i = 0.,   // Step counter
          d = i,    // Distance along ray
          s, r;     // Surface distance, color modulation
    
    vec2 R = iResolution.xy,  // Get screen resolution
         m = iMouse.z > 0. ?  // Mouse interaction:
               (iMouse.xy - R/2.)/R.y:  // Convert to normalized coordinates
               vec2(0, -.17);           // Default view angle
    
    vec3 o = vec3(0, 20, -120),  // Camera origin (x,y,z)
         u = normalize(vec3(U - R/2., R.y)),  // Create view ray direction
         c = vec3(0), p; // Color accumulator, current position
    
    mat2 v = A(y),  // Create vertical rotation (pitch) matrix
         h = A(x);  // Create horizontal rotation (yaw) matrix
    
    // Raymarching loop - find surface intersections
    for (; i++<l;) {
        p = u*d + o;         // Current position along ray
        p.yz *= v;           // Apply vertical rotation
        p.xz *= h;           // Apply horizontal rotation
        
        s = map(p);          // Get distance to nearest surface
        r = (cos(round(length(p.xz))*T/50.)*.7 - 1.8)/2.;  // Radial color pattern
        c += min(s, exp(-s/.07))  // Combine distance field and fog
           * H(r+.5) * (r+2.4);   // Apply color gradient with hue macro
        
        if (s < 1e-3 || d > 1e3) break; // Surface hit or max distance
        d += s*.7; // March forward using distance estimation
    }
    
    C = vec4(exp(log(c)/2.2), 1); // Gamma correction (approx pow(c, 1/2.2))
}

// The comments now explain:

//1. Core SDF techniques used
//2. Coordinate system transformations
//3. Time-based animations and parameters
//4. Geometric pattern generation logic
//5. Raymarching implementation details
//6. Color space conversions and lighting calculations

