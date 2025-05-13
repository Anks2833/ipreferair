import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	// server: {
	// 	proxy: {
	// 		'/api': {
	// 			// target: 'http://localhost:3000',
	// 			target: 'https://ipreferstay.onrender.com',
	// 			changeOrigin: true,
	// 			secure: false,
	// 		},
	// 	},
	// },
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
