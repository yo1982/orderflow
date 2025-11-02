
import { USERS, ORDERS } from '../constants';
import { User, Order, OrderStatus } from '../types';

let mockUsers: User[] = [...USERS];
let mockOrders: Order[] = [...ORDERS];

export const getInitialUsers = (): User[] => {
  return mockUsers;
};

export const getInitialOrders = (): Order[] => {
  return mockOrders.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
};

export const createOrder = (orderData: Omit<Order, 'id' | 'submissionDate' | 'status'>): Promise<Order> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newOrder: Order = {
        ...orderData,
        id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
        submissionDate: new Date(),
        status: OrderStatus.PENDING,
      };
      mockOrders = [newOrder, ...mockOrders];
      resolve(newOrder);
    }, 500);
  });
};

export const updateOrderInDb = (orderId: string, status: OrderStatus, reason?: string): Promise<Order | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let updatedOrder: Order | null = null;
            mockOrders = mockOrders.map(order => {
                if (order.id === orderId) {
                    updatedOrder = { ...order, status, reason: reason || order.reason };
                    return updatedOrder;
                }
                return order;
            });
            resolve(updatedOrder);
        }, 500);
    });
};
