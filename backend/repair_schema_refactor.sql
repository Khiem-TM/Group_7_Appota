BEGIN;

ALTER TABLE tournaments
    DROP CONSTRAINT IF EXISTS tournaments_host_id_fkey;
ALTER TABLE tournaments
    ADD CONSTRAINT tournaments_host_id_fkey
    FOREIGN KEY (host_id) REFERENCES accounts(id);

ALTER TABLE announcements
    DROP CONSTRAINT IF EXISTS announcements_author_id_fkey;
ALTER TABLE announcements
    ADD CONSTRAINT announcements_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES accounts(id);
ALTER TABLE announcements
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE announcements
    DROP COLUMN IF EXISTS announcement_type;

ALTER TABLE participants
    DROP CONSTRAINT IF EXISTS participants_user_id_fkey;
ALTER TABLE participants
    ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE participants
    ADD CONSTRAINT participants_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES accounts(id);
ALTER TABLE participants
    ADD COLUMN IF NOT EXISTS player_id BIGINT;
ALTER TABLE participants
    DROP CONSTRAINT IF EXISTS uq_participant_player;
ALTER TABLE participants
    ADD CONSTRAINT uq_participant_player UNIQUE (tournament_id, player_id);
ALTER TABLE participants
    DROP CONSTRAINT IF EXISTS participants_player_id_fkey;
ALTER TABLE participants
    ADD CONSTRAINT participants_player_id_fkey
    FOREIGN KEY (player_id) REFERENCES players(id);

ALTER TABLE players
    DROP CONSTRAINT IF EXISTS players_created_by_fkey;
ALTER TABLE players
    ADD CONSTRAINT players_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES accounts(id);

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
    ADD COLUMN IF NOT EXISTS played INTEGER NOT NULL DEFAULT 0;
ALTER TABLE standings
    ADD COLUMN IF NOT EXISTS score_for INTEGER NOT NULL DEFAULT 0;
ALTER TABLE standings
    ADD COLUMN IF NOT EXISTS score_against INTEGER NOT NULL DEFAULT 0;
ALTER TABLE standings
    ALTER COLUMN rank DROP NOT NULL;
ALTER TABLE standings
    DROP COLUMN IF EXISTS score_diff;

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
    ADD COLUMN IF NOT EXISTS scheduled_at VARCHAR(50);
ALTER TABLE matches
    ADD COLUMN IF NOT EXISTS finished_at VARCHAR(50);

ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS bio VARCHAR(500);
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS cover_url VARCHAR(500);

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

ALTER TABLE tournaments
    ADD COLUMN IF NOT EXISTS game_id BIGINT;
ALTER TABLE tournaments
    DROP CONSTRAINT IF EXISTS tournaments_game_id_fkey;
ALTER TABLE tournaments
    ADD CONSTRAINT tournaments_game_id_fkey
    FOREIGN KEY (game_id) REFERENCES games(id);

COMMIT;
