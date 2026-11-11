import { test } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET ??= 'secreto-de-prueba-con-mas-de-32-caracteres'
const { createVerifyToken } = await import('../src/middlewares/verifyToken.js')
const { signAccessToken } = await import('../src/utils/jwt.js')

const options = {
  secret: 'clave-de-pruebas-larga-de-al-menos-32-caracteres',
  issuer: 'bva-api',
  audience: 'bva-web',
  expiresIn: '1h',
}
const verifyToken = createVerifyToken(options)

/** Ejecuta el middleware con una cabecera y devuelve { req, error }. */
function run(authorization) {
  const req = { get: (name) => (name === 'authorization' ? authorization : undefined) }
  let error
  verifyToken(req, {}, (err) => {
    error = err
  })
  return { req, error }
}

const token = (overrides = {}) =>
  signAccessToken({ id: 7, tenantId: 3, role: 'admin' }, { ...options, ...overrides })

test('acepta un token válido y deja el usuario en req.user', () => {
  const { req, error } = run(`Bearer ${token()}`)
  assert.equal(error, undefined)
  assert.deepEqual(req.user, { id: '7', tenantId: '3', role: 'admin' })
})

test('rechaza peticiones sin cabecera o con formato incorrecto', () => {
  for (const header of [undefined, '', 'Token abc', `bearer ${token()}`, 'Bearer a.b']) {
    const { error } = run(header)
    assert.equal(error.status, 401)
    assert.match(error.headers['WWW-Authenticate'], /invalid_request/)
  }
})

test('rechaza un token expirado con un mensaje claro', () => {
  const { error } = run(`Bearer ${token({ expiresIn: -10 })}`)
  assert.equal(error.status, 401)
  assert.equal(error.message, 'El token expiró')
})

test('rechaza un token firmado con otro secreto', () => {
  const { error } = run(`Bearer ${token({ secret: 'otro-secreto-distinto-de-32-caracteres!!' })}`)
  assert.equal(error.message, 'Token inválido')
})

test('rechaza tokens de otro emisor o audiencia', () => {
  assert.equal(run(`Bearer ${token({ issuer: 'otra-api' })}`).error.status, 401)
  assert.equal(run(`Bearer ${token({ audience: 'otra-web' })}`).error.status, 401)
})

test('rechaza el ataque alg "none" (token sin firma)', () => {
  const unsigned = jwt.sign({ tid: '3', role: 'owner' }, null, {
    algorithm: 'none',
    subject: '1',
    issuer: options.issuer,
    audience: options.audience,
  })
  assert.equal(run(`Bearer ${unsigned}`).error.status, 401)
})

test('rechaza un token válido al que le falta el tenant', () => {
  const noTenant = jwt.sign({ role: 'admin' }, options.secret, {
    subject: '7',
    issuer: options.issuer,
    audience: options.audience,
  })
  assert.equal(run(`Bearer ${noTenant}`).error.message, 'Token inválido')
})
