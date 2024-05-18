import { createContext, useEffect, useState } from 'react'

export interface FramerPluginContextType {
  id: string
  name: string
  isLoaded: boolean
}

export const FramerPluginContext = createContext<FramerPluginContextType | null>(null)

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

  return (
    <FramerPluginContext.Provider value={{ id: id!, name: name!, isLoaded }}>
      {isLoaded && children}
    </FramerPluginContext.Provider>
  )
}
