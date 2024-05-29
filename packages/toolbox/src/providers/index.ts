import { useContext } from 'react'
import { framer } from 'framer-plugin'
import { FramerPluginContext, type FramerPluginContextType } from './framer-plugin'

/**
 * A hook to access the Framer Plugin context.
 *
 * This hook must be used within a `FramerPluginProvider`. If used outside of the provider,
 * it will log a warning and return default values to prevent the component from crashing.
 *
 * @remarks
 * If context is not available, the hook will return default values for the plugin context. This is to prevent the component from crashing when used outside of the provider.
 *
 * @example
 * ```tsx
 * const { id, name, isLoaded, showUI } = useFramerPlugin()
 * ```
 *
 * @public
 */
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

export { FramerPluginProvider, type FramerPluginContextType } from './framer-plugin'
