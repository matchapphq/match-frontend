import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Users, MapPin } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { venueService } from '../services/venueService';
import { reservationService, ReservationWithDetails } from '../services/reservationService';

interface VenueOwnerDashboardProps {
  onNavigate: (page: string) => void;
}

export function VenueOwnerDashboard({ onNavigate }: VenueOwnerDashboardProps) {
  const { user } = useAuth();
  const [venuesCount, setVenuesCount] = useState(0);
  const [upcomingMatches, setUpcomingMatches] = useState(0);
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const venues = await venueService.getMyVenues(user.id);
      setVenuesCount(venues.length);

      if (venues.length > 0) {
        const allReservations = await Promise.all(
          venues.map(v => reservationService.getVenueReservations(v.id))
        );
        const flatReservations = allReservations.flat();
        setReservations(flatReservations.slice(0, 5));

        const venueDetails = await Promise.all(
          venues.map(v => venueService.getVenueById(v.id))
        );
        const matchCount = venueDetails.reduce(
          (acc, v) => acc + (v?.venue_matches?.length || 0),
          0
        );
        setUpcomingMatches(matchCount);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'My Venues', value: venuesCount, icon: MapPin, color: 'blue' },
    { label: 'Upcoming Matches', value: upcomingMatches, icon: Calendar, color: 'green' },
    { label: 'Total Reservations', value: reservations.length, icon: Users, color: 'purple' },
    { label: 'Pending Approval', value: reservations.filter(r => r.status === 'pending').length, icon: TrendingUp, color: 'yellow' },
  ];

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
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your venues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Reservations
            </h2>
          </CardHeader>
          <CardBody>
            {reservations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No reservations yet
              </p>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reservation.customer_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reservation.venue_match?.match?.home_team?.name} vs{' '}
                        {reservation.venue_match?.match?.away_team?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Party of {reservation.party_size} • {reservation.venue_match?.venue?.name}
                      </p>
                    </div>
                    <span
                      className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${
                          reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : reservation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }
                      `}
                    >
                      {reservation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('add-match')}
                className="w-full text-left p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Add New Match
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select matches to broadcast at your venue
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate('reservations')}
                className="w-full text-left p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Manage Reservations
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review and approve pending bookings
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate('analytics')}
                className="w-full text-left p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      View Analytics
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      See performance metrics and insights
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
