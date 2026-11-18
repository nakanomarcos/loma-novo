CREATE TABLE home_maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  room TEXT NOT NULL DEFAULT 'Geral',
  due_date TEXT,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  person_id INTEGER REFERENCES people(id),
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE children_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_person_id INTEGER REFERENCES people(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'escola',
  date TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birthday TEXT,
  phone TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE groceries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'despensa',
  quantity TEXT NOT NULL DEFAULT '1',
  unit TEXT NOT NULL DEFAULT 'un',
  is_purchased INTEGER NOT NULL DEFAULT 0,
  is_essential INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'casa',
  estimated_cost_cents INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'desejo',
  link_or_store TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE pets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'Cachorro',
  breed TEXT,
  birth_date TEXT,
  avatar_color TEXT NOT NULL DEFAULT '#9E6123',
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE pet_care_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER REFERENCES pets(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'consulta',
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2022,
  license_plate TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE vehicle_maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER REFERENCES vehicles(id),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  next_due_mileage INTEGER,
  status TEXT NOT NULL DEFAULT 'concluido',
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE property_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'eletrodomestico',
  estimated_value_cents INTEGER NOT NULL DEFAULT 0,
  purchase_date TEXT,
  warranty_until TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE emergency_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role_or_relation TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_or_details TEXT,
  priority_order INTEGER NOT NULL DEFAULT 1,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
