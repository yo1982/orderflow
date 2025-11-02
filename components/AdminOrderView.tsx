
import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateWhatsAppMessage } from '../services/geminiService';
import { Order, OrderStatus } from '../types';
import Button from './Button';

interface AdminOrderViewProps {
  order: Order;
  onClose: () => void;
}

type ViewState = 'details' | 'reason' | 'whatsapp';

const AdminOrderView: React.FC<AdminOrderViewProps> = ({ order, onClose }) => {
  const { users, updateOrderStatus } = useAppContext();
  const [viewState, setViewState] = useState<ViewState>('details');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');

  const orderUser = users.find(u => u.id === order.userId);

  const handleActionClick = (newAction: OrderStatus) => {
    setAction(newAction);
    if (newAction === OrderStatus.REJECTED || newAction === OrderStatus.PARTIALLY_APPROVED) {
      setViewState('reason');
    } else if (newAction === OrderStatus.APPROVED) {
      handleGenerateMessage();
    }
  };

  const handleGenerateMessage = useCallback(async () => {
    setIsLoading(true);
    setViewState('whatsapp');
    const message = await generateWhatsAppMessage(order);
    setWhatsAppMessage(message);
    setIsLoading(false);
  }, [order]);

  const handleConfirmAction = async () => {
    if (!action) return;
    setIsLoading(true);
    await updateOrderStatus(order.id, action, reason);
    setIsLoading(false);
    onClose();
  };

  const sendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsAppMessage);
    window.open(`https://wa.me/${order.whatsappNumber}?text=${encodedMessage}`, '_blank');
    handleConfirmAction();
  };

  const renderContent = () => {
    switch (viewState) {
        case 'reason':
            return <ReasonView setReason={setReason} reason={reason} action={action} onConfirm={handleConfirmAction} onBack={() => setViewState('details')} isLoading={isLoading} />
        case 'whatsapp':
            return <WhatsAppView message={whatsAppMessage} setMessage={setWhatsAppMessage} onConfirm={sendWhatsApp} onBack={() => setViewState('details')} isLoading={isLoading} order={order}/>
        default:
            return <DetailsView order={order} orderUser={orderUser} onAction={handleActionClick} />
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Order Details: {order.id}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
            </div>
            {renderContent()}
        </div>
    </div>
  );
};

const DetailsView = ({ order, orderUser, onAction }: { order: Order; orderUser: any; onAction: (action: OrderStatus) => void }) => (
    <>
        <div className="p-6 space-y-4">
            {order.imageUrl && <img src={order.imageUrl} alt="Order attachment" className="rounded-lg w-full object-cover max-h-64" />}
            <p><strong>Product:</strong> {order.productName}</p>
            <p><strong>Submitted by:</strong> {orderUser?.name || 'Unknown User'}</p>
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Customer WhatsApp:</strong> {order.whatsappNumber}</p>
            <p><strong>Details:</strong> {order.details || 'N/A'}</p>
            <p><strong>Status:</strong> <span className="font-bold">{order.status}</span></p>
            {order.status === OrderStatus.REJECTED && <p><strong>Reason:</strong> {order.reason}</p>}
        </div>
        {order.status === OrderStatus.PENDING && (
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <Button onClick={() => onAction(OrderStatus.REJECTED)} variant="danger">Reject</Button>
                <Button onClick={() => onAction(OrderStatus.PARTIALLY_APPROVED)} variant="secondary">Partially Approve</Button>
                <Button onClick={() => onAction(OrderStatus.APPROVED)} variant="primary">Approve</Button>
            </div>
        )}
    </>
);

const ReasonView = ({ setReason, reason, action, onConfirm, onBack, isLoading }: any) => (
    <div className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Reason for {action}</h3>
        <textarea 
            rows={4} 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder={`Provide a reason for ${action === OrderStatus.REJECTED ? 'rejection' : 'partial approval'}`}
        />
        <div className="flex justify-end space-x-3">
            <Button onClick={onBack} variant="secondary">Back</Button>
            <Button onClick={onConfirm} isLoading={isLoading} disabled={!reason.trim()}>Confirm</Button>
        </div>
    </div>
);

const WhatsAppView = ({ message, setMessage, onConfirm, onBack, isLoading, order }: any) => (
    <div className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Generated WhatsApp Message</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Review and edit the AI-generated message for {order.customerName}.</p>
        {isLoading ? (
            <div className="text-center p-8">
                <p>Generating message...</p>
            </div>
        ) : (
            <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
        )}
        <div className="flex justify-end space-x-3">
            <Button onClick={onBack} variant="secondary" disabled={isLoading}>Back</Button>
            <Button onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>Approve & Send</Button>
        </div>
    </div>
);


export default AdminOrderView;
