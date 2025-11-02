
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  points: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  PARTIALLY_APPROVED = 'Partially Approved',
  REJECTED = 'Rejected',
}

export interface Order {
  id: string;
  userId: number;
  productName: string;
  customerName: string;
  whatsappNumber: string;
  details: string;
  imageUrl: string | null;
  status: OrderStatus;
  reason?: string;
  submissionDate: Date;
}

export interface Notification {
    id: number;
    message: string;
    read: boolean;
}
