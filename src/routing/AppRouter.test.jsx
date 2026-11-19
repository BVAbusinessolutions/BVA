import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MotionProvider } from '../context/MotionContext'
import AppRouter from './AppRouter'
import { PATHS } from './paths'

function renderAt(path) {
  render(
    <MotionProvider>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={null}>
          <AppRouter />
        </Suspense>
      </MemoryRouter>
    </MotionProvider>,
  )
}

const CASES = [
  [PATHS.home, /Tu negocio/],
  [PATHS.services, /Servicios que trabajan por ti/],
  [PATHS.platform, /Tu negocio en una sola pantalla/],
  [PATHS.contact, /Qué tarea quieres dejar de hacer/],
  [PATHS.privacy, /Política de privacidad/],
  [PATHS.terms, /Términos y condiciones/],
  ['/ruta-que-no-existe', /Esta página no existe/],
]

describe('rutas del sitio', () => {
  it.each(CASES)('%s muestra su título principal', async (path, title) => {
    renderAt(path)
    expect(
      await screen.findByRole('heading', { level: 1, name: title }, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('el encabezado y el pie aparecen en todas las páginas', async () => {
    renderAt(PATHS.services)
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
