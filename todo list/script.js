/* ==========================================================
   MY TO-DO LIST - JAVASCRIPT APPLICATION
   Technologies: Vanilla JavaScript & HTML5 Local Storage
   Description: Clean, modular, beginner-friendly task manager
   ========================================================== */

// --- 1. APPLICATION STATE & STORAGE CONFIGURATION ---
// Key used to store and retrieve our tasks from the browser's Local Storage
const STORAGE_KEY = 'my_todo_list_tasks';

// In-memory array of task objects
// Each task looks like: { id: "1731000000000", text: "Buy milk", completed: false, createdAt: "Nov 7, 6:45 PM" }
let tasks = [];

// Current active filter: 'all' | 'pending' | 'completed'
let currentFilter = 'all';

// ID of the task currently being edited (null when not editing any task)
let editingTaskId = null;


// --- 2. DOM ELEMENT REFERENCES ---
// Grabbing references to HTML elements so we can interact with them
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const inputError = document.getElementById('input-error');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const emptyIcon = document.getElementById('empty-icon');
const emptyTitle = document.getElementById('empty-title');
const emptyDesc = document.getElementById('empty-desc');

// Statistics and progress elements
const totalTasksCount = document.getElementById('total-tasks-count');
const pendingTasksCount = document.getElementById('pending-tasks-count');
const completedTasksCount = document.getElementById('completed-tasks-count');
const statsPercentage = document.getElementById('stats-percentage');
const progressBarFill = document.getElementById('progress-bar-fill');

// Filter tabs & badges
const filterTabs = document.querySelectorAll('.filter-tab');
const filterAllBadge = document.getElementById('filter-all-badge');
const filterPendingBadge = document.getElementById('filter-pending-badge');
const filterCompletedBadge = document.getElementById('filter-completed-badge');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Toast notification container
const toastElement = document.getElementById('toast');
let toastTimeoutId = null;


// --- 3. LOCAL STORAGE FUNCTIONS ---

/**
 * Loads tasks from the browser's Local Storage into our application state.
 * If no tasks exist or data is invalid, defaults to an empty array.
 */
function loadTasks() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      tasks = JSON.parse(storedData);
      // Ensure it's an array
      if (!Array.isArray(tasks)) {
        tasks = [];
      }
    } else {
      tasks = [];
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    tasks = [];
  }
}

/**
 * Saves the current tasks array to Local Storage as a JSON string.
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    showToast('⚠️ Could not save tasks to browser storage.');
  }
}


// --- 4. CORE TASK OPERATIONS ---

/**
 * Formats a timestamp into a friendly date string (e.g., "Nov 7, 6:45 PM")
 */
function formatCurrentDateTime() {
  const now = new Date();
  const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
  return now.toLocaleDateString('en-US', options);
}

/**
 * Adds a new task after validating input.
 * @param {string} rawText - Text entered by the user
 */
function addTask(rawText) {
  const trimmedText = rawText.trim();

  // Basic Input Validation: Do not allow empty or whitespace-only tasks
  if (trimmedText === '') {
    showInputError('Please enter a task before clicking Add Task!');
    return;
  }

  // Clear any existing error message
  clearInputError();

  // Create new task object
  const newTask = {
    id: Date.now().toString(), // Unique timestamp ID
    text: trimmedText,
    completed: false,
    createdAt: formatCurrentDateTime()
  };

  // Add to beginning of array so newest tasks appear at the top
  tasks.unshift(newTask);

  // Save to Local Storage and re-render the UI
  saveTasks();
  renderApp();

  // Reset input field and refocus
  taskInput.value = '';
  taskInput.focus();

  // Provide user feedback
  showToast('✨ Task added successfully!');
}

/**
 * Toggles a task's completed status (true <-> false).
 * @param {string} id - Unique identifier of the task
 */
function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderApp();

  if (task.completed) {
    showToast('🎉 Task marked as completed!');
  } else {
    showToast('↩️ Task marked as pending.');
  }
}

/**
 * Puts a task into inline edit mode.
 * @param {string} id - Unique identifier of the task to edit
 */
function enterEditMode(id) {
  editingTaskId = id;
  renderApp();

  // Focus the edit input box after rendering
  const editInputElement = document.getElementById(`edit-input-${id}`);
  if (editInputElement) {
    editInputElement.focus();
    // Position cursor at the end of the text
    const textLength = editInputElement.value.length;
    editInputElement.setSelectionRange(textLength, textLength);
  }
}

/**
 * Cancels editing mode without saving changes.
 */
function cancelEditMode() {
  editingTaskId = null;
  renderApp();
}

/**
 * Saves changes to an edited task.
 * @param {string} id - Unique identifier of the task
 * @param {string} newText - Updated task description
 */
function saveTaskEdit(id, newText) {
  const trimmedText = newText.trim();

  // Validate that the updated task is not empty
  if (trimmedText === '') {
    showToast('⚠️ Task text cannot be empty.');
    return;
  }

  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.text = trimmedText;
  editingTaskId = null; // Exit edit mode

  saveTasks();
  renderApp();
  showToast('✏️ Task updated successfully!');
}

/**
 * Deletes a task from the list and Local Storage.
 * @param {string} id - Unique identifier of the task
 */
function deleteTask(id) {
  const taskElement = document.querySelector(`[data-task-id="${id}"]`);

  // Add smooth exit animation before removing from state
  if (taskElement) {
    taskElement.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== id);
      // If we were editing this task, reset editing state
      if (editingTaskId === id) {
        editingTaskId = null;
      }
      saveTasks();
      renderApp();
      showToast('🗑️ Task deleted.');
    }, 250);
  } else {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderApp();
    showToast('🗑️ Task deleted.');
  }
}

/**
 * Removes all completed tasks at once.
 */
function clearCompletedTasks() {
  const completedCount = tasks.filter(t => t.completed).length;
  if (completedCount === 0) return;

  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderApp();
  showToast(`🧹 Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}!`);
}


// --- 5. UI RENDERING & DOM MANIPULATION ---

/**
 * Main render function that updates the entire user interface:
 * - Filtered task list
 * - Statistics & progress bar
 * - Filter count badges
 * - Empty state message
 */
function renderApp() {
  renderTaskList();
  updateStatistics();
  updateFilterBadges();
}

/**
 * Renders the visible tasks according to the active filter.
 */
function renderTaskList() {
  // Clear the current list HTML
  taskList.innerHTML = '';

  // Filter tasks based on currentFilter
  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Handle empty state visibility
  if (filteredTasks.length === 0) {
    emptyState.classList.add('visible');
    configureEmptyState();
  } else {
    emptyState.classList.remove('visible');
  }

  // Generate DOM elements for each task
  filteredTasks.forEach(task => {
    const isEditing = task.id === editingTaskId;
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`;
    taskItem.setAttribute('data-task-id', task.id);

    if (isEditing) {
      // Render Inline Edit Form
      taskItem.innerHTML = `
        <form class="task-edit-form" id="edit-form-${task.id}">
          <input 
            type="text" 
            id="edit-input-${task.id}" 
            class="task-edit-input" 
            value="${escapeHtml(task.text)}"
            maxlength="150"
            aria-label="Edit task text"
          />
          <button type="submit" class="edit-btn edit-btn-save" title="Save changes">Save</button>
          <button type="button" class="edit-btn edit-btn-cancel" id="cancel-btn-${task.id}" title="Cancel editing">Cancel</button>
        </form>
      `;

      // Attach event listeners for the inline edit form
      const editForm = taskItem.querySelector(`#edit-form-${task.id}`);
      const editInput = taskItem.querySelector(`#edit-input-${task.id}`);
      const cancelBtn = taskItem.querySelector(`#cancel-btn-${task.id}`);

      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTaskEdit(task.id, editInput.value);
      });

      cancelBtn.addEventListener('click', () => {
        cancelEditMode();
      });

      // Pressing 'Escape' cancels edit mode
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          cancelEditMode();
        }
      });
    } else {
      // Normal Task Row View
      taskItem.innerHTML = `
        <div class="task-main">
          <!-- Custom Checkbox -->
          <label class="custom-checkbox-label" title="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
            <input 
              type="checkbox" 
              class="task-checkbox-input" 
              ${task.completed ? 'checked' : ''}
              data-action="toggle"
              data-id="${task.id}"
            />
            <span class="checkbox-custom">
              <svg class="checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </label>

          <!-- Task Text and Creation Timestamp -->
          <div class="task-content">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-date">Added on ${task.createdAt}</span>
          </div>
        </div>

        <!-- Task Action Buttons: Edit and Delete -->
        <div class="task-actions">
          <button 
            type="button" 
            class="action-btn btn-edit" 
            data-action="edit" 
            data-id="${task.id}" 
            title="Edit task"
            aria-label="Edit task: ${escapeHtml(task.text)}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button 
            type="button" 
            class="action-btn btn-delete" 
            data-action="delete" 
            data-id="${task.id}" 
            title="Delete task"
            aria-label="Delete task: ${escapeHtml(task.text)}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;
    }

    taskList.appendChild(taskItem);
  });
}

/**
 * Updates task statistics, counters, and progress bar fill.
 */
function updateStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  // Update counter numbers
  totalTasksCount.textContent = total;
  pendingTasksCount.textContent = pending;
  completedTasksCount.textContent = completed;

  // Calculate percentage (0 if no tasks exist)
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  statsPercentage.textContent = `${percent}%`;
  progressBarFill.style.width = `${percent}%`;

  // Enable / disable the "Clear Completed" button
  clearCompletedBtn.disabled = completed === 0;
}

/**
 * Updates the counter badges displayed on each filter tab.
 */
function updateFilterBadges() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  filterAllBadge.textContent = total;
  filterPendingBadge.textContent = pending;
  filterCompletedBadge.textContent = completed;
}

/**
 * Customizes the empty state message based on whether there are no tasks
 * in general or no tasks matching the selected filter.
 */
function configureEmptyState() {
  if (tasks.length === 0) {
    emptyIcon.textContent = '🌸';
    emptyTitle.textContent = 'No tasks yet!';
    emptyDesc.textContent = 'Your to-do list is empty. Add a task above to plan your day!';
  } else if (currentFilter === 'pending') {
    emptyIcon.textContent = '🎉';
    emptyTitle.textContent = 'All caught up!';
    emptyDesc.textContent = 'You have no pending tasks. Great job on completing your work!';
  } else if (currentFilter === 'completed') {
    emptyIcon.textContent = '💪';
    emptyTitle.textContent = 'No completed tasks yet';
    emptyDesc.textContent = 'Complete some of your tasks above to see them checked off here!';
  }
}


// --- 6. FEEDBACK & HELPER UTILITIES ---

/**
 * Displays an input validation error message and triggers the shake animation.
 * @param {string} message - Validation error description
 */
function showInputError(message) {
  inputError.textContent = message;
  inputError.classList.add('visible');
  taskInput.classList.remove('shake');
  // Trigger DOM reflow to allow repeating animation
  void taskInput.offsetWidth;
  taskInput.classList.add('shake');
  taskInput.focus();
}

/**
 * Clears the input validation error message.
 */
function clearInputError() {
  inputError.textContent = '';
  inputError.classList.remove('visible');
  taskInput.classList.remove('shake');
}

/**
 * Displays a non-intrusive floating toast notification.
 * @param {string} message - Message text to display
 */
function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    toastElement.classList.remove('show');
  }, 2400);
}

/**
 * Sanitizes text to safely escape HTML special characters.
 * Prevents Cross-Site Scripting (XSS) when rendering user-submitted text.
 * @param {string} str - Raw input string
 * @returns {string} - Escaped string safe for HTML insertion
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// --- 7. EVENT LISTENERS ---

// Event 1: Adding a new task via Form submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

// Event 2: Clear input error as soon as user begins typing
taskInput.addEventListener('input', () => {
  if (inputError.classList.contains('visible')) {
    clearInputError();
  }
});

// Event 3: Task List Event Delegation (Handles Checkbox, Edit button, Delete button)
taskList.addEventListener('click', (e) => {
  // Find closest button or input with a data-action attribute
  const trigger = e.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  const taskId = trigger.dataset.id;

  if (action === 'toggle') {
    toggleTaskCompletion(taskId);
  } else if (action === 'edit') {
    enterEditMode(taskId);
  } else if (action === 'delete') {
    deleteTask(taskId);
  }
});

// Event 4: Filter Tabs switching (All, Pending, Completed)
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const selectedFilter = tab.dataset.filter;
    if (selectedFilter === currentFilter) return;

    currentFilter = selectedFilter;

    // Update active tab styling
    filterTabs.forEach(t => {
      const isActive = t.dataset.filter === currentFilter;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderApp();
  });
});

// Event 5: Clear Completed Tasks button
clearCompletedBtn.addEventListener('click', () => {
  clearCompletedTasks();
});


// --- 8. INITIALIZATION ON PAGE LOAD ---
// When the DOM is fully loaded, load stored data and render the app
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderApp();
});
