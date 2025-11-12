import { useEffect, useState } from 'react';
import { Plus, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { venueService } from '../services/venueService';
import { Database } from '../lib/database.types';

type Venue = Database['public']['Tables']['venues']['Row'];

export function MyVenues() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    capacity: 0,
  });

  useEffect(() => {
    loadVenues();
  }, [user]);

  const loadVenues = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await venueService.getMyVenues(user.id);
      setVenues(data);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (venue?: Venue) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        description: venue.description || '',
        address: venue.address || '',
        city: venue.city || '',
        country: venue.country || '',
        phone: venue.phone || '',
        email: venue.email || '',
        capacity: venue.capacity,
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        capacity: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingVenue) {
        await venueService.updateVenue(editingVenue.id, formData);
      } else {
        await venueService.createVenue({
          ...formData,
          owner_id: user.id,
        });
      }
      setShowModal(false);
      loadVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;

    try {
      await venueService.deleteVenue(id);
      loadVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mes lieux
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
            Gérez vos lieux de visionnage sportifs
            </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un lieu
        </Button>
      </div>

      {venues.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun lieu pour le moment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Commencez en créant votre premier lieu
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier lieu
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} hover>
              <CardBody>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {venue.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(venue)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {venue.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {venue.description}
                  </p>
                )}

                <div className="space-y-2">
                  {venue.address && (
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {venue.address}
                        {venue.city && `, ${venue.city}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Capacité: {venue.capacity}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span
                    className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${
                        venue.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }
                    `}
                  >
                    {venue.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVenue ? 'Edit Venue' : 'Add New Venue'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du lieu"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            label="Adresse"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ville"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />

            <Input
              label="Pays"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Capacité"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
            required
            min="0"
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingVenue ? 'Enregistrer les modifications' : 'Créer un lieu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
