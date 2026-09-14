const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "workouts.json");

/**
 * WorkoutRepository
 * A simple file-backed repository that centralizes all access to
 * workout records. Swapping the storage engine (e.g. to a real
 * database) later only requires changing the code in this file.
 */
class WorkoutRepository {
  _readAll() {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  }

  _writeAll(workouts) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(workouts, null, 2), "utf-8");
  }

  getAll() {
    return this._readAll();
  }

  getById(id) {
    return this._readAll().find((w) => w.id === id) || null;
  }

  create(workout) {
    const workouts = this._readAll();
    const newWorkout = {
      id: Date.now().toString(),
      exercise: workout.exercise,
      category: workout.category,
      duration: Number(workout.duration) || 0,
      sets: workout.sets ? Number(workout.sets) : null,
      reps: workout.reps ? Number(workout.reps) : null,
      date: workout.date,
      notes: workout.notes || "",
    };
    workouts.push(newWorkout);
    this._writeAll(workouts);
    return newWorkout;
  }

  update(id, updates) {
    const workouts = this._readAll();
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) return null;

    workouts[index] = {
      ...workouts[index],
      exercise: updates.exercise,
      category: updates.category,
      duration: Number(updates.duration) || 0,
      sets: updates.sets ? Number(updates.sets) : null,
      reps: updates.reps ? Number(updates.reps) : null,
      date: updates.date,
      notes: updates.notes || "",
    };
    this._writeAll(workouts);
    return workouts[index];
  }

  remove(id) {
    const workouts = this._readAll();
    const filtered = workouts.filter((w) => w.id !== id);
    const removed = filtered.length !== workouts.length;
    this._writeAll(filtered);
    return removed;
  }
}

module.exports = new WorkoutRepository();
