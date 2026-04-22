import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteToml } from 'vite-plugin-toml';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

import Icons from 'unplugin-icons/vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: "/BetterTaskies/",
  plugins: [
    tailwindcss(),
    svelte(), // <-- Must come after Tailwind
    ViteToml(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide'
    }),
    Icons({
      defaultStyle: 'width: calc(var(--spacing) * 8); height: calc(var(--spacing) * 8);',
      compiler: 'svelte',
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
      // Generates 'manifest.webmanifest' file on build
      manifest: {
        name: 'Better Taskies',
        short_name: 'Better Taskies',
        start_url: '/BetterTaskies/',
        display: 'standalone',
        description: 'A simple to do app with your personal Yrellis assistant.',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'images/icons/icon-48.webp',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-72.webp',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-96.webp',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-128.webp',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-192.webp',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-256.webp',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'images/icons/icon-512.webp',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        "screenshots": [
          // Mobile
          {
            "src": "images/screenshots/narrow1.png",
            "sizes": "1080x2300",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Daily Taskies"
          },
          // Desktop
          {
            "src": "images/screenshots/wide1.png",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Daily Taskies"
          },
        ],
      }
    }),
  ],
  resolve: {
    alias: [
      { find: '@/*', replacement: resolve(__dirname, 'src') },
      { find: '@styles', replacement: resolve(__dirname, './src/styles') },
      { find: '@assets', replacement: resolve(__dirname, './src/assets') },
    ]
  },
})
