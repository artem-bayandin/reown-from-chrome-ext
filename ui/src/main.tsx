import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppKitProvider } from '@reown/appkit/react'
import { appKitConfig } from './appkit/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider {...appKitConfig}>
      <App />
    </AppKitProvider>
  </StrictMode>,
)
