import { useRef, useState, useMemo } from 'react'
import { useMyStore } from '../store/store'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertexShader from './shaders/hello.vert'
import fragmentShader from './shaders/hello.frag'

export default function ShaderTest() {
  const rawFft = useMyStore((state) => state.rawFft)
  const ref = useRef<THREE.Mesh>(null)
  const materialRef = useRef(null)

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_colorA: { value: new THREE.Color('#FFE486') },
      u_colorB: { value: new THREE.Color('#FEB3D9') },
    }),
    [],
  )
  useFrame((state, delta) => {
    if (materialRef.current) {
      const speed = ((delta * rawFft[20]) / 255) * 10

      uniforms.u_time.value = state.clock.elapsedTime * speed

      uniforms.u_colorA.value = new THREE.Color(rawFft[20] / 255, 0, 0)
    }
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}
