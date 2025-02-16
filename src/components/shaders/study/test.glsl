// Time variable multiplied by 5 for faster animation
#define T (iTime*5.)
// Creates a 2x2 rotation matrix using cosine functions
#define A(v) mat2(cos(m.v*3.1416 + vec4(0, -1.5708, 1.5708, 0)))       // rotate
// Creates RGB colors using cosine functions with 120-degree phase shifts (red, green, blue)
#define H(v) (cos(((v)+.5)*6.2832 + radians(vec3(60, 0, -60)))*.5+.5)  // hue

// Signed Distance Function (SDF) that defines the 3D scene geometry
float map(vec3 u)
{
    float t = T,    // Current time for animation
          l = 5.,   // Number of iterations for the pattern to reduce clipping
          w = 40.,  // Amount of warping in Z axis
          s = .4,   // Size of the cube objects
          f = 1e20, // Initial very large distance
          i = 0., y, z;
    
    // Convert coordinates to polar space
    u.yz = -u.zy;  // Swap Y and Z axes
    u.xy = vec2(atan(u.x, u.y), length(u.xy));  // Convert XY to polar coordinates
    u.x += t/6.;    // Rotate the entire pattern counter-clockwise
    
    vec3 p;
    for (; i++<l;)  // Create repeating pattern
    {
        p = u;
        y = round(max(p.y-i, 0.)/l)*l+i;  // Create segments in Y direction
        p.x *= y;                         // Scale X based on Y position
        p.x -= sqrt(y*t*t*2.);            // Move X based on time
        p.x -= round(p.x/6.2832)*6.2832;  // Wrap around in X direction (2π)
        p.y -= y;                         // Offset Y position
        p.z += sqrt(y/w)*w;               // Create curved pattern in Z
        z = cos(y*t/50.)*.5+.5;           // Create wave pattern
        p.z += z*2.;                      // Apply wave to Z position
        p = abs(p);                       // Mirror everything to create symmetry
        f = min(f, max(p.x, max(p.y, p.z)) - s*z);  // Calculate distance to cube
    }
    
    return f;
}

void mainImage( out vec4 C, in vec2 U )
{
    float l = 50.,  // Maximum raymarch steps
          i = 0., d = i, s, r;
    
    // Screen and mouse handling
    vec2 R = iResolution.xy,
         m = iMouse.z > 0. ?             // Check if mouse is clicked
               (iMouse.xy - R/2.)/R.y:   // Use mouse position for camera angle
               vec2(0, -.17);            // Default camera angle when not clicked
    
    vec3 o = vec3(0, 20, -120),  // Camera position in 3D space
         u = normalize(vec3(U - R/2., R.y)),  // Ray direction for each pixel
         c = vec3(0),            // Color accumulator
         p;                      // Position along ray
    
    mat2 v = A(y),  // Pitch rotation matrix
         h = A(x);  // Yaw rotation matrix
    
    // Main raymarching loop
    for (; i++<l;)
    {
        p = u*d + o;           // Calculate current position along ray
        p.yz *= v;             // Apply pitch rotation
        p.xz *= h;             // Apply yaw rotation
        
        s = map(p);            // Get distance to nearest surface
        r = (cos(round(length(p.xz))*T/50.)*.7 - 1.8)/2.;  // Calculate color gradient
        c += min(s, exp(-s/.07))     // Add glow effect
           * H(r+.5) * (r+2.4);      // Apply color based on position
        
        if (s < 1e-3 || d > 1e3) break;  // Stop if hit surface or too far
        d += s*.7;                        // Step forward along ray
    }
    
    // Apply gamma correction and output final color
    C = vec4(exp(log(c)/2.2), 1);
}