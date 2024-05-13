import { useState, useEffect } from "react";

/**
 * A hook that debounces a value.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 *
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debounce = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return debouncedValue;
}
