document.addEventListener ('DOMContentLoaded', loadTasks);
document.getElementById ('addTaskButton').addEventListener ('click', addTask);

function loadTasks () {
  const tasks = JSON.parse (localStorage.getItem ('tasks')) || [];
  tasks.sort ((a, b) => new Date (a.deadline) - new Date (b.deadline));
  tasks.forEach (task => {
    addTaskToDOM (task.text, task.deadline, task.completed, task.completedAt);
  });
}

function addTask () {
  const taskInput = document.getElementById ('taskInput');
  const deadlineInput = document.getElementById ('deadlineInput');
  const task = taskInput.value.trim ();
  const deadline = deadlineInput.value;

  if (!task || !deadline) {
    alert ('Silakan isi semua field!');
    return;
  }

  addTaskToDOM (task, deadline, false, null);
  saveTaskToLocalStorage (task, deadline, false, null);
  taskInput.value = '';
  deadlineInput.value = '';

  location.reload ();
}

function addTaskToDOM (task, deadline, completed, completedAt) {
  const taskList = document.getElementById ('taskList');
  const li = document.createElement ('li');

  if (completed) {
    li.classList.add ('completed');
  }

  const deadlineStatus = getDeadlineStatus (deadline);
  const completedTime = completedAt
    ? `<span class="completed-time">Selesai pada: ${completedAt}</span>`
    : '';

  li.innerHTML = `
        <div class="kontainer-todolist task-container">            
            <span class="judul-task ${completed ? 'completed' : ''}">${task}</span>
        </div>
        <div class="kontainer-todolist deadline-container">
            ${completedTime}
            <span class="deadline ${deadlineStatus}">${deadline}</span>
            <button onclick="removeTask(this)"><img src="/assets/icon-tong-sampah.png" alt="Hapus"></button>
            <button class="check-btn" onclick="toggleTask(this)">${completed ? '✖' : '✔'}</button>
        </div>
    `;

  taskList.appendChild (li);
}

function saveTaskToLocalStorage (task, deadline, completed, completedAt) {
  const tasks = JSON.parse (localStorage.getItem ('tasks')) || [];
  tasks.push ({
    text: task,
    deadline: deadline,
    completed: completed,
    completedAt: completedAt,
  });
  localStorage.setItem ('tasks', JSON.stringify (tasks));
}

function removeTask (button) {
  const taskList = document.getElementById ('taskList');
  const li = button.parentElement.parentElement;
  const taskText = li.querySelector ('.judul-task').textContent.trim ();
  const taskDeadline = li.querySelector ('.deadline').textContent.trim ();

  li.remove ();
  removeTaskFromLocalStorage (taskText, taskDeadline);
}

function removeTaskFromLocalStorage (taskText, taskDeadline) {
  let tasks = JSON.parse (localStorage.getItem ('tasks')) || [];
  tasks = tasks.filter (
    t => !(t.text === taskText && t.deadline === taskDeadline)
  );
  localStorage.setItem ('tasks', JSON.stringify (tasks));
}

function toggleTask (button) {
  const li = button.parentElement.parentElement;
  const taskTextElement = li.querySelector ('.judul-task');
  const taskText = taskTextElement.textContent.trim ();
  const taskDeadline = li.querySelector ('.deadline').textContent.trim ();

  taskTextElement.classList.toggle ('completed');
  const isCompleted = taskTextElement.classList.contains ('completed');
  button.textContent = isCompleted ? '✖' : '✔';

  const completedAt = isCompleted ? new Date ().toLocaleString () : null;

  let tasks = JSON.parse (localStorage.getItem ('tasks')) || [];
  tasks = tasks.map (t => {
    if (t.text === taskText && t.deadline === taskDeadline) {
      return {...t, completed: isCompleted, completedAt: completedAt};
    }
    return t;
  });
  localStorage.setItem ('tasks', JSON.stringify (tasks));

  // Update the DOM with completion time
  const deadlineContainer = li.querySelector ('.deadline-container');
  if (isCompleted) {
    let completedTimeElement = li.querySelector ('.completed-time');
    if (!completedTimeElement) {
      completedTimeElement = document.createElement ('span');
      completedTimeElement.className = 'completed-time';
      completedTimeElement.textContent = `Selesai pada: ${completedAt}`;
      deadlineContainer.insertBefore (
        completedTimeElement,
        deadlineContainer.querySelector ('button')
      );
    } else {
      completedTimeElement.textContent = `Selesai pada: ${completedAt}`;
    }
  } else {
    const completedTimeElement = li.querySelector ('.completed-time');
    if (completedTimeElement) {
      completedTimeElement.remove ();
    }
  }
}

function getDeadlineStatus (deadline) {
  const today = new Date ();
  const dueDate = new Date (deadline);
  const timeDiff = dueDate - today;
  const oneDay = 24 * 60 * 60 * 1000;

  if (timeDiff < 0) {
    return 'overdue';
  } else if (timeDiff < oneDay * 3) {
    return 'upcoming';
  } else {
    return 'on-time';
  }
}
