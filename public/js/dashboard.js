function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));
}

async function loadDashboard() {
  const tbody = document.getElementById("recent-body");
  tbody.innerHTML = `<tr><td colspan="4" class="loading-state">Loading activity...</td></tr>`;

  let workouts;
  try {
    workouts = await WorkoutAPI.getAll();
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" class="error-state">${escapeHTML(error.message)}</td></tr>`;
    return;
  }

  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const categories = new Set(workouts.map((w) => w.category));
  const weekStart = startOfWeek();
  const thisWeek = workouts.filter((w) => new Date(w.date) >= weekStart);

  document.getElementById("stat-total").textContent = workouts.length;
  document.getElementById("stat-week").textContent = thisWeek.length;
  document.getElementById("stat-minutes").textContent = totalMinutes;
  document.getElementById("stat-categories").textContent = categories.size;

  const recent = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  tbody.innerHTML = "";

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No workouts logged yet.</td></tr>`;
    return;
  }

  recent.forEach((w) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatDate(w.date)}</td>
      <td><strong>${escapeHTML(w.exercise)}</strong></td>
      <td><span class="tag ${w.category === "Cardio" ? "red" : ""}">${escapeHTML(w.category)}</span></td>
      <td>${w.duration} min</td>
    `;
    tbody.appendChild(tr);
  });
}

loadDashboard();
