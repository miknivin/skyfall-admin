import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true,"Email already exists"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required:true,
      select:false
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    resorts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resort", 
      },
    ],
    profile: {
      phone: { type: String },
      address: { type: String },
      avatar: { type: String }, // URL to profile picture
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking", // User’s bookings
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    signupMethod: {
      type: String,
      enum: ["OTP", "Email/Password", "OAuth"],
      default: "Email/Password",
    },
  },
  {
    timestamps: true, 
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
