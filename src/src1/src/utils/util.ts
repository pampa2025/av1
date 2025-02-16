export const Noramlize = (val: number) => {
  if (typeof val === 'number' && val > 1) {
    return val / 255
  }
}

export const NoramlizeArray = (val: Uint8Array) => {
  const res = val.map((x) => x / 255)
  return res
}
