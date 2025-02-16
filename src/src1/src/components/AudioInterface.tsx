import { useEffect, useRef } from 'react'
import '../styles/audiointerface.css'
import { Config } from '../constant'
import { useMyStore } from '../store/store'
export default function Visualizer() {
  const analyserCanvas: any = useRef(null)
  const store = useMyStore()

  const audioTest = async (ctx: any) => {
    if (navigator.mediaDevices.getUserMedia !== null) {
      const options = {
        video: false,
        audio: true,
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia(options)
        const audioCtx = new AudioContext()
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = Config.fftSize
        const audioSrc = audioCtx.createMediaStreamSource(stream)
        audioSrc.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)

        const loopingFunction = () => {
          requestAnimationFrame(loopingFunction)
          analyser.getByteFrequencyData(data)
          // TODO
          // FIXME update the raw data by function will cause re-render of all r3f component
          // store.setRawFft(data)
          // directy sign value not re-render of all r3f component
          store.rawFft = data
          draw(data, ctx)
          // console.log('looping')
        }
        /* "requestAnimationFrame" requests the browser to execute the code during the next repaint cycle. This allows the system to optimize resources and frame-rate to reduce unnecessary reflow/repaint calls. */
        loopingFunction()
        // requestAnimationFrame(loopingFunction)
      } catch (err) {
        // error handling
        console.error('error when init audio mic', err)
      }
    }
  }
  const draw = (dataParm: any, ctx: any) => {
    ctx.clearRect(0, 0, analyserCanvas.current.width, analyserCanvas.current.height)

    dataParm = [...dataParm]
    ctx.fillStyle = 'white' //white background
    ctx.lineWidth = 2 //width of candle/bar
    ctx.strokeStyle = '#d5d4d5' //color of candle/bar
    const space = analyserCanvas.current.width / dataParm.length
    dataParm.forEach((value: number, i: number) => {
      ctx.beginPath()
      ctx.moveTo(space * i, analyserCanvas.current.height) //x,y
      ctx.lineTo(space * i, analyserCanvas.current.height - value * 0.4) //x,y
      ctx.stroke()
    })
  }

  useEffect(() => {
    const ctx = analyserCanvas.current.getContext('2d')

    audioTest(ctx)
  }, [])

  return <canvas ref={analyserCanvas} className='audioInsterfaceWrapper'></canvas>
}
