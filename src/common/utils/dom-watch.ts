import filter from 'array-filter-inplace'

interface WatchedSelector {
  target: string,
  parent: ParentNode,
  expiry?: Date,
  callback: (el: Element) => void,
}

interface InjectionPosition {
  target: string,
  position: InsertPosition,
}

const watchedSelectors: WatchedSelector[] = []
const elementsInjected = new Map<Element, InjectionPosition>()

let timer: ReturnType<typeof setTimeout> | null = null

const observer = new MutationObserver(() => {
  if (!timer) timer = setTimeout(() => {
    timer = null

    filter(watchedSelectors, ({ target, parent, expiry, callback }: WatchedSelector) => {
      if (expiry && new Date() > expiry) return false

      const el = parent.querySelector(target)
      if (el) {
        callback(el)
        return false
      }

      return true
    })

    for (const [element, { target, position }] of elementsInjected) {
      if (!element.parentElement) document.querySelector(target)?.insertAdjacentElement(position, element)
    }
  }, 2000)
})

observer.observe(document, { childList: true, subtree: true })

export const injectElement = (element: Element, position: InsertPosition, target: string) => {
  elementsInjected.set(element, { target, position })
}

export const ejectElement = (element: Element) => {
  elementsInjected.delete(element)
  element.remove()
}

export const ensureSelector = (target: string, options?: { parent?: ParentNode, timeout?: number }) => {
  return new Promise((resolve, reject) => {
    const el = (options?.parent ?? document).querySelector(target)
    if (el) return resolve(el)

    let expiry: Date | undefined = undefined

    if (options?.timeout !== undefined) {
      expiry = new Date()
      expiry.setSeconds(expiry.getSeconds() + options.timeout)

      setTimeout(() => {
        reject(new Error(`Timeout waiting for ${target}`))
      }, options.timeout * 1000)
    }

    watchedSelectors.push({ target, parent: options?.parent ?? document, expiry, callback: resolve })
  })
}
