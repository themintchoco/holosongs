import filter from 'array-filter-inplace'

interface WatchedSelector {
  target: string,
  callback: (el: Element) => void
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

    filter(watchedSelectors, (watchedSelector: WatchedSelector) => {
      const el = document.querySelector(watchedSelector.target)
      if (el) {
        watchedSelector.callback(el)
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

export const ensureSelector = (target: string) => {
  return new Promise((resolve) => {
    const el = document.querySelector(target)
    if (el) return resolve(el)

    watchedSelectors.push({ target, callback: resolve })
  })
}
