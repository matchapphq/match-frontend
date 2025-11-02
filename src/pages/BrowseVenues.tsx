import { useEffect, useState } from 'react';
import { MapPin, Users, Calendar, Search } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { venueService } from '../services/venueService';
import { Database } from '../lib/database.types';

type Venue = Database['public']['Tables']['venues']['Row'];

interface BrowseVenuesProps {
  onSelectVenue: (venueId: string) => void;
}

export function BrowseVenues({ onSelectVenue }: BrowseVenuesProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    const filtered = venues.filter((venue) => {
      const query = searchQuery.toLowerCase();
      return (
        venue.name.toLowerCase().includes(query) ||
        venue.city?.toLowerCase().includes(query) ||
        venue.country?.toLowerCase().includes(query) ||
        venue.description?.toLowerCase().includes(query)
      );
    });
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await venueService.getAllVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
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
          Browse Venues
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find the perfect venue to watch your favorite matches
        </p>

        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by name, city, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {filteredVenues.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No venues found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Check back soon for venues in your area'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} hover>
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {venue.name}
                </h3>

                {venue.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {venue.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
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
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSelectVenue(venue.id)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Matches
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
