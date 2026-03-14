import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { join } from 'path';
import dts from 'vite-plugin-dts';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const externalPackages = [
    'react',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-dom',
    'react-dom/client',
    '@trrack/core',
];

export default defineConfig({
    cacheDir: '../../node_modules/.vite/vis-react',
    plugins: [
        dts({
            tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
            entryRoot: 'src',
            insertTypesEntry: true,
            skipDiagnostics: true,
        }),
        react(),
        viteTsConfigPaths({
            root: '../../',
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: 'src/index.ts',
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: (id) => externalPackages.includes(id),
        },
    },
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        setupFiles: ['../../test/setup-dom.ts'],
        coverage: {
            all: true,
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            reportsDirectory: '../../coverage/vis-react',
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/*.d.ts'],
        },
    },
});
