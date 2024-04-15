import * as path from 'path';
import { defineConfig } from 'vite';

import { join } from 'path';
import dts from 'vite-plugin-dts';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/core',
    define: {
        'process.env': {},
    },
    plugins: [
        nxViteTsPaths(),
        dts({
            entryRoot: 'src',
            tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
        }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
        outDir: '../../dist/packages/core',
        reportCompressedSize: true,
        commonjsOptions: { transformMixedEsModules: true },
        lib: {
            // Could also be a dictionary or array of multiple entry points.
            entry: 'src/index.ts',
            name: 'core',
            fileName: 'index',
            // Change this to the formats you want to support.
            // Don't forget to update your package.json as well.
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            // External packages that should not be bundled into your library.
            external: ['@reduxjs/toolkit'],
            output: {
                globals: {
                    '@reduxjs/toolkit': 'RTK',
                },
            },
        },
    },
    test: {
        globals: true,
        cache: {
            dir: '../../node_modules/.vitest',
        },
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/packages/core',
            provider: 'v8',
        },
    },
});