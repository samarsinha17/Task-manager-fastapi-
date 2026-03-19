import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/${editing}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, completed: false }),
    });

    setForm({ title: "", description: "" });
    setEditing(null);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditing(task.id);
    setForm({ title: task.title, description: task.description || "" });
  };

  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleDone = async (task) => {
    await fetch(`${API}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        completed: !task.completed,
      }),
    });
    fetchTasks();
  };

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
      </header>

      <section className="card">
        <h2>{editing ? "Edit Task" : "New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
            />
          </div>

          <div className="actions">
            <button className="primary" type="submit">
              {editing ? "Update task" : "Create task"}
            </button>
            {editing && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditing(null);
                  setForm({ title: "", description: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Tasks</h2>

        {loading ? (
          <p className="no-tasks">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet.</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <div className="task-main">
                  <div className="task-text">
                    <p className="task-title">{task.title}</p>
                    {task.description && (
                      <p className="task-desc">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="task-buttons">
                  <button
                    className="checkbox"
                    onClick={() => toggleDone(task)}
                    aria-label="Toggle completed"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <button className="secondary" onClick={() => startEdit(task)}>
                    Edit
                  </button>
                  <button className="secondary" onClick={() => remove(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
