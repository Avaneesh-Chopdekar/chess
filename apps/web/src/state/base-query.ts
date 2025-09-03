import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RefreshResponse } from '@/types/dto/refresh';

export const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('accessToken'); // Or from Redux state
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
export const authenticatedBaseQuery: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Unauthorized, possibly token expired
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        { url: '/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      );

      if (
        refreshResult.data &&
        typeof (refreshResult.data as RefreshResponse).accessToken === 'string'
      ) {
        localStorage.setItem(
          'accessToken',
          (refreshResult.data as { accessToken: string }).accessToken,
        );
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Handle refresh token failure (e.g., redirect to login)
        window.location.href = '/login';
      }
    }
  }
  return result;
};
