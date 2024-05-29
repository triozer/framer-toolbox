import { useEffect, useMemo, useRef, useState } from 'react'

import type { DebouncedFunc } from 'lodash'
import lodashDebounce from 'lodash.debounce'

/**
 * A hook that debounces a value.
 *
 * @example
 * ```tsx
 * const debouncedValue = useDebounceValue(inputValue, 500)
 * ```
 *
 * @public
 * @kind hook
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const debounce = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(debounce)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * A hook that debounces a callback function.
 *
 * @example
 * ```tsx
 * const debouncedSave = useDebounce(saveFunction, 300)
 * ```
 *
 * @public
 * @kind hook
 */
export function useDebounce<T extends unknown[], S>(callback: (...args: T) => S, delay: number = 1000): DebouncedFunc<(...arg: T) => S> {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (...arg: T) => {
      return ref.current(...arg)
    }

    return lodashDebounce(func, delay)
  }, [delay])

  return debouncedCallback
}
