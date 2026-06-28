import React from 'react';

function Navbar({ tasks, theme, toggleTheme }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Task<span>Flow</span>
      </div>
      <div className="navbar-stats">
        <span>Total: <strong>{total}</strong></span>
        <span>Pending: <strong>{pending}</strong></span>
        <span>Done: <strong>{completed}</strong></span>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  );
}

export default Navbar;
