import mongoose from "mongoose";

const { Schema } = mongoose;

const ResortSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links to Admin who manages this resort
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rooms: [
      {
        roomType: {
          type: String, // e.g., "Deluxe", "Suite"
          required: true,
        },
        capacity: {
          type: Number, // Max guests per room
          required: true,
        },
        pricePerNight: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
        },
        images: [
          {
            type: String,
          },
        ],
        roomCount: {
          type: Number, // Number of rooms of this type
          required: true,
        },
      },
    ],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking", // Links to Booking collection
      },
    ],
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        availableRooms: [
          {
            roomType: { type: String },
            count: { type: Number },
          },
        ],
      },
    ],
    eventSpaces: [
      {
        name: {
          type: String, // e.g., "Grand Ballroom", "Garden Terrace"
          required: [true, "Event space name is required"],
          trim: true,
        },
        type: {
          type: String, // e.g., "Banquet Hall", "Outdoor Garden"
          required: [true, "Event space type is required"],
        },
        capacity: {
          type: Number, // Max guests the space can accommodate
          required: [true, "Capacity is required"],
        },
        pricePerEvent: {
          type: Number, // Base price for booking the space
          required: [true, "Price per event is required"],
        },
        description: {
          type: String, // Additional details about the space
        },
        images: [
          {
            type: String, // URLs for images of the event space
          },
        ],
        availability: [
          {
            date: {
              type: Date,
              required: true,
            },
            status: {
              type: String,
              enum: ["available", "booked", "temporaryClosed"],
              default: "available",
            },
          },
        ],
        bookings: [
          {
            type: Schema.Types.ObjectId,
            ref: "Booking", // Links to Booking collection for events
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Resort = mongoose.model("Resort", ResortSchema);
export default Resort;
