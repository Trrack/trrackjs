import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';
import { head, siteMetadata } from '../theme.config';

export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {head}
      <body>{children}</body>
    </html>
  );
}
