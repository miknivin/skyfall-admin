import ErrorHandler from "../utils/errorHandler.js";

// Middleware to validate addRooms request
export const validateAddRooms = (req, res, next) => {
  const { rooms, availabilityDates } = req.body;

  // Validate rooms
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return next(
      new ErrorHandler("Rooms array is required and must not be empty", 400)
    );
  }

  // Basic URL validation regex
  const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/;

  // Validate each room
  for (const room of rooms) {
    if (
      !room.roomType ||
      !room.capacity ||
      !room.pricePerNight ||
      !room.roomCount
    ) {
      return next(
        new ErrorHandler(
          "Each room must have roomType, capacity, pricePerNight, and roomCount",
          400
        )
      );
    }

    // Validate images if provided
    if (room.images) {
      if (!Array.isArray(room.images)) {
        return next(new ErrorHandler("Room images must be an array", 400));
      }
      for (const image of room.images) {
        if (typeof image !== "string") {
          return next(
            new ErrorHandler(
              "Each room image must be a valid URL string (e.g., AWS S3 presigned URL)",
              400
            )
          );
        }
      }
    }
  }

  if (availabilityDates) {
    if (!Array.isArray(availabilityDates)) {
      return next(new ErrorHandler("availabilityDates must be an array", 400));
    }

    for (const avail of availabilityDates) {
      if (!avail.date || !avail.availableRooms) {
        return next(
          new ErrorHandler(
            "Availability must include date and availableRooms",
            400
          )
        );
      }

      if (!Array.isArray(avail.availableRooms)) {
        return next(new ErrorHandler("availableRooms must be an array", 400));
      }

      for (const room of avail.availableRooms) {
        if (!room.roomType || typeof room.count !== "number") {
          return next(
            new ErrorHandler(
              "Each available room must have roomType and count",
              400
            )
          );
        }
      }
    }
  }

  next();
};
