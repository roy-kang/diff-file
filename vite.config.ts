import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    (monacoEditorPlugin as any).default({}) // 确保这里使用的是插件函数
  ],
  build: {
    outDir: './dist'
  },
  server: {
    host: '0.0.0.0',
    port: 8866
  }
})
