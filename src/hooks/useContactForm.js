import { useCallback, useState } from 'react'
import { validateContact } from '../utils/validateContact'
import { sendContactRequest } from '../services/contactService'

const EMPTY = {
  name: '',
  email: '',
  whatsapp: '',
  business: '',
  message: '',
  consent: false,
  website: '', // campo trampa para bots; las personas no lo ven
}

/** Estado, validación y envío del formulario de contacto. */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | simulated | error

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      if (values.website) {
        setStatus('sent')
        return
      }
      const found = validateContact(values)
      setErrors(found)
      if (Object.keys(found).length > 0) {
        const firstField = Object.keys(found)[0]
        event.currentTarget.querySelector(`[name="${firstField}"]`)?.focus()
        return
      }
      setStatus('sending')
      try {
        const result = await sendContactRequest(values)
        setStatus(result.simulated ? 'simulated' : 'sent')
        setValues(EMPTY)
      } catch {
        setStatus('error')
      }
    },
    [values],
  )

  return { values, errors, status, handleChange, handleSubmit }
}
