import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  description: '',
  deadline: '',
  priority: 'Medium',
};

function TaskForm({ onSubmit, editTask, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  // If editTask is passed in, fill the form
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        deadline: editTask.deadline
          ? editTask.deadline.substring(0, 10)
          : '',
        priority: editTask.priority || 'Medium',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required!');
    onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <div className="form-card">
      <h2>{editTask ? '✏️ Edit Task' : '➕ New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button type="submit" className="btn-submit">
            {editTask ? 'Update Task' : 'Add Task'}
          </button>
          {editTask && (
            <button
              type="button"
              className="btn-submit"
              style={{ background: '#444' }}
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
