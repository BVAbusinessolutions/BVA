import { BrowserRouter } from 'react-router-dom'
import { MotionProvider } from '../context/MotionContext'
import { ThemeProvider } from '../context/ThemeContext'

/** Proveedores globales: marca del cliente, preferencia de movimiento y enrutador. */
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </MotionProvider>
    </ThemeProvider>
  )
}
