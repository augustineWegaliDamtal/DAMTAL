import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',   // 👈 Your backend server
        changeOrigin: true,                // 🔐 Ensures token headers forward properly
        secure: false                      // 🧪 Needed for HTTP in local dev
      }
    }
  },
  optimizeDeps: {
    include: [
      'ag-grid-react',
      'ag-grid-community'
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ]
});
