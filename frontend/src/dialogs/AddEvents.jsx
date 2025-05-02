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
  Textarea,
} from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useAddEventSpaceMutation } from "@/redux/api/propertiesApi";

export function AddEventSpaceDialog({ open, handleOpen, resortId }) {
  const initialEventSpaceState = {
    name: "",
    type: "",
    capacity: "",
    pricePerEvent: "",
    description: "",
    images: [], // Array of { file, url }
    availability: [{ date: "", status: "available" }],
    isTypeDropdownOpen: false,
  };

  const [eventSpaces, setEventSpaces] = useState([initialEventSpaceState]);
  const [error, setError] = useState(null);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [addEventSpaces, { isLoading }] = useAddEventSpaceMutation();

  const typeOptions = ["Banquet Hall", "Outdoor Garden", "Conference Room", "Terrace", "Lawn", "Other"];
  const statusOptions = ["available", "booked", "TemporaryClosed"];
  const dropdownRefs = useRef([]);

  const handleEventSpaceChange = (index, field, value) => {
    const updatedEventSpaces = [...eventSpaces];
    updatedEventSpaces[index][field] = value;
    setEventSpaces(updatedEventSpaces);
  };

  const handleImageChange = (spaceIndex, files) => {
    setIsProcessingImages(true);
    const updatedEventSpaces = JSON.parse(JSON.stringify(eventSpaces)); // Deep copy to ensure re-render
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        if (!validImageTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WebP are allowed.`);
          return reject(new Error("Invalid file type"));
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
          return reject(new Error("File too large"));
        }

        // Generate blob URL
        const url = URL.createObjectURL(file);
        console.log(`Generated blob URL for ${file.name}: ${url}`); // Debugging

        // Verify the blob URL is a valid image by loading it
        const img = new Image();
        img.onload = () => {
          resolve({ file, url });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url); // Clean up if invalid
          toast.error(`Invalid or corrupted image: ${file.name}`);
          reject(new Error("Invalid or corrupted image"));
        };
        img.src = url;
      });
    };

    Promise.all(Array.from(files).map(processFile))
      .then((newImages) => {
        updatedEventSpaces[spaceIndex].images = [
          ...updatedEventSpaces[spaceIndex].images,
          ...newImages,
        ];
        setEventSpaces(updatedEventSpaces);
        setIsProcessingImages(false);
      })
      .catch((err) => {
        console.log(`Error processing images: ${err.message}`);
        setIsProcessingImages(false);
      });
  };

  const handleImageDelete = (spaceIndex, imageIndex) => {
    const updatedEventSpaces = [...eventSpaces];
    console.log('executed');
    
    const image = updatedEventSpaces[spaceIndex].images[imageIndex];
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
    updatedEventSpaces[spaceIndex].images = updatedEventSpaces[spaceIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setEventSpaces(updatedEventSpaces);
  };

  const toggleTypeDropdown = (index, open) => {
    const updatedEventSpaces = [...eventSpaces];
    updatedEventSpaces[index].isTypeDropdownOpen = open;
    setEventSpaces(updatedEventSpaces);
  };

  const selectType = (index, value) => {
    handleEventSpaceChange(index, "type", value);
    toggleTypeDropdown(index, false);
  };

  const handleAvailabilityChange = (spaceIndex, availIndex, field, value) => {
    const updatedEventSpaces = [...eventSpaces];
    updatedEventSpaces[spaceIndex].availability[availIndex][field] = value;
    setEventSpaces(updatedEventSpaces);
  };

  const addEventSpace = () => {
    setEventSpaces([...eventSpaces, { ...initialEventSpaceState }]);
  };

  const addAvailability = (spaceIndex) => {
    const updatedEventSpaces = [...eventSpaces];
    updatedEventSpaces[spaceIndex].availability.push({ date: "", status: "available" });
    setEventSpaces(updatedEventSpaces);
  };

  const removeEventSpace = (index) => {
    if (eventSpaces.length > 1) {
      const updatedEventSpaces = eventSpaces.filter((_, i) => i !== index);
      setEventSpaces(updatedEventSpaces);
    }
  };

  const removeAvailability = (spaceIndex, availIndex) => {
    const updatedEventSpaces = [...eventSpaces];
    if (updatedEventSpaces[spaceIndex].availability.length > 1) {
      updatedEventSpaces[spaceIndex].availability = updatedEventSpaces[spaceIndex].availability.filter(
        (_, i) => i !== availIndex
      );
      setEventSpaces(updatedEventSpaces);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formattedEventSpaces = eventSpaces.map((space) => ({
      name: space.name,
      type: space.type,
      capacity: parseInt(space.capacity) || 0,
      pricePerEvent: parseFloat(space.pricePerEvent) || 0,
      description: space.description || undefined,
      images: space.images
        .filter((img) => img.url)
        .map((img) => img.url)
        .length > 0
        ? space.images.filter((img) => img.url).map((img) => img.url)
        : undefined,
    }));

    const availabilityDates = eventSpaces.flatMap((space, spaceIndex) =>
      space.availability
        .filter((avail) => avail.date && avail.status)
        .map((avail) => ({
          date: avail.date,
          status: avail.status,
        }))
    );

    console.log(resortId,'resortId');
    
    try {
      await addEventSpaces({
        resortId,
        eventSpaces: formattedEventSpaces,
        availabilityDates,
      }).unwrap();
      setEventSpaces([initialEventSpaceState]);
      toast.success("Event spaces added successfully");
      handleOpen();
    } catch (err) {
      toast(err?.message || "Failed to add event spaces")
      setError(err?.data?.message || "Failed to add event spaces");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target) && eventSpaces[index].isTypeDropdownOpen) {
          toggleTypeDropdown(index, false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [eventSpaces]);


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
          Add Event Spaces
        </Typography>
        <Typography className="mt-1 font-normal text-gray-600">
          Add one or more event spaces to your property.
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
        {eventSpaces.map((space, spaceIndex) => (
          <div key={spaceIndex} className="space-y-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <Typography variant="h6" color="blue-gray">
                Event Space {spaceIndex + 1}
              </Typography>
              {eventSpaces.length > 1 && (
                <IconButton
                  variant="text"
                  color="red"
                  onClick={() => removeEventSpace(spaceIndex)}
                >
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
                Event Space Name
              </Typography>
              <Input
                type="text"
                color="gray"
                size="lg"
                placeholder="e.g., Grand Ballroom"
                value={space.name}
                onChange={(e) =>
                  handleEventSpaceChange(spaceIndex, "name", e.target.value)
                }
                className="placeholder:opacity-100 focus:!border-gray-900 !border-blue-gray-200 "
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Event Space Type
              </Typography>
              <div
                className="relative"
                ref={(el) => (dropdownRefs.current[spaceIndex] = el)}
              >
                <Input
                  type="text"
                  color="gray"
                  size="lg"
                  placeholder="e.g., Banquet Hall"
                  value={space.type}
                  onChange={(e) =>
                    handleEventSpaceChange(spaceIndex, "type", e.target.value)
                  }
                  onFocus={() => toggleTypeDropdown(spaceIndex, true)}
                  className="placeholder:opacity-100 focus:!border-gray-900 !border-blue-gray-300"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
                {space.isTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {typeOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectType(spaceIndex, option)}
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
                  placeholder="e.g., 100"
                  value={space.capacity}
                  onChange={(e) =>
                    handleEventSpaceChange(spaceIndex, "capacity", e.target.value)
                  }
                  className="placeholder:opacity-100 focus:!border-gray-900 !border-blue-gray-200"
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
                  Price per Event (₹)
                </Typography>
                <Input
                  type="number"
                  color="gray"
                  size="lg"
                  placeholder="e.g., 5000"
                  value={space.pricePerEvent}
                  onChange={(e) =>
                    handleEventSpaceChange(spaceIndex, "pricePerEvent", e.target.value)
                  }
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
                Description
              </Typography>
              <Textarea
                color="gray"
                size="lg"
                placeholder="e.g., Spacious hall with modern amenities"
                value={space.description}
                onChange={(e) =>
                  handleEventSpaceChange(spaceIndex, "description", e.target.value)
                }
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div>
              <div className="mb-3">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor={`image-upload-${spaceIndex}`}
                >
                  Upload Images
                </label>
                <input
                  className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 p-2 cursor-pointer bg-gray-50 focus:outline-none"
                  id={`image-upload-${spaceIndex}`}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(spaceIndex, e.target.files)}
                />
              </div>
              {space.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {space.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="relative border rounded">
                      <img
                        src={image.url }
                        alt={`Preview ${imageIndex + 1}`}
                        className="w-full rounded max-w-xs"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                        onError={(e) => {
                          console.log(`Failed to load image ${imageIndex + 1}: ${image.url}`);
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <div
                        className="absolute top-0 right-0 rounded-full p-1 bg-red-100 text-red-900"
                        onClick={() => handleImageDelete(spaceIndex, imageIndex)}
                        aria-label={`Remove image ${imageIndex + 1}`}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) }
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Availability
              </Typography>
              {space.availability.map((avail, availIndex) => (
                <div key={availIndex} className="flex gap-4 mb-2 items-center">
                  <div className="w-1/2">
                    <Input
                      type="date"
                      color="gray"
                      size="lg"
                      min={getLocalDate()}
                      value={avail.date}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          spaceIndex,
                          availIndex,
                          "date",
                          e.target.value
                        )
                      }
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{ className: "!min-w-full" }}
                      labelProps={{ className: "hidden" }}
                    />
                  </div>
                  <div className="w-1/2">
                    <select
                      value={avail.status}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          spaceIndex,
                          availIndex,
                          "status",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {space.availability.length > 1 && (
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => removeAvailability(spaceIndex, availIndex)}
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
                onClick={() => addAvailability(spaceIndex)}
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
          onClick={addEventSpace}
        >
          <PlusIcon className="h-5 w-5" /> Add Another Event Space
        </Button>
        {error && (
          <Typography color="red" variant="small">
            {error}
          </Typography>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={handleOpen} className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Event Spaces"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}