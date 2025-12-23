import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig(({ mode }) => {
  return {
    // Base path for assets (relative for Cloudflare Pages compatibility)
    base: './',

    // Development server configuration
    server: {
      port: 8080,
      open: true,
      strictPort: true // Fail if port 8080 is already in use
    },

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: mode === 'production',
      minify: mode === 'production' ? 'esbuild' : false,

      // Chunk splitting strategy (replaces CommonsChunkPlugin)
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunk for all node_modules
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
          // Asset naming to match Webpack output structure
          chunkFileNames: 'static/js/[name].[hash].js',
          entryFileNames: 'static/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            // CSS files
            if (assetInfo.name.endsWith('.css')) {
              return 'static/css/[name].[hash].[ext]'
            }
            // Images
            if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)) {
              return 'static/img/[name].[hash].[ext]'
            }
            // Fonts
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return 'static/fonts/[name].[hash].[ext]'
            }
            // Default
            return 'static/[name].[hash].[ext]'
          }
        }
      },

      // Target browsers (from browserslist in package.json)
      target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14']
    },

    // Module resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Use full Vue build with template compiler (critical for Vue 2.7)
        vue: 'vue/dist/vue.esm.js'
      },
      extensions: ['.js', '.json', '.vue']
    },

    // Plugin configuration
    plugins: [
      vue({
        // Vue 2 template options
        template: {
          compilerOptions: {
            whitespace: 'condense'
          }
        }
      })
    ],

    // CSS configuration
    css: {
      postcss: './.postcssrc.js',
      devSourcemap: true
    },

    // Vitest configuration (merged from vitest.config.js)
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./test/setup.js'],
      include: ['test/unit/**/*.spec.js', 'test/integration/**/*.spec.js'],
      exclude: ['test/e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{js,vue}'],
        exclude: [
          'node_modules/',
          'test/',
          '*.config.js',
          'dist/',
          'src/main.js',
          'src/router/index.js',
          'src/App.vue'
        ],
        reportsDirectory: './coverage',
        all: true
      }
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['vuetify'] // Loaded via CDN
    }
  }
})
