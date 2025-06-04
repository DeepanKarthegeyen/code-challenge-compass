
import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Code2, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">CodeChallenge Pro</h1>
        </div>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
