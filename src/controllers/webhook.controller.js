import { createTip } from "../services/tip.service.js";
import { createUser } from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/response.api.js";

export const razorpayWebhook = catchAsync(async (req, res) => {

  if (req.body.event !== "payment.authorized") {
    console.log("not authorized");
    return res.json(new ApiResponse(200, "Webhook received"));
  }

  await createUser({
    visitor_id: req.body.payload.payment.entity.notes.visitor_id,
    name: req.body.payload.payment.entity.notes.name,
    email: req.body.payload.payment.entity.email,
    phone: req.body.payload.payment.entity.contact,
  });

  await createTip({
    visitor_id: req.body.payload.payment.entity.notes.visitor_id,
    creator_id: req.body.payload.payment.entity.notes.creator_id,
    amount: req.body.payload.payment.entity.amount,
    currency: req.body.payload.payment.entity.currency,
    message: req.body.payload.payment.entity.notes.message,
    payment_gateway: "razorpay",
    payment_id: req.body.payload.payment.entity.id,
  });

  res.json(new ApiResponse(200, "Webhook received"));
});
