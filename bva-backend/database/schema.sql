-- =============================================================================
-- BVA Business Solutions · Esquema multi-tenant (MySQL 8.0.16+ · InnoDB · utf8mb4)
-- =============================================================================
--
-- MODELO MULTI-TENANT: una sola base de datos compartida; cada fila operativa lleva tenant_id.
--
-- 1. Aislamiento con claves foráneas COMPUESTAS.
--    Cada tabla de negocio tiene UNIQUE (tenant_id, id) y los hijos referencian
--    (tenant_id, <padre>_id). Así la base de datos IMPIDE que una cita del tenant 1 apunte
--    a un cliente del tenant 2, aunque la aplicación tenga un error.
--
-- 2. Reglas de borrado.
--    - tenants -> todo: RESTRICT. Nunca se borra un negocio con datos por accidente.
--      La baja es lógica (tenants.status = 'cancelled') y la purga es un proceso aparte.
--    - Historial con valor legal o contable (pedidos, reservas, citas, pagos, inventario): RESTRICT.
--      No se puede borrar un cliente o producto que ya tiene historia; se desactiva.
--    - Partes de un todo (order_items de un pedido): CASCADE.
--    - Las FK compuestas opcionales usan RESTRICT, no SET NULL: SET NULL también vaciaría
--      tenant_id, que es NOT NULL.
--
-- 3. Contraseñas: users.password_hash guarda SOLO el hash bcrypt (60 caracteres, incluye la
--    sal y el costo). La contraseña en claro nunca llega a la base de datos.
--
-- 4. Dinero en DECIMAL(12,2) (nunca FLOAT). Moneda por defecto CRC. Fechas y horas en UTC.
--
-- 5. ESTRATEGIA DE ÍNDICES: ver el comentario antes de las tablas orders y bookings.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS bva_saas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE bva_saas;

-- -----------------------------------------------------------------------------
-- CORE SAAS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tenants (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(63)  NOT NULL COMMENT 'Identificador en URL: clinica-vida',
  name           VARCHAR(150) NOT NULL,
  industry       ENUM('services', 'health', 'tourism', 'ecommerce', 'other') NOT NULL DEFAULT 'other',
  primary_color  CHAR(7)      NOT NULL DEFAULT '#2F5BFF' COMMENT 'Acento de marca blanca',
  logo_url       VARCHAR(500) NULL,
  country        CHAR(2)      NOT NULL DEFAULT 'CR',
  timezone       VARCHAR(40)  NOT NULL DEFAULT 'America/Costa_Rica',
  currency       CHAR(3)      NOT NULL DEFAULT 'CRC',
  status         ENUM('trial', 'active', 'suspended', 'cancelled') NOT NULL DEFAULT 'trial',
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_tenants_slug (slug),
  KEY idx_tenants_status (status),
  CONSTRAINT chk_tenants_color CHECK (REGEXP_LIKE(primary_color, '^#[0-9A-Fa-f]{6}$')),
  CONSTRAINT chk_tenants_slug  CHECK (REGEXP_LIKE(slug, '^[a-z0-9]+(-[a-z0-9]+)*$'))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id      BIGINT UNSIGNED NOT NULL,
  email          VARCHAR(254) NOT NULL,
  password_hash  CHAR(60)     NOT NULL COMMENT 'Hash bcrypt ($2b$12$...). Nunca la contraseña.',
  full_name      VARCHAR(120) NOT NULL,
  role           ENUM('owner', 'admin', 'agent', 'viewer') NOT NULL DEFAULT 'agent',
  status         ENUM('active', 'invited', 'disabled') NOT NULL DEFAULT 'active',
  last_login_at  DATETIME(3)  NULL,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_tenant_id (tenant_id, id),
  UNIQUE KEY uq_users_tenant_email (tenant_id, email) COMMENT 'Login: WHERE tenant_id = ? AND email = ?',
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_users_bcrypt CHECK (password_hash LIKE '$2_$%')
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS subscriptions (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id             BIGINT UNSIGNED NOT NULL,
  plan                  ENUM('starter', 'growth', 'pro') NOT NULL,
  status                ENUM('trialing', 'active', 'past_due', 'cancelled') NOT NULL DEFAULT 'trialing',
  billing_cycle         ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  price                 DECIMAL(12, 2)  NOT NULL,
  currency              CHAR(3)         NOT NULL DEFAULT 'CRC',
  current_period_start  DATE            NOT NULL,
  current_period_end    DATE            NOT NULL,
  cancelled_at          DATETIME(3)     NULL,
  provider_ref          VARCHAR(100)    NULL COMMENT 'Id en la pasarela de pago (nunca datos de tarjeta)',
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_subscriptions_tenant_status (tenant_id, status, current_period_end),
  KEY idx_subscriptions_renewals (status, current_period_end) COMMENT 'Proceso de cobros: qué vence hoy',
  CONSTRAINT fk_subscriptions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_subscriptions_period CHECK (current_period_end > current_period_start),
  CONSTRAINT chk_subscriptions_price  CHECK (price >= 0)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- CORE CRM
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS customers (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   BIGINT UNSIGNED NOT NULL,
  full_name   VARCHAR(150) NOT NULL,
  email       VARCHAR(254) NULL,
  phone       VARCHAR(20)  NULL COMMENT 'Formato E.164: +50688888888',
  source      ENUM('web', 'whatsapp', 'referral', 'walk_in', 'other') NOT NULL DEFAULT 'other',
  notes       TEXT         NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_tenant_id (tenant_id, id),
  KEY idx_customers_tenant_email (tenant_id, email),
  KEY idx_customers_tenant_phone (tenant_id, phone) COMMENT 'Búsqueda al llegar un WhatsApp',
  KEY idx_customers_tenant_created (tenant_id, created_at),
  CONSTRAINT fk_customers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS leads (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id        BIGINT UNSIGNED NOT NULL,
  customer_id      BIGINT UNSIGNED NULL COMMENT 'Se llena cuando el prospecto se convierte en cliente',
  assigned_to      BIGINT UNSIGNED NULL COMMENT 'Usuario responsable',
  full_name        VARCHAR(150)   NOT NULL,
  email            VARCHAR(254)   NULL,
  phone            VARCHAR(20)    NULL,
  source           ENUM('web', 'whatsapp', 'facebook', 'instagram', 'referral', 'other') NOT NULL DEFAULT 'web',
  status           ENUM('new', 'contacted', 'qualified', 'won', 'lost') NOT NULL DEFAULT 'new',
  estimated_value  DECIMAL(12, 2) NULL,
  notes            TEXT           NULL,
  created_at       DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_leads_pipeline (tenant_id, status, created_at) COMMENT 'Tablero: prospectos por columna',
  KEY idx_leads_assigned (tenant_id, assigned_to, status),
  KEY idx_leads_customer (tenant_id, customer_id),
  CONSTRAINT fk_leads_tenant   FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_leads_customer FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_leads_assignee FOREIGN KEY (tenant_id, assigned_to) REFERENCES users (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_leads_value   CHECK (estimated_value IS NULL OR estimated_value >= 0)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- MÓDULO SERVICIOS / SALUD
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS services (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id     BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(120)      NOT NULL,
  description   TEXT              NULL,
  duration_min  SMALLINT UNSIGNED NOT NULL,
  price         DECIMAL(12, 2)    NOT NULL,
  currency      CHAR(3)           NOT NULL DEFAULT 'CRC',
  is_active     BOOLEAN           NOT NULL DEFAULT TRUE,
  created_at    DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_tenant_id (tenant_id, id),
  UNIQUE KEY uq_services_tenant_name (tenant_id, name),
  CONSTRAINT fk_services_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_services_duration CHECK (duration_min > 0),
  CONSTRAINT chk_services_price    CHECK (price >= 0)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NULL COMMENT 'Opcional: si el profesional también entra al sistema',
  full_name   VARCHAR(150) NOT NULL,
  specialty   VARCHAR(120) NULL,
  email       VARCHAR(254) NULL,
  phone       VARCHAR(20)  NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_staff_tenant_id (tenant_id, id),
  UNIQUE KEY uq_staff_tenant_user (tenant_id, user_id),
  CONSTRAINT fk_staff_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_staff_user   FOREIGN KEY (tenant_id, user_id) REFERENCES users (tenant_id, id) ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id    BIGINT UNSIGNED NOT NULL,
  customer_id  BIGINT UNSIGNED NOT NULL,
  service_id   BIGINT UNSIGNED NOT NULL,
  staff_id     BIGINT UNSIGNED NULL,
  starts_at    DATETIME(3)    NOT NULL COMMENT 'UTC',
  ends_at      DATETIME(3)    NOT NULL COMMENT 'UTC',
  status       ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'scheduled',
  price        DECIMAL(12, 2) NOT NULL COMMENT 'Precio al momento de agendar',
  notes        TEXT           NULL,
  created_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_appointments_agenda (tenant_id, starts_at) COMMENT 'Agenda del día o de la semana',
  KEY idx_appointments_staff (tenant_id, staff_id, starts_at) COMMENT 'Choques de horario por profesional',
  KEY idx_appointments_customer (tenant_id, customer_id, starts_at),
  KEY idx_appointments_service (tenant_id, service_id),
  CONSTRAINT fk_appointments_tenant   FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_customer FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_service  FOREIGN KEY (tenant_id, service_id) REFERENCES services (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_staff    FOREIGN KEY (tenant_id, staff_id) REFERENCES staff (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_appointments_time    CHECK (ends_at > starts_at),
  CONSTRAINT chk_appointments_price   CHECK (price >= 0)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- MÓDULO TURISMO / HOSPEDAJE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS properties (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(150)      NOT NULL,
  type        ENUM('room', 'cabin', 'villa', 'apartment', 'tour', 'other') NOT NULL DEFAULT 'room',
  capacity    SMALLINT UNSIGNED NOT NULL,
  base_price  DECIMAL(12, 2)    NOT NULL COMMENT 'Por noche',
  currency    CHAR(3)           NOT NULL DEFAULT 'CRC',
  address     VARCHAR(255)      NULL,
  is_active   BOOLEAN           NOT NULL DEFAULT TRUE,
  created_at  DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_properties_tenant_id (tenant_id, id),
  KEY idx_properties_tenant_active (tenant_id, is_active),
  CONSTRAINT fk_properties_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_properties_capacity CHECK (capacity > 0),
  CONSTRAINT chk_properties_price    CHECK (base_price >= 0)
) ENGINE = InnoDB;

-- ESTRATEGIA DE ÍNDICES (orders y bookings son las tablas de mayor volumen)
--  * tenant_id es SIEMPRE la primera columna. Toda consulta filtra por tenant, así MySQL
--    salta directo al bloque de ese negocio. Un cliente grande no vuelve lentos a los demás.
--  * Después va la columna de igualdad (status, property_id, customer_id) y al final la
--    de rango u orden (created_at, check_in). Con ese orden el índice resuelve WHERE y
--    ORDER BY ... LIMIT sin ordenar en memoria.
--  * bookings (tenant_id, property_id, check_in, check_out): consulta de disponibilidad.
--    Para evitar dobles reservas, la API verifica el traslape dentro de una transacción con
--    SELECT ... FOR UPDATE sobre este índice (MySQL no tiene restricciones de exclusión).
--  * Pocos índices a propósito: cada índice extra encarece cada INSERT.
--  * No se usa PARTITION: MySQL no permite claves foráneas en tablas particionadas.
--    Con mucho volumen, primero archivar años viejos y luego mover tenants grandes a otra base.
CREATE TABLE IF NOT EXISTS bookings (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id     BIGINT UNSIGNED NOT NULL,
  property_id   BIGINT UNSIGNED NOT NULL,
  customer_id   BIGINT UNSIGNED NOT NULL,
  check_in      DATE              NOT NULL,
  check_out     DATE              NOT NULL,
  guests        SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  status        ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') NOT NULL DEFAULT 'pending',
  channel       ENUM('direct', 'web', 'whatsapp', 'booking', 'airbnb', 'other') NOT NULL DEFAULT 'direct',
  total_amount  DECIMAL(12, 2)    NOT NULL,
  currency      CHAR(3)           NOT NULL DEFAULT 'CRC',
  notes         TEXT              NULL,
  created_at    DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_bookings_availability (tenant_id, property_id, check_in, check_out),
  KEY idx_bookings_arrivals (tenant_id, status, check_in) COMMENT 'Llegadas de hoy y próximas',
  KEY idx_bookings_customer (tenant_id, customer_id, check_in),
  KEY idx_bookings_created (tenant_id, created_at) COMMENT 'Reportes de ventas por fecha',
  CONSTRAINT fk_bookings_tenant   FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_bookings_property FOREIGN KEY (tenant_id, property_id) REFERENCES properties (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_bookings_customer FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_bookings_dates   CHECK (check_out > check_in),
  CONSTRAINT chk_bookings_guests  CHECK (guests > 0),
  CONSTRAINT chk_bookings_amount  CHECK (total_amount >= 0)
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- MÓDULO E-COMMERCE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS products (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id    BIGINT UNSIGNED NOT NULL,
  sku          VARCHAR(64)    NOT NULL,
  name         VARCHAR(150)   NOT NULL,
  description  TEXT           NULL,
  price        DECIMAL(12, 2) NOT NULL,
  currency     CHAR(3)        NOT NULL DEFAULT 'CRC',
  stock        INT            NOT NULL DEFAULT 0 COMMENT 'Existencia actual; cada cambio queda en inventory_logs',
  is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_tenant_id (tenant_id, id),
  UNIQUE KEY uq_products_tenant_sku (tenant_id, sku),
  KEY idx_products_catalog (tenant_id, is_active, name),
  CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_products_price CHECK (price >= 0),
  CONSTRAINT chk_products_stock CHECK (stock >= 0)
) ENGINE = InnoDB;

-- Ver ESTRATEGIA DE ÍNDICES antes de la tabla bookings.
--  * (tenant_id, created_at): listado de pedidos recientes y reportes de ventas por rango.
--  * (tenant_id, status, created_at): "pedidos por despachar", el filtro más usado.
--  * (tenant_id, customer_id, created_at): historial de compras de un cliente.
--  * UNIQUE (tenant_id, order_number): número visible único por negocio, no global.
CREATE TABLE IF NOT EXISTS orders (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id       BIGINT UNSIGNED NOT NULL,
  customer_id     BIGINT UNSIGNED NOT NULL,
  order_number    VARCHAR(30)    NOT NULL COMMENT 'Número visible: CV-2026-000123',
  status          ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  subtotal        DECIMAL(12, 2) NOT NULL,
  tax             DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT 'IVA',
  total           DECIMAL(12, 2) NOT NULL,
  currency        CHAR(3)        NOT NULL DEFAULT 'CRC',
  payment_method  ENUM('sinpe', 'card', 'cash', 'transfer', 'other') NULL,
  paid_at         DATETIME(3)    NULL,
  created_at      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_tenant_id (tenant_id, id),
  UNIQUE KEY uq_orders_tenant_number (tenant_id, order_number),
  KEY idx_orders_recent (tenant_id, created_at),
  KEY idx_orders_status (tenant_id, status, created_at),
  KEY idx_orders_customer (tenant_id, customer_id, created_at),
  CONSTRAINT fk_orders_tenant   FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_orders_customer FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_orders_amounts CHECK (subtotal >= 0 AND tax >= 0 AND total = subtotal + tax)
) ENGINE = InnoDB;

-- Líneas del pedido: sin ellas un pedido no dice qué se vendió. Se borran con su pedido (CASCADE).
CREATE TABLE IF NOT EXISTS order_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   BIGINT UNSIGNED NOT NULL,
  order_id    BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  quantity    INT UNSIGNED   NOT NULL,
  unit_price  DECIMAL(12, 2) NOT NULL COMMENT 'Precio al momento de la compra',
  line_total  DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  PRIMARY KEY (id),
  KEY idx_order_items_order (tenant_id, order_id),
  KEY idx_order_items_product (tenant_id, product_id) COMMENT 'Productos más vendidos',
  CONSTRAINT fk_order_items_tenant  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_order   FOREIGN KEY (tenant_id, order_id) REFERENCES orders (tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (tenant_id, product_id) REFERENCES products (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_order_items_qty    CHECK (quantity > 0),
  CONSTRAINT chk_order_items_price  CHECK (unit_price >= 0)
) ENGINE = InnoDB;

-- Bitácora de inventario: solo se inserta, nunca se edita (auditoría de cada movimiento).
CREATE TABLE IF NOT EXISTS inventory_logs (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id    BIGINT UNSIGNED NOT NULL,
  product_id   BIGINT UNSIGNED NOT NULL,
  order_id     BIGINT UNSIGNED NULL COMMENT 'Pedido que causó el movimiento, si aplica',
  user_id      BIGINT UNSIGNED NULL COMMENT 'Quién hizo el ajuste manual, si aplica',
  change_qty   INT          NOT NULL COMMENT 'Positivo entra, negativo sale',
  stock_after  INT          NOT NULL,
  reason       ENUM('purchase', 'sale', 'return', 'adjustment', 'damage') NOT NULL,
  note         VARCHAR(255) NULL,
  created_at   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_inventory_product (tenant_id, product_id, created_at) COMMENT 'Kardex de un producto',
  KEY idx_inventory_order (tenant_id, order_id),
  KEY idx_inventory_user (tenant_id, user_id),
  CONSTRAINT fk_inventory_tenant  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT,
  CONSTRAINT fk_inventory_product FOREIGN KEY (tenant_id, product_id) REFERENCES products (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_inventory_order   FOREIGN KEY (tenant_id, order_id) REFERENCES orders (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_inventory_user    FOREIGN KEY (tenant_id, user_id) REFERENCES users (tenant_id, id) ON DELETE RESTRICT,
  CONSTRAINT chk_inventory_change CHECK (change_qty <> 0),
  CONSTRAINT chk_inventory_stock  CHECK (stock_after >= 0)
) ENGINE = InnoDB;
