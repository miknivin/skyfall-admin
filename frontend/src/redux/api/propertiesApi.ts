import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define interfaces for the property (resort) data based on updated ResortSchema
interface Document {
  type: 'license' | 'registration';
  name: string;
  url: string;
}

interface Room {
  roomType: string;
  capacity: number;
  pricePerNight: number;
  roomCount: number;
}

interface AvailableRoom {
  roomType: string;
  count: number;
}

interface AvailabilityDate {
  date: string;
  availableRooms: AvailableRoom[];
}

interface Property {
  _id: string;
  adminId: string;
  name: string;
  location: string;
  description?: string;
  documents?: Document[];
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
}

interface PropertiesResponse {
  message: string;
  data: Property[];
}

interface PropertyResponse {
  message: string;
  data: Property;
}

interface AddRoomsRequest {
  resortId: string;
  rooms: Room[];
  availabilityDates?: AvailabilityDate[];
}

export const propertiesApi = createApi({
  reducerPath: 'propertiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Properties'],
  endpoints: (builder) => ({
    getAdminProperties: builder.query<Property[], void>({
      query: () => ({
        url: '/my-properties',
        method: 'GET',
      }),
      transformResponse: (response: PropertiesResponse) => response.data,
      providesTags: ['Properties'],
    }),
    getPropertyById: builder.query<Property, string>({
      query: (id) => ({
        url: `/my-properties/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: PropertyResponse) => response.data,
      providesTags: (result, error, id) => [{ type: 'Properties', id }],
    }),
    addRooms: builder.mutation<PropertyResponse, AddRoomsRequest>({
      query: ({ resortId, rooms, availabilityDates }) => ({
        url: `/my-properties/${resortId}/rooms`,
        method: 'PUT',
        body: { rooms, availabilityDates },
      }),
      invalidatesTags: (result, error, { resortId }) => [
        { type: 'Properties', id: resortId },
        'Properties',
      ],
    }),
  }),
});

export const {
  useGetAdminPropertiesQuery,
  useGetPropertyByIdQuery,
  useAddRoomsMutation,
} = propertiesApi;