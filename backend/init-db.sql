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
    cover_url VARCHAR(500),
    bio VARCHAR(500),
    country VARCHAR(100),
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

CREATE INDEX idx_games_slug ON games(slug);

INSERT INTO games (name, slug, thumbnail_url, description, developer, genre) VALUES
  ('League of Legends', 'league-of-legends', 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg', '5v5 MOBA chiến lược — tiêu diệt Nexus của đối thủ.', 'Riot Games', 'MOBA'),
  ('Dota 2', 'dota-2', 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png', '5v5 MOBA phức tạp và sâu sắc nhất thế giới.', 'Valve', 'MOBA'),
  ('Counter-Strike 2', 'cs2', 'https://cdn.cloudflare.steamstatic.com/apps/csgo/media/cs2_workshop_preview.png', 'FPS chiến thuật 5v5 — đặt bom và tháo bom.', 'Valve', 'FPS'),
  ('VALORANT', 'valorant', 'https://www.riotgames.com/darkroom/576/d0807e131a84b4f5dc9e09fd3c3b9cc7:90a606b5aa48c41d97e9d906adc4ca8c/valorant-702.jpg', 'FPS chiến thuật 5v5 với các nhân vật có kỹ năng đặc biệt.', 'Riot Games', 'FPS'),
  ('EA Sports FC 25', 'ea-fc-25', 'https://upload.wikimedia.org/wikipedia/en/9/94/EA_Sports_FC_25_cover.jpg', 'Mô phỏng bóng đá hàng đầu thế giới.', 'EA Sports', 'Sports')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (name, slug, thumbnail_url, description, developer, genre) VALUES
  ('PUBG: Battlegrounds', 'pubg-battlegrounds', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg', 'Battle royale sinh tồn quy mô lớn.', 'KRAFTON', 'Battle Royale'),
  ('Apex Legends', 'apex-legends', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg', 'Battle royale theo squad với legend có kỹ năng riêng.', 'Respawn Entertainment', 'Battle Royale'),
  ('Rainbow Six Siege', 'rainbow-six-siege', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/359550/header.jpg', 'FPS chiến thuật tấn công/phòng thủ 5v5.', 'Ubisoft', 'FPS'),
  ('Rocket League', 'rocket-league', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252950/header.jpg', 'Bóng đá xe hơi tốc độ cao.', 'Psyonix', 'Sports'),
  ('Overwatch 2', 'overwatch-2', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2357570/header.jpg', 'Hero shooter theo đội với nhịp độ nhanh.', 'Blizzard Entertainment', 'Hero Shooter'),
  ('Street Fighter 6', 'street-fighter-6', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg', 'Fighting game đối kháng 1v1.', 'Capcom', 'Fighting'),
  ('Tekken 8', 'tekken-8', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1778820/header.jpg', 'Đối kháng 3D tốc độ cao.', 'Bandai Namco', 'Fighting'),
  ('Mortal Kombat 1', 'mortal-kombat-1', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg', 'Fighting game điện ảnh với combo và fatality.', 'NetherRealm Studios', 'Fighting'),
  ('Halo Infinite', 'halo-infinite', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1240440/header.jpg', 'Arena FPS cổ điển với sandbox vũ khí.', '343 Industries', 'FPS'),
  ('The Finals', 'the-finals', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2073850/header.jpg', 'FPS team-based với phá hủy môi trường.', 'Embark Studios', 'FPS'),
  ('Brawlhalla', 'brawlhalla', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/291550/header.jpg', 'Platform fighter nhiều người chơi.', 'Blue Mammoth Games', 'Fighting'),
  ('SMITE', 'smite', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/386360/header.jpg', 'MOBA góc nhìn thứ ba với các vị thần.', 'Titan Forge Games', 'MOBA'),
  ('Paladins', 'paladins', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/444090/header.jpg', 'Hero shooter fantasy theo đội.', 'Evil Mojo Games', 'Hero Shooter'),
  ('Team Fortress 2', 'team-fortress-2', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/440/header.jpg', 'Class-based shooter kinh điển.', 'Valve', 'FPS'),
  ('eFootball', 'efootball', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1665460/header.jpg', 'Mô phỏng bóng đá cạnh tranh.', 'Konami', 'Sports'),
  ('War Thunder', 'war-thunder', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/236390/header.jpg', 'Chiến đấu phương tiện quân sự quy mô lớn.', 'Gaijin Entertainment', 'Vehicle Combat'),
  ('iRacing', 'iracing', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/266410/header.jpg', 'Mô phỏng đua xe cạnh tranh.', 'iRacing.com Motorsport Simulations', 'Racing'),
  ('F1 24', 'f1-24', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2488620/header.jpg', 'Đua xe Formula 1 chính thức.', 'Codemasters', 'Racing'),
  ('NBA 2K25', 'nba-2k25', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2878980/header.jpg', 'Mô phỏng bóng rổ cạnh tranh.', 'Visual Concepts', 'Sports'),
  ('Guilty Gear Strive', 'guilty-gear-strive', 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1384160/header.jpg', 'Fighting game anime tốc độ cao.', 'Arc System Works', 'Fighting')
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
    game_id BIGINT REFERENCES games(id),
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
    started_at VARCHAR(50),
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
-- Invitations
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

CREATE INDEX idx_invitations_tournament_id ON invitations(tournament_id);
CREATE INDEX idx_invitations_invited_user_id ON invitations(invited_user_id);
CREATE INDEX idx_invitations_status ON invitations(status);

-- =========================================
-- Notifications
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

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =========================================
-- Alembic version table
-- =========================================
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Record migrations as applied
INSERT INTO alembic_version (version_num) VALUES ('001_schema_refactor');
INSERT INTO alembic_version (version_num) VALUES ('002_new_features');

COMMIT;
