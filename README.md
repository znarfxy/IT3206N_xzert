# Xzert — Workout Tracker

A lightweight web app for logging and managing daily workout routines.
Node.js + Express backend, SQLite database, and plain HTML/CSS/JS frontend.

## Pages

| File                  | Purpose                                   |
|------------------------|--------------------------------------------|
| `index.html`           | Dashboard — stats + recent activity        |
| `workouts.html`        | View all workouts, edit / delete           |
| `workout-form.html`    | Add a new workout, or edit an existing one |

## Structure

```
workout-tracker/
├── server.js                       # Express app + REST API routes
├── repository/
│   └── workoutRepository.js        # SQLite data access layer (CRUD + migration)
├── data/
│   ├── workouts.json               # Legacy seed data (imported once)
│   └── xzert.db                    # SQLite database (generated on first run)
└── public/
    ├── index.html
    ├── workouts.html
    ├── workout-form.html
    ├── css/style.css
    └── js/
        ├── api.js                  # fetch() wrapper for the API
        ├── dashboard.js
        ├── workouts.js
        └── form.js
```

## Run it

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## API

| Method | Endpoint             | Description         |
|--------|-----------------------|----------------------|
| GET    | `/api/workouts`       | List all workouts    |
| GET    | `/api/workouts/:id`   | Get one workout      |
| POST   | `/api/workouts`       | Create a workout     |
| PUT    | `/api/workouts/:id`   | Update a workout     |
| DELETE | `/api/workouts/:id`   | Delete a workout     |

## Notes

- Data persists to `data/xzert.db`. On first run, existing records in
  `data/workouts.json` are imported automatically.
- The frontend reads and updates data through the Express REST API. Search and
  category filters on the Workouts page operate on the current API response.
- Colors and typography are defined as CSS variables at the top of
  `public/css/style.css`.
