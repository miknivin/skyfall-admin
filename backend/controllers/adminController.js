import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import AdminRequest from "../models/AdminRequest.js";
import User from "../models/User.js";
// Register user   =>  /api/v1/register
export const createAdminRequest = catchAsyncErrors(async (req, res, next) => {
  const { userId, name, email, phone, status, requestDetails, reviewedBy } =
    req.body;

  // Create new AdminRequest
  const adminRequest = await AdminRequest.create({
    userId,
    name,
    email,
    phone,
    status: status || "pending",
    requestDetails: requestDetails || { resorts: [] },
    reviewedBy,
  });

  res.status(201).json({
    success: true,
    data: adminRequest,
  });
});
