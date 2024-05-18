import { useEffect } from 'react'
import './App.css'

import { FramerPlugin, useStore } from '@triozer/framer-toolbox'

function Home() {
  const [store, _, setStoreValue, isStoreLoaded] = useStore('store', {
    lastVisit: -1,
  })
  const { lastVisit } = store

  useEffect(() => {
    setStoreValue('lastVisit', Date.now())
  }, [])

  if (!isStoreLoaded)
    return null

  return (
    <span>
      Welcome
      {' '}
      {lastVisit !== -1
        ? `back (${new Date(lastVisit).toLocaleDateString()})`
        : 'to my plugin'}
      !
    </span>
  )
}

export function App() {
  return (
    <FramerPlugin autoResize={true}>
      <Home />
    </FramerPlugin>
  )
}
