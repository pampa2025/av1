import { CameraControls, Preload } from '@react-three/drei'
// import { useFrame, useThree } from '@react-three/fiber'

import { Suspense, useRef } from 'react'

// import { Model } from './Robot_hip_hop_dancing'
// import ShaderTest from './ShaderTest'

import Shadertoy from './Shadertoy'
function Scene() {
  const controlsRef = useRef<CameraControls>(null)

  return (
    <>
      <CameraControls
        ref={controlsRef}
        makeDefault
        minAzimuthAngle={-Math.PI}
        maxAzimuthAngle={Math.PI}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
      />
      <color attach='background' args={[196 / 255, 224 / 255, 222 / 255]} />
      <axesHelper args={[5]} />
      <ambientLight intensity={1.5} />
      <Shadertoy />
    </>
  )
}

export { Scene }
