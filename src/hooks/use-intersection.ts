import React, { type RefObject } from "react"

export function useIntersection(
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit,
): IntersectionObserverEntry | null {
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    React.useState<IntersectionObserverEntry | null>(null)

  React.useEffect(() => {
    if (ref.current && typeof IntersectionObserver === "function") {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0] ?? null)
      }

      const observer = new IntersectionObserver(handler, options)
      observer.observe(ref.current)

      return () => {
        setIntersectionObserverEntry(null)
        observer.disconnect()
      }
    }
    return () => {}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, options.threshold, options.root, options.rootMargin])

  return intersectionObserverEntry
}
