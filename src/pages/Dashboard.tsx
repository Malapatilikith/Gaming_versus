
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTournaments } from '@/contexts/TournamentContext';
import { WelcomeNotification } from '@/components/WelcomeNotification';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { getTournamentsByGame } = useTournaments();
  const navigate = useNavigate();
  
  // Get tournaments by game type
  const freefireTournaments = getTournamentsByGame('freefire');
  const bgmiTournaments = getTournamentsByGame('bgmi');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeNotification username={user.username} />
      
      <main className="container px-4 py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Select Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Fire Card */}
            <div className="game-card">
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-gaming-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                      {freefireTournaments.length} Tournaments
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white text-2xl font-bold">Free Fire</h3>
                    <p className="text-white text-opacity-80">
                      Join exciting Free Fire tournaments and win amazing prizes
                    </p>
                    <Button 
                      onClick={() => navigate('/tournaments/freefire')}
                      className="button-primary"
                    >
                      Join Contest
                    </Button>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&h=500" 
                  alt="Free Fire" 
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
            
            {/* BGMI Card */}
            <div className="game-card">
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-gaming-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      {bgmiTournaments.length} Tournaments
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white text-2xl font-bold">BGMI</h3>
                    <p className="text-white text-opacity-80">
                      Compete in BGMI tournaments and showcase your skills
                    </p>
                    <Button 
                      onClick={() => navigate('/tournaments/bgmi')}
                      className="button-secondary"
                    >
                      Join Contest
                    </Button>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&h=500" 
                  alt="BGMI" 
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...freefireTournaments, ...bgmiTournaments]
              .filter(t => t.status === 'upcoming')
              .slice(0, 3)
              .map(tournament => (
                <Card key={tournament.id} className="tournament-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tournament.gameType === 'freefire' 
                          ? 'bg-gaming-orange bg-opacity-20 text-gaming-orange' 
                          : 'bg-gaming-blue bg-opacity-20 text-gaming-blue'
                      }`}>
                        {tournament.gameType === 'freefire' ? 'Free Fire' : 'BGMI'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Entry: ₹{tournament.entryFee}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tournament.name}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-gaming-green" />
                        <span>Prize: ₹{tournament.prizePool}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gaming-blue" />
                        <span>
                          {tournament.slots.filter(s => s.playerId).length}/{tournament.totalSlots} Slots filled
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gaming-pink" />
                        <span>
                          {new Date(tournament.date).toLocaleDateString()} at {tournament.time}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/tournaments/${tournament.gameType}`)}
                      className="w-full mt-3 bg-gaming-dark text-white hover:bg-opacity-90"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
        
        {isAdmin && (
          <section className="mb-8">
            <Card className="border-gaming-purple">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Admin Controls</h3>
                <p className="mb-4 text-muted-foreground">
                  Manage tournaments and track payments from the admin panel.
                </p>
                <Button 
                  onClick={() => navigate('/admin')}
                  className="button-primary"
                >
                  Go to Admin Panel
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
