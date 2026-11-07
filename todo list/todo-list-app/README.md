# My To-Do List 🌸✨

A clean, modern, and beginner-friendly To-Do List Web Application crafted with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with a beautiful pink and purple aesthetic, responsive layout, interactive statistics, and browser Local Storage persistence.

---

## 🌟 Features

- **🌸 Beautiful Pink & Purple Theme**: Modern gradients, frosted glass cards, subtle ambient glows, and clean typography.
- **➕ Add Tasks with Validation**: Add new tasks easily. Empty tasks or whitespace-only inputs trigger a friendly shake animation and clear warning message.
- **✏️ In-Place Task Editing**: Edit any existing task with a single click. Includes keyboard shortcuts (`Enter` to save, `Escape` to cancel).
- **✅ Completion Toggle**: Custom animated checkboxes to mark tasks as completed or pending, with smooth strike-through animations.
- **🗑️ Delete Tasks**: Easily remove individual tasks with smooth slide-out exit animations.
- **🧹 Clear Completed**: Quickly wipe away all completed tasks with one click.
- **🔍 3 Filter Views**:
  - **All Tasks**: Shows every task on your list with a total badge counter.
  - **Pending Tasks**: Filters only tasks that are yet to be completed.
  - **Completed Tasks**: Displays all finished items.
- **📊 Real-Time Statistics & Progress Bar**:
  - Total tasks count
  - Pending tasks count
  - Completed tasks count
  - Visual completion percentage bar
- **💾 Local Storage Persistence**: All tasks and status changes automatically save to `localStorage`, so your to-do list remains saved after refreshing or restarting your browser.
- **💬 Contextual Empty State**: Displays friendly messages and emojis when you have no tasks or when a filtered view is empty.
- **📱 Fully Responsive**: Looks stunning and works seamlessly on mobile phones, tablets, and desktop displays.
- **🛡️ Secure & Lightweight**: Uses pure HTML entity escaping to safeguard against XSS, with zero external build tools, zero dependencies, and zero paid APIs.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure (`<header>`, `<main>`, `<section>`, `<form>`, `<ul>`, `<footer>`) |
| **CSS3** | Modern styling, CSS Custom Properties (Variables), Flexbox, Pink-Purple gradients, Glassmorphism, and Keyframe animations |
| **Vanilla JavaScript (ES6+)** | Dynamic DOM manipulation, state management, event listeners, input validation, and date formatting |
| **Browser Local Storage API** | Client-side persistent data storage (`localStorage.getItem`, `localStorage.setItem`) |

---

## 📁 Project Structure

```text
todo-list-app/
│
├── index.html     # Main HTML5 structure with semantic elements and inline SVGs
├── style.css      # CSS3 styling, animations, pink-purple theme, and responsive queries
├── script.js      # Vanilla JavaScript logic: CRUD, filtering, stats & LocalStorage
└── README.md      # Comprehensive project overview and instructions
```

---

## 🚀 How to Run the Application

You do **not** need to install Node.js, databases, or web servers to run this project. It runs entirely inside any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave, Opera, etc.).

### Method 1: Direct File Opening (Easiest)
1. Navigate to the project folder on your computer:
   ```text
   c:\Users\tharu\OneDrive\Desktop\todo list\
   ```
2. Double-click on the `index.html` file.
3. The application will immediately launch in your default web browser!

---

### Method 2: VS Code Live Server Extension (Recommended for Developers)
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and choose the `todo list` folder.
3. Install the **Live Server** extension (by Ritwick Dey) from the VS Code Extensions marketplace.
4. Right-click `index.html` and click **"Open with Live Server"**.
5. Your browser will open the app at `http://127.0.0.1:5500/index.html` with automatic reload enabled.

---

### Method 3: Built-in Python Local Server
If you prefer running a lightweight local HTTP server from the command line:

1. Open PowerShell or Terminal in the project directory.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and visit:
   ```text
   http://localhost:8000
   ```

---

### Method 4: Built-in Node.js Server
If you have Node.js installed:

```bash
npx serve .
```
Or:
```bash
npx http-server .
```

---

## 💡 How to Use the Application

1. **Adding a Task**:
   - Type your task into the text box (e.g., "Complete homework" or "Buy groceries").
   - Click the **"Add Task"** button or hit **Enter** on your keyboard.
   - If you leave the box empty, you will see a warning message and a shake effect.

2. **Marking a Task as Completed**:
   - Click the rounded checkbox next to the task.
   - The task will be crossed out, the counter will update, and the progress bar will advance.

3. **Editing a Task**:
   - Click the **Edit (pencil)** icon on any task.
   - The task switches into an inline input box. Update the text.
   - Click **Save** (or press `Enter`) to confirm, or click **Cancel** (or press `Escape`) to discard changes.

4. **Deleting a Task**:
   - Click the **Delete (trash can)** icon to remove the task.
   - A smooth sliding animation will play as the task is removed.

5. **Filtering Tasks**:
   - Click **All Tasks** to see everything.
   - Click **Pending** to view only uncompleted tasks.
   - Click **Completed** to view finished tasks.
   - Badges display the live count for each status.

6. **Clearing All Completed Tasks**:
   - When one or more tasks are marked completed, the **"Clear Completed"** button becomes active.
   - Click it to clear all finished tasks in a single click.

7. **Data Persistence**:
   - All tasks are instantly saved to browser Local Storage.
   - Refresh the page, close the browser, or turn off your computer — when you return, your tasks will still be there!

---

## 🧩 Key Concepts for Beginners

- **Local Storage (`localStorage`)**: A browser API that allows web pages to store key-value pairs persistently. Unlike session storage or JavaScript variables, data in `localStorage` survives page refreshes and browser restarts.
- **Event Delegation**: Instead of adding individual event listeners to every single task element created dynamically, a single event listener is attached to the parent `<ul>` element (`taskList.addEventListener('click', ...)`), improving performance and keeping code simple.
- **CSS Variables**: Reusable values defined in `:root` (such as `--theme-gradient` and `--pink-primary`) allowing consistent branding and instant theme customization.
- **Input Sanitization**: The `escapeHtml()` helper converts sensitive characters (`<`, `>`, `&`, `"`, `'`) into safe HTML entities to prevent script injection.

---

## 📄 License
This project is open-source and free to use for educational, personal, or commercial projects.
