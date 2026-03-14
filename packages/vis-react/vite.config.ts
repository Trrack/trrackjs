/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { join } from 'path';
import dts from 'vite-plugin-dts';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const externalPackages = [
    'react',
    'react-dom',
    'react-dom/client',
    '@trrack/core',
    'd3',
    'react-spring',
    '@mantine/core',
    '@mantine/hooks',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/react-fontawesome',
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
            name: 'TrrackVisReact',
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: (id) =>
                externalPackages.includes(id) ||
                id.startsWith('@fortawesome/free-solid-svg-icons/'),
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react-dom/client': 'ReactDOMClient',
                    d3: 'd3',
                    '@trrack/core': 'Trrack',
                    'react-spring': 'ReactSpring',
                    '@mantine/core': 'MantineCore',
                    '@mantine/hooks': 'MantineHooks',
                    '@fortawesome/react-fontawesome': 'FontAwesomeReact',
                    '@fortawesome/free-solid-svg-icons/faEdit':
                        'FontAwesomeFaEdit',
                    '@fortawesome/free-solid-svg-icons/faBookmark':
                        'FontAwesomeFaBookmark',
                },
            },
        },
    },
    test: {
        globals: true,
        cache: {
            dir: '../../node_modules/.vitest',
        },
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
});
