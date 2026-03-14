import { defineConfig } from 'vitest/config';

import { join } from 'path';
import dts from 'vite-plugin-dts';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    cacheDir: '../../node_modules/.vite/core',
    define: {
        'process.env': {},
    },
    plugins: [
        dts({
            tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
            // Faster builds by skipping tests. Set this to false to enable type checking.
            skipDiagnostics: true,
        }),

        viteTsConfigPaths({
            root: '../../',
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
        sourcemap: true,
        lib: {
            entry: 'src/index.ts',
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['@reduxjs/toolkit', 'fast-json-patch', 'uuid'],
        },
    },

    test: {
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            all: true,
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            reportsDirectory: '../../coverage/core',
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/*.d.ts'],
        },
    },
});
