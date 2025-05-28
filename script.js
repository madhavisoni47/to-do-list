let highPriorityTask = [];
let lowPriorityTask = [];

const highPriorityContainer = document.querySelector("#highpriorityContainer");
const lowPriorityContainer = document.querySelector("#lowpriorityContainer");

function displayTask() {
  highPriorityContainer.innerHTML = '';
  lowPriorityContainer.innerHTML = '';

  highPriorityTask.forEach((task, index) => {
    const taskItem = createTaskElement(task, index, "high-priority");
    highPriorityContainer.appendChild(taskItem);
  });

  lowPriorityTask.forEach((task, index) => {
    const taskItem = createTaskElement(task, index, "low-priority");
    lowPriorityContainer.appendChild(taskItem);
  });
}

function createTaskElement(task, index, priorityClass) {
  const taskItem = document.createElement("div");
  taskItem.className = "todo-item";
  taskItem.classList.add("checkbox-wrapper-48");
  taskItem.classList.add(priorityClass);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  

  checkbox.addEventListener("change", function () {
    task.done = this.checked
    saveTaskToLocalStorage();
    displayTask();
  });

  const label = document.createElement("label");
  label.textContent = `${task.description}  (Deadline:  ${task.deadline})`;
  if (task.done) {
    label.style.textDecoration = "line-through";
    label.style.color = "#0a691f"
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    if (priorityClass === "high-priority") {
      highPriorityTask.splice(index, 1);
    } else {
      lowPriorityTask.splice(index, 1);
    }
    saveTaskToLocalStorage();
    displayTask();
  });

  taskItem.appendChild(checkbox);
  taskItem.appendChild(label);
  taskItem.appendChild(deleteButton);

  return taskItem;
}

function saveTaskToLocalStorage() {
  localStorage.setItem("highPriorityTask", JSON.stringify(highPriorityTask));
  localStorage.setItem("lowPriorityTask", JSON.stringify(lowPriorityTask));
}

function loadTaskFromLocalStorage() {
  const storedHighPriorityTask = localStorage.getItem("highPriorityTask");
  const storedLowPriorityTask = localStorage.getItem("lowPriorityTask");

  if (storedHighPriorityTask) {
    highPriorityTask = JSON.parse(storedHighPriorityTask);
  }

  if (storedLowPriorityTask) {
    lowPriorityTask = JSON.parse(storedLowPriorityTask);
  }

  displayTask();
}

const addButton = document.querySelector("#addButton");
addButton.addEventListener("click", function () {
  const taskInput = document.querySelector("#taskInput");
  const deadlineInput = document.querySelector("#deadlineInput");

  const taskDescription = taskInput.value.trim();
  const deadlineValue = deadlineInput.value;

  if (taskDescription) {
    const newTask = {
      description: taskDescription,
      deadline: deadlineValue,
      done: false,
    };

    const taskDeadline = new Date(deadlineValue);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (!isNaN(taskDeadline.getTime()) && taskDeadline <= today) {
      highPriorityTask.push(newTask);
    } else {
      lowPriorityTask.push(newTask);
    }

    saveTaskToLocalStorage();
    displayTask();

    taskInput.value = '';
    deadlineInput.value = '';
  }
});

loadTaskFromLocalStorage();
