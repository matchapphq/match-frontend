import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { VenueOwnerDashboard } from './pages/VenueOwnerDashboard';
import { MyVenues } from './pages/MyVenues';
import { BrowseVenues } from './pages/BrowseVenues';
import { VenueDetails } from './pages/VenueDetails';
import { MyBookings } from './pages/MyBookings';
import { AddMatch } from './pages/AddMatch';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile) {
      setCurrentPage(profile.role === 'venue_owner' ? 'dashboard' : 'browse');
    } else if (!loading && !user) {
      setCurrentPage('browse');
    }
  }, [profile, user, loading]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedVenueId(null);
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setCurrentPage('venue-details');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="min-h-[calc(100vh-4rem)]">
        {currentPage === 'dashboard' && profile?.role === 'venue_owner' && (
          <VenueOwnerDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'my-venues' && profile?.role === 'venue_owner' && (
          <MyVenues />
        )}

        {currentPage === 'add-match' && profile?.role === 'venue_owner' && (
          <AddMatch onNavigate={handleNavigate} />
        )}

        {currentPage === 'browse' && (
          <BrowseVenues onSelectVenue={handleSelectVenue} />
        )}

        {currentPage === 'venue-details' && selectedVenueId && (
          <VenueDetails
            venueId={selectedVenueId}
            onBack={() => handleNavigate('browse')}
          />
        )}

        {currentPage === 'bookings' && user && (
          <MyBookings />
        )}

        {currentPage === 'reservations' && profile?.role === 'venue_owner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Reservations Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage reservations for your venues
            </p>
          </div>
        )}

        {currentPage === 'customers' && profile?.role === 'venue_owner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Customer Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your customer relationships
            </p>
          </div>
        )}

        {currentPage === 'profile' && user && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        )}

        {!currentPage && (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Match
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your premier platform for sports venue management
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
