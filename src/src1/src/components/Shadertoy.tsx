// @ts-nocheck
import { useRef, useCallback, useState, forwardRef } from 'react'
import { Canvas, useFrame, useThree, createPortal, extend } from '@react-three/fiber'
import { OrthographicCamera, useFBO, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const OffScreenMaterial = shaderMaterial(
  {
    bufferTexture: { value: null },

    res: { value: new THREE.Vector2(0, 0) },

    smokeSource: { value: new THREE.Vector3(0, 0, 0) },
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    void main () {
        vUv =uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  // fragment shader
  /*glsl*/ `
    uniform vec2 res;//The width and height of our screen
    uniform sampler2D bufferTexture;//Our input texture
    uniform vec3 smokeSource;//The x,y are the posiiton. The z is the power/density
    varying vec2 vUv;

    void main() {
      vec2 pixel = vUv;
      gl_FragColor = texture2D( bufferTexture, gl_FragCoord.xy / res.xy );

      //Get the distance of the current pixel from the smoke source
      float dist = distance(pixel * res.xy, smokeSource.xy * res.xy);

      gl_FragColor.rgb += smokeSource.z * max(10.0 - dist, 0.0) ;

      //Smoke diffuse
      vec4 rightColor = texture2D(bufferTexture,vec2(pixel.x + 1.0/res.x,pixel.y));
      vec4 leftColor = texture2D(bufferTexture,vec2(pixel.x - 1.0/res.x,pixel.y));
      vec4 upColor = texture2D(bufferTexture,vec2(pixel.x,pixel.y + 1.0/res.y));
      vec4 downColor = texture2D(bufferTexture,vec2(pixel.x,pixel.y - 1.0/res.y));

      //Diffuse equation
      float factor = 8.0 * 0.016 * (leftColor.r + rightColor.r + downColor.r * 3.0 + upColor.r - 6.0 * gl_FragColor.r);

      //Account for low precision of texels
      float minimum = 0.000003;
      if (factor >= -minimum && factor < -0.10) factor = -minimum;

      gl_FragColor.rgb += factor;
      gl_FragColor.a = 0.5;
  }`,
)

extend({ OffScreenMaterial })

const OffScreenScene = forwardRef(function OffScreenScene(props, ref) {
  const { size } = useThree()

  return (
    <group>
      <mesh ref={ref}>
        <planeGeometry args={[size.width, size.height]} />
        <offScreenMaterial
          bufferTexture={props.map}
          res={new THREE.Vector2(256, 256)}
          smokeSource={new THREE.Vector3(0, 0, 0)}
        />
      </mesh>
      <gridHelper />
    </group>
  )
})

const Shadertoy = () => {
  const { scene, size } = useThree()
  const offScreen = useRef()
  const onScreen = useRef()

  const [offScreenScene] = useState(() => new THREE.Scene())
  const offScreenCameraRef = useRef(null)

  let renderTargetB = new THREE.RenderTarget(256, 256, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
  })
  let renderTargetA = new THREE.RenderTarget(256, 256, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
  })

  useFrame(({ gl, camera }) => {
    gl.setRenderTarget(renderTargetA)
    gl.render(offScreenScene, offScreenCameraRef.current!)

    //Swap RenderTarget
    var t = renderTargetB
    renderTargetB = renderTargetA
    renderTargetA = t

    onScreen.current.material.map = renderTargetA.texture
    offScreen.current.material.uniforms.bufferTexture.value = renderTargetB.texture

    gl.setRenderTarget(null)
    gl.render(scene, camera)
  })

  const onPointerMove = useCallback((e: any) => {
    const { uv } = e

    offScreen.current.material.uniforms.smokeSource.value.x = uv.x

    offScreen.current.material.uniforms.smokeSource.value.y = uv.y
  }, [])

  const onMouseUp = useCallback((event: any) => {
    offScreen.current.material.uniforms.smokeSource.value.z = 0.0
  }, [])
  const onMouseDown = useCallback((event: any) => {
    offScreen.current.material.uniforms.smokeSource.value.z = 0.1
  }, [])

  return (
    <>
      <mesh
        ref={onScreen}
        onPointerMove={onPointerMove}
        onPointerDown={onMouseDown}
        onPointerUp={onMouseUp}
      >
        {/* <planeGeometry args={[5, 5]} /> */}
        <boxGeometry></boxGeometry>
        <meshBasicMaterial
          side={THREE.DoubleSide}
          map={renderTargetA.texture}
          transparent={true}
        />
      </mesh>

      <gridHelper />

      {createPortal(
        <>
          <OffScreenScene ref={offScreen} map={renderTargetB.texture} />
          <OrthographicCamera
            makeDefault
            position={[0, 0, 2]}
            args={[-1, 1, 1, -1, 1, 1000]}
            aspect={size.width / size.height}
            ref={offScreenCameraRef}
          />
        </>,
        offScreenScene,
      )}
    </>
  )
}

export default Shadertoy
