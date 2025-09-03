'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  useLogoutMutation,
  useGetCurrentUserQuery,
} from '@/state/users/user-api-slice';
import { useEffect } from 'react';

export default function Navbar() {
  const [logoutMutation, { isLoading, isError }] = useLogoutMutation();
  const { data: currentUser } = useGetCurrentUserQuery();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    console.log(currentUser);
  }, [currentUser]);

  if (isError) {
    toast.error('An error occurred while logging out. Please try again.');
  }

  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = await cookieStore.get('refreshToken');
    if (!refreshToken?.value) {
      toast.error('No refresh token found. Please log in again.');
      localStorage.removeItem('accessToken');
      router.replace('/login');
      return;
    }
    logoutMutation({ refreshToken: refreshToken?.value })
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        cookieStore.delete('refreshToken');
        localStorage.removeItem('accessToken');
        router.replace('/login');
      })
      .catch((error) => console.log(error));
  };

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Chess</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {currentUser ? (
          <>
            <p className="pr-4">{currentUser.name}</p>
            <button className="btn" onClick={handleLogout} disabled={isLoading}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => router.push('/login')}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
