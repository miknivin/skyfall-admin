import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAddRoomsMutation } from "@/redux/api/propertiesApi";
import toast from "react-hot-toast";

export function AddRoomDialog({ open, handleOpen, resortId }) {
  const initialRoomState = {
    roomType: "",
    capacity: "",
    pricePerNight: "",
    roomCount: "",
    images: [], // Array to store image files or base64 strings
    availability: [{ date: "", count: "" }],
    isRoomTypeDropdownOpen: false,
  };

  const [rooms, setRooms] = useState([initialRoomState]);
  const [error, setError] = useState(null);

  const [addRooms, { isLoading }] = useAddRoomsMutation();
  
  const roomTypeOptions = ["Single", "Double", "Suite"];
  const dropdownRefs = useRef([]);

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const toggleRoomTypeDropdown = (index, open) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].isRoomTypeDropdownOpen = open;
    setRooms(updatedRooms);
  };

  const selectRoomType = (index, value) => {
    handleRoomChange(index, "roomType", value);
    toggleRoomTypeDropdown(index, false);
  };

  const handleAvailabilityChange = (roomIndex, availIndex, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].availability[availIndex][field] = value;
    setRooms(updatedRooms);
  };

  const handleImageChange = (roomIndex, e) => {
    const files = Array.from(e.target.files);
    const updatedRooms = [...rooms];
    // Convert files to base64 for preview and backend submission
    Promise.all(
      files.map((file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file, base64: reader.result });
          reader.readAsDataURL(file);
        })
      )
    ).then((results) => {
      updatedRooms[roomIndex].images = [
        ...updatedRooms[roomIndex].images,
        ...results.map((res) => ({ file: res.file, base64: res.base64 })),
      ];
      setRooms(updatedRooms);
    });
  };

  const removeImage = (roomIndex, imageIndex) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].images = updatedRooms[roomIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms([...rooms, { ...initialRoomState }]);
  };

  const addAvailability = (roomIndex) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].availability.push({ date: "", count: "" });
    setRooms(updatedRooms);
  };

  const removeRoom = (index) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const removeAvailability = (roomIndex, availIndex) => {
    const updatedRooms = [...rooms];
    if (updatedRooms[roomIndex].availability.length > 1) {
      updatedRooms[roomIndex].availability = updatedRooms[roomIndex].availability.filter(
        (_, i) => i !== availIndex
      );
      setRooms(updatedRooms);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formattedRooms = rooms.map((room) => ({
      roomType: room.roomType,
      capacity: parseInt(room.capacity) || 0,
      pricePerNight: parseFloat(room.pricePerNight) || 0,
      roomCount: parseInt(room.roomCount) || 0,
      images: room.images.map((img) => img.base64), // Send base64 strings to backend
    }));

    const availabilityDates = rooms.flatMap((room, roomIndex) =>
      room.availability
        .filter((avail) => avail.date && avail.count)
        .map((avail) => ({
          availableRooms: [{ roomType: room.roomType, count: parseInt(avail.count) || 0 }],
        }))
    );

    try {
      await addRooms({
        resortId,
        rooms: formattedRooms,
        availabilityDates,
      }).unwrap();
      setRooms([initialRoomState]);
      toast.success("Rooms added successfully");
      handleOpen();
    } catch (err) {
      setError(err?.data?.message || "Failed to add rooms");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target) && rooms[index].isRoomTypeDropdownOpen) {
          toggleRoomTypeDropdown(index, false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rooms]);

  const getLocalDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  return (
    <Dialog size="lg" open={open} handler={handleOpen} className="p-4">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          Add Rooms
        </Typography>
        <Typography className="mt-1 font-normal text-gray-600">
          Add one or more rooms to your property.
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleOpen}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-6 pb-6 overflow-y-auto max-h-[70vh]">
        {error && (
          <Typography color="red" variant="small">
            {error}
          </Typography>
        )}
        {rooms.map((room, roomIndex) => (
          <div key={roomIndex} className="space-y-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <Typography variant="h6" color="blue-gray">
                Room {roomIndex + 1}
              </Typography>
              {rooms.length > 1 && (
                <IconButton variant="text" color="red" onClick={() => removeRoom(roomIndex)}>
                  <TrashIcon className="h-5 w-5" />
                </IconButton>
              )}
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Room Type
              </Typography>
              <div className="relative" ref={(el) => (dropdownRefs.current[roomIndex] = el)}>
                <Input
                  type="text"
                  color="gray"
                  size="lg"
                  placeholder="e.g., Single or Deluxe"
                  value={room.roomType}
                  onChange={(e) => handleRoomChange(roomIndex, "roomType", e.target.value)}
                  onFocus={() => toggleRoomTypeDropdown(roomIndex, true)}
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
                {room.isRoomTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {roomTypeOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectRoomType(roomIndex, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 text-left font-medium"
                >
                  Capacity (Guests)
                </Typography>
                <Input
                  type="number"
                  color="gray"
                  size="lg"
                  placeholder="e.g., 2"
                  value={room.capacity}
                  onChange={(e) => handleRoomChange(roomIndex, "capacity", e.target.value)}
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 text-left font-medium"
                >
                  Price per Night (₹)
                </Typography>
                <Input
                  type="number"
                  color="gray"
                  size="lg"
                  placeholder="e.g., 150"
                  value={room.pricePerNight}
                  onChange={(e) => handleRoomChange(roomIndex, "pricePerNight", e.target.value)}
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Number of Rooms
              </Typography>
              <Input
                type="number"
                color="gray"
                size="lg"
                placeholder="e.g., 5"
                value={room.roomCount}
                onChange={(e) => handleRoomChange(roomIndex, "roomCount", e.target.value)}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div>
            <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="small_size"
              >
                Room Images
              </label>
              <input
                className="block w-full mb-5 text-sm p-2 rounded-md text-gray-900 border  border-blue-gray-200 cursor-pointer bg-transparent focus:outline-none"
                id={`imageUpload-${roomIndex}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(roomIndex, e)}
              />
              {room.images&&room.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {room.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="relative">
                      <img
                        src={image.base64}
                        alt={`Room ${roomIndex + 1} preview ${imageIndex + 1}`}
                        className="h-24 w-full max-w-sm object-cover rounded-md"
                      />
                      <IconButton
                        variant="text"
                        color="red"
                        size="sm"
                        className="!absolute top-1 right-1"
                        onClick={() => removeImage(roomIndex, imageIndex)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Availability
              </Typography>
              {room.availability.map((avail, availIndex) => (
                <div key={availIndex} className="flex gap-4 mb-2 items-center">
                  <div className="w-1/2">
                    <Input
                      type="date"
                      color="gray"
                      size="lg"
                      min={getLocalDate()}
                      value={avail.date}
                      onChange={(e) =>
                        handleAvailabilityChange(roomIndex, availIndex, "date", e.target.value)
                      }
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{ className: "!min-w-full" }}
                      labelProps={{ className: "hidden" }}
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="number"
                      color="gray"
                      size="lg"
                      placeholder="e.g., 5"
                      value={avail.count}
                      onChange={(e) =>
                        handleAvailabilityChange(roomIndex, availIndex, "count", e.target.value)
                      }
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{ className: "!min-w-full" }}
                      labelProps={{ className: "hidden" }}
                    />
                  </div>
                  {room.availability.length > 1 && (
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => removeAvailability(roomIndex, availIndex)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  )}
                </div>
              ))}
              <Button
                variant="text"
                color="blue"
                className="flex items-center gap-2 mt-2"
                onClick={() => addAvailability(roomIndex)}
              >
                <PlusIcon className="h-5 w-5" /> Add Availability Date
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outlined"
          color="blue"
          className="flex items-center gap-2"
          onClick={addRoom}
        >
          <PlusIcon className="h-5 w-5" /> Add Another Room
        </Button>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={handleOpen} className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Rooms"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}