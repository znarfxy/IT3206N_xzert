const express = require("express");
const path = require("path");
const workoutRepository = require("./repository/workoutRepository");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- API routes ---------------------------------------------------

// GET all workouts
app.get("/api/workouts", async (req, res, next) => {
  try {
    res.json(await workoutRepository.getAll());
  } catch (error) {
    next(error);
  }
});

// GET a single workout
app.get("/api/workouts/:id", async (req, res, next) => {
  try {
    const workout = await workoutRepository.getById(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (error) {
    next(error);
  }
});

// CREATE a workout
app.post("/api/workouts", async (req, res, next) => {
  const { exercise, category, duration, date } = req.body;
  if (!exercise || !category || !duration || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const created = await workoutRepository.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

// UPDATE a workout
app.put("/api/workouts/:id", async (req, res, next) => {
  try {
    const updated = await workoutRepository.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Workout not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE a workout
app.delete("/api/workouts/:id", async (req, res, next) => {
  try {
    const removed = await workoutRepository.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Workout not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Unable to complete that request" });
});

app.listen(PORT, () => {
  console.log(`Xzert running at http://localhost:${PORT}`);
});
