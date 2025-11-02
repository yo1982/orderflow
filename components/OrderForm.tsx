
import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './Input';
import Button from './Button';
import { Order } from '../types';

interface OrderFormProps {
    onOrderSubmitted: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderSubmitted }) => {
  const { currentUser, addOrder } = useAppContext();
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !productName || !customerName || !whatsappNumber) return;
    setIsLoading(true);

    let imageUrl: string | null = null;
    if(imageFile) {
        imageUrl = await fileToBase64(imageFile);
    }
    
    const newOrder: Omit<Order, 'id' | 'submissionDate' | 'status'> = {
      userId: currentUser.id,
      productName,
      customerName,
      whatsappNumber,
      details,
      imageUrl,
    };
    await addOrder(newOrder);
    setIsLoading(false);
    onOrderSubmitted();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Submit a New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input id="productName" label="Product Name" value={productName} onChange={e => setProductName(e.target.value)} required />
            <Input id="customerName" label="Final Customer's Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            <Input id="whatsappNumber" label="Final Customer's WhatsApp Number" type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} required />
            <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Details</label>
                <textarea 
                    id="details" 
                    rows={4} 
                    value={details} 
                    onChange={e => setDetails(e.target.value)} 
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach Picture</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto object-cover rounded-md" />
                        ) : (
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:ring-offset-gray-800">
                                <span>Upload a file</span>
                                <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" className="sr-only" accept="image/*" capture="environment" onChange={handleImageChange}/>
                            </label>
                            <p className="pl-1">or use camera</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <Button type="submit" size="lg" isLoading={isLoading} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Order'}
                </Button>
            </div>
        </form>
    </div>
  );
};

export default OrderForm;
