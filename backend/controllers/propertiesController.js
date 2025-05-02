import mongoose from "mongoose";
import Resort from "../models/Resort.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAdminResorts = async (req, res) => {
  try {
    const adminId = req.user._id;

    const resorts = await Resort.find({ adminId }).lean();

    if (!resorts || resorts.length === 0) {
      return res
        .status(404)
        .json({ message: "No resorts found for this admin" });
    }

    res.status(200).json({
      message: "Resorts retrieved successfully",
      data: resorts,
    });
  } catch (error) {
    console.error("Error fetching admin resorts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getResortById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;
    if (!adminId || !id) {
      return res.status(400).json({ message: "Invalid admin ID or resort ID" });
    }

    const resort = await Resort.findOne({ _id: id, adminId }).lean();

    if (!resort) {
      return res
        .status(404)
        .json({ message: "Resort not found or not authorized" });
    }

    res.status(200).json({
      message: "Resort retrieved successfully",
      data: resort,
    });
  } catch (error) {
    console.error("Error fetching resort by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addRooms = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rooms, availabilityDates } = req.body;

    const resort = await Resort.findById(id);
    if (!resort) {
      return next(new ErrorHandler("Resort not found", 404));
    }

    for (const room of rooms) {
      const existingRoom = resort.rooms.find(
        (r) => r.roomType === room.roomType
      );
      if (existingRoom) {
        existingRoom.roomCount += room.roomCount;
        existingRoom.pricePerNight = room.pricePerNight;
        existingRoom.capacity = room.capacity;
        if (room.images) {
          existingRoom.images = room.images; // Update images if provided
        }
      } else {
        resort.rooms.push({
          roomType: room.roomType,
          capacity: room.capacity,
          pricePerNight: room.pricePerNight,
          roomCount: room.roomCount,
          images: room.images || [], // Include images or empty array if not provided
        });
      }
    }

    if (availabilityDates && Array.isArray(availabilityDates)) {
      for (const avail of availabilityDates) {
        const dateEntry = resort.availability.find(
          (a) =>
            new Date(a.date).toDateString() ===
            new Date(avail.date).toDateString()
        );

        if (dateEntry) {
          for (const room of avail.availableRooms) {
            const existingRoom = dateEntry.availableRooms.find(
              (ar) => ar.roomType === room.roomType
            );
            if (existingRoom) {
              existingRoom.count = room.count;
            } else {
              dateEntry.availableRooms.push({
                roomType: room.roomType,
                count: room.count,
              });
            }
          }
        } else {
          resort.availability.push({
            date: new Date(avail.date),
            availableRooms: avail.availableRooms.map((room) => ({
              roomType: room.roomType,
              count: room.count,
            })),
          });
        }
      }
    }

    const updatedResort = await resort.save();
    res.status(200).json({
      success: true,
      message: "Rooms added successfully",
      data: updatedResort,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const addEventSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventSpaces, availabilityDates } = req.body;

    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ message: "Resort not found" });
    }

    const addedEventSpaces = [];
    for (const eventSpaceData of eventSpaces) {
      const uploadedImages = await Promise.all(
        (eventSpaceData.images || []).map(async (blobUrl) => {
          // TODO: Implement actual image upload (e.g., to S3 or Cloudinary)
          // Example:
          // const uploadedUrl = await uploadImageToStorage(blobUrl);
          // return uploadedUrl;
          return blobUrl;
        })
      );

      const eventSpace = {
        _id: new mongoose.Types.ObjectId(),
        name: eventSpaceData.name,
        type: eventSpaceData.type,
        capacity: eventSpaceData.capacity,
        pricePerEvent: eventSpaceData.pricePerEvent,
        description: eventSpaceData.description || undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      };

      resort.eventSpaces.push(eventSpace);
      addedEventSpaces.push(eventSpace);
    }

    if (availabilityDates && availabilityDates.length > 0) {
      const availabilityEntries = availabilityDates.map((avail) => ({
        eventSpaceId: addedEventSpaces[0]._id,
        date: avail.date,
        status: avail.status,
      }));
      resort.availability.push(...availabilityEntries);
    }

    await resort.save();

    res.status(201).json({
      message: "Event spaces added successfully",
      eventSpaces: addedEventSpaces,
      availabilityDates: availabilityDates || [],
    });
  } catch (error) {
    console.error("Error adding event space:", error);
    res.status(500).json({
      message: "Error adding event spaces",
      error: error.message,
    });
  }
};
