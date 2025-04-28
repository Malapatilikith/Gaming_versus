
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTournaments } from '@/contexts/TournamentContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';

const TournamentList = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTournamentsByGame } = useTournaments();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Validate and correct game type
  const validGameType = (gameType === 'freefire' || gameType === 'bgmi') 
    ? gameType 
    : 'freefire';
  
  // Get filtered tournaments
  const allTournaments = getTournamentsByGame(validGameType as 'freefire' | 'bgmi');
  const upcomingTournaments = allTournaments.filter(t => t.status === 'upcoming');
  const ongoingTournaments = allTournaments.filter(t => t.status === 'ongoing');
  const completedTournaments = allTournaments.filter(t => t.status === 'completed');
  
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
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {validGameType === 'freefire' ? 'Free Fire' : 'BGMI'} Tournaments
          </h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Games
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingTournaments.length})
            </TabsTrigger>
            <TabsTrigger value="ongoing">
              Ongoing ({ongoingTournaments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTournaments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTournaments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No upcoming tournaments available.</p>
                </CardContent>
              </Card>
            ) : (
              upcomingTournaments.map(tournament => (
                <Card key={tournament.id} className="tournament-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="p-6 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">{tournament.name}</h3>
                        <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-gaming-green" />
                            <span>Prize: ₹{tournament.prizePool}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gaming-blue" />
                            <span>Slots: {tournament.totalSlots}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gaming-pink" />
                            <span>{new Date(tournament.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-yellow-400">
                            <span>Entry Fee: ₹{tournament.entryFee}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="mb-3 sm:mb-0">
                            <span className="font-medium">
                              {tournament.slots.filter(s => s.playerId).length}/{tournament.totalSlots} Slots filled
                            </span>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                              <div 
                                className={`${validGameType === 'freefire' ? 'bg-gaming-orange' : 'bg-gaming-blue'} h-2 rounded-full`} 
                                style={{ width: `${(tournament.slots.filter(s => s.playerId).length / tournament.totalSlots) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => navigate(`/tournament/${tournament.id}`)}
                            className={validGameType === 'freefire' ? 'button-primary' : 'button-secondary'}
                          >
                            <span>Join Now</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className={`hidden md:block bg-gradient-to-r ${
                        validGameType === 'freefire' 
                          ? 'from-gaming-orange/20 to-gaming-orange/10' 
                          : 'from-gaming-blue/20 to-gaming-blue/10'
                      } p-6 flex flex-col justify-center items-center`}>
                        <div className="text-center">
                          <p className="text-4xl font-bold mb-2">
                            {tournament.time}
                          </p>
                          <p className="text-sm opacity-80">Tournament Time</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="ongoing" className="space-y-4">
            {ongoingTournaments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No ongoing tournaments available.</p>
                </CardContent>
              </Card>
            ) : (
              ongoingTournaments.map(tournament => (
                <Card key={tournament.id} className="tournament-card">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{tournament.name}</h3>
                    <p className="text-gaming-green font-medium mb-4">
                      Tournament is currently live!
                    </p>
                    <Button 
                      onClick={() => navigate(`/tournament/${tournament.id}`)}
                      className={validGameType === 'freefire' ? 'button-primary' : 'button-secondary'}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedTournaments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No completed tournaments available.</p>
                </CardContent>
              </Card>
            ) : (
              completedTournaments.map(tournament => (
                <Card key={tournament.id} className="tournament-card">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{tournament.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      This tournament has ended.
                    </p>
                    <Button 
                      onClick={() => navigate(`/tournament/${tournament.id}`)}
                      variant="outline"
                    >
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TournamentList;
