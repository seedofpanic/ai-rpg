import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), viteCompression()],
  server: {
    open: true,
  },
});
