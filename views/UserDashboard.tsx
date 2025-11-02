
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import OrderForm from '../components/OrderForm';
import OrderCard from '../components/OrderCard';
import { Order } from '../types';

type Tab = 'profile' | 'newOrder' | 'history';

const UserDashboard: React.FC = () => {
  const { currentUser, orders } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('history');

  const userOrders = orders.filter(order => order.userId === currentUser?.id);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent />;
      case 'newOrder':
        return <OrderForm onOrderSubmitted={() => setActiveTab('history')} />;
      case 'history':
        return <OrderHistoryContent orders={userOrders} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your orders and view your profile.</p>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton name="Order History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                <TabButton name="New Order" isActive={activeTab === 'newOrder'} onClick={() => setActiveTab('newOrder')} />
                <TabButton name="My Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
        </div>

        <div className="mt-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface TabButtonProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ name, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`${
                isActive
                ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
        >
            {name}
        </button>
    )
}

const ProfileContent: React.FC = () => {
  const { currentUser } = useAppContext();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-3">
        <p><strong>Name:</strong> {currentUser?.name}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Points:</strong> <span className="font-bold text-primary-500 text-lg">{currentUser?.points}</span></p>
      </div>
    </div>
  );
};

const OrderHistoryContent: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
    {orders.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">You have not submitted any orders yet.</p>
    )}
  </div>
);

export default UserDashboard;
