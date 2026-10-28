import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import posthog from '@posthog/rollup-plugin';

export default ({ mode }) => {
  process.env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

  return defineConfig({
    plugins: [
      react(),
      posthog({
        personalApiKey: process.env.POSTHOG_API_KEY ?? '',
        projectId: process.env.POSTHOG_PROJECT_ID,
        host: process.env.POSTHOG_HOST,
        sourcemaps: {
          enabled: Boolean(
            process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID,
          ),
          deleteAfterUpload: true,
        },
      }),
    ],
    build: {
      sourcemap: 'hidden',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'https://eventer-ef4v.vercel.app',
          changeOrigin: true,
        },
      },
    },
  });
};
