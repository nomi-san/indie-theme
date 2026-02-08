/** Asynchronous delay */
export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

/** Wait for an element to appear in the DOM */
export function watchElement<T>(selector: string, interval = 500): Promise<T> {
  return new Promise(async resolve => {
    while (true) {
      let el = document.querySelector(selector)
      if (el != null) {
        resolve(el as unknown as T)
        break
      }
      await delay(interval)
    }
  })
}