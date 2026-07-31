# Swiggy Plus — Frontend

React + Vite (JavaScript) frontend for the Swiggy Plus cafe discovery app, with a real
interactive map (Leaflet/OpenStreetMap), Framer Motion animations, and Tailwind CSS.

## Unique feature: Live Cafe Pulse
Instead of static star ratings, users can check in at a cafe and share **live** seating,
noise, and wifi conditions. The app aggregates recent check-ins into a real-time "vibe score"
shown on every cafe card, map marker popup, and detail page — something Swiggy/Zomato don't offer.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend, default http://localhost:5000/api
npm run dev              # http://localhost:5173
```

Make sure the backend is running and seeded first (see `../backend/README.md`).

## Demo login
- email: `demo@swiggyplus.test`
- password: `demo1234`
(Pre-filled on the login screen.)

## Pages
- `/` — landing page
- `/discover` — real map (Leaflet) + list view, geolocation, search, tag filters, radius slider
- `/cafe/:id` — cafe detail, live pulse panel, check-in modal, reviews, embedded map
- `/premium` — Swiggy Plus membership perks + mock upgrade flow
- `/favorites` — saved cafes (auth required)
- `/dashboard` — your points + check-in history (auth required)
- `/profile` — edit profile (auth required)
- `/login`, `/signup`

## Tech
React 18, React Router, Framer Motion, Tailwind CSS, react-leaflet (OpenStreetMap/CARTO dark tiles
— no API key required), Axios.

## Notes
- Dark/light mode toggle in the navbar, persisted to localStorage.
- Skeleton loaders, toast notifications, and empty states are implemented throughout.
- Fully responsive: mobile nav drawer, responsive grids, mobile-first modal (bottom sheet).
