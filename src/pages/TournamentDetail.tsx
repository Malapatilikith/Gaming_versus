
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTournaments } from '@/contexts/TournamentContext';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trophy, Calendar, Users, Clock, ChevronLeft, CreditCard } from 'lucide-react';

const TournamentDetail = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tournaments, joinTournament } = useTournaments();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
  // Find the tournament
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
          <p className="mb-4">The tournament you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const { gameType, name, prizePool, entryFee, totalSlots, slots, date, time, status } = tournament;
  
  // Check if user is registered
  const userSlot = user ? slots.find(slot => slot.playerId === user.id) : null;
  
  // Handle slot selection
  const handleSlotSelect = (slotNumber: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join tournaments.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Open dialog with selected slot
    setSelectedSlot(slotNumber);
    setIsDialogOpen(true);
  };
  
  // Handle join confirmation
  const handleJoinConfirm = async () => {
    if (!selectedSlot || !playerName || !gameId) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsJoining(true);
    
    try {
      const success = await joinTournament(tournament.id, selectedSlot, playerName, gameId);
      
      if (success) {
        setIsDialogOpen(false);
        setSelectedSlot(null);
        setPlayerName('');
        setGameId('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <Button 
          onClick={() => navigate(`/tournaments/${gameType}`)} 
          variant="ghost" 
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Tournaments
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{name}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center bg-muted px-3 py-2 rounded-lg">
                    <Trophy className="h-5 w-5 mr-2 text-gaming-green" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                      <p className="font-bold">₹{prizePool}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-muted px-3 py-2 rounded-lg">
                    <CreditCard className="h-5 w-5 mr-2 text-yellow-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Entry Fee</p>
                      <p className="font-bold">₹{entryFee}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-muted px-3 py-2 rounded-lg">
                    <Calendar className="h-5 w-5 mr-2 text-gaming-blue" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-bold">{new Date(date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-muted px-3 py-2 rounded-lg">
                    <Clock className="h-5 w-5 mr-2 text-gaming-pink" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-bold">{time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-muted px-3 py-2 rounded-lg">
                    <Users className="h-5 w-5 mr-2 text-gaming-purple" />
                    <div>
                      <p className="text-xs text-muted-foreground">Slots Filled</p>
                      <p className="font-bold">{slots.filter(s => s.playerId).length}/{totalSlots}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Tournament Details</h2>
                  <p className="text-muted-foreground mb-3">
                    Join this exciting {gameType === 'freefire' ? 'Free Fire' : 'BGMI'} tournament and compete for the prize pool of ₹{prizePool}. 
                  </p>
                  <p className="text-muted-foreground mb-3">
                    Make sure to join the tournament on time. The tournament starts at {time} on {new Date(date).toLocaleDateString()}.
                  </p>
                  {gameType === 'freefire' ? (
                    <p className="text-muted-foreground">
                      This is a CS (Clash Squad) ranked tournament. Players will compete in teams and the top performers will win prizes.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      This is a classic tournament. Players will compete in teams and the top performers will win prizes.
                    </p>
                  )}
                </div>
                
                {userSlot ? (
                  <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-400 mb-2">
                      You're Registered!
                    </h3>
                    <p className="mb-2">
                      You've successfully registered for this tournament in slot #{userSlot.number}.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Player Name:</span> {userSlot.playerName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Game ID:</span> {userSlot.gameId}
                      </div>
                    </div>
                  </div>
                ) : status === 'upcoming' ? (
                  <div className="bg-gaming-blue bg-opacity-20 border border-gaming-blue rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gaming-blue mb-2">
                      Join This Tournament
                    </h3>
                    <p className="mb-3">
                      Select a slot from the slots section to join this tournament.
                    </p>
                    {user && user.wallet < entryFee ? (
                      <div className="text-sm text-yellow-400 mb-2">
                        <p>You don't have enough balance to join this tournament. Please add money to your wallet.</p>
                      </div>
                    ) : null}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => {
                          if (user && user.wallet < entryFee) {
                            navigate('/wallet');
                          } else {
                            document.getElementById('slots-section')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={gameType === 'freefire' ? 'button-primary' : 'button-secondary'}
                      >
                        {user && user.wallet < entryFee ? 'Add Money' : 'Select Slot'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gaming-dark bg-opacity-20 border border-gaming-dark rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {status === 'ongoing' ? 'Tournament is Live' : 'Tournament has Ended'}
                    </h3>
                    <p>
                      {status === 'ongoing' 
                        ? 'This tournament is currently in progress. Registration is closed.' 
                        : 'This tournament has ended. Check back for results.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:row-start-1">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    status === 'upcoming' ? 'bg-green-500' : 
                    status === 'ongoing' ? 'bg-gaming-orange' :
                    'bg-gaming-red'
                  }`}></span>
                  <span>
                    {status === 'upcoming' ? 'Upcoming' : 
                    status === 'ongoing' ? 'Live Now' :
                    'Completed'}
                  </span>
                </h2>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Tournament Type</p>
                  <p className="font-medium">{gameType === 'freefire' ? 'Free Fire' : 'BGMI'}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Match Format</p>
                  <p className="font-medium">
                    {gameType === 'freefire' ? 'CS Ranked' : 'Classic'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Registration Ends</p>
                  <p className="font-medium">
                    {new Date(date).toLocaleDateString()} at {time}
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className={`${gameType === 'freefire' ? 'bg-gaming-orange' : 'bg-gaming-blue'} h-2 rounded-full`} 
                      style={{ width: `${(slots.filter(s => s.playerId).length / totalSlots) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {slots.filter(s => s.playerId).length}/{totalSlots} Slots filled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div id="slots-section" className="mt-8">
          <h2 className="text-xl font-bold mb-4">Tournament Slots</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {slots.map((slot) => {
              const isUserSlot = user && slot.playerId === user.id;
              const isAvailable = !slot.playerId;
              
              return (
                <div 
                  key={slot.id} 
                  className={`
                    ${isUserSlot 
                      ? 'bg-green-900 bg-opacity-20 border-green-500' 
                      : isAvailable 
                        ? 'bg-muted border-muted-foreground hover:border-primary cursor-pointer'
                        : 'bg-gray-800 border-gray-700'
                    }
                    border rounded-lg p-3 text-center transition-colors
                  `}
                  onClick={() => isAvailable && status === 'upcoming' ? handleSlotSelect(slot.number) : null}
                >
                  <p className="font-bold text-lg mb-1">Slot {slot.number}</p>
                  {isUserSlot ? (
                    <span className="text-xs bg-green-500 text-white rounded-full px-2 py-1">Your Slot</span>
                  ) : isAvailable ? (
                    <span className="text-xs text-muted-foreground">Available</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Taken</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Tournament</DialogTitle>
            <DialogDescription>
              Enter your details to join this tournament.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slot</label>
              <Input value={selectedSlot ? `Slot #${selectedSlot}` : ''} disabled />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">In-Game Name</label>
              <Input 
                placeholder="Enter your in-game name" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Game ID</label>
              <Input 
                placeholder="Enter your game ID" 
                value={gameId} 
                onChange={(e) => setGameId(e.target.value)} 
              />
            </div>
            
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm mb-2">Tournament Details:</p>
              <ul className="text-sm space-y-1">
                <li>Entry Fee: ₹{entryFee}</li>
                <li>Date: {new Date(date).toLocaleDateString()}</li>
                <li>Time: {time}</li>
              </ul>
            </div>
            
            {user && user.wallet < entryFee && (
              <div className="text-sm text-yellow-400">
                <p>You don't have enough balance to join this tournament. Please add money to your wallet.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className={gameType === 'freefire' ? 'button-primary' : 'button-secondary'}
              onClick={handleJoinConfirm}
              disabled={isJoining || !playerName || !gameId || (user && user.wallet < entryFee)}
            >
              {isJoining ? 'Joining...' : 'Confirm & Pay ₹' + entryFee}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentDetail;
