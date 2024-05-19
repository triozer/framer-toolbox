import { useContext } from 'react'
import { framer } from 'framer-plugin'
import { FramerPluginContext, type FramerPluginContextType } from './framer-plugin'

export function useFramerPlugin(): FramerPluginContextType {
  const context = useContext(FramerPluginContext)

  if (!context) {
    console.warn('useFramerPlugin must be used within a FramerPluginProvider')
    // In this case, we want to still allow the component to render without crashing
    return {
      id: null,
      name: null,
      isLoaded: true,
      showUI: framer.showUI,
    } as any as FramerPluginContextType
  }

  return context
}

export { FramerPluginProvider } from './framer-plugin'
