
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginView from './views/LoginView';
import UserDashboard from './views/UserDashboard';
import AdminDashboard from './views/AdminDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginView />;
  }

  if (currentUser.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }
  
  return <UserDashboard />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <AppContent />
      </div>
    </AppProvider>
  );
};

export default App;
