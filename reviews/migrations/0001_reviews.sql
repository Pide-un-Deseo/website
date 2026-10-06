CREATE TABLE review_invitations (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'used', 'revoked')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  consumed_by TEXT UNIQUE
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL UNIQUE REFERENCES review_invitations(id),
  first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 40),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL CHECK (length(text) BETWEEN 10 AND 1200),
  status TEXT NOT NULL CHECK (status IN ('published', 'hidden')),
  created_at TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  hidden_at TEXT
);

CREATE INDEX reviews_visible_created_at
  ON reviews(status, created_at DESC);

CREATE INDEX review_invitations_status_expires_at
  ON review_invitations(status, expires_at);