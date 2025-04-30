import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: [true, "Phone number already exists"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestDetails: {
      resorts: [
        {
          name: {
            type: String,
            required: [true, "Resort name is required"],
            trim: true,
          },
          location: {
            latitude: {
              type: Number,
              required: [true, "Latitude is required"],
            },
            longitude: {
              type: Number,
              required: [true, "Longitude is required"],
            },
            displayName: {
              type: String,
              required: [true, "Display name is required"],
              trim: true,
            },
            formattedAddress: {
              type: String,
              required: [true, "Address is required"],
              trim: true,
            },
          },
          description: {
            type: String,
            trim: true,
          },
          documents: [
            {
              type: {
                type: String,
                required: [true, "Document type is required"],
                enum: ["license", "registration"],
              },
              name: {
                type: String,
                required: [true, "Document name is required"],
                trim: true,
              },
              url: {
                type: String,
                required: [true, "Document URL is required"],
                trim: true,
              },
            },
          ],
        },
      ],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

AdminRequestSchema.index({ userId: 1, status: 1 });

const AdminRequest = mongoose.model("AdminRequest", AdminRequestSchema);
export default AdminRequest;
