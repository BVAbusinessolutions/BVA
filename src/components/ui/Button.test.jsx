import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Button from './Button'

describe('Button', () => {
  it('es un <button> cuando no recibe destino', () => {
    render(<Button>Enviar</Button>)
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'button')
  })

  it('es un enlace interno con `to`', () => {
    render(
      <MemoryRouter>
        <Button to="/contacto">Contacto</Button>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contacto')
  })

  it('abre enlaces externos en otra pestaña de forma segura', () => {
    render(<Button href="https://wa.me/506">WhatsApp</Button>)
    const link = screen.getByRole('link', { name: 'WhatsApp' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
