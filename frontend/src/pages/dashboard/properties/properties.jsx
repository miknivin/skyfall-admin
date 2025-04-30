import { useGetAdminPropertiesQuery } from "@/redux/api/propertiesApi";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";


import { format } from "date-fns";
import { Link } from "react-router-dom";

export function Properties() {
  const { data: properties, isLoading, error } = useGetAdminPropertiesQuery();

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Properties
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {isLoading ? (
            <Typography className="text-center p-4">Loading...</Typography>
          ) : error ? (
            <Typography className="text-center p-4 text-red-500">
              Error: {error.message}
            </Typography>
          ) : !properties || properties.length === 0 ? (
            <Typography className="text-center p-4">
              No properties found.
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['ID',"Property", "Status", "Created", ""].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {properties.map(
                  (
                    { _id, name, location, status, createdAt },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === properties.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={_id}>
                         <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                #{_id.slice(-6)}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {location}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={
                              status === "approved"
                                ? "green"
                                : status === "pending"
                                ? "amber"
                                : "red"
                            }
                            value={status}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {format(new Date(createdAt), "dd/MM/yyyy")}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Link
                            to={_id}
                            
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Properties;