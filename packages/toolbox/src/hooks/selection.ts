import { type CanvasNode, framer } from 'framer-plugin'
import { useEffect, useState } from 'react'

export function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([])

  useEffect(() => {
    return framer.subscribeToSelection(setSelection)
  }, [])

  return selection
}
