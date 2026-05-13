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

COMMIT;
