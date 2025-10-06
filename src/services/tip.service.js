import { pool } from "../utils/postgress.js";
import ApiError from "../utils/error.api.js";
import { z } from "zod";

// Zod schema for tip validation
const createTipSchema = z.object({
  visitor_id: z.string().min(1, "Visitor ID is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().length(3, "Currency must be a 3-character code"),
  message: z.string().optional(),
  payment_gateway: z.string().min(1, "Payment gateway is required"),
  payment_id: z.string().min(1, "Payment ID is required"),
});

export const createTip = async (data) => {
  // Validate input data using Zod
  const validationResult = createTipSchema.safeParse(data);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    throw new ApiError(400, `Validation failed: ${errorMessages}`);
  }

  const {
    visitor_id,
    creator_id,
    amount,
    currency,
    message,
    payment_gateway,
    payment_id,
  } = validationResult.data;

  try {
    const query = `
            INSERT INTO public.tips (
                visitor_id, 
                creator_id, 
                amount, 
                currency, 
                message, 
                payment_gateway, 
                payment_id, 
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, EXTRACT(epoch FROM now()))
            RETURNING *
        `;

    const values = [
      visitor_id,
      creator_id,
      amount,
      currency,
      message || null,
      payment_gateway,
      payment_id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(500, "Failed to create tip");
    }

    return result.rows[0];
  } catch (error) {
    return null;
  }
};

export const getTipsByCreatedAt = async (created_at, creator_id) => {
  try {
    const query = `
      SELECT 
        t.*,
        u.name as visitor_name,
        u.email as visitor_email,
        u.phone as visitor_phone
      FROM public.tips t
      LEFT JOIN public.users u ON t.visitor_id = u.visitor_id
      WHERE t.created_at > $1 AND t.creator_id = $2
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, [created_at, creator_id]);
    
    return result.rows;
  } catch (error) {
    return null;
  }
};
