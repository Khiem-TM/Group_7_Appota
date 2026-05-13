# Backend

## Player Migration

This backend now supports a parallel `users` + `players` model.

### Database migration

Run the SQL migration against the existing database:

```bash
cat migrate_add_players.sql | docker compose exec -T postgres psql -U postgres -d tournament_db
```

What it does:

- creates the `players` table
- adds `participants.player_id`
- backfills `players` from existing users
- backfills `participants.player_id` when matching rows exist
- keeps the existing `participants.user_id` foreign key intact

### API changes

- `POST /auth/register` now creates a `Player` record automatically for the new user.
- `POST /tournaments/{tournament_id}/join` keeps the old `user_id` flow.
- `POST /tournaments/{tournament_id}/join-player` joins a tournament using `player_id`.
- `POST /users/players` lets a host create a standalone player without a user account.
- `GET /users/players` lets an admin list players.

### Notes

- New participants store both `user_id` and `player_id`.
- Existing code can keep using `user_id` while new code migrates to `player_id`.
- For a person without a user account, create a standalone player first, then join the tournament with that `player_id`.
- `players.created_by` is not unique anymore, so one host can create multiple standalone players.

### Curl test flow

Use this flow to test from tournament creation to adding both a normal user and a standalone player.

```bash
BASE_URL=http://localhost:8000
STAMP=$(date +%s)

# 1) Register host
HOST_EMAIL=testhost_${STAMP}@example.com
HOST_USERNAME=testhost_${STAMP}
HOST_REGISTER=$(curl -sS -X POST "$BASE_URL/auth/register" \
	-H 'Content-Type: application/json' \
	-d '{"email":"'"$HOST_EMAIL"'","username":"'"$HOST_USERNAME"'","password":"Password123!","role":"HOST"}')
HOST_TOKEN=$(printf '%s' "$HOST_REGISTER" | python3 -c 'import sys, json; print(json.load(sys.stdin)["access_token"])')

# 2) Create tournament
TOURNAMENT_CREATE=$(curl -sS -X POST "$BASE_URL/tournaments" \
	-H "Authorization: Bearer $HOST_TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"name":"Curl Test Tournament","format":"SINGLE_ELIMINATION","visibility":"PUBLIC","max_players":8}')
TOURNAMENT_ID=$(printf '%s' "$TOURNAMENT_CREATE" | python3 -c 'import sys, json; print(json.load(sys.stdin)["id"])')

# 3) Open registration
curl -sS -X POST "$BASE_URL/tournaments/$TOURNAMENT_ID/publish" \
	-H "Authorization: Bearer $HOST_TOKEN"

# 4) Register a normal user and join with user_id flow
USER_EMAIL=testplayer_${STAMP}@example.com
USER_USERNAME=testplayer_${STAMP}
USER_REGISTER=$(curl -sS -X POST "$BASE_URL/auth/register" \
	-H 'Content-Type: application/json' \
	-d '{"email":"'"$USER_EMAIL"'","username":"'"$USER_USERNAME"'","password":"Password123!","role":"PLAYER"}')
USER_TOKEN=$(printf '%s' "$USER_REGISTER" | python3 -c 'import sys, json; print(json.load(sys.stdin)["access_token"])')

USER_JOIN=$(curl -sS -X POST "$BASE_URL/tournaments/$TOURNAMENT_ID/join" \
	-H "Authorization: Bearer $USER_TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{}')

# 5) Create a standalone player without a user account
STANDALONE_PLAYER=$(curl -sS -X POST "$BASE_URL/users/players" \
	-H "Authorization: Bearer $HOST_TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"display_name":"Guest Player","avatar_url":null}')
PLAYER_ID=$(printf '%s' "$STANDALONE_PLAYER" | python3 -c 'import sys, json; print(json.load(sys.stdin)["id"])')

# 6) Join the tournament with player_id flow
PLAYER_JOIN=$(curl -sS -X POST "$BASE_URL/tournaments/$TOURNAMENT_ID/join-player" \
	-H "Authorization: Bearer $HOST_TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"player_id":'"$PLAYER_ID"'}')

printf 'TOURNAMENT_ID=%s\n' "$TOURNAMENT_ID"
printf 'USER_JOIN=%s\n' "$USER_JOIN"
printf 'PLAYER_JOIN=%s\n' "$PLAYER_JOIN"
```

## Lint

Run lint with Docker:

```bash
docker compose run --rm lint
```

To auto-fix safe issues:

```bash
docker compose run --rm lint-fix
```

If you prefer VS Code, run the task `lint:ruff` or `lint:ruff-fix` from the Command Palette.

## Git hook

To run lint automatically before each commit, install the versioned hook script:

```bash
chmod +x scripts/install-pre-commit-hook.sh scripts/pre-commit
./scripts/install-pre-commit-hook.sh
```

After that, every `git commit` from this repo will run the same Docker-based lint check and block the commit if lint fails.
