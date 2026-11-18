CREATE TABLE health_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'consulta',
  person_id INTEGER REFERENCES people(id),
  date TEXT NOT NULL,
  doctor_or_clinic TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'musculacao',
  person_id INTEGER REFERENCES people(id),
  date TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE care_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'pele',
  person_id INTEGER REFERENCES people(id),
  frequency TEXT NOT NULL DEFAULT 'diario',
  completed INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE mood_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id INTEGER REFERENCES people(id),
  date TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'calmo',
  energy_level INTEGER NOT NULL DEFAULT 3,
  sleep_hours INTEGER NOT NULL DEFAULT 8,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE devotionals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  passage_or_verse TEXT,
  reflection TEXT,
  type TEXT NOT NULL DEFAULT 'leitura',
  person_id INTEGER REFERENCES people(id),
  date TEXT NOT NULL,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE meal_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  meal_type TEXT NOT NULL DEFAULT 'almoco',
  day_of_week TEXT NOT NULL DEFAULT 'segunda',
  recipe_or_ingredients TEXT,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
