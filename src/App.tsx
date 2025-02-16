import './App.css'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { NoToneMapping } from 'three'
import './styles/main.css'
import { Scene } from './components/Scene'
import { Perf } from 'r3f-perf'
const isDev = import.meta.env.DEV
console.log('is dev', isDev)

const App = () => {
  return (
    <div className='content'>
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
    </div>
  )
}

export default App
