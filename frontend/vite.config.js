import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  const publicWebUrl = env.VITE_PUBLIC_WEB_HOST || ''
  const url = publicWebUrl ? new URL(publicWebUrl) : null
  const publicHost = url ? url.hostname : undefined
  const isHttps = url ? url.protocol === 'https:' : false

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,

      allowedHosts: publicHost ? [publicHost] : [/\.ngrok-free\.app$/],

      origin: publicWebUrl || undefined,

      hmr: publicHost
        ? {
            host: publicHost,
            clientPort: 443,
            protocol: isHttps ? 'wss' : 'ws'
          }
        : undefined,

      cors: true,
    },
  }
})
