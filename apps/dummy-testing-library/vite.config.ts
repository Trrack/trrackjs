import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react(),
        viteTsConfigPaths({
            root: '../../',
        }),
    ],
    test: {
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        setupFiles: ['../../test/setup-dom.ts'],
    },
});
