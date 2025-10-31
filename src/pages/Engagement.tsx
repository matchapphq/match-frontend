import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import type { Engagement } from '../types';
import '../styles/Engagement.css';

export default function EngagementPage() {
  const { engagement, screens } = useApp();
  const [realtimeData, setRealtimeData] = useState<Engagement[]>(engagement);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev =>
        prev.map(item => ({
          ...item,
          visitors: item.visitors + Math.floor(Math.random() * 3 - 1),
          avgWatchTime: item.avgWatchTime + Math.floor(Math.random() * 5 - 2),
          timestamp: new Date().toISOString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalVisitors = realtimeData.reduce((sum, e) => sum + e.visitors, 0);
  const avgWatchTime = Math.floor(
    realtimeData.reduce((sum, e) => sum + e.avgWatchTime, 0) / realtimeData.length
  );

  return (
    <div className="engagement-page">
      <h1>Visitor Engagement Analytics</h1>
      <p className="live-indicator">🔴 Live Data - Updates every 5 seconds</p>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Visitors</h3>
          <p className="summary-value">{totalVisitors}</p>
        </div>
        <div className="summary-card">
          <h3>Average Watch Time</h3>
          <p className="summary-value">{avgWatchTime} min</p>
        </div>
        <div className="summary-card">
          <h3>Active Screens</h3>
          <p className="summary-value">{screens.filter(s => s.status === 'active').length}</p>
        </div>
      </div>

      <div className="engagement-details">
        <h2>Screen-wise Analytics</h2>
        <div className="analytics-grid">
          {realtimeData.map((data, index) => {
            const screen = screens.find(s => s.id === data.screenId);
            return (
              <div key={index} className="analytics-card">
                <h3>{screen ? screen.name : 'Unknown Screen'}</h3>
                {screen && <p className="location">{screen.location}</p>}

                <div className="metric">
                  <span className="metric-label">Current Visitors:</span>
                  <span className="metric-value">{data.visitors}</span>
                </div>

                <div className="metric">
                  <span className="metric-label">Avg Watch Time:</span>
                  <span className="metric-value">{data.avgWatchTime} min</span>
                </div>

                {screen?.currentBroadcast && (
                  <div className="current-content">
                    <strong>Now Playing:</strong>
                    <p>{screen.currentBroadcast.matchName}</p>
                  </div>
                )}

                <div className="engagement-bar">
                  <div
                    className="engagement-fill"
                    style={{ width: `${Math.min((data.visitors / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="capacity-text">
                  Capacity: {Math.min(data.visitors, 50)}/50
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="engagement-history">
        <h2>Recent Activity</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Screen</th>
              <th>Visitors</th>
              <th>Avg Watch Time</th>
            </tr>
          </thead>
          <tbody>
            {realtimeData.map((data, index) => {
              const screen = screens.find(s => s.id === data.screenId);
              return (
                <tr key={index}>
                  <td>{new Date(data.timestamp).toLocaleTimeString()}</td>
                  <td>{screen ? screen.name : 'N/A'}</td>
                  <td>{data.visitors}</td>
                  <td>{data.avgWatchTime} min</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
