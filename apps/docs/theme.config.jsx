import { useRouter } from 'next/router';

import styles from './pages/index.module.css';

const theme = {
  logo: (
    <h1>
      <span>trrack</span> - A library for{' '}
      <span className={styles['highlight-logo']}>r</span>
      eproducible <span className={styles['highlight-logo']}>track</span>ing
    </h1>
  ),
  project: {
    link: 'https://github.com/Trrack/trrackjs',
  },
  docsRepositoryBase: 'https://github.com/Trrack/trrackjs/tree/main/apps/docs',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        property="og:description"
        content="The provenance tracking library for web."
      />
    </>
  ),
  useNextSeoProps() {
    const { route } = useRouter();
    if (route !== '/' && route !== '/docs')
      return {
        titleTemplate: '%s - Trrack',
      };
  },
  chat: {
    link: 'https://github.com/kirangadhave/',
    icon: 'Get in touch',
  },
  banner: {
    key: '2.0-release',
    text: (
      <a
        href="http://vdl.sci.utah.edu/trrack/"
        target="_blank"
        rel="noreferrer"
      >
        🎉 This is documentation for <strong>Trrack 2.0</strong>.{' '}
        <strong>Click here</strong> for legacy Trrack documentation →
      </a>
    ),
  },
  footer: {
    text: (
      <span>
        BSD 3 {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/Trrack" target="_blank" rel="noreferrer">
          The Trrack Team
        </a>
        .
      </span>
    ),
  },
};

export default theme;
