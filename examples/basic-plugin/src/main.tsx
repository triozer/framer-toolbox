import '@triozer/framer-toolbox/dist/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { FramerPluginProvider } from '@triozer/framer-toolbox'
import { App } from './App.tsx'

const root = document.getElementById('root')
if (!root)
  throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FramerPluginProvider>
      <App />
    </FramerPluginProvider>
  </React.StrictMode>,
)
