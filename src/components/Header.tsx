
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Menu, Wallet, User, LogOut, Mail, ChevronDown, Plus } from 'lucide-react';

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-bold text-xl text-primary mr-6">
          <Trophy className="h-6 w-6" />
          <span>L Gaming Versus</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate('/tournaments/freefire')}>
            Free Fire
          </Button>
          <Button variant="ghost" onClick={() => navigate('/tournaments/bgmi')}>
            BGMI
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')}>
            Contact
          </Button>
          {isAdmin && (
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              Admin
            </Button>
          )}
        </nav>
        
        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="mb-4">
              <SheetTitle>L Gaming Versus</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => {
                  navigate('/tournaments/freefire');
                  setIsMobileMenuOpen(false);
                }}
              >
                Free Fire
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => {
                  navigate('/tournaments/bgmi');
                  setIsMobileMenuOpen(false);
                }}
              >
                BGMI
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => {
                  navigate('/contact');
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact
              </Button>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  className="justify-start" 
                  onClick={() => {
                    navigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Admin
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* User Actions */}
        <div className="flex-1 flex justify-end items-center space-x-2">
          {user ? (
            <>
              {/* Wallet */}
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center mr-2" 
                onClick={() => navigate('/wallet')}
              >
                <Wallet className="h-4 w-4 mr-2" />
                <span>₹{user.wallet}</span>
                <Plus className="h-4 w-4 ml-1 text-gaming-green" />
              </Button>
              
              {/* Mobile Wallet */}
              <Button 
                variant="outline" 
                className="sm:hidden mr-2 px-2" 
                onClick={() => navigate('/wallet')}
              >
                <Wallet className="h-4 w-4" />
                <span className="ml-1">₹{user.wallet}</span>
              </Button>
              
              {/* Contact */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/contact')}
                className="hidden sm:flex"
              >
                <Mail className="h-5 w-5" />
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Avatar className="h-8 w-8 text-xs">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>Tournaments</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/wallet')}>
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/contact')}>
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Contact</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin')}>
                      <User className="h-4 w-4 mr-2" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};
