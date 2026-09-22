-- Contrato inicial. Nuevos cambios se añaden en migraciones posteriores.
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
  email VARCHAR(254) NOT NULL CHECK (email = lower(trim(email))),
  password_hash TEXT NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  capacity_bytes BIGINT NOT NULL CHECK (capacity_bytes > 0),
  daily_upload_limit INTEGER CHECK (daily_upload_limit > 0),
  daily_bytes_limit BIGINT CHECK (daily_bytes_limit > 0),
  monthly_price_gtq NUMERIC(10, 2) CHECK (monthly_price_gtq >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(16) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'cancelled')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  CHECK (expires_at IS NULL OR expires_at > started_at)
);
CREATE UNIQUE INDEX subscriptions_one_active_per_user
  ON subscriptions(user_id) WHERE status = 'active';
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);

CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name),
  UNIQUE (id, user_id)
);

CREATE TABLE stored_objects (
  -- SHA-256 del contenido ORIGINAL: deduplicación global de archivos idénticos.
  hash_sha256 CHAR(64) PRIMARY KEY CHECK (hash_sha256 ~ '^[a-f0-9]{64}$'),
  original_size_bytes BIGINT NOT NULL CHECK (original_size_bytes > 0),
  -- Ruta RELATIVA a STORAGE_ROOT, asignada al finalizar el procesamiento.
  -- No se persiste el original, el porcentaje de ahorro ni contadores de consumo.
  storage_key TEXT UNIQUE CHECK (
    storage_key ~ '^[a-f0-9]{2}/[a-f0-9]{64}\.webp$'
    AND storage_key = substr(hash_sha256, 1, 2) || '/' || hash_sha256 || '.webp'
  ),
  status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((status = 'ready' AND storage_key IS NOT NULL)
    OR (status <> 'ready' AND storage_key IS NULL))
);

CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  folder_id UUID,
  object_hash CHAR(64) NOT NULL REFERENCES stored_objects(hash_sha256),
  original_name VARCHAR(255) NOT NULL CHECK (length(trim(original_name)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Una carpeta de otro cliente no puede convertirse en propietaria de la imagen.
  FOREIGN KEY (folder_id, user_id) REFERENCES folders(id, user_id)
);
CREATE INDEX images_user_id_idx ON images(user_id);
CREATE INDEX images_object_hash_idx ON images(object_hash);
CREATE INDEX images_folder_id_idx ON images(folder_id);

COMMENT ON TABLE stored_objects IS
  'Archivo físico WebP global. Las referencias se derivan de images, no de un contador persistido.';
COMMENT ON COLUMN stored_objects.original_size_bytes IS
  'Única métrica de tamaño persistida; los bytes WebP se obtienen del disco y el ahorro se calcula.';
