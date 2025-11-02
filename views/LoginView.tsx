
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import Button from '../components/Button';

const LoginView: React.FC = () => {
  const { login, users } = useAppContext();

  const handleLogin = (role: UserRole) => {
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      login(userToLogin);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-100 to-white dark:from-primary-950 dark:to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">OrderFlow Pro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Streamline Your Order Management</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => handleLogin(UserRole.USER)} variant="primary" size="lg">
            Login as User (Alice)
          </Button>
          <Button onClick={() => handleLogin(UserRole.ADMIN)} variant="secondary" size="lg">
            Login as Admin
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Select a role to enter the application.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
