
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import AdminOrderView from '../components/AdminOrderView';
import { Order, OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const { orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter(order => order.status === filter);
  }, [orders, filter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage all user orders.</p>
        </div>
        
        <div className="mb-6 flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(['ALL', ...Object.values(OrderStatus)] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                filter === status 
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} onCardClick={() => setSelectedOrder(order)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No orders match the current filter.</p>
          </div>
        )}
      </main>
      
      {selectedOrder && (
        <AdminOrderView 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
