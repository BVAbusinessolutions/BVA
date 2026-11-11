import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, useTenant } from './ThemeContext'

function TenantName() {
  const { tenant, status } = useTenant()
  return <p>{status === 'ready' ? tenant.name : status}</p>
}

describe('ThemeProvider', () => {
  it('inyecta el acento del cliente y lo quita al desmontar, sin tocar el fondo', async () => {
    const root = document.documentElement.style
    const { unmount } = render(
      <ThemeProvider slug="clinica-vida">
        <TenantName />
      </ThemeProvider>,
    )

    expect(await screen.findByText('Clínica Vida')).toBeInTheDocument()
    await waitFor(() => expect(root.getPropertyValue('--accent')).toBe('#14b8a6'))
    expect(root.getPropertyValue('--ink')).toBe('')

    unmount()
    expect(root.getPropertyValue('--accent')).toBe('')
  })
})
