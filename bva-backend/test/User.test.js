import { test } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcrypt'

process.env.JWT_SECRET ??= 'secreto-de-prueba-con-mas-de-32-caracteres'
process.env.BCRYPT_ROUNDS ??= '4'
const { createUserModel, ValidationError } = await import('../src/models/User.js')

const ROUNDS = 4 // bajo solo para que las pruebas sean rápidas; en producción 12

/** Base de datos falsa: guarda cada consulta y responde con lo que se le indique. */
function fakeDb(respond = () => [[]]) {
  const calls = []
  return {
    calls,
    async execute(sql, params) {
      calls.push({ sql, params })
      return respond(sql, params)
    },
  }
}

const userRow = async (password, extra = {}) => ({
  id: 7,
  tenant_id: 3,
  email: 'ana@clinica.cr',
  full_name: 'Ana Rojas',
  role: 'admin',
  status: 'active',
  password_hash: await bcrypt.hash(password, ROUNDS),
  ...extra,
})

test('hashPassword guarda un hash bcrypt, nunca la contraseña', async () => {
  const model = createUserModel(fakeDb(), { rounds: ROUNDS })
  const hash = await model.hashPassword('ClaveSegura2026')
  assert.match(hash, /^\$2[aby]\$04\$.{53}$/)
  assert.notEqual(hash, 'ClaveSegura2026')
  assert.ok(await bcrypt.compare('ClaveSegura2026', hash))
})

test('dos usuarios con la misma contraseña tienen hashes distintos (sal aleatoria)', async () => {
  const model = createUserModel(fakeDb(), { rounds: ROUNDS })
  assert.notEqual(await model.hashPassword('MismaClave123'), await model.hashPassword('MismaClave123'))
})

test('rechaza contraseñas cortas y las que bcrypt truncaría (más de 72 bytes)', async () => {
  const model = createUserModel(fakeDb(), { rounds: ROUNDS })
  await assert.rejects(model.hashPassword('corta'), ValidationError)
  await assert.rejects(model.hashPassword('ñ'.repeat(37)), ValidationError) // 74 bytes
})

test('create usa una consulta parametrizada y nunca inserta la contraseña en claro', async () => {
  const db = fakeDb((sql) =>
    sql.startsWith('INSERT') ? [{ insertId: 9 }] : [[{ id: 9, tenant_id: 3, email: 'x' }]],
  )
  const model = createUserModel(db, { rounds: ROUNDS })
  const evil = "x@x.cr'); DROP TABLE users; --"
  await model.create({ tenantId: 3, email: evil, password: 'ClaveSegura2026', fullName: 'Ana' })

  const insert = db.calls[0]
  assert.ok(!insert.sql.includes('DROP'), 'el valor no se concatena en el SQL')
  assert.equal(insert.params[0], 3)
  assert.equal(insert.params[1], evil.toLowerCase())
  assert.ok(!insert.params.includes('ClaveSegura2026'))
  assert.ok(await bcrypt.compare('ClaveSegura2026', insert.params[2]))
})

test('verifyCredentials devuelve el usuario sin el hash cuando la clave es correcta', async () => {
  const row = await userRow('ClaveSegura2026')
  const db = fakeDb((sql) => (sql.startsWith('SELECT') ? [[row]] : [{}]))
  const model = createUserModel(db, { rounds: ROUNDS })

  const user = await model.verifyCredentials(3, ' ANA@clinica.cr ', 'ClaveSegura2026')
  assert.equal(user.id, 7)
  assert.equal(user.password_hash, undefined)
  assert.deepEqual(db.calls[0].params, [3, 'ana@clinica.cr'])
  assert.match(db.calls[1].sql, /^UPDATE users SET last_login_at/)
})

test('verifyCredentials devuelve null con clave incorrecta, usuario inexistente o inactivo', async () => {
  const active = await userRow('ClaveSegura2026')
  const disabled = await userRow('ClaveSegura2026', { status: 'disabled' })
  const model = (row) =>
    createUserModel(
      fakeDb(() => [row ? [row] : []]),
      { rounds: ROUNDS },
    )

  assert.equal(await model(active).verifyCredentials(3, 'ana@clinica.cr', 'otraClave99'), null)
  assert.equal(await model(null).verifyCredentials(3, 'nadie@x.cr', 'ClaveSegura2026'), null)
  assert.equal(await model(disabled).verifyCredentials(3, 'ana@clinica.cr', 'ClaveSegura2026'), null)
})

test('renueva el hash al iniciar sesión si se subió el costo de bcrypt', async () => {
  const row = await userRow('ClaveSegura2026') // hecho con costo 4
  const db = fakeDb((sql) => (sql.startsWith('SELECT') ? [[row]] : [{}]))
  const model = createUserModel(db, { rounds: 5 })

  await model.verifyCredentials(3, 'ana@clinica.cr', 'ClaveSegura2026')
  const update = db.calls[1]
  assert.match(update.sql, /password_hash = \?/)
  assert.equal(bcrypt.getRounds(update.params[0]), 5)
})
