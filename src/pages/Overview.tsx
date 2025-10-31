import { useApp } from '../contexts/AppContext';
import '../styles/Overview.css';

export default function Overview() {
  const { screens, broadcasts, availability, engagement } = useApp();

  const activeScreens = screens.filter(s => s.status === 'active').length;
  const liveBroadcasts = broadcasts.filter(b => b.status === 'live').length;
  const availableSeats = availability.filter(a => a.status === 'available').length;
  const totalVisitors = engagement.reduce((sum, e) => sum + e.visitors, 0);

  return (
    <div className="overview">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📺</div>
          <div className="stat-content">
            <h3>Active Screens</h3>
            <p className="stat-value">{activeScreens} / {screens.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>Live Broadcasts</h3>
            <p className="stat-value">{liveBroadcasts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🪑</div>
          <div className="stat-content">
            <h3>Available Seats</h3>
            <p className="stat-value">{availableSeats} / {availability.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Visitors</h3>
            <p className="stat-value">{totalVisitors}</p>
          </div>
        </div>
      </div>

      <div className="quick-info">
        <div className="info-section">
          <h2>Active Screens</h2>
          <div className="screen-list">
            {screens.filter(s => s.status === 'active').map(screen => (
              <div key={screen.id} className="screen-item">
                <span className="screen-name">{screen.name}</span>
                <span className="screen-location">{screen.location}</span>
                {screen.currentBroadcast && (
                  <span className="screen-broadcast">
                    🔴 {screen.currentBroadcast.matchName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2>Live Broadcasts</h2>
          <div className="broadcast-list">
            {broadcasts.filter(b => b.status === 'live').map(broadcast => (
              <div key={broadcast.id} className="broadcast-item">
                <span className="broadcast-name">{broadcast.matchName}</span>
                <span className="broadcast-sport">{broadcast.sport}</span>
              </div>
            ))}
            {liveBroadcasts === 0 && (
              <p className="no-data">No live broadcasts at the moment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
