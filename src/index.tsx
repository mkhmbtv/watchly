import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppProviders} from './context'
import './bootstrap'
import App from './app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
)
