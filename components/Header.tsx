
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              OrderFlow Pro
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              Hello, <strong className="font-medium">{currentUser?.name}</strong>
            </span>
            <Button onClick={logout} size="sm" variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
