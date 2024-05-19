import { useEffect, useMemo, useRef, useState } from 'react'

import type { DebouncedFunc } from 'lodash'
import lodashDebounce from 'lodash.debounce'

/**
 * A hook that debounces a value.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 *
 * @returns The debounced value.
 */
export function useDebounceValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const debounce = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(debounce)
    }
  }, [value, delay])

  return debouncedValue
}

export function useDebounce<T extends unknown[], S>(callback: (...args: T) => S, delay: number = 1000): DebouncedFunc<(...arg: T) => S> {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    // pass arguments to callback function
    const func = (...arg: T) => {
      return ref.current(...arg)
    }

    return lodashDebounce(func, delay)
    // or just debounce(ref.current, delay)
  }, [delay])

  return debouncedCallback
}
