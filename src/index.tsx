import React from 'react'
import ReactDOM from 'react-dom/client'
import './bootsrtap'
import App from './app'
import {worker} from './mocks/server/dev-server'
import {DiscoverMoviesScreen} from 'screens/discover'

if (process.env.NODE_ENV === 'development') {
  worker.start()
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <DiscoverMoviesScreen />
  </React.StrictMode>,
)
