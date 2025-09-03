import Link from 'next/link';
import React from 'react';

export default function LandingPage() {
  return (
    <main className="h-svh flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://media.chesskidfiles.com/images/user/tiny_mce/GrandpaRayNC/chessboard%20setup%20correctly%20with%20all%20pieces_f82a7.png"
        alt="Chess Board Image"
        className="w-1/2 sm:w-1/4 aspect-square border-4 border-blue-500"
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold text-blue-500">Chess Game</h1>
        <Link
          href="/login"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 active:bg-blue-900 transition-colors duration-300 text-white font-bold py-2 px-4 rounded text-center"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
