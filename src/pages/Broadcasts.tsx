import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import type { Broadcast } from '../types';
import '../styles/Broadcasts.css';

export default function Broadcasts() {
  const { screens, broadcasts, assignBroadcast } = useApp();
  const [selectedScreen, setSelectedScreen] = useState<string>('');
  const [selectedBroadcast, setSelectedBroadcast] = useState<string>('');

  const handleAssign = () => {
    if (!selectedScreen || !selectedBroadcast) {
      alert('Please select both a screen and a broadcast');
      return;
    }

    const broadcast = broadcasts.find(b => b.id === selectedBroadcast);
    if (broadcast) {
      assignBroadcast(selectedScreen, broadcast);
      alert('Broadcast assigned successfully!');
      setSelectedScreen('');
      setSelectedBroadcast('');
    }
  };

  const getStatusColor = (status: Broadcast['status']) => {
    switch (status) {
      case 'live': return 'status-live';
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
    }
  };

  return (
    <div className="broadcasts-page">
      <h1>Broadcast Management</h1>

      <div className="assign-section">
        <h2>Assign Broadcast to Screen</h2>
        <div className="assign-form">
          <div className="form-group">
            <label htmlFor="screen-select">Select Screen</label>
            <select
              id="screen-select"
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
            >
              <option value="">-- Choose a screen --</option>
              {screens.map(screen => (
                <option key={screen.id} value={screen.id}>
                  {screen.name} ({screen.location})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="broadcast-select">Select Broadcast</label>
            <select
              id="broadcast-select"
              value={selectedBroadcast}
              onChange={(e) => setSelectedBroadcast(e.target.value)}
            >
              <option value="">-- Choose a broadcast --</option>
              {broadcasts.map(broadcast => (
                <option key={broadcast.id} value={broadcast.id}>
                  {broadcast.matchName} ({broadcast.sport})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleAssign} className="assign-button">
            Assign Broadcast
          </button>
        </div>
      </div>

      <div className="broadcasts-section">
        <h2>Available Broadcasts</h2>
        <div className="broadcasts-grid">
          {broadcasts.map((broadcast) => (
            <div key={broadcast.id} className="broadcast-card">
              <div className="broadcast-header">
                <h3>{broadcast.matchName}</h3>
                <span className={`status-badge ${getStatusColor(broadcast.status)}`}>
                  {broadcast.status}
                </span>
              </div>

              <div className="broadcast-details">
                <p><strong>Sport:</strong> {broadcast.sport}</p>
                <p><strong>Start Time:</strong> {new Date(broadcast.startTime).toLocaleString()}</p>
                {broadcast.endTime && (
                  <p><strong>End Time:</strong> {new Date(broadcast.endTime).toLocaleString()}</p>
                )}
              </div>

              <div className="assigned-screens">
                <strong>Assigned to:</strong>
                {screens
                  .filter(s => s.currentBroadcast?.id === broadcast.id)
                  .map(screen => (
                    <span key={screen.id} className="screen-tag">
                      {screen.name}
                    </span>
                  ))}
                {screens.filter(s => s.currentBroadcast?.id === broadcast.id).length === 0 && (
                  <span className="no-assignment">Not assigned</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
