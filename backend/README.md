# Backend

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
