import { fetchPaymentIdByOrderId } from "../services/razorpay.service.js";
import { createTip, updateTip } from "../services/tip.service.js";
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
    display_name: req.body.payload.payment.entity.notes.display_name,
    creator_id: req.body.payload.payment.entity.notes.creator_id,
    amount: req.body.payload.payment.entity.amount,
    currency: req.body.payload.payment.entity.currency,
    message: req.body.payload.payment.entity.notes.message,
    payment_gateway: "razorpay",
    payment_id: req.body.payload.payment.entity.id,
    type: req.body.payload.payment.entity.notes.type,
    media: req.body.payload.payment.entity.notes.media,
  });

  res.json(new ApiResponse(200, "Webhook received"));
});

export const settlementWebhook = catchAsync(async (req, res) => {

  console.log(JSON.stringify(req.body, null, 2));

  const source = req.body.payload.transfer.entity.source;
  
  // Check if source is a payment_id (starts with "pay_") or order_id (starts with "order_")
  let payment_id;
  
  if (source.startsWith("pay_")) {
    // Source is already a payment_id
    payment_id = source;
  } else if (source.startsWith("order_")) {
    // Source is an order_id, fetch the payment_id
    const result = await fetchPaymentIdByOrderId(source);
    payment_id = result.payment_id;
  } else {
    throw new Error(`Invalid source format: ${source}. Expected payment_id (pay_*) or order_id (order_*)`);
  }

  if (!payment_id) {
    throw new Error(`Could not determine payment_id from source: ${source}`);
  }

  await updateTip(
    { payment_id },
    {
      settled: true,
      transfer_id: req.body.payload.transfer.entity.id,
      transfer_amount: req.body.payload.transfer.entity.amount,
    }
  );
  res.json(new ApiResponse(200, "Webhook received"));
});
