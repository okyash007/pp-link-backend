import catchAsync from "../utils/catchAsync.js";
import { z } from "zod";
import ApiError from "../utils/error.api.js";
import { createEvent } from "../services/event.service.js";

const paramsSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.string().min(1, "Event type is required"),
  visitor_id: z.string().min(1, "Visitor ID is required"),
});

export const createEventGet = catchAsync(async (req, res, next) => {
  // Validate query parameters for GET request
  const validationResult = paramsSchema.safeParse(req.query);

  if (!validationResult.success) {
    throw new ApiError(400, `Validation failed params are not valid`);
  }

  const res_data = await createEvent(
    validationResult.data.event_name,
    validationResult.data.event_type,
    validationResult.data.visitor_id
  );

  res.json(new ApiResponse(200, res_data, "Event created successfully"));
});

export const createEventPost = catchAsync(async (req, res) => {
  // Validate request body for POST request
  const validationResult = paramsSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ApiError(400, `Validation failed params are not valid`);
  }
  const res_data = await createEvent(
    validationResult.data.event_name,
    validationResult.data.event_type,
    validationResult.data.visitor_id
  );

  res.json(new ApiResponse(200, res_data, "Event created successfully"));
});
