function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function renderWorkouts() {
  const workouts = await WorkoutAPI.getAll();
  const tbody = document.getElementById("workouts-body");
  tbody.innerHTML = "";

  if (workouts.length === 0) {
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

  workouts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((w) => {
      const tr = document.createElement("tr");
      const setsReps = w.sets && w.reps ? `${w.sets} × ${w.reps}` : "—";
      tr.innerHTML = `
        <td>${formatDate(w.date)}</td>
        <td><strong>${w.exercise}</strong></td>
        <td><span class="tag ${w.category === "Cardio" ? "red" : ""}">${w.category}</span></td>
        <td>${w.duration} min</td>
        <td>${setsReps}</td>
        <td>${w.notes || "—"}</td>
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
