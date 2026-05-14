-- =========================================
-- Migration 002: New Features
-- Games table, match time fields, invitations, notifications
-- =========================================

BEGIN;

-- =========================================
-- Feature 1: Games table
-- =========================================
CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    thumbnail_url VARCHAR(500),
    description TEXT,
    developer VARCHAR(100),
    genre VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

INSERT INTO games (name, slug, thumbnail_url, description, developer, genre) VALUES
  (
    'League of Legends',
    'league-of-legends',
    'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg',
    '5v5 MOBA chiến lược — tiêu diệt Nexus của đối thủ.',
    'Riot Games',
    'MOBA'
  ),
  (
    'Dota 2',
    'dota-2',
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
    '5v5 MOBA phức tạp và sâu sắc nhất thế giới.',
    'Valve',
    'MOBA'
  ),
  (
    'Counter-Strike 2',
    'cs2',
    'https://cdn.cloudflare.steamstatic.com/apps/csgo/media/cs2_workshop_preview.png',
    'FPS chiến thuật 5v5 — đặt bom và tháo bom.',
    'Valve',
    'FPS'
  ),
  (
    'VALORANT',
    'valorant',
    'https://www.riotgames.com/darkroom/576/d0807e131a84b4f5dc9e09fd3c3b9cc7:90a606b5aa48c41d97e9d906adc4ca8c/valorant-702.jpg',
    'FPS chiến thuật 5v5 với các nhân vật có kỹ năng đặc biệt.',
    'Riot Games',
    'FPS'
  ),
  (
    'EA Sports FC 25',
    'ea-fc-25',
    'https://upload.wikimedia.org/wikipedia/en/9/94/EA_Sports_FC_25_cover.jpg',
    'Mô phỏng bóng đá hàng đầu thế giới.',
    'EA Sports',
    'Sports'
  )
ON CONFLICT (slug) DO NOTHING;

-- Add game_id FK to tournaments
ALTER TABLE tournaments
    ADD COLUMN IF NOT EXISTS game_id BIGINT REFERENCES games(id);

CREATE INDEX IF NOT EXISTS idx_tournaments_game_id ON tournaments(game_id);

-- =========================================
-- Feature 4: Match time fields
-- =========================================
ALTER TABLE matches
    ADD COLUMN IF NOT EXISTS started_at VARCHAR(50);

-- =========================================
-- Feature 3: Invitations table
-- =========================================
CREATE TABLE IF NOT EXISTS invitations (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    invited_by BIGINT NOT NULL REFERENCES accounts(id),
    invited_user_id BIGINT NOT NULL REFERENCES accounts(id),
    player_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    participant_id BIGINT REFERENCES participants(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_tournament_id ON invitations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_user_id ON invitations(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

-- =========================================
-- Feature 3: Notifications table
-- =========================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    related_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Track this migration
INSERT INTO alembic_version (version_num)
VALUES ('002_new_features')
ON CONFLICT DO NOTHING;

COMMIT;
