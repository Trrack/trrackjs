/// <reference types="vitest" />
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        viteTsConfigPaths({
            root: '../../',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.ts'],
    },
});
