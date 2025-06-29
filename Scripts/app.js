// document.addEventListener('DOMContentLoaded', function() {
//     const userName = localStorage.getItem('name');
//     document.getElementById('user-name').textContent = userName;

//     const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
//     document.getElementById('user-avatar').src = avatarUrl;

//     document.getElementById('sign-out').addEventListener('click', function() {
//         localStorage.clear();
//         window.location.href = 'index.html';
//     });

//     const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     tasks.forEach(task => {
//         addTaskToDOM(task);
//     });

//     document.getElementById('add-task').addEventListener('click', function() {
//         const newTask = document.getElementById('new-task').value;
//         if (newTask) {
//             const task = { title: newTask, modified: new Date().toISOString() };
//             tasks.push(task);
//             localStorage.setItem('tasks', JSON.stringify(tasks));
//             addTaskToDOM(task);
//             document.getElementById('new-task').value = '';
//         }
//     });

// });

// function addTaskToDOM(task) {
//     const li = document.createElement('li');
//     li.textContent = `${task.title} (Last modified: ${new Date(task.modified).toLocaleString()})`;
//     document.getElementById('todo-list').appendChild(li);
// }

document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("name");
  if (!userName) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("user-name").textContent = userName;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}`;
  document.getElementById("user-avatar").src = avatarUrl;

  document.getElementById("sign-out").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    ["todo-list", "completed-list", "archived-list"].forEach((id) => {
      document.getElementById(id).innerHTML = "";
    });

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-card";
      li.innerHTML = `
        <strong>${task.title}</strong><br>
        <small>Last modified: ${new Date(
          task.modified
        ).toLocaleString()}</small><br>
      `;

      const addBtn = (label, action) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.addEventListener("click", () => {
          action();
          saveTasks();
          renderTasks();
        });
        li.appendChild(btn);
      };

      if (task.stage === "todo") {
        addBtn("Mark as Completed", () => (task.stage = "completed"));
        addBtn("Archive", () => (task.stage = "archived"));
      } else if (task.stage === "completed") {
        addBtn("Move to Todo", () => (task.stage = "todo"));
        addBtn("Archive", () => (task.stage = "archived"));
      } else if (task.stage === "archived") {
        addBtn("Move to Todo", () => (task.stage = "todo"));
        addBtn("Move to Completed", () => (task.stage = "completed"));
        addBtn(
          "Delete ❌",
          () => (tasks = tasks.filter((t) => t.id !== task.id))
        ); // optional
      }

      task.modified = new Date().toISOString();

      const sectionId =
        task.stage === "todo"
          ? "todo-list"
          : task.stage === "completed"
          ? "completed-list"
          : "archived-list";
      document.getElementById(sectionId).appendChild(li);
    });
  }

  renderTasks();

  document.getElementById("add-task").addEventListener("click", () => {
    const newTaskInput = document.getElementById("new-task");
    const title = newTaskInput.value.trim();
    if (!title) return alert("Task cannot be empty.");

    const task = {
      id: Date.now(),
      title,
      stage: "todo",
      modified: new Date().toISOString(),
    };
    tasks.unshift(task);
    newTaskInput.value = "";
    saveTasks();
    renderTasks();
  });

  function showSection(view) {
    ["todo", "completed", "archived"].forEach((section) => {
      const el = document.getElementById(`${section}-section`);
      el.classList.toggle("visible", view === section);
    });
  }


  showSection("todo");

  // Handle view buttons
  document.querySelectorAll("#view-selector button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      showSection(view);
    });
  });
});
