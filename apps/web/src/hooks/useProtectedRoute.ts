import { redirect } from 'next/navigation';
import { useGetCurrentUserQuery } from '@/state/users/user-api-slice';

export const useProtectedRoute = () => {
  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

  if (isError || (!user && !isLoading)) {
    redirect('/login');
  }

  return { user, isLoading };
};
