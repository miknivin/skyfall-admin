import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Guest Name", "Room Type", "Check-In", "Check-Out", ""];

const TABLE_ROWS = [
  {
    guestName: "John Michael",
    roomType: "Deluxe Suite",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25",
  },
  {
    guestName: "Alexa Liras",
    roomType: "Standard Room",
    checkIn: "2025-04-22",
    checkOut: "2025-04-23",
  },
  {
    guestName: "Laurent Perrier",
    roomType: "Presidential Suite",
    checkIn: "2025-04-18",
    checkOut: "2025-04-28",
  },
  {
    guestName: "Michael Levi",
    roomType: "Ocean View",
    checkIn: "2025-04-15",
    checkOut: "2025-04-20",
  },
  {
    guestName: "Richard Gran",
    roomType: "Standard Room",
    checkIn: "2025-04-21",
    checkOut: "2025-04-24",
  },
];

export function BookingTable() {
  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
          {TABLE_ROWS.map(({ guestName, roomType, checkIn, checkOut }) => (
            <tr key={guestName} className="even:bg-blue-gray-50/50">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {guestName}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {roomType}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {checkIn}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {checkOut}
                </Typography>
              </td>
              <td className="p-4">
                <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
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
