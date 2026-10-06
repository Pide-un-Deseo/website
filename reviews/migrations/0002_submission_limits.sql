CREATE TABLE review_submission_limits (
  client_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL CHECK (attempts >= 1),
  PRIMARY KEY (client_key, window_start)
);

CREATE INDEX review_submission_limits_window_start
  ON review_submission_limits(window_start);