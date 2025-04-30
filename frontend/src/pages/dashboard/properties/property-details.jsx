import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useGetPropertyByIdQuery } from "@/redux/api/propertiesApi";
import { BookingTable } from "@/tables/BookingTables";
import { RoomsTable } from "@/tables/RoomsTable";
import { AddRoomDialog } from "@/dialogs/AddRooms";
import { useState } from "react";
import { FullScreenLoader } from "@/utils/Loader";

export function PropertiesDetails() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const { data: property, isLoading, error } = useGetPropertyByIdQuery(id);
  const handleOpen = () => setOpen(!open);
  if (isLoading) return <FullScreenLoader/>
  if (error) return <div className="text-center">An Error occurred</div>
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {property?.name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal max-w-md text-blue-gray-600"
                >
                  {property?.location}
                </Typography>
              </div>
            </div>
            <div className="w-96">
            <ButtonGroup variant="outlined" className="flex">
              <Button className="flex items-center">
                Info
              </Button>
              <Button onClick={handleOpen} className="flex items-center">
                Add rooms
              </Button>
              <Button className="flex items-center">
                Add Events
              </Button>
            </ButtonGroup>
            </div>
          </div>
          <>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <ProfileInfoCard
              title="General Information"
              description={property?.description}
              details={{
               
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                New users
              </Typography>
              <ul className="flex flex-col gap-6">
                {conversationsData.map((props) => (
                  <MessageCard
                    key={props.name}
                    {...props}
                    action={
                      <Button variant="text" size="sm">
                        reply
                      </Button>
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="w-100 mb-3">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Bookings
            </Typography>
            <BookingTable/>
          </div>
          <div className="w-100 mb-3">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Rooms
            </Typography>
           <RoomsTable/>
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Images
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {projectsData.map(
                ({ img, title, description, tag, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    {/* <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {tag}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={route}>
                        <Button variant="outlined" size="sm">
                          view project
                        </Button>
                      </Link>
                      <div>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </CardFooter> */}
                  </Card>
                )
              )}
            </div>
          </div>
          </>
        </CardBody>
      </Card>
      <AddRoomDialog open={open} handleOpen={handleOpen} resortId={id} />
    </>
  );
}

export default PropertiesDetails;
