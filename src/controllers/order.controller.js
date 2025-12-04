import { createOrder } from "../services/razorpay.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

/**
 * Create a Razorpay order
 * POST /order/create
 */
export const createRazorpayOrder = catchAsync(async (req, res) => {
  const { amount, currency, notes } = req.body;

  // Validate required fields
  if (!amount || amount <= 0) {
    throw new ApiError(400, "Amount is required and must be greater than 0");
  }

  // Convert amount to paise (multiply by 100 if not already in paise)
  // Assuming amount comes in rupees, convert to paise
  const amountInPaise = Math.round(amount * 100);

  try {
    const result = await createOrder({
      amount: amountInPaise,
      currency: currency || "INR",
      notes: notes || {},
    });

    res.json(
      new ApiResponse(200, result, "Order created successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create order");
  }
});

