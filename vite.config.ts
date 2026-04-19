import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Esto permite que uses '@/' para referirte a la carpeta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },  
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'src/pages/auth/login/login.html',
        registro: 'src/pages/auth/registro/registro.html', 
        admin: 'src/pages/admin/home/home.html', 
        client: 'src/pages/store/home/home.html', 
        carrito: 'src/pages/store/cart/cart.html', 
      },
    },
  },
});