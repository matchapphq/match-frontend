import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import type { Availability } from '../types';
import '../styles/Availability.css';

export default function AvailabilityPage() {
  const { availability, updateAvailability, addAvailability, screens } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'table' as Availability['type'],
    identifier: '',
    status: 'available' as Availability['status'],
    screenId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAvailability(formData);
    setFormData({ type: 'table', identifier: '', status: 'available', screenId: '' });
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, newStatus: Availability['status']) => {
    updateAvailability(id, newStatus);
  };

  const getStatusColor = (status: Availability['status']) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'reserved': return 'status-reserved';
    }
  };

  const tables = availability.filter(a => a.type === 'table');
  const seats = availability.filter(a => a.type === 'seat');

  return (
    <div className="availability-page">
      <div className="page-header">
        <h1>Availability Management</h1>
        <button
          className="add-button"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add Seat/Table
        </button>
      </div>

      {showAddForm && (
        <div className="form-card">
          <h2>Add New Seat/Table</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Availability['type'] })}
              >
                <option value="table">Table</option>
                <option value="seat">Seat</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="identifier">Identifier</label>
              <input
                id="identifier"
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
                placeholder="e.g., T1, S1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Initial Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Availability['status'] })}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="screen">Near Screen (Optional)</label>
              <select
                id="screen"
                value={formData.screenId}
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
              >
                <option value="">None</option>
                {screens.map(screen => (
                  <option key={screen.id} value={screen.id}>
                    {screen.name} ({screen.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="availability-sections">
        <div className="availability-section">
          <h2>Tables ({tables.length})</h2>
          <div className="availability-grid">
            {tables.map((item) => (
              <div key={item.id} className="availability-card">
                <div className="availability-header">
                  <h3>🪑 {item.identifier}</h3>
                  <span className={`status-badge ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {item.screenId && (
                  <p className="screen-info">
                    Near: {screens.find(s => s.id === item.screenId)?.name}
                  </p>
                )}

                <div className="status-actions">
                  <button
                    onClick={() => handleStatusChange(item.id, 'available')}
                    disabled={item.status === 'available'}
                    className="status-btn available"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'occupied')}
                    disabled={item.status === 'occupied'}
                    className="status-btn occupied"
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'reserved')}
                    disabled={item.status === 'reserved'}
                    className="status-btn reserved"
                  >
                    Reserved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="availability-section">
          <h2>Seats ({seats.length})</h2>
          <div className="availability-grid">
            {seats.map((item) => (
              <div key={item.id} className="availability-card">
                <div className="availability-header">
                  <h3>💺 {item.identifier}</h3>
                  <span className={`status-badge ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {item.screenId && (
                  <p className="screen-info">
                    Near: {screens.find(s => s.id === item.screenId)?.name}
                  </p>
                )}

                <div className="status-actions">
                  <button
                    onClick={() => handleStatusChange(item.id, 'available')}
                    disabled={item.status === 'available'}
                    className="status-btn available"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'occupied')}
                    disabled={item.status === 'occupied'}
                    className="status-btn occupied"
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'reserved')}
                    disabled={item.status === 'reserved'}
                    className="status-btn reserved"
                  >
                    Reserved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
