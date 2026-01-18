import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Vercel Marketplace integration typically sets SUPABASE_URL and SUPABASE_ANON_KEY.
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  return {
    plugins: [react()],
    define: {
      // Strictly expose ONLY the API_KEY to prevent leaking other secrets
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      
      // Define global constants for Supabase to avoid "import.meta.env is undefined" errors
      __SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __SUPABASE_ANON_KEY__: JSON.stringify(supabaseAnonKey),
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', '@heroicons/react', '@google/genai', '@supabase/supabase-js'],
          },
        },
      },
    },
  };
});