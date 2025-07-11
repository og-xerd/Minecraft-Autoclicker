import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HeroUIProvider} from "@heroui/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider className="dark">
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </StrictMode>,
)
