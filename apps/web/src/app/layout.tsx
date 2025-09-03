import Providers from '@/components/providers';
import './global.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const fontSans = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Welcome to Chess Game',
  description:
    'Real-time multiplayer chess game with chat and video call features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-svh h-full scroll-smooth antialiased bg-neutral-50 text-neutral-950 ${fontSans.className}`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
