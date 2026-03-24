import { fileURLToPath } from 'node:url';
import nextra from 'nextra';

const withNextra = nextra({});

export default withNextra({
  output: 'export',
  basePath: '/trrackjs',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: fileURLToPath(new URL('../..', import.meta.url)),
  },
});
