let tasksData = {};

const todo = document.querySelector("#to-do");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  console.log(data);
  for (const col in data) {
    console.log(col, data[col]);
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task");
      div.setAttribute("draggable", "true");
      div.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.desc}</p>
      <button>DELETE</button>
  `;

      column.appendChild(div);
      div.addEventListener("drag", (e) => {
        dragElement = div;
      });
    });
  }
}

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    // console.log("dragging", e);
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      tasksData[col.id] = Array.from(tasks).map((t) => {
        return {
          title: t.querySelector("h2").innerText,
          desc: t.querySelector("p").innerText,
        };
      });

      localStorage.setItem("tasks", JSON.stringify(tasksData));
      count.innerText = tasks.length;
    });

  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

//modal related logic
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");
toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});
modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  const todoTasks = todo.querySelectorAll(".task");

  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
  <h2>${taskTitle}</h2>
  <p>${taskDesc}</p>
  <button>DELETE</button>
  `;

  todo.appendChild(div);
  div.addEventListener("drag", (e) => {
    dragElement = div;
  });
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = tasks.length;
  });

  modal.classList.remove("active");
});
