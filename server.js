const express = require("express");
const path = require("path");
const workoutRepository = require("./repository/workoutRepository");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- API routes ---------------------------------------------------

// GET all workouts
app.get("/api/workouts", (req, res) => {
  res.json(workoutRepository.getAll());
});

// GET a single workout
app.get("/api/workouts/:id", (req, res) => {
  const workout = workoutRepository.getById(req.params.id);
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
});

// CREATE a workout
app.post("/api/workouts", (req, res) => {
  const { exercise, category, duration, date } = req.body;
  if (!exercise || !category || !duration || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const created = workoutRepository.create(req.body);
  res.status(201).json(created);
});

// UPDATE a workout
app.put("/api/workouts/:id", (req, res) => {
  const updated = workoutRepository.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Workout not found" });
  res.json(updated);
});

// DELETE a workout
app.delete("/api/workouts/:id", (req, res) => {
  const removed = workoutRepository.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "Workout not found" });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Xzert running at http://localhost:${PORT}`);
});
