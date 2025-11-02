import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { reservationService, ReservationWithDetails } from '../services/reservationService';

export function MyBookings() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, [user]);

  const loadReservations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await reservationService.getMyReservations(user.id);
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await reservationService.cancelReservation(reservationId);
      loadReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'default';
      default:
        return 'default';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your reservations
        </p>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start exploring venues and book your first match
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} hover>
              <CardBody>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={getStatusVariant(reservation.status)}>
                        {reservation.status.toUpperCase()}
                      </Badge>
                      <Badge variant="info">
                        {reservation.venue_match?.match?.sport?.name}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {reservation.venue_match?.match?.home_team?.logo_url && (
                            <img
                              src={reservation.venue_match.match.home_team.logo_url}
                              alt={reservation.venue_match.match.home_team.name}
                              className="w-6 h-6"
                            />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reservation.venue_match?.match?.home_team?.name}
                          </span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">vs</span>
                        <div className="flex items-center gap-2">
                          {reservation.venue_match?.match?.away_team?.logo_url && (
                            <img
                              src={reservation.venue_match.match.away_team.logo_url}
                              alt={reservation.venue_match.match.away_team.name}
                              className="w-6 h-6"
                            />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reservation.venue_match?.match?.away_team?.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {reservation.venue_match?.match?.match_date &&
                          new Date(reservation.venue_match.match.match_date).toLocaleString()}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {reservation.venue_match?.venue?.name}
                        {reservation.venue_match?.venue?.city &&
                          `, ${reservation.venue_match.venue.city}`}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        Party of {reservation.party_size}
                      </div>

                      {reservation.special_requests && (
                        <div className="mt-2 p-2 rounded bg-gray-50 dark:bg-gray-700/50">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Special requests:</span>{' '}
                            {reservation.special_requests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {reservation.status === 'pending' || reservation.status === 'confirmed' ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(reservation.id)}
                    >
                      Cancel Booking
                    </Button>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
