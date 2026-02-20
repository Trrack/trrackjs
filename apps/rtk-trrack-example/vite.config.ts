/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react(),
        viteTsConfigPaths({
            root: '../../',
        }),
    ],
    server: {
        port: 3001,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
