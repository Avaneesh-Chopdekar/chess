'use client';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import React from 'react';

export default function HomePage() {
  const { user, isLoading } = useProtectedRoute();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Welcome, {user?.name}</div>;
}
