CREATE TABLE IF NOT EXISTS work_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  client_or_company TEXT,
  area TEXT NOT NULL DEFAULT 'Desenvolvimento',
  status TEXT NOT NULL DEFAULT 'em_andamento',
  fee_cents INTEGER NOT NULL DEFAULT 0,
  deadline TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS study_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  platform_or_institution TEXT,
  category TEXT NOT NULL DEFAULT 'tecnologia',
  progress_percent INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 0,
  completed_hours INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  certificate_url TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'desenvolvimento',
  status TEXT NOT NULL DEFAULT 'lendo',
  rating INTEGER DEFAULT 5,
  current_page INTEGER NOT NULL DEFAULT 0,
  total_pages INTEGER NOT NULL DEFAULT 0,
  review_or_notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS personal_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'autoral',
  status TEXT NOT NULL DEFAULT 'em_andamento',
  progress_percent INTEGER NOT NULL DEFAULT 0,
  deadline TEXT,
  next_milestone TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planejada',
  budget_estimated_cents INTEGER NOT NULL DEFAULT 0,
  accommodation TEXT,
  checklist_items TEXT,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS personal_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  person_name TEXT NOT NULL DEFAULT 'Marcos',
  category TEXT NOT NULL DEFAULT 'identidade',
  document_number TEXT,
  expiration_date TEXT,
  renewal_alert INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cultural_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'filme',
  platform TEXT NOT NULL DEFAULT 'Netflix',
  status TEXT NOT NULL DEFAULT 'assistindo',
  rating INTEGER DEFAULT 5,
  genre TEXT,
  recommended_by TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS music_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist_or_curator TEXT NOT NULL,
  moment_or_mood TEXT NOT NULL DEFAULT 'foco',
  playlist_or_album TEXT,
  platform TEXT NOT NULL DEFAULT 'Spotify',
  is_favorite INTEGER NOT NULL DEFAULT 1,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
