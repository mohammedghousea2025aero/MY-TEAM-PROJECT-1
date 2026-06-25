import React from 'react';

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const deadlineStr = task.deadline
    ? new Date(task.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`task-card priority-${task.priority} ${
        task.completed ? 'completed' : ''
      }`}
    >
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>
          {deadlineStr && (
            <span className="badge-deadline">📅 {deadlineStr}</span>
          )}
          {task.completed && (
            <span className="badge" style={{ background: 'rgba(67,217,162,0.15)', color: '#43d9a2' }}>
              ✓ Done
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
