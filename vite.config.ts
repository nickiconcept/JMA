import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Strictly expose ONLY the API_KEY to prevent leaking other secrets
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      // Increase chunk size warning limit to 1600kb to silence warnings for large vendor files
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', '@heroicons/react', '@google/genai'],
          },
        },
      },
    },
  };
});