CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('system_admin','facility_manager','standard_user')) DEFAULT 'standard_user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES resources(id),
  user_id UUID NOT NULL REFERENCES users(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed','cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at),
  CONSTRAINT bookings_no_overlap EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status = 'confirmed')
);

CREATE INDEX IF NOT EXISTS bookings_resource_time_idx ON bookings(resource_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings(user_id);

INSERT INTO resources(id,name,resource_type) VALUES
('11111111-1111-1111-1111-111111111111','Executive Conference Room A','conference_room'),
('22222222-2222-2222-2222-222222222222','Specialized Hardware Lab 1','hardware_lab'),
('33333333-3333-3333-3333-333333333333','Executive Vehicle Fleet 1','vehicle')
ON CONFLICT DO NOTHING;
