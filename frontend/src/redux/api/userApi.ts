import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/authSlice";
import { User } from "@/types/user-i-t";
import { getApiUrl } from "@/helpers/getApiUrl";

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

interface UploadAvatarRequest {
  avatar: FormData; // For file uploads
}

interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordRequest {
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "user" | "admin" | "super_admin";
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  user?: User;
}

interface AdminUsersResponse {
  success: boolean;
  users: User[];
}

type UserTag = "User" | "AdminUsers" | "AdminUser";
const API_URL = getApiUrl()
console.log(API_URL,'APi url');

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1`,
    credentials: "include",
  }),
  tagTypes: ["User", "AdminUsers", "AdminUser"] as UserTag[],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/me",
      transformResponse: (result: ApiResponse<User>) => result.user!,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.error("GetMe error:", error);
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, UpdateProfileRequest>({
      query: (body) => ({
        url: "/me/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation<ApiResponse<User>, UploadAvatarRequest>({
      query: (body) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<ApiResponse<void>, UpdatePasswordRequest>({
      query: (body) => ({
        url: "/password/update",
        method: "PUT",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<void>,
      { token: string; body: ResetPasswordRequest }
    >({
      query: ({ token, body }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/password/forgot",
        method: "POST",
        body,
      }),
    }),
    getAdminUsers: builder.query<AdminUsersResponse, void>({
      query: () => "/admin/users",
      providesTags: ["AdminUsers"],
    }),
    getUserDetails: builder.query<ApiResponse<User>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUser"],
    }),
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; body: UpdateUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

// Export typed hooks
export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
