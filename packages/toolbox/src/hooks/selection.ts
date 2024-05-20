import { type CanvasNode, framer } from 'framer-plugin'
import { useEffect, useState } from 'react'

/**
 * A hook to manage and subscribe to the selection of canvas nodes in Framer.
 *
 * @example
 * ```tsx
 * const selection = useSelection()
 * ```
 *
 * @public
 * @kind hook
 */
export function useSelection(): CanvasNode[] {
  const [selection, setSelection] = useState<CanvasNode[]>([])

  useEffect(() => {
    return framer.subscribeToSelection(setSelection)
  }, [])

  return selection
}
