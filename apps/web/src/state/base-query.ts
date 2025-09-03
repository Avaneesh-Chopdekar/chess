import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RefreshResponse } from '@/types/dto/refresh';

export const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  prepareHeaders: async (headers, { getState }) => {
    const accessToken = localStorage.getItem('accessToken'); // Or from Redux state
    const refreshToken = await cookieStore.get('refreshToken');
    const token = refreshToken?.value || '';
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
      headers.set('x-refresh-token', token);
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
