import catchAsync from "../utils/catchAsync.js";
import { z } from "zod";
import ApiError from "../utils/error.api.js";
import { createEvent } from "../services/event.service.js";
import { ApiResponse } from "../utils/response.api.js";

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

  // const user_ip = parseIp(req);
  const user_ip = "49.43.163.126";

  if (!user_ip) {
    throw new ApiError(400, `Invalid or missing user IP`);
  }

  const utm_params = Object.entries(req.query)
    .filter(([key]) => key.startsWith("utm_"))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  createEvent({
    event_type: req.query.event_type,
    event_name: req.query.event_name,
    url: req.get("X-Current-URL"),
    path: req.get("X-Current-Path"),
    visitor_id: req.query.visitor_id,
    utm_params,
    user_agent: req.useragent,
    user_ip,
  });

  res.json(new ApiResponse(200, "Event created successfully"));
});

export const createEventPost = catchAsync(async (req, res) => {
  const validationResult = paramsSchema.safeParse(req.query);

  if (!validationResult.success) {
    throw new ApiError(400, `Validation failed params are not valid`);
  }

  // const user_ip = parseIp(req);
  const user_ip = "49.43.163.126";

  if (!user_ip) {
    throw new ApiError(400, `Invalid or missing user IP`);
  }

  const utm_params = Object.entries(req.query)
    .filter(([key]) => key.startsWith("utm_"))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  createEvent({
    event_type: req.query.event_type,
    event_name: req.query.event_name,
    event_data: req.body,
    url: req.get("X-Current-URL"),
    path: req.get("X-Current-Path"),
    visitor_id: req.query.visitor_id,
    utm_params,
    user_agent: req.useragent,
    user_ip,
  });

  res.json(new ApiResponse(200, "Event created successfully"));
});
