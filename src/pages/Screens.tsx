import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import type { Screen } from '../types';
import '../styles/Screens.css';

export default function Screens() {
  const { screens, addScreen, updateScreen, deleteScreen } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'active' as Screen['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScreen) {
      updateScreen(editingScreen.id, formData);
      setEditingScreen(null);
    } else {
      addScreen(formData);
    }
    setFormData({ name: '', location: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleEdit = (screen: Screen) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name,
      location: screen.location,
      status: screen.status,
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingScreen(null);
    setFormData({ name: '', location: '', status: 'active' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this screen?')) {
      deleteScreen(id);
    }
  };

  const getStatusColor = (status: Screen['status']) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'maintenance': return 'status-maintenance';
    }
  };

  return (
    <div className="screens-page">
      <div className="page-header">
        <h1>Screen Management</h1>
        <button
          className="add-button"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add Screen
        </button>
      </div>

      {showAddForm && (
        <div className="form-card">
          <h2>{editingScreen ? 'Edit Screen' : 'Add New Screen'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Screen Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Main Screen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Bar Area"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Screen['status'] })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingScreen ? 'Update' : 'Add'} Screen
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="screens-grid">
        {screens.map((screen) => (
          <div key={screen.id} className="screen-card">
            <div className="screen-header">
              <h3>{screen.name}</h3>
              <span className={`status-badge ${getStatusColor(screen.status)}`}>
                {screen.status}
              </span>
            </div>
            
            <div className="screen-details">
              <p><strong>Location:</strong> {screen.location}</p>
              {screen.currentBroadcast && (
                <div className="current-broadcast">
                  <strong>Currently Playing:</strong>
                  <p>🔴 {screen.currentBroadcast.matchName}</p>
                  <p className="sport-tag">{screen.currentBroadcast.sport}</p>
                </div>
              )}
            </div>

            <div className="screen-actions">
              <button onClick={() => handleEdit(screen)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(screen.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
