import { type UIOptions, framer } from 'framer-plugin'
import { createContext, useEffect, useState } from 'react'

/**
 * The options of the UI interface.
 *
 * @public
 */
export interface FramerPluginContextType {
  /** The ID of the plugin. */
  id: string
  /** Whether the plugin is loaded. */
  isLoaded: boolean
  /** The function to show the UI interface. */
  showUI: (options: UIOptions) => Promise<void>
}

/**
 * The React context for Framer Plugin, initialized to `null` by default.
 *
 * @public
 */
export const FramerPluginContext = createContext<FramerPluginContextType | null>(null)

/**
 * The provider component for Framer Plugin context, managing plugin state and providing context values.
 *
 * @example
 * ```tsx
 * // In your main.tsx
 * <FramerPluginProvider>
 *  <App />
 * </FramerPluginProvider>
 * ```
 *
 * @public
 * @kind component
 */
export const FramerPluginProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const [id, setId] = useState<string>()

  useEffect(() => {
    (async () => {
      const config = await fetch('framer.json').then(res => res.json())

      setId(config.id)

      setIsLoaded(true)
    })()
  }, [])

  const showUI = async (options?: UIOptions) => {
    await framer.showUI({
      ...options,
    })
  }

  return (
    <FramerPluginContext.Provider value={{ id: id!, isLoaded, showUI }}>
      {isLoaded && children}
    </FramerPluginContext.Provider>
  )
}
