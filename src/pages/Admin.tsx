import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useTournaments } from 'contexts/TournamentContext';
import { useToast } from 'components/ui/use-toast';
import { Header } from 'components/Header';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trophy, Users, Calendar, Clock } from 'lucide-react';

// Form schema for tournament creation
const tournamentSchema = z.object({
  name: z.string().min(3, { message: "Tournament name must be at least 3 characters" }),
  gameType: z.enum(["freefire", "bgmi"], { required_error: "Please select a game type" }),
  prizePool: z.coerce.number().positive({ message: "Prize pool must be a positive number" }),
  entryFee: z.coerce.number().nonnegative({ message: "Entry fee must be zero or a positive number" }),
  totalSlots: z.coerce.number().int().min(2, { message: "Total slots must be at least 2" }).max(100, { message: "Total slots cannot exceed 100" }),
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
});

const Admin = () => {
  const [activeTab, setActiveTab] = useState('addTournament');
  const { user, isAdmin } = useAuth();
  const { tournaments, addTournament } = useTournaments();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create form
  const form = useForm<z.infer<typeof tournamentSchema>>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      gameType: "freefire",
      prizePool: 1000,
      entryFee: 50,
      totalSlots: 12,
      date: new Date().toISOString().slice(0, 10),
      time: "18:00",
    },
  });
  
  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate, toast]);
  
  // Handle tournament creation
  const onSubmit = (values: z.infer<typeof tournamentSchema>) => {
    // Make sure all required fields are provided when calling addTournament
    addTournament({
      name: values.name,
      gameType: values.gameType,
      prizePool: values.prizePool,
      entryFee: values.entryFee,
      totalSlots: values.totalSlots,
      date: values.date,
      time: values.time,
      status: 'upcoming'
    });
    
    // Reset form
    form.reset();
    
    toast({
      title: "Tournament created",
      description: `${values.name} has been successfully created.`,
    });
  };
  
  if (!user || !isAdmin) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="addTournament">Add Tournament</TabsTrigger>
            <TabsTrigger value="manageTournaments">Manage Tournaments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="addTournament">
            <Card className="border-gaming-purple">
              <CardHeader>
                <CardTitle>Create Tournament</CardTitle>
                <CardDescription>
                  Fill in the details to create a new tournament.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter tournament name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gameType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select game type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="freefire">Free Fire</SelectItem>
                                <SelectItem value="bgmi">BGMI</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="prizePool"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prize Pool (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Total prize money for the tournament
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="entryFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Fee (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Fee to join the tournament (can be 0 for free tournaments)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalSlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Slots</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum number of players who can join
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="button-primary">
                      Create Tournament
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manageTournaments">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Management</CardTitle>
                <CardDescription>
                  View and manage all tournaments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Free Fire Tournaments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {tournaments
                            .filter(t => t.gameType === 'freefire')
                            .map(tournament => (
                              <div 
                                key={tournament.id} 
                                className="p-3 border border-muted-foreground rounded-lg"
                              >
                                <h3 className="font-medium">{tournament.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Trophy className="h-4 w-4 mr-1 text-gaming-green" />
                                    <span>₹{tournament.prizePool}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-gaming-blue" />
                                    <span>{tournament.slots.filter(s => s.playerId).length}/{tournament.totalSlots}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{tournament.time}</span>
                                  </div>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          
                          {tournaments.filter(t => t.gameType === 'freefire').length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                              No Free Fire tournaments available
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">BGMI Tournaments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {tournaments
                            .filter(t => t.gameType === 'bgmi')
                            .map(tournament => (
                              <div 
                                key={tournament.id} 
                                className="p-3 border border-muted-foreground rounded-lg"
                              >
                                <h3 className="font-medium">{tournament.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Trophy className="h-4 w-4 mr-1 text-gaming-green" />
                                    <span>₹{tournament.prizePool}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-gaming-blue" />
                                    <span>{tournament.slots.filter(s => s.playerId).length}/{tournament.totalSlots}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{tournament.time}</span>
                                  </div>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          
                          {tournaments.filter(t => t.gameType === 'bgmi').length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                              No BGMI tournaments available
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
