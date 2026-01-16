let tasksData = {}; // setting the task as objects to send to the localstorage

const todo = document.querySelector("#to-do"); //
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done]; // grabbing items from todo, progress, done column and setting them in an array
let dragElement = null; // creating a variable to set the draggable divs from those columns in it

function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
      <h2>${title}</h2>
      <p>${desc}</p>
      <button>DELETE</button>
  `;

  column.appendChild(div);
  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    // updating local storage data each time for the divs
    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = tasks.length;
  });
}

//get items from local storage to put the in the frontend
if (localStorage.getItem("tasks")) {
  // turning the object from "tasks" to array with json.parse
  const data = JSON.parse(localStorage.getItem("tasks"));

  console.log(data);

  // creating columns from local storage to put in the kanban board
  for (const col in data) {
    console.log(col, data[col]);

    // grabbing the columns from the local storage by the id #col
    const column = document.querySelector(`#${col}`);
    // creating unmovable div from local storage that it doesn't get removed from reload
    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }
  // updating the count from each column that it doesn't get removed from reload
  updateTaskCount();
}
// grabbing the TASKS
const tasks = document.querySelectorAll(".task");

// making the tasks draggable
tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    // console.log("dragging", e);
    dragElement = task;
  });
});

// dragging function
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over"); // turn on hover effect in each column
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over"); // turn off hover effect in each column
  });
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over"); // turning off hover effect from each column after putting a task in it

    // sending each task to local storage
    updateTaskCount();
  });
}

// work the drag function for each column
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

// add task button event
addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  addTask(taskTitle, taskDesc, todo);
  updateTaskCount();
  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});
