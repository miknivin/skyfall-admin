import { Card, Typography } from "@material-tailwind/react";

const ROOMS = [
  {
    roomType: "Deluxe",
    capacity: 2,
    pricePerNight: 120,
    roomCount: 5,
  },
  {
    roomType: "Suite",
    capacity: 4,
    pricePerNight: 200,
    roomCount: 3,
  },
  {
    roomType: "Standard",
    capacity: 2,
    pricePerNight: 80,
    roomCount: 10,
  },
];

const TABLE_HEAD = ["Room Type", "Capacity", "Price/Night", "Total Rooms", ""];

export function RoomsTable() {
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
          {ROOMS.map(({ roomType, capacity, pricePerNight, roomCount }) => (
            <tr key={roomType} className="even:bg-blue-gray-50/50">
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
          ))}
        </tbody>
      </table>
    </Card>
  );
}
