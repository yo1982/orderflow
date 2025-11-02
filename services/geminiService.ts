
import { GoogleGenAI } from "@google/genai";
import { Order } from "../types";

// This check is to prevent errors in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : undefined;

if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateWhatsAppMessage = async (order: Order): Promise<string> => {
    if (!apiKey) {
        return `Dear ${order.customerName},\n\nYour order #${order.id} for "${order.productName}" has been approved and is now being processed. We will notify you once it is ready for shipment.\n\nThank you for your business!`;
    }

    const prompt = `
        Generate a friendly and professional WhatsApp message for a customer.
        The message should be concise and clear.

        Customer Name: ${order.customerName}
        Order ID: ${order.id}
        Product Name: ${order.productName}

        The message should:
        1. Greet the customer by name.
        2. Inform them that their order has been approved and is being processed.
        3. Mention the product name and order ID.
        4. End with a polite closing.
        
        Do not include placeholders.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating WhatsApp message:", error);
        // Fallback message in case of API error
        return `Dear ${order.customerName},\n\nYour order #${order.id} for "${order.productName}" has been approved and is now being processed. We will notify you once it is ready for shipment.\n\nThank you for your business!`;
    }
};
