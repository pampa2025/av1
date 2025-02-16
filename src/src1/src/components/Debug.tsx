import { useRef, useState } from 'react'
import { useMyStore } from '../store/store'
import { Noramlize } from '../utils/util'
import * as THREE from 'three'

import { useFrame } from '@react-three/fiber'
export default function Debug() {
  // const rawFft = useMyStore((state) => state.rawFft)

  const ref = useRef<THREE.Mesh>(null)
  const fftRef = useRef(0)
  const [val, setVal] = useState(0)
  const colorRef = useRef(0)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((_state, delta) => {
    const rawFft = window.MyData.fft
    const val = (rawFft[20] / 255) * 5
    ref.current!.scale.set(val, val, val)

    // FIXME not work for using at jsx component as parameters
    // colorRef.current = val
    // FIXME works but cause component re render with console.log debug
    // setVal(rawFft[20] / 255)

    // works but need update value by set function and with ref to it
    matRef.current!.color.set(rawFft[20] / 255, 0, 0)
  })

  console.log('debug cube refreshing')

  return (
    <mesh ref={ref}>
      <boxGeometry></boxGeometry>
      <meshBasicMaterial ref={matRef}></meshBasicMaterial>
    </mesh>
  )
}
