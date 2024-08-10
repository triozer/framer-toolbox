import { type UIOptions, framer } from 'framer-plugin'
import { createContext, useEffect, useRef, useState } from 'react'

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
  /** The function to set the UI options. */
  setUIOptions: (options: UIOptions) => void
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
  const [name, setName] = useState<string>()

  const uiOptions = useRef<UIOptions>({})

  useEffect(() => {
    (async () => {
      const config = await fetch('/framer.json').then(res => res.json())

      setId(config.id)
      setName(config.name)

      setIsLoaded(true)
    })()
  }, [])

  const showUI = async (options?: UIOptions) => {
    await framer.showUI({
      title: name,
      ...uiOptions.current,
      ...options,
    })
  }

  const setUIOptions = (options: UIOptions) => {
    uiOptions.current = options
  }

  return (
    <FramerPluginContext.Provider value={{ id: id!, name: name!, isLoaded, showUI, setUIOptions }}>
      {isLoaded && children}
    </FramerPluginContext.Provider>
  )
}
