import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/User.js";

export const isAuthenticateUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("❌ No token provided.");
    return next(
      new ErrorHandler("You need to login to access this resource", 401)
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error("❗ Error verifying token:", err);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

//Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    //console.log(req.user);

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
