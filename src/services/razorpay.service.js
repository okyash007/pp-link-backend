import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of Razorpay instance
let razorpayInstance = null;

/**
 * Get or initialize Razorpay instance
 * @returns {Razorpay} Razorpay instance
 * @throws {Error} If Razorpay credentials are not configured
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

/**
 * Create a Razorpay Order
 * @param {Object} orderData - Order creation data
 * @param {Number} orderData.amount - Amount in paise (smallest currency unit)
 * @param {String} orderData.currency - Currency code (e.g., 'INR')
 * @param {Object} orderData.notes - Additional notes/metadata
 * @returns {Promise<Object>} Created order details
 */
export const createOrder = async (orderData) => {
  try {
    const { amount, currency = "INR", notes = {} } = orderData;

    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency,
      notes: notes,
    });

    return {
      success: true,
      order_id: order.id,
      order: order,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error(
      error?.error?.description ||
        error?.message ||
        "Failed to create Razorpay order"
    );
  }
};

export default getRazorpayInstance;

