import { useEffect, useState } from 'react'

/**
 * @public
 */
export type Theme = 'light' | 'dark'

/**
 * A hook that returns the current theme.
 *
 * @public
 * @kind hook
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(document.body.getAttribute('data-framer-theme') as Theme ?? 'light')

  const handle = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-framer-theme') {
        setTheme(document.body.getAttribute('data-framer-theme') as Theme)
        break
      }
    }
  }

  useEffect(() => {
    const mutationObserver = new MutationObserver(handle)

    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-framer-theme'],
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  return theme
}
