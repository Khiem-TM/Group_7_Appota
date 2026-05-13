-- =========================================
-- STEP 1: Create players table
-- =========================================
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_players_created_by'
    ) THEN
        ALTER TABLE players
        ADD CONSTRAINT uq_players_created_by UNIQUE (created_by);
    END IF;
END $$;

-- =========================================
-- STEP 2: Add player_id column to participants
-- =========================================
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS player_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_player_id ON participants(player_id);

-- =========================================
-- STEP 3: Create players from existing users
-- (mỗi user trở thành 1 player)
-- =========================================
INSERT INTO players (display_name, avatar_url, created_by)
SELECT u.username, u.avatar_url, u.id
FROM users u
LEFT JOIN players p ON p.created_by = u.id
WHERE p.id IS NULL;

-- =========================================
-- STEP 4: Backfill participants.player_id
-- =========================================
UPDATE participants pt
SET player_id = p.id
FROM players p
JOIN users u ON p.created_by = u.id
WHERE pt.user_id = u.id
  AND pt.player_id IS NULL;

-- =========================================
-- STEP 5: Add new FK (song song FK cũ)
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_participant_player'
    ) THEN
        ALTER TABLE participants
        ADD CONSTRAINT fk_participant_player
        FOREIGN KEY (player_id) REFERENCES players(id);
    END IF;
END $$;