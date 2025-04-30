import ErrorHandler from "../utils/errorHandler.js";

// Validation middleware for AdminRequest
export const validateAdminRequest = (req, res, next) => {
  const { userId, name, email, phone, requestDetails } = req.body;

  // Validate required fields
  if (!userId || !name || !email || !phone) {
    return next(
      new ErrorHandler(
        "Please provide all required fields: userId, name, email, phone",
        400
      )
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  // Validate phone format (basic check for digits and optional +, -, spaces)
  const phoneRegex = /^\+?[\d\s-]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return next(new ErrorHandler("Invalid phone number format", 400));
  }

  // Validate requestDetails if provided
  if (requestDetails && requestDetails.resorts) {
    if (!Array.isArray(requestDetails.resorts)) {
      return next(new ErrorHandler("Resorts must be an array", 400));
    }

    for (const resort of requestDetails.resorts) {
      // Validate resort required fields
      if (!resort.name || !resort.location) {
        return next(
          new ErrorHandler("Each resort must have a name and location", 400)
        );
      }

      // Validate location fields
      const { latitude, longitude, displayName, formattedAddress } =
        resort.location;
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        !displayName ||
        !formattedAddress
      ) {
        return next(
          new ErrorHandler(
            "Each resort location must have latitude, longitude, displayName, and formattedAddress",
            400
          )
        );
      }

      // Validate documents if provided
      if (resort.documents) {
        if (!Array.isArray(resort.documents)) {
          return next(new ErrorHandler("Documents must be an array", 400));
        }

        for (const doc of resort.documents) {
          if (!doc.type || !doc.name || !doc.url) {
            return next(
              new ErrorHandler(
                "Each document must have a type, name, and URL",
                400
              )
            );
          }
          if (!["license", "registration"].includes(doc.type)) {
            return next(
              new ErrorHandler(
                "Document type must be 'license' or 'registration'",
                400
              )
            );
          }
        }

        // Ensure only one document per type
        const docTypes = resort.documents.map((doc) => doc.type);
        const uniqueDocTypes = new Set(docTypes);
        if (uniqueDocTypes.size !== docTypes.length) {
          return next(
            new ErrorHandler(
              "Only one document per type (license or registration) is allowed",
              400
            )
          );
        }
      }
    }
  }

  next(); // Validation passed, proceed to controller
};
