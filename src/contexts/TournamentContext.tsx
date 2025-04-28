
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

export interface Slot {
  id: string;
  number: number;
  playerId: string | null;
  playerName: string | null;
  gameId: string | null;
}

export interface Tournament {
  id: string;
  name: string;
  gameType: 'freefire' | 'bgmi';
  prizePool: number;
  entryFee: number;
  totalSlots: number;
  slots: Slot[];
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface TournamentContextType {
  tournaments: Tournament[];
  addTournament: (tournament: Omit<Tournament, 'id' | 'slots'>) => void;
  joinTournament: (tournamentId: string, slotNumber: number, playerName: string, gameId: string) => Promise<boolean>;
  getTournamentsByGame: (gameType: 'freefire' | 'bgmi') => Tournament[];
  getAvailableSlots: (tournamentId: string) => Slot[];
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};

// Mock initial tournaments
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Free Fire Weekly Cup',
    gameType: 'freefire',
    prizePool: 5000,
    entryFee: 50,
    totalSlots: 12,
    slots: Array.from({ length: 12 }, (_, i) => ({
      id: `1-${i+1}`,
      number: i+1,
      playerId: null,
      playerName: null,
      gameId: null
    })),
    date: '2025-04-20',
    time: '18:00',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'BGMI Pro League',
    gameType: 'bgmi',
    prizePool: 10000,
    entryFee: 100,
    totalSlots: 16,
    slots: Array.from({ length: 16 }, (_, i) => ({
      id: `2-${i+1}`,
      number: i+1,
      playerId: null,
      playerName: null,
      gameId: null
    })),
    date: '2025-04-22',
    time: '20:00',
    status: 'upcoming'
  }
];

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { toast } = useToast();
  const { user, updateWallet } = useAuth();

  // Load tournaments from localStorage or use initial ones
  useEffect(() => {
    const storedTournaments = localStorage.getItem('tournaments');
    if (storedTournaments) {
      try {
        setTournaments(JSON.parse(storedTournaments));
      } catch (error) {
        console.error('Failed to parse stored tournaments:', error);
        setTournaments(INITIAL_TOURNAMENTS);
      }
    } else {
      setTournaments(INITIAL_TOURNAMENTS);
    }
  }, []);

  // Save tournaments to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  const addTournament = (tournamentData: Omit<Tournament, 'id' | 'slots'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: String(Date.now()),
      slots: Array.from({ length: tournamentData.totalSlots }, (_, i) => ({
        id: `${Date.now()}-${i+1}`,
        number: i+1,
        playerId: null,
        playerName: null,
        gameId: null
      }))
    };
    
    setTournaments(prev => [...prev, newTournament]);
    toast({
      title: "Tournament added",
      description: `${newTournament.name} has been successfully created.`,
    });
  };

  const joinTournament = async (tournamentId: string, slotNumber: number, playerName: string, gameId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join tournaments.",
        variant: "destructive"
      });
      return false;
    }
    
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    if (tournamentIndex === -1) {
      toast({
        title: "Tournament not found",
        description: "The tournament you're trying to join doesn't exist.",
        variant: "destructive"
      });
      return false;
    }
    
    const tournament = tournaments[tournamentIndex];
    const slotIndex = tournament.slots.findIndex(s => s.number === slotNumber);
    
    if (slotIndex === -1) {
      toast({
        title: "Invalid slot",
        description: "The slot you selected doesn't exist.",
        variant: "destructive"
      });
      return false;
    }
    
    if (tournament.slots[slotIndex].playerId) {
      toast({
        title: "Slot already taken",
        description: "This slot has already been booked by another player.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if user has enough balance
    if (user.wallet < tournament.entryFee) {
      toast({
        title: "Insufficient balance",
        description: `You need ₹${tournament.entryFee} to join this tournament. Please add money to your wallet.`,
        variant: "destructive"
      });
      return false;
    }
    
    // Check if user is already registered in this tournament
    const alreadyRegistered = tournament.slots.some(slot => slot.playerId === user.id);
    if (alreadyRegistered) {
      toast({
        title: "Already registered",
        description: "You are already registered in this tournament.",
        variant: "destructive"
      });
      return false;
    }
    
    // Update the tournament by marking the slot as taken
    const updatedTournaments = [...tournaments];
    updatedTournaments[tournamentIndex].slots[slotIndex] = {
      ...updatedTournaments[tournamentIndex].slots[slotIndex],
      playerId: user.id,
      playerName: playerName,
      gameId: gameId
    };
    
    setTournaments(updatedTournaments);
    
    // Deduct the entry fee from the wallet
    updateWallet(-tournament.entryFee);
    
    toast({
      title: "Successfully joined",
      description: `You have successfully joined ${tournament.name} in slot #${slotNumber}.`,
    });
    
    return true;
  };

  const getTournamentsByGame = (gameType: 'freefire' | 'bgmi') => {
    return tournaments.filter(t => t.gameType === gameType);
  };

  const getAvailableSlots = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return [];
    return tournament.slots.filter(slot => !slot.playerId);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        addTournament,
        joinTournament,
        getTournamentsByGame,
        getAvailableSlots
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};
