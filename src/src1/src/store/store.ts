import { create } from 'zustand'
import { Config } from '../constant'
type Store = {
  rawFft: any
  setRawFft: (val: Uint8Array) => void
}
const useMyStore = create<Store>((set) => ({
  rawFft: null,
  setRawFft(val: any) {
    set((state) => ({ ...state, rawFft: val }))
  },
}))

export { useMyStore }
