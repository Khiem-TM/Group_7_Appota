-- =========================================
-- Fresh Schema Creation for Tournament DB
-- New schema with accounts, players, participants redesign
-- =========================================

BEGIN TRANSACTION;

-- =========================================
-- Accounts (formerly users)
-- =========================================
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_username ON accounts(username);

-- =========================================
-- Players (new table)
-- =========================================
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_players_created_by ON players(created_by);

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
    prize_pool VARCHAR(255),
    rules TEXT,
    start_date VARCHAR(50),
    bracket_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tournament_name ON tournaments(name);
CREATE INDEX idx_tournament_slug ON tournaments(slug);
CREATE INDEX idx_tournament_status ON tournaments(status);
CREATE INDEX idx_tournament_host_id ON tournaments(host_id);

-- =========================================
-- Participants (updated with player_id)
-- =========================================
CREATE TABLE IF NOT EXISTS participants (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    seed INTEGER,
    eliminated BOOLEAN NOT NULL DEFAULT FALSE,
    placement INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_participant UNIQUE (tournament_id, player_id)
);

CREATE INDEX idx_participants_tournament_id ON participants(tournament_id);
CREATE INDEX idx_participants_player_id ON participants(player_id);

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

CREATE INDEX idx_standings_tournament_id ON standings(tournament_id);
CREATE INDEX idx_standings_participant_id ON standings(participant_id);

-- =========================================
-- Matches
-- =========================================
CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL DEFAULT 0,
    player1_id BIGINT,
    player2_id BIGINT,
    winner_id BIGINT,
    loser_id BIGINT,
    score1 INTEGER,
    score2 INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    scheduled_at VARCHAR(50),
    finished_at VARCHAR(50),
    bracket VARCHAR(20) DEFAULT 'MAIN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX idx_matches_player1_id ON matches(player1_id);
CREATE INDEX idx_matches_player2_id ON matches(player2_id);
CREATE INDEX idx_matches_winner_id ON matches(winner_id);
CREATE INDEX idx_matches_loser_id ON matches(loser_id);

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

CREATE INDEX idx_announcements_tournament_id ON announcements(tournament_id);
CREATE INDEX idx_announcements_author_id ON announcements(author_id);

-- =========================================
-- Alembic version table
-- =========================================
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Record migration as applied
INSERT INTO alembic_version (version_num) VALUES ('001_schema_refactor');

COMMIT;
