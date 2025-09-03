import { createApi } from '@reduxjs/toolkit/query/react';
import User, { UserRequest } from '@/types/user';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
} from '@/types/dto';
import { authenticatedBaseQuery } from '../base-query';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: authenticatedBaseQuery,
  endpoints: (builder) => {
    return {
      register: builder.mutation<User, UserRequest>({
        query: (user) => ({
          url: '/user/register',
          method: 'POST',
          body: user,
        }),
      }),
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (request) => ({
          url: '/user/login',
          method: 'POST',
          body: request,
        }),
      }),
      refresh: builder.mutation<LoginResponse, LoginRequest>({
        query: (request) => ({
          url: '/user/refresh',
          method: 'POST',
          body: request,
        }),
      }),
      logout: builder.mutation<LogoutResponse, LogoutRequest>({
        query: (request) => ({
          url: '/user/logout',
          method: 'POST',
          body: request,
        }),
      }),
      getCurrentUser: builder.query<User, void>({
        query: () => '/user/me',
      }),
      deleteUser: builder.mutation<void, void>({
        query: () => ({
          url: '/user/me',
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useDeleteUserMutation,
} = userApi;

export const { endpoints: userApiEndpoints } = userApi;
