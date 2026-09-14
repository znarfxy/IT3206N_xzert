// Small wrapper around fetch() for the /api/workouts endpoints.
const WorkoutAPI = {
  async getAll() {
    const res = await fetch("/api/workouts");
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`/api/workouts/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async create(data) {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`/api/workouts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    return res.ok;
  },
};
