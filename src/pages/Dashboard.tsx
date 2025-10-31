import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>🏟️ {user?.venueName}</h2>
          <p className="user-email">{user?.email}</p>
        </div>

        <ul className="nav-menu">
          <li>
            <Link
              to="/dashboard"
              className={isActive('/dashboard') ? 'active' : ''}
            >
              📊 Overview
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/screens"
              className={isActive('/dashboard/screens') ? 'active' : ''}
            >
              📺 Screens
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/broadcasts"
              className={isActive('/dashboard/broadcasts') ? 'active' : ''}
            >
              📡 Broadcasts
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/availability"
              className={isActive('/dashboard/availability') ? 'active' : ''}
            >
              🪑 Availability
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/engagement"
              className={isActive('/dashboard/engagement') ? 'active' : ''}
            >
              📈 Engagement
            </Link>
          </li>
        </ul>

        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
