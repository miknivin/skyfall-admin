import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Room Type", "Capacity", "Price/Night", "Total Rooms", "Images", ""];

export function RoomsTable({ rooms }) {
  return (
    <Card className="h-full w-full overflow-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  No rooms available
                </Typography>
              </td>
            </tr>
          ) : (
            rooms.map(({ roomType, capacity, pricePerNight, roomCount, images = [] }, index) => (
              <tr key={`${roomType}-${index}`} className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {roomType}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {capacity} Guests
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    ₹{pricePerNight}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {roomCount}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {images.length} {images.length === 1 ? "Image" : "Images"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    Edit
                  </Typography>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}