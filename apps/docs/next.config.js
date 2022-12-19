//@ts-check

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { withNx } = require('@nrwl/next/plugins/with-nx');

// /**
//  * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
//  **/
// const nextConfig = {
//   nx: {
//     // Set this to true if you would like to to use SVGR
//     // See: https://github.com/gregberge/svgr
//     svgr: false,
//   },
// };

// module.exports = withNx(nextConfig);

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
});

module.exports = withNextra();

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
