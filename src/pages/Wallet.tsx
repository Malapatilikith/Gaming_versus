
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDown, ArrowUp, Clock } from 'lucide-react';

// Mock transaction history
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'deposit',
    amount: 500,
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: '2',
    type: 'tournament',
    amount: -100,
    tournamentName: 'Free Fire Weekly Cup',
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '3',
    type: 'deposit',
    amount: 200,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
  },
  {
    id: '4',
    type: 'tournament',
    amount: -50,
    tournamentName: 'BGMI Pro League',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
];

const Wallet = () => {
  const { user, updateWallet } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle deposit
  const handleDeposit = () => {
    const depositAmount = parseInt(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      updateWallet(depositAmount);
      
      toast({
        title: "Deposit successful",
        description: `₹${depositAmount} has been added to your wallet.`,
      });
      
      setAmount('');
      setIsProcessing(false);
    }, 1500);
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Money</CardTitle>
                <CardDescription>
                  Add money to your wallet to join tournaments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end space-x-4">
                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium">Amount (₹)</label>
                      <Input 
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="button-primary"
                      onClick={handleDeposit}
                      disabled={isProcessing || !amount}
                    >
                      {isProcessing ? 'Processing...' : 'Add Money'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 200, 500, 1000].map(value => (
                      <Button 
                        key={value} 
                        variant="outline" 
                        onClick={() => setAmount(String(value))}
                      >
                        ₹{value}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a demo application. In a real application, you would 
                      be able to choose from different payment methods.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">UPI</Button>
                      <Button variant="outline" className="flex-1">Card</Button>
                      <Button variant="outline" className="flex-1">Net Banking</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View your recent transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {MOCK_TRANSACTIONS.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {MOCK_TRANSACTIONS.map(transaction => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between border-b border-border pb-3"
                      >
                        <div className="flex items-center">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mr-3
                            ${transaction.type === 'deposit' 
                              ? 'bg-green-500 bg-opacity-20 text-green-500' 
                              : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                            }
                          `}>
                            {transaction.type === 'deposit' 
                              ? <ArrowDown className="h-5 w-5" /> 
                              : <ArrowUp className="h-5 w-5" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.type === 'deposit' 
                                ? 'Added money to wallet' 
                                : `Tournament entry: ${transaction.tournamentName}`
                              }
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(transaction.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`
                          font-bold
                          ${transaction.amount > 0 ? 'text-green-500' : 'text-yellow-400'}
                        `}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:row-start-1">
            <Card className="bg-gradient-gaming text-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold mb-2">Current Balance</h2>
                  <p className="text-4xl font-bold mb-4">₹{user.wallet}</p>
                  <p className="text-sm opacity-80 mb-6">
                    Use your balance to join tournaments
                  </p>
                  <Button 
                    onClick={() => document.getElementById('add-money-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-gaming-dark hover:bg-opacity-90"
                  >
                    Add Money
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Deposits</span>
                    <span className="font-medium">
                      ₹{MOCK_TRANSACTIONS
                        .filter(t => t.type === 'deposit')
                        .reduce((sum, t) => sum + t.amount, 0)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-medium">
                      ₹{Math.abs(MOCK_TRANSACTIONS
                        .filter(t => t.type === 'tournament')
                        .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tournaments Joined</span>
                    <span className="font-medium">
                      {MOCK_TRANSACTIONS.filter(t => t.type === 'tournament').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;
