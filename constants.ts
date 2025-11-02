
import { User, Order, UserRole, OrderStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.USER, points: 150 },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', role: UserRole.USER, points: 75 },
  { id: 100, name: 'Admin Manager', email: 'admin@example.com', role: UserRole.ADMIN, points: 0 },
];

export const ORDERS: Order[] = [
  {
    id: 'ORD001',
    userId: 1,
    productName: 'Custom T-Shirt',
    customerName: 'Charlie Brown',
    whatsappNumber: '15551234567',
    details: 'Size L, blue color, with a custom logo.',
    imageUrl: 'https://picsum.photos/seed/ORD001/400/300',
    status: OrderStatus.APPROVED,
    submissionDate: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: 'ORD002',
    userId: 2,
    productName: 'Engraved Mug',
    customerName: 'Diana Prince',
    whatsappNumber: '15557654321',
    details: '11oz ceramic mug with "Wonder" text.',
    imageUrl: 'https://picsum.photos/seed/ORD002/400/300',
    status: OrderStatus.REJECTED,
    reason: 'Image resolution too low for engraving.',
    submissionDate: new Date('2023-10-25T14:30:00Z'),
  },
  {
    id: 'ORD003',
    userId: 1,
    productName: 'Business Cards (x500)',
    customerName: 'Eve Adams',
    whatsappNumber: '15558889999',
    details: 'Matte finish, double-sided print.',
    imageUrl: 'https://picsum.photos/seed/ORD003/400/300',
    status: OrderStatus.PENDING,
    submissionDate: new Date('2023-10-27T09:15:00Z'),
  },
];

export const POINTS_AWARDED = {
    [OrderStatus.APPROVED]: 20,
    [OrderStatus.PARTIALLY_APPROVED]: 10,
};
