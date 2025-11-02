
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onCardClick?: (order: Order) => void;
}

const statusColors: { [key in OrderStatus]: string } = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [OrderStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [OrderStatus.PARTIALLY_APPROVED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onCardClick }) => {
  const { id, productName, submissionDate, status } = order;
  const isClickable = !!onCardClick;

  return (
    <div
      onClick={() => onCardClick?.(order)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isClickable ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
            <p className="text-sm font-bold text-primary-500 dark:text-primary-400">{id}</p>
            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                {status}
            </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white truncate" title={productName}>
          {productName}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Submitted on {new Date(submissionDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
