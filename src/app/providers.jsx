import { BrowserRouter } from 'react-router-dom'
import { MotionProvider } from '../context/MotionContext'

/** Proveedores globales: enrutador y preferencia de movimiento. */
export default function Providers({ children }) {
  return (
    <MotionProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </MotionProvider>
  )
}
