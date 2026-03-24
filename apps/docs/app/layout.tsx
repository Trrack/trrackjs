import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import '../styles/globals.css';
import {
  banner,
  docsRepositoryBase,
  footer,
  head,
  navbar,
  siteMetadata,
} from '../theme.config';

export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {head}
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase={docsRepositoryBase}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
