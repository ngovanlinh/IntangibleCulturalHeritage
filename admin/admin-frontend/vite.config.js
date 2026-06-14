import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Đảm bảo dòng này có mặt

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Trỏ trực tiếp đến thư mục src của admin (Backend)
            '@backend': path.resolve(__dirname, '../src')
        },
    },
})