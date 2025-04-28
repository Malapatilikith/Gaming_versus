
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, Globe, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form fields
    (e.target as HTMLFormElement).reset();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Have questions or feedback? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What is this regarding?" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Your message here..." 
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="button-primary w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="bg-gradient-gaming text-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:lgamingverusu@gmail.com" 
                        className="text-sm opacity-80 hover:opacity-100"
                      >
                        lgamingverusu@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a 
                        href="tel:+910000000000" 
                        className="text-sm opacity-80 hover:opacity-100"
                      >
                        +91 00 0000 0000
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href="#" 
                        className="text-sm opacity-80 hover:opacity-100"
                      >
                        www.lgamingversus.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">FAQs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How do I join a tournament?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      To join a tournament, navigate to the Games page, select your preferred game, 
                      choose a tournament, and book an available slot.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">How do I add money to my wallet?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click on the wallet icon in the top navigation, enter the amount you wish to add, 
                      and select your preferred payment method.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">How are prizes distributed?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prizes are distributed directly to the winners' wallet within 24 hours after 
                      the tournament ends.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">What happens if I miss a tournament?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you miss a tournament you've registered for, your entry fee will not be refunded. 
                      Please make sure to join on time.
                    </p>
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

export default Contact;
