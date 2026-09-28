function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));
}

async function renderWorkouts() {
  const tbody = document.getElementById("workouts-body");
  tbody.innerHTML = `<tr><td colspan="7" class="loading-state">Loading workouts...</td></tr>`;

  let workouts;
  try {
    workouts = await WorkoutAPI.getAll();
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="error-state">${escapeHTML(error.message)}</td></tr>`;
    return;
  }

  const query = document.getElementById("workout-search").value.trim().toLowerCase();
  const category = document.getElementById("category-filter").value;
  const filtered = workouts.filter((workout) =>
    (!query || `${workout.exercise} ${workout.notes}`.toLowerCase().includes(query)) &&
    (!category || workout.category === category)
  );
  document.getElementById("workout-count").textContent = `${filtered.length} ${filtered.length === 1 ? "session" : "sessions"}`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="big">🏋️</div>
            <p>No workouts logged yet. Add your first one!</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  filtered
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((w) => {
      const tr = document.createElement("tr");
      const setsReps = w.sets && w.reps ? `${w.sets} × ${w.reps}` : "—";
      tr.innerHTML = `
        <td>${formatDate(w.date)}</td>
        <td><strong>${escapeHTML(w.exercise)}</strong></td>
        <td><span class="tag ${w.category === "Cardio" ? "red" : ""}">${escapeHTML(w.category)}</span></td>
        <td>${w.duration} min</td>
        <td>${setsReps}</td>
        <td>${escapeHTML(w.notes || "—")}</td>
        <td class="row-actions">
          <a href="workout-form.html?id=${w.id}" class="btn btn-ghost btn-sm">Edit</a>
          <button class="btn btn-danger btn-sm" data-id="${w.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this workout? This can't be undone.")) return;
      await WorkoutAPI.remove(btn.dataset.id);
      renderWorkouts();
    });
  });
}

renderWorkouts();
document.getElementById("workout-search").addEventListener("input", renderWorkouts);
document.getElementById("category-filter").addEventListener("change", renderWorkouts);
