import { useEffect, useState } from 'react';
import { MapPin, Users, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { venueService, VenueWithMatches } from '../services/venueService';
import { reservationService } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';

interface VenueDetailsProps {
  venueId: string;
  onBack: () => void;
}

export function VenueDetails({ venueId, onBack }: VenueDetailsProps) {
  const { user } = useAuth();
  const [venue, setVenue] = useState<VenueWithMatches | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    partySize: 1,
    specialRequests: '',
  });

  useEffect(() => {
    loadVenue();
  }, [venueId]);

  const loadVenue = async () => {
    try {
      setLoading(true);
      const data = await venueService.getVenueById(venueId);
      setVenue(data);
    } catch (error) {
      console.error('Error loading venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !user) return;

    try {
      await reservationService.createReservation({
        venue_match_id: selectedMatch,
        customer_id: user.id,
        customer_name: bookingForm.customerName,
        customer_email: bookingForm.customerEmail,
        customer_phone: bookingForm.customerPhone,
        party_size: bookingForm.partySize,
        special_requests: bookingForm.specialRequests,
      });

      setShowBookingModal(false);
      setSelectedMatch(null);
      alert('Booking request submitted successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const openBookingModal = (venueMatchId: string) => {
    setSelectedMatch(venueMatchId);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card className="mt-4">
          <CardBody className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Venue not found</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Venues
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            {venue.image_url && (
              <div className="h-48 overflow-hidden rounded-t-xl">
                <img
                  src={venue.image_url}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardBody>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {venue.name}
              </h1>

              {venue.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {venue.description}
                </p>
              )}

              <div className="space-y-3">
                {(venue.address || venue.city) && (
                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      {venue.address}
                      {venue.city && `, ${venue.city}`}
                      {venue.country && `, ${venue.country}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Capacity: {venue.capacity}</span>
                </div>

                {venue.phone && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium mr-2">Phone:</span>
                    <span>{venue.phone}</span>
                  </div>
                )}

                {venue.email && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium mr-2">Email:</span>
                    <span>{venue.email}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Matches
          </h2>

          {!venue.venue_matches || venue.venue_matches.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No upcoming matches scheduled
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {venue.venue_matches.map((vm) => (
                <Card key={vm.id} hover>
                  <CardBody>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="info">{vm.match.sport.name}</Badge>
                          <Badge>{vm.match.league.name}</Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            {vm.match.home_team.logo_url && (
                              <img
                                src={vm.match.home_team.logo_url}
                                alt={vm.match.home_team.name}
                                className="w-6 h-6"
                              />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {vm.match.home_team.name}
                            </span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">vs</span>
                          <div className="flex items-center gap-2">
                            {vm.match.away_team.logo_url && (
                              <img
                                src={vm.match.away_team.logo_url}
                                alt={vm.match.away_team.name}
                                className="w-6 h-6"
                              />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {vm.match.away_team.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(vm.match.match_date).toLocaleString()}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Users className="w-4 h-4 mr-2" />
                          {vm.available_seats} seats available
                        </div>
                      </div>

                      <Button onClick={() => openBookingModal(vm.id)}>
                        Book Now
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Your Spot"
      >
        <form onSubmit={handleBooking} className="space-y-4">
          <Input
            label="Your Name"
            value={bookingForm.customerName}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, customerName: e.target.value })
            }
            required
          />

          <Input
            label="Email"
            type="email"
            value={bookingForm.customerEmail}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, customerEmail: e.target.value })
            }
            required
          />

          <Input
            label="Phone"
            type="tel"
            value={bookingForm.customerPhone}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, customerPhone: e.target.value })
            }
          />

          <Input
            label="Party Size"
            type="number"
            min="1"
            value={bookingForm.partySize}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, partySize: parseInt(e.target.value) || 1 })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Special Requests
            </label>
            <textarea
              value={bookingForm.specialRequests}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, specialRequests: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Confirm Booking
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
