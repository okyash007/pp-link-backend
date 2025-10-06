import { pool } from "../utils/postgress.js";
import ApiError from "../utils/error.api.js";
import { z } from "zod";

// Zod schema for user validation
const createUserSchema = z.object({
  visitor_id: z.string().min(1, "Visitor ID is required"),
  name: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().max(50, "Phone number too long").optional(),
  address: z.string().optional(),
  city: z.string().max(100, "City name too long").optional(),
  province: z.string().max(100, "Province name too long").optional(),
  province_code: z.string().max(10, "Province code too long").optional(),
  country: z.string().max(100, "Country name too long").optional(),
  country_code: z.string().max(10, "Country code too long").optional(),
  zip: z.string().max(20, "ZIP code too long").optional(),
});

export const createUser = async (data) => {
  // Validate input data using Zod
  const validationResult = createUserSchema.safeParse(data);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    throw new ApiError(400, `Validation failed: ${errorMessages}`);
  }

  const {
    visitor_id,
    name,
    email,
    phone,
    address,
    city,
    province,
    province_code,
    country,
    country_code,
    zip,
  } = validationResult.data;

  try {
    const query = `
            INSERT INTO public.users (
                visitor_id, 
                name, 
                email, 
                phone, 
                address, 
                city, 
                province, 
                province_code, 
                country, 
                country_code, 
                zip, 
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, EXTRACT(epoch FROM now()))
            RETURNING *
        `;

    const values = [
      visitor_id,
      name || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      province || null,
      province_code || null,
      country || null,
      country_code || null,
      zip || null,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new ApiError(500, "Failed to create user");
    }

    return result.rows[0];
  } catch (error) {
    return null;
  }
};

export const getUserByVisitorId = async (visitor_id) => {
  const query = `SELECT * FROM public.users WHERE visitor_id = $1`;
  const result = await pool.query(query, [visitor_id]);
  return result.rows[0];
};
