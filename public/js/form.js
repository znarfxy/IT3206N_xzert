const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

const form = document.getElementById("workout-form");
const errorBanner = document.getElementById("error-banner");

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.style.display = "block";
}

async function prefillForEdit() {
  if (!editId) return;

  const workout = await WorkoutAPI.getById(editId);
  if (!workout) {
    showError("Workout not found. It may have already been deleted.");
    return;
  }

  document.getElementById("form-title").innerHTML = 'Edit <span class="accent">Workout</span>';
  document.getElementById("submit-btn").textContent = "Update Workout";
  document.getElementById("workout-id").value = workout.id;
  document.getElementById("exercise").value = workout.exercise;
  document.getElementById("category").value = workout.category;
  document.getElementById("date").value = workout.date;
  document.getElementById("duration").value = workout.duration;
  document.getElementById("sets").value = workout.sets || "";
  document.getElementById("reps").value = workout.reps || "";
  document.getElementById("notes").value = workout.notes || "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBanner.style.display = "none";

  const data = {
    exercise: document.getElementById("exercise").value.trim(),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    duration: document.getElementById("duration").value,
    sets: document.getElementById("sets").value,
    reps: document.getElementById("reps").value,
    notes: document.getElementById("notes").value.trim(),
  };

  if (!data.exercise || !data.category || !data.date || !data.duration) {
    showError("Please fill in exercise, category, date, and duration.");
    return;
  }

  try {
    if (editId) {
      await WorkoutAPI.update(editId, data);
    } else {
      await WorkoutAPI.create(data);
    }
    window.location.href = "workouts.html";
  } catch (err) {
    showError("Something went wrong while saving. Please try again.");
  }
});

// Default the date field to today for new entries
if (!editId) {
  document.getElementById("date").value = new Date().toISOString().split("T")[0];
}

prefillForEdit();
