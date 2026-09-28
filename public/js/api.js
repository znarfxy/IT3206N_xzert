// Small wrapper around fetch() for the /api/workouts endpoints.
const WorkoutAPI = {
  async getAll() {
    const res = await fetch("/api/workouts");
    return parseResponse(res);
  },

  async getById(id) {
    const res = await fetch(`/api/workouts/${id}`);
    if (!res.ok) return null;
    return parseResponse(res);
  },

  async create(data) {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(res);
  },

  async update(id, data) {
    const res = await fetch(`/api/workouts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(res);
  },

  async remove(id) {
    const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    return res.ok;
  },
};

async function parseResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}
