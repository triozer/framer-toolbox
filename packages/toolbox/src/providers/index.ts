import { useContext } from 'react'
import { FramerPluginContext, type FramerPluginContextType } from './framer-plugin'

export function useFramerPlugin(): FramerPluginContextType | null {
  const context = useContext(FramerPluginContext)

  if (!context) {
    console.warn('useFramerPlugin must be used within a FramerPluginProvider')
    return null
  }

  return context
}

export { FramerPluginProvider } from './framer-plugin'
