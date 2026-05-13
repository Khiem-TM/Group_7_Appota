# Tournament Bracket Generator - Frontend

Frontend skeleton for a one-day MVP using React + Vite + Tailwind CSS.

## Stack

- React (JavaScript)
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- lucide-react

## Quick Start

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t tournament-frontend .
docker run --rm -p 8080:80 tournament-frontend
```

## Notes

- All data is mocked in `src/data/mockData.js`.
- API client is prepared in `src/api/client.js` for future FastAPI integration.
