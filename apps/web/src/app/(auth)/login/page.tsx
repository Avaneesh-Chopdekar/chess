'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import {
  useGetCurrentUserQuery,
  useLoginMutation,
} from '@/state/users/user-api-slice';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation, { error, isLoading }] = useLoginMutation();
  const { data: user } = useGetCurrentUserQuery();

  if (user) {
    redirect('/home');
  }

  if (error) {
    toast.error('An error occurred. Please try again.');
    console.error('Registration error:', error);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation({ email, password })
      .unwrap()
      .then((data) => {
        toast.success('Logged in successfully');
        localStorage.setItem('accessToken', data.accessToken);
        cookieStore.set('refreshToken', data.refreshToken);
        redirect('/home');
      })
      .catch((error) => console.log(error));
  }

  function handleReset() {
    setEmail('');
    setPassword('');
  }
  return (
    <main className="flex justify-center items-center h-svh">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome Back!</h2>
            <p className="text-sm text-base-content">
              Login with your account to start playing
            </p>
            <div className="form-control">
              <label
                className="label validator flex flex-col items-start"
                htmlFor="email"
              >
                <span className="label-text">Email</span>
                <input
                  type="email"
                  id="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>
            <div className="form-control">
              <label
                className="label validator flex flex-col items-start"
                htmlFor="password"
              >
                <span className="label-text">Password</span>
                <input
                  type="password"
                  id="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                />
              </label>
              <div className="validator-hint hidden">
                Password must be at least 8 characters long <br />
                and must contain at least <br />
                one uppercase letter <br />
                one lowercase letter <br />
                one special character <br />
                and one number
              </div>
            </div>
            <div className="mt-4 card-actions justify-end">
              <button type="reset" className="btn btn-secondary btn-outline">
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
