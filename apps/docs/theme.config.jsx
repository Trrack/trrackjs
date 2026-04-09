import { Banner, Head, Search } from 'nextra/components';
import { Footer, Navbar } from 'nextra-theme-docs';

import { HeaderNav } from './components/HeaderNav';
import styles from './content/index.module.css';

export const siteMetadata = {
  title: {
    default: 'Trrack',
    template: '%s - Trrack',
  },
  description: 'The provenance tracking library for web.',
};

export const head = (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      property="og:description"
      content="The provenance tracking library for web."
    />
  </Head>
);

export const navbar = (
  <Navbar
    logo={
      <h1>
        <span>trrack</span> - A library for{' '}
        <span className={styles['highlight-logo']}>r</span>
        eproducible <span className={styles['highlight-logo']}>track</span>ing
      </h1>
    }
    projectLink="https://github.com/Trrack/trrackjs"
  />
);

export const search = (
  <div className="x:flex x:items-center x:gap-4 x:max-md:hidden">
    <HeaderNav />
    <Search />
  </div>
);

export const docsRepositoryBase =
  'https://github.com/Trrack/trrackjs/tree/main/apps/docs';

export const banner = (
  <Banner storageKey="2.0-release">
    <a
      href="http://vdl.sci.utah.edu/trrack/"
      target="_blank"
      rel="noreferrer"
    >
      This is documentation for <strong>Trrack 2.0</strong>.{' '}
      <strong>Click here</strong> for legacy Trrack documentation →
    </a>
  </Banner>
);

export const footer = (
  <Footer>
    <span>
      BSD 3 {new Date().getFullYear()} ©{' '}
      <a href="https://github.com/Trrack" target="_blank" rel="noreferrer">
        The Trrack Team
      </a>
      .
    </span>
  </Footer>
);
