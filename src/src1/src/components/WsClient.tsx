import { useState, useCallback, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export default function WsClient() {
  console.log('ws client for visual')

  const [socketUrl, setSocketUrl] = useState('ws://localhost:4444/?t=visual')
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([])

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const recvData = JSON.parse(event.data)
      // console.log('Received message:', recvData)
      window.MyData = recvData['fft']
    },
  })

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage])

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('ws://localhost:4444'),
    [],
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return (
    <div className='wsClientDiv'>
      <button onClick={handleClickChangeSocketUrl}>Click Me to change Socket Url</button>
      <span>The WebSocket is currently {connectionStatus}</span>
    </div>
  )
}
