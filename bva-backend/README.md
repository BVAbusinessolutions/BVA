# bva-backend

API multi-tenant de BVA Business Solutions: Node.js 20+, Express 5, MySQL 8 (mysql2), JWT y bcrypt.

## Arranque

```bash
cp .env.example .env          # llenar DB_* y JWT_SECRET (mínimo 32 caracteres)
mysql -u root -p < database/schema.sql
npm install
npm run dev
```

`npm test` corre las pruebas sin necesitar MySQL.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/config/` | Variables de entorno validadas y pool de MySQL |
| `src/models/` | Consultas SQL parametrizadas, siempre filtradas por `tenant_id` |
| `src/controllers/` | Validan la entrada y responden |
| `src/routes/` | Rutas y qué middleware protege cada una |
| `src/middlewares/` | `verifyToken` (JWT), `requireRole`, manejo de errores |
| `database/schema.sql` | Esquema completo multi-tenant |

## Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/health` | Pública |
| POST | `/api/auth/login` | Pública, máximo 10 intentos cada 15 min por IP |
| GET | `/api/tenants/:slug/theme` | Pública: color y logo para la marca blanca |
| GET | `/api/auth/me` | Token |
| POST | `/api/users` | Token con rol owner o admin |

## Seguridad

- **Contraseñas con bcrypt**, costo 12. Se rechazan las de menos de 8 caracteres y las de más de 72 bytes, porque bcrypt ignoraría el resto. Si se sube el costo, el hash se renueva solo en el siguiente inicio de sesión.
- **El inicio de sesión no revela nada.** Siempre responde lo mismo y tarda lo mismo, exista o no el correo.
- **JWT solo HS256**, con emisor, audiencia y vencimiento. Lleva el id del usuario, el tenant y el rol, nada más.
- **El tenant sale siempre del token**, nunca del cuerpo de la petición.
- **Claves foráneas compuestas** en el esquema: la base de datos impide mezclar datos de dos negocios.
