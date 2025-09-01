import './global.css';

export const metadata = {
  title: 'Welcome to Chess Game',
  description: 'Real-time multiplayer chess game with chat and video call features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
