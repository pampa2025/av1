import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { LoadingManager, AnimationMixer } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

export const manager = new LoadingManager()
export let isLoading = true
export let progress = 0
export let errorUrl = ''
export let errorType = ''

manager.onStart = function (url, itemsLoaded, itemsTotal) {
  // console.log(
  // 	"Started loading file: " +
  // 		url +
  // 		".\nLoaded " +
  // 		itemsLoaded +
  // 		" of " +
  // 		itemsTotal +
  // 		" files."
  // );
}

manager.onLoad = function () {
  // console.log('Loading complete!');
}

// @ts-ignore
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  // console.log(
  //     'Loading file: ' +
  //         url +
  //         '.\nLoaded ' +
  //         itemsLoaded +
  //         ' of ' +
  //         itemsTotal +
  //         ' files.'
  // );
  progress = itemsLoaded / itemsTotal
  if (progress >= 1) {
    isLoading = false
  } else {
    isLoading = true
  }
}

manager.onError = function (url: string) {
  console.log('There was an error loading ' + url)
}

export const textureLoader = new THREE.TextureLoader(manager)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

export const gltfLoader = new GLTFLoader(manager)

gltfLoader.setMeshoptDecoder(MeshoptDecoder)
gltfLoader.setDRACOLoader(dracoLoader)

export function InitAnimation(gltf: any): [AnimationMixer, Map<string, any>] {
  const model = gltf.scene
  const gltfAnimations = gltf.animations
  const mixer = new AnimationMixer(model)

  const animationsMap = new Map()
  // console.log('gltfAnimations', gltfAnimations);

  for (let i = 0; i < gltfAnimations.length; i++) {
    // console.log('npm action name', gltfAnimations[i].name)
    const animation = gltfAnimations[i]
    const action = mixer.clipAction(animation)
    animationsMap.set(animation.name, action)
  }

  return [mixer, animationsMap]
}
