const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DATA_DIR = path.join(__dirname, "..", "data");
const DATABASE_FILE = path.join(DATA_DIR, "xzert.db");
const LEGACY_DATA_FILE = path.join(DATA_DIR, "workouts.json");

/**
 * WorkoutRepository
 * SQLite-backed repository. The legacy JSON file is imported once when
 * the database is created so existing workouts are preserved.
 */
class WorkoutRepository {
  constructor() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    this.db = new sqlite3.Database(DATABASE_FILE);
    this.ready = this._initialize();
  }

  _run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(error) {
        if (error) reject(error);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  _all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
  }

  _get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (error, row) => {
        if (error) reject(error);
        else resolve(row || null);
      });
    });
  }

  async _initialize() {
    await this._run(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        exercise TEXT NOT NULL,
        category TEXT NOT NULL,
        duration INTEGER NOT NULL,
        sets INTEGER,
        reps INTEGER,
        date TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      )
    `);

    const existing = await this._get("SELECT COUNT(*) AS count FROM workouts");
    if (existing.count === 0 && fs.existsSync(LEGACY_DATA_FILE)) {
      const legacy = JSON.parse(fs.readFileSync(LEGACY_DATA_FILE, "utf-8") || "[]");
      for (const workout of legacy) {
        await this._run(
          `INSERT OR IGNORE INTO workouts
           (id, exercise, category, duration, sets, reps, date, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [workout.id, workout.exercise, workout.category, Number(workout.duration) || 0,
            workout.sets ?? null, workout.reps ?? null, workout.date, workout.notes || ""]
        );
      }
    }
  }

  async getAll() {
    await this.ready;
    return this._all("SELECT * FROM workouts ORDER BY date DESC, rowid DESC");
  }

  async getById(id) {
    await this.ready;
    return this._get("SELECT * FROM workouts WHERE id = ?", [id]);
  }

  async create(workout) {
    await this.ready;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await this._run(
      `INSERT INTO workouts (id, exercise, category, duration, sets, reps, date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, workout.exercise, workout.category, Number(workout.duration),
        workout.sets ? Number(workout.sets) : null, workout.reps ? Number(workout.reps) : null,
        workout.date, workout.notes || ""]
    );
    return this.getById(id);
  }

  async update(id, updates) {
    await this.ready;
    const result = await this._run(
      `UPDATE workouts SET exercise = ?, category = ?, duration = ?, sets = ?, reps = ?, date = ?, notes = ?
       WHERE id = ?`,
      [updates.exercise, updates.category, Number(updates.duration),
        updates.sets ? Number(updates.sets) : null, updates.reps ? Number(updates.reps) : null,
        updates.date, updates.notes || "", id]
    );
    return result.changes ? this.getById(id) : null;
  }

  async remove(id) {
    await this.ready;
    const result = await this._run("DELETE FROM workouts WHERE id = ?", [id]);
    return result.changes > 0;
  }
}

module.exports = new WorkoutRepository();
