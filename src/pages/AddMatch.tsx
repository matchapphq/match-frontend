import { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { sportsApi } from '../services/sportsApi';
import InMemoryDatabase from '../lib/inMemoryDatabase';

const db = InMemoryDatabase.getInstance();

interface AddMatchProps {
  onNavigate: (page: string) => void;
}

export function AddMatch({ onNavigate }: AddMatchProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    sport_id: '',
    league_id: '',
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    match_time: '',
    venue_name: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [currentMonth]);

  useEffect(() => {
    if (formData.sport_id) {
      loadLeaguesAndTeams(formData.sport_id);
    }
  }, [formData.sport_id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [sportsData] = await Promise.all([
        sportsApi.getSports()
      ]);
      setSports(sportsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaguesAndTeams = async (sportId: string) => {
    try {
      const [leaguesData, teamsData] = await Promise.all([
        sportsApi.getLeagues(sportId),
        sportsApi.getTeams(sportId)
      ]);
      setLeagues(leaguesData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading leagues and teams:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const matchesData = await sportsApi.getMatches({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });
      setMatches(matchesData);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMatchesForDate = (date: Date) => {
    return matches.filter(match => {
      const matchDate = new Date(match.match_date);
      return matchDate.getDate() === date.getDate() &&
             matchDate.getMonth() === date.getMonth() &&
             matchDate.getFullYear() === date.getFullYear();
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, match_date: dateStr }));
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sport_id || !formData.league_id || !formData.home_team_id || 
        !formData.away_team_id || !formData.match_date || !formData.match_time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const matchDateTime = new Date(`${formData.match_date}T${formData.match_time}`);
      
      await db.createMatch({
        sport_id: formData.sport_id,
        league_id: formData.league_id,
        home_team_id: formData.home_team_id,
        away_team_id: formData.away_team_id,
        match_date: matchDateTime.toISOString(),
        venue_name: formData.venue_name || null,
        status: 'scheduled'
      });

      // Reset form and reload matches
      setShowAddForm(false);
      setFormData({
        sport_id: '',
        league_id: '',
        home_team_id: '',
        away_team_id: '',
        match_date: '',
        match_time: '',
        venue_name: ''
      });
      await loadMatches();
      alert('Match added successfully!');
    } catch (error) {
      console.error('Error adding match:', error);
      alert('Failed to add match');
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Match Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and add matches to the system
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-24"></div>;
                  }
                  
                  const dayMatches = getMatchesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`
                        min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        hover:bg-gray-50 dark:hover:bg-gray-800
                      `}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayMatches.slice(0, 2).map((match) => (
                          <div
                            key={match.id}
                            className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 truncate"
                            title={`${match.home_team?.name} vs ${match.away_team?.name}`}
                          >
                            {match.home_team?.name?.substring(0, 3)} vs {match.away_team?.name?.substring(0, 3)}
                          </div>
                        ))}
                        {dayMatches.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayMatches.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Side Panel - Add Match Form or Match List */}
        <div>
          {showAddForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add New Match
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sport *
                    </label>
                    <select
                      value={formData.sport_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, sport_id: e.target.value, league_id: '', home_team_id: '', away_team_id: '' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Sport</option>
                      {sports.map(sport => (
                        <option key={sport.id} value={sport.id}>{sport.name}</option>
                      ))}
                    </select>
                  </div>

                  {formData.sport_id && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          League *
                        </label>
                        <select
                          value={formData.league_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, league_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select League</option>
                          {leagues.map(league => (
                            <option key={league.id} value={league.id}>{league.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Home Team *
                        </label>
                        <select
                          value={formData.home_team_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, home_team_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select Home Team</option>
                          {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Away Team *
                        </label>
                        <select
                          value={formData.away_team_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, away_team_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select Away Team</option>
                          {teams.filter(t => t.id !== formData.home_team_id).map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Match Date *
                    </label>
                    <input
                      type="date"
                      value={formData.match_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, match_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Match Time *
                    </label>
                    <input
                      type="time"
                      value={formData.match_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, match_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={formData.venue_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                      placeholder="e.g., Old Trafford"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Match
                  </button>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </CardHeader>
              <CardBody>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, match_date: selectedDate.toISOString().split('T')[0] }));
                    setShowAddForm(true);
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Match
                </button>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Selected Date Matches
                  </h3>
                  <div className="space-y-2">
                    {getMatchesForDate(selectedDate).length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No matches on {selectedDate.toLocaleDateString()}
                      </p>
                    ) : (
                      getMatchesForDate(selectedDate).map(match => (
                        <div key={match.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {match.sport?.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {match.league?.name}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {match.home_team?.name} vs {match.away_team?.name}
                          </p>
                          {match.venue_name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.venue_name}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
