export const validateEventSpace = (req, res, next) => {
  const { eventSpaces, availabilityDates } = req.body;

  // Validate eventSpaces array
  if (!Array.isArray(eventSpaces) || eventSpaces.length === 0) {
    return res.status(400).json({
      message: "eventSpaces must be a non-empty array",
    });
  }

  // Validate each event space
  for (let i = 0; i < eventSpaces.length; i++) {
    const eventSpace = eventSpaces[i];

    // Check required fields
    if (
      !eventSpace.name ||
      typeof eventSpace.name !== "string" ||
      eventSpace.name.trim() === ""
    ) {
      return res.status(400).json({
        message: `Event space at position ${i}: name is required and must be a non-empty string`,
      });
    }

    if (
      !eventSpace.type ||
      typeof eventSpace.type !== "string" ||
      eventSpace.type.trim() === ""
    ) {
      return res.status(400).json({
        message: `Event space at position ${i}: type is required and must be a non-empty string`,
      });
    }

    if (!Number.isInteger(eventSpace.capacity) || eventSpace.capacity <= 0) {
      return res.status(400).json({
        message: `Event space at position ${i}: capacity must be a positive integer`,
      });
    }

    if (
      typeof eventSpace.pricePerEvent !== "number" ||
      eventSpace.pricePerEvent <= 0
    ) {
      return res.status(400).json({
        message: `Event space at position ${i}: pricePerEvent must be a positive number`,
      });
    }

    // Validate optional description
    if (
      eventSpace.description &&
      (typeof eventSpace.description !== "string" ||
        eventSpace.description.trim() === "")
    ) {
      return res.status(400).json({
        message: `Event space at position ${i}: description must be a non-empty string if provided`,
      });
    }

    // Validate optional images
    if (eventSpace.images) {
      if (!Array.isArray(eventSpace.images)) {
        return res.status(400).json({
          message: `Event space at position ${i}: images must be an array`,
        });
      }
      for (let j = 0; j < eventSpace.images.length; j++) {
        if (
          typeof eventSpace.images[j] !== "string" ||
          eventSpace.images[j].trim() === ""
        ) {
          return res.status(400).json({
            message: `Event space at position ${i}: image at position ${j} must be a non-empty string`,
          });
        }
      }
    }
  }

  if (availabilityDates) {
    if (!Array.isArray(availabilityDates)) {
      return res.status(400).json({
        message: "availabilityDates must be an array",
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const validStatuses = ["available", "booked", "TemporaryClosed"];

    for (let i = 0; i < availabilityDates.length; i++) {
      const { date, status } = availabilityDates[i];

      if (!date || typeof date !== "string" || !dateRegex.test(date)) {
        return res.status(400).json({
          message: `Availability date at position ${i}: date is required and must be in YYYY-MM-DD format`,
        });
      }

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Availability date at position ${i}: status is required and must be one of ${validStatuses.join(
            ", "
          )}`,
        });
      }
    }
  }

  next();
};
