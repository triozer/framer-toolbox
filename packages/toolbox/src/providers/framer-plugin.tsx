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
  /** The name of the plugin. */
  name: string
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
 * @public
 * @kind component
 */
export const FramerPluginProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const [id, setId] = useState<string>()
  const [name, setName] = useState<string>()

  useEffect(() => {
    (async () => {
      const config = await fetch('/framer.json').then(res => res.json())

      setId(config.id)
      setName(config.name)

      setIsLoaded(true)
    })()
  }, [])

  const showUI = async (options: UIOptions) => {
    await framer.showUI({
      title: name,
      ...options,
    })
  }

  return (
    <FramerPluginContext.Provider value={{ id: id!, name: name!, isLoaded, showUI }}>
      {isLoaded && children}
    </FramerPluginContext.Provider>
  )
}
