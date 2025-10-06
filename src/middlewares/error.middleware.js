import ApiError from "../utils/error.api.js";

export const errorMiddleWare = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  res.status(status).json({
    success: false,
    statusCode: status,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
