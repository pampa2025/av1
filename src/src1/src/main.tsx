import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { NoToneMapping } from 'three'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import { Scene } from './components/Scene'
import { Perf } from 'r3f-perf'

window.MyData = { fft: new Array<512>(), midi: {} }
const isDev = import.meta.env.DEV
console.log('is dev', isDev)

function Main() {
  console.log('loaded main page')
  return (
    <>
      {/* TODO demand mode stops perf to work */}
      {/* <Canvas frameloop='demand'> */}
      <Canvas
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = NoToneMapping
        }}
        linear
        camera={{ near: 0.1, far: 15 }}
      >
        {isDev ? <Perf position='bottom-right' /> : null}

        <Scene />
      </Canvas>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
