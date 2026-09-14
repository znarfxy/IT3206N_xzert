# Xzert — Workout Tracker

A lightweight web app for logging and managing daily workout routines.
Node.js + Express backend, plain HTML/CSS/JS frontend, JSON file repository.

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
│   └── workoutRepository.js        # Data access layer (CRUD)
├── data/
│   └── workouts.json               # Storage (sample data included)
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

- Data persists to `data/workouts.json` — no external database needed.
- Colors and typography are defined as CSS variables at the top of
  `public/css/style.css`, so the blue/red theme is easy to retint.
