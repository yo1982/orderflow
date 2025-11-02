
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Order, Notification, OrderStatus } from '../types';
import { getInitialUsers, getInitialOrders, createOrder, updateOrderInDb } from '../services/mockApiService';
import { POINTS_AWARDED } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  orders: Order[];
  notifications: Notification[];
  login: (user: User) => void;
  logout: () => void;
  addOrder: (order: Omit<Order, 'id' | 'submissionDate' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => Promise<void>;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => getInitialUsers());
  const [orders, setOrders] = useState<Order[]>(() => getInitialOrders());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = (user: User) => {
    setCurrentUser(user);
    addNotification(`Welcome back, ${user.name}!`);
  };

  const logout = () => {
    addNotification(`Goodbye, ${currentUser?.name}.`);
    setCurrentUser(null);
  };

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'submissionDate' | 'status'>): Promise<void> => {
    const newOrder = await createOrder(orderData);
    setOrders(prev => [newOrder, ...prev]);
    addNotification('Your new order has been submitted successfully!');
  };

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, reason?: string) => {
    const updatedOrder = await updateOrderInDb(orderId, status, reason);
    if (!updatedOrder) return;
    
    setOrders(prevOrders => prevOrders.map(o => (o.id === orderId ? updatedOrder : o)));

    const orderUser = users.find(u => u.id === updatedOrder.userId);
    if (!orderUser) return;

    addNotification(`Order ${orderId} has been ${status}.`);
    
    // Award points
    const pointsToAdd = POINTS_AWARDED[status as keyof typeof POINTS_AWARDED] || 0;
    if (pointsToAdd > 0) {
        setUsers(prevUsers => prevUsers.map(u => 
            u.id === orderUser.id ? { ...u, points: u.points + pointsToAdd } : u
        ));
    }
  }, [users]);


  const value = {
    currentUser,
    users,
    orders,
    notifications,
    login,
    logout,
    addOrder,
    updateOrderStatus,
    addNotification,
    clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
