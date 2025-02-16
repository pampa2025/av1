/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 ./public/models/robot_hip_hop_dancing.glb -K -t -D 
Author: Walter Araujo (https://sketchfab.com/walteraraujo)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/robot-hip-hop-dancing-bedd2ba99e1840ff89d2bca4a3e0c276
Title: Robot Hip Hop Dancing
*/

import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'
useGLTF.setDecoderPath('draco/')
type ActionName = 'mixamo.com'
import { useMyStore } from '../store/store'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Object_7: THREE.SkinnedMesh
    _rootJoint: THREE.Bone
  }
  materials: {
    mat0mat: THREE.MeshPhysicalMaterial
  }
  animations: GLTFAction[]
}

const usingGltfUrl = 'models/robot_hip_hop_dancing-transformed.glb'
export function Model(props: JSX.IntrinsicElements['group']) {
  // const group = React.useRef<THREE.Group>(null)
  // const { scene, animations } = useGLTF('models/robot_hip_hop_dancing.glb')
  // const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  // const { nodes, materials } = useGraph(clone) as GLTFResult
  // const actions = useAnimations(animations, group)

  const group = useRef<THREE.Group>(null)

  const { scene, animations } = useGLTF(usingGltfUrl)

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const mixer = new THREE.AnimationMixer(clone)

  const actions = useAnimations(animations, group)

  // console.log('actions:', actions)

  const playClipName = 'mixamo.com'
  const clip = actions.clips[0]
  // console.log('clip', clip)

  for (let index = 0; index < actions.clips.length; index++) {
    const clipName = actions.clips[index].name
    const clip = actions.clips[index]
    if (clipName === playClipName) {
      mixer.clipAction(clip).play()
    }
  }
  // const rawFft = useMyStore((state) => state.rawFft)

  const [val, setVal] = useState(0)
  const scaleRef = useRef(0)
  useFrame((state, delta) => {
    const rawFft = window.MyData.fft
    const speed = ((delta * rawFft[20]) / 255) * 10
    // console.log('speed', speed)
    const updateSpeed = speed > 0.05 ? speed : 0
    mixer.update(updateSpeed)
    // setVal((rawFft[20] / 255) * 15)
    scaleRef.current = (rawFft[20] / 255) * 15
    const val = (rawFft[20] / 255) * 5

    // group.current.scale.set(val, val, val)
  })

  console.log('debug refresh')
  return (
    <group {...props} ref={group}>
      <primitive object={clone} />
    </group>
    // <group ref={group} {...props} dispose={null}>
    //   <group name='Sketchfab_Scene'>
    //     <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={379.427}>
    //       <group
    //         name='a5d523f9129a4a26bb34c75153857384fbx'
    //         rotation={[Math.PI / 2, 0, 0]}
    //         scale={0.01}
    //       >
    //         <group name='Object_2'>
    //           <group name='RootNode'>
    //             <group name='Object_4'>
    //               <primitive object={nodes._rootJoint} />
    //               <group name='Object_6' />
    //               <group name='unamed' />
    //               <skinnedMesh
    //                 name='Object_7'
    //                 geometry={nodes.Object_7.geometry}
    //                 material={materials.mat0mat}
    //                 skeleton={nodes.Object_7.skeleton}
    //               />
    //             </group>
    //           </group>
    //         </group>
    //       </group>
    //     </group>
    //   </group>
    // </group>
  )
}

useGLTF.preload(usingGltfUrl)
