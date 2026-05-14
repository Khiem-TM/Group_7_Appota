-- =========================================
-- Unified Schema + Seed Data
-- Tournament Bracket Generator
-- =========================================
-- This file is intentionally idempotent.
-- New developers only need to run this single SQL file once, or let
-- docker compose run the `migrate` service automatically.

BEGIN;

-- =========================================
-- Accounts
-- =========================================
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    bio VARCHAR(500),
    country VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS cover_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS bio VARCHAR(500),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100),
    ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'USER',
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_username ON accounts(username);

-- =========================================
-- Players
-- =========================================
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE players
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS created_by BIGINT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_players_created_by ON players(created_by);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'players_created_by_fkey'
    ) THEN
        ALTER TABLE players
        ADD CONSTRAINT players_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES accounts(id);
    END IF;
END $$;

-- =========================================
-- Games
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

ALTER TABLE games
    ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS developer VARCHAR(100),
    ADD COLUMN IF NOT EXISTS genre VARCHAR(100),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

INSERT INTO games (name, slug, thumbnail_url, description, developer, genre) VALUES
  ('League of Legends', 'league-of-legends', 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg', '5v5 MOBA chien luoc - tieu diet Nexus cua doi thu.', 'Riot Games', 'MOBA'),
  ('Dota 2', 'dota-2', 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png', '5v5 MOBA phuc tap va sau sac.', 'Valve', 'MOBA'),
  ('Counter-Strike 2', 'cs2', 'https://cdn.cloudflare.steamstatic.com/apps/csgo/media/cs2_workshop_preview.png', 'FPS chien thuat 5v5 - dat bom va thao bom.', 'Valve', 'FPS'),
  ('VALORANT', 'valorant', 'https://www.riotgames.com/darkroom/576/d0807e131a84b4f5dc9e09fd3c3b9cc7:90a606b5aa48c41d97e9d906adc4ca8c/valorant-702.jpg', 'FPS chien thuat 5v5 voi agent co ky nang rieng.', 'Riot Games', 'FPS'),
  ('EA Sports FC 25', 'ea-fc-25', 'https://upload.wikimedia.org/wikipedia/en/9/94/EA_Sports_FC_25_cover.jpg', 'Mo phong bong da canh tranh.', 'EA Sports', 'Sports'),
  ('PUBG: Battlegrounds', 'pubg-battlegrounds', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg', 'Battle royale sinh ton quy mo lon.', 'KRAFTON', 'Battle Royale'),
  ('Apex Legends', 'apex-legends', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg', 'Battle royale theo squad voi legend co ky nang rieng.', 'Respawn Entertainment', 'Battle Royale'),
  ('Rainbow Six Siege', 'rainbow-six-siege', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/359550/header.jpg', 'FPS chien thuat tan cong phong thu 5v5.', 'Ubisoft', 'FPS'),
  ('Rocket League', 'rocket-league', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252950/header.jpg', 'Bong da xe hoi toc do cao.', 'Psyonix', 'Sports'),
  ('Overwatch 2', 'overwatch-2', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2357570/header.jpg', 'Hero shooter theo doi voi nhip do nhanh.', 'Blizzard Entertainment', 'Hero Shooter'),
  ('Street Fighter 6', 'street-fighter-6', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg', 'Fighting game doi khang 1v1.', 'Capcom', 'Fighting'),
  ('Tekken 8', 'tekken-8', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg', 'Doi khang 3D toc do cao.', 'Bandai Namco', 'Fighting'),
  ('Mortal Kombat 1', 'mortal-kombat-1', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg', 'Fighting game voi combo va fatality.', 'NetherRealm Studios', 'Fighting'),
  ('Halo Infinite', 'halo-infinite', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1240440/header.jpg', 'Arena FPS co dien voi sandbox vu khi.', '343 Industries', 'FPS'),
  ('The Finals', 'the-finals', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2073850/header.jpg', 'FPS team-based voi pha huy moi truong.', 'Embark Studios', 'FPS'),
  ('Brawlhalla', 'brawlhalla', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/291550/header.jpg', 'Platform fighter nhieu nguoi choi.', 'Blue Mammoth Games', 'Fighting'),
  ('SMITE', 'smite', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/386360/header.jpg', 'MOBA goc nhin thu ba voi cac vi than.', 'Titan Forge Games', 'MOBA'),
  ('Paladins', 'paladins', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/444090/header.jpg', 'Hero shooter fantasy theo doi.', 'Evil Mojo Games', 'Hero Shooter'),
  ('Team Fortress 2', 'team-fortress-2', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/440/header.jpg', 'Class-based shooter kinh dien.', 'Valve', 'FPS'),
  ('eFootball', 'efootball', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1665460/header.jpg', 'Mo phong bong da canh tranh.', 'Konami', 'Sports'),
  ('War Thunder', 'war-thunder', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/236390/header.jpg', 'Chien dau phuong tien quan su quy mo lon.', 'Gaijin Entertainment', 'Vehicle Combat'),
  ('iRacing', 'iracing', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/266410/header.jpg', 'Mo phong dua xe canh tranh.', 'iRacing.com Motorsport Simulations', 'Racing'),
  ('F1 24', 'f1-24', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2488620/header.jpg', 'Dua xe Formula 1 chinh thuc.', 'Codemasters', 'Racing'),
  ('NBA 2K25', 'nba-2k25', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2878980/header.jpg', 'Mo phong bong ro canh tranh.', 'Visual Concepts', 'Sports'),
  ('Guilty Gear Strive', 'guilty-gear-strive', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg', 'Fighting game anime toc do cao.', 'Arc System Works', 'Fighting')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  thumbnail_url = EXCLUDED.thumbnail_url,
  description = EXCLUDED.description,
  developer = EXCLUDED.developer,
  genre = EXCLUDED.genre,
  updated_at = NOW();

-- =========================================
-- Tournaments
-- =========================================
CREATE TABLE IF NOT EXISTS tournaments (
    id BIGSERIAL PRIMARY KEY,
    host_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    format VARCHAR(50) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    max_players INTEGER NOT NULL DEFAULT 16,
    game VARCHAR(100),
    game_id BIGINT,
    prize_pool VARCHAR(255),
    rules TEXT,
    start_date VARCHAR(50),
    bracket_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE tournaments
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS format VARCHAR(50),
    ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    ADD COLUMN IF NOT EXISTS max_players INTEGER NOT NULL DEFAULT 16,
    ADD COLUMN IF NOT EXISTS game VARCHAR(100),
    ADD COLUMN IF NOT EXISTS game_id BIGINT,
    ADD COLUMN IF NOT EXISTS prize_pool VARCHAR(255),
    ADD COLUMN IF NOT EXISTS rules TEXT,
    ADD COLUMN IF NOT EXISTS start_date VARCHAR(50),
    ADD COLUMN IF NOT EXISTS bracket_generated BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_tournament_name ON tournaments(name);
CREATE INDEX IF NOT EXISTS idx_tournament_slug ON tournaments(slug);
CREATE INDEX IF NOT EXISTS idx_tournament_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_host_id ON tournaments(host_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_game_id ON tournaments(game_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tournaments_host_id_fkey'
    ) THEN
        ALTER TABLE tournaments
        ADD CONSTRAINT tournaments_host_id_fkey
        FOREIGN KEY (host_id) REFERENCES accounts(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tournaments_game_id_fkey'
    ) THEN
        ALTER TABLE tournaments
        ADD CONSTRAINT tournaments_game_id_fkey
        FOREIGN KEY (game_id) REFERENCES games(id);
    END IF;
END $$;

-- =========================================
-- Participants
-- =========================================
CREATE TABLE IF NOT EXISTS participants (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    user_id BIGINT,
    player_id BIGINT,
    seed INTEGER,
    eliminated BOOLEAN NOT NULL DEFAULT FALSE,
    placement INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE participants
    ADD COLUMN IF NOT EXISTS user_id BIGINT,
    ADD COLUMN IF NOT EXISTS player_id BIGINT,
    ADD COLUMN IF NOT EXISTS seed INTEGER,
    ADD COLUMN IF NOT EXISTS eliminated BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS placement INTEGER,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE participants
    ALTER COLUMN user_id DROP NOT NULL,
    ALTER COLUMN player_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_participants_tournament_id ON participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_player_id ON participants(player_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'participants_tournament_id_fkey'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT participants_tournament_id_fkey
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'participants_user_id_fkey'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT participants_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES accounts(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'participants_player_id_fkey'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT participants_player_id_fkey
        FOREIGN KEY (player_id) REFERENCES players(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_participant'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT uq_participant UNIQUE (tournament_id, user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_participant_player'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT uq_participant_player UNIQUE (tournament_id, player_id);
    END IF;
END $$;

-- =========================================
-- Standings
-- =========================================
CREATE TABLE IF NOT EXISTS standings (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    participant_id BIGINT NOT NULL UNIQUE,
    played INTEGER NOT NULL DEFAULT 0,
    won INTEGER NOT NULL DEFAULT 0,
    lost INTEGER NOT NULL DEFAULT 0,
    draw INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    score_for INTEGER NOT NULL DEFAULT 0,
    score_against INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'standings' AND column_name = 'wins'
    ) THEN
        ALTER TABLE standings RENAME COLUMN wins TO won;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'standings' AND column_name = 'losses'
    ) THEN
        ALTER TABLE standings RENAME COLUMN losses TO lost;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'standings' AND column_name = 'draws'
    ) THEN
        ALTER TABLE standings RENAME COLUMN draws TO draw;
    END IF;
END $$;

ALTER TABLE standings
    ADD COLUMN IF NOT EXISTS played INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS won INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS lost INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS draw INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS score_for INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS score_against INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rank INTEGER,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE standings ALTER COLUMN rank DROP NOT NULL;
ALTER TABLE standings DROP COLUMN IF EXISTS score_diff;

CREATE INDEX IF NOT EXISTS idx_standings_tournament_id ON standings(tournament_id);
CREATE INDEX IF NOT EXISTS idx_standings_participant_id ON standings(participant_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'standings_tournament_id_fkey'
    ) THEN
        ALTER TABLE standings
        ADD CONSTRAINT standings_tournament_id_fkey
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'standings_participant_id_fkey'
    ) THEN
        ALTER TABLE standings
        ADD CONSTRAINT standings_participant_id_fkey
        FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =========================================
-- Matches
-- =========================================
CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL DEFAULT 0,
    bracket VARCHAR(20) NOT NULL DEFAULT 'MAIN',
    player1_id BIGINT,
    player2_id BIGINT,
    winner_id BIGINT,
    loser_id BIGINT,
    score1 INTEGER,
    score2 INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    scheduled_at VARCHAR(50),
    started_at VARCHAR(50),
    finished_at VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'matches' AND column_name = 'bracket_type'
    ) THEN
        ALTER TABLE matches RENAME COLUMN bracket_type TO bracket;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'matches' AND column_name = 'score_player1'
    ) THEN
        ALTER TABLE matches RENAME COLUMN score_player1 TO score1;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'matches' AND column_name = 'score_player2'
    ) THEN
        ALTER TABLE matches RENAME COLUMN score_player2 TO score2;
    END IF;
END $$;

ALTER TABLE matches
    ADD COLUMN IF NOT EXISTS match_number INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS bracket VARCHAR(20) NOT NULL DEFAULT 'MAIN',
    ADD COLUMN IF NOT EXISTS score1 INTEGER,
    ADD COLUMN IF NOT EXISTS score2 INTEGER,
    ADD COLUMN IF NOT EXISTS scheduled_at VARCHAR(50),
    ADD COLUMN IF NOT EXISTS started_at VARCHAR(50),
    ADD COLUMN IF NOT EXISTS finished_at VARCHAR(50),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_player1_id ON matches(player1_id);
CREATE INDEX IF NOT EXISTS idx_matches_player2_id ON matches(player2_id);
CREATE INDEX IF NOT EXISTS idx_matches_winner_id ON matches(winner_id);
CREATE INDEX IF NOT EXISTS idx_matches_loser_id ON matches(loser_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_tournament_id_fkey'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_tournament_id_fkey
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_player1_id_fkey'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_player1_id_fkey
        FOREIGN KEY (player1_id) REFERENCES participants(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_player2_id_fkey'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_player2_id_fkey
        FOREIGN KEY (player2_id) REFERENCES participants(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_winner_id_fkey'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_winner_id_fkey
        FOREIGN KEY (winner_id) REFERENCES participants(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_loser_id_fkey'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_loser_id_fkey
        FOREIGN KEY (loser_id) REFERENCES participants(id);
    END IF;
END $$;

-- =========================================
-- Announcements
-- =========================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE announcements
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE announcements DROP COLUMN IF EXISTS announcement_type;

CREATE INDEX IF NOT EXISTS idx_announcements_tournament_id ON announcements(tournament_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'announcements_tournament_id_fkey'
    ) THEN
        ALTER TABLE announcements
        ADD CONSTRAINT announcements_tournament_id_fkey
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'announcements_author_id_fkey'
    ) THEN
        ALTER TABLE announcements
        ADD CONSTRAINT announcements_author_id_fkey
        FOREIGN KEY (author_id) REFERENCES accounts(id);
    END IF;
END $$;

-- =========================================
-- Invitations
-- =========================================
CREATE TABLE IF NOT EXISTS invitations (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    invited_by BIGINT NOT NULL,
    invited_user_id BIGINT NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    participant_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE invitations
    ADD COLUMN IF NOT EXISTS participant_id BIGINT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_invitations_tournament_id ON invitations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_user_id ON invitations(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invitations_tournament_id_fkey'
    ) THEN
        ALTER TABLE invitations
        ADD CONSTRAINT invitations_tournament_id_fkey
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invitations_invited_by_fkey'
    ) THEN
        ALTER TABLE invitations
        ADD CONSTRAINT invitations_invited_by_fkey
        FOREIGN KEY (invited_by) REFERENCES accounts(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invitations_invited_user_id_fkey'
    ) THEN
        ALTER TABLE invitations
        ADD CONSTRAINT invitations_invited_user_id_fkey
        FOREIGN KEY (invited_user_id) REFERENCES accounts(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invitations_participant_id_fkey'
    ) THEN
        ALTER TABLE invitations
        ADD CONSTRAINT invitations_participant_id_fkey
        FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- =========================================
-- Notifications
-- =========================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    related_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS related_id BIGINT,
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey'
    ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =========================================
-- Migration marker
-- =========================================
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

INSERT INTO alembic_version (version_num)
VALUES ('schema_2026_05_unified')
ON CONFLICT DO NOTHING;

COMMIT;
