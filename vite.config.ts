import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import qrcode from 'qrcode-terminal'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function qrcodePlugin(): Plugin {
  const printQr = (url?: string) => {
    if (url) {
      console.log('\n' + '='.repeat(48))
      console.log('📱 스마트폰(동일 Wi-Fi) 카메라로 스캔하여 바로 접속:')
      qrcode.generate(url, { small: true })
      console.log(`🔗 직접 입력 접속 주소: ${url}`)
      console.log('='.repeat(48) + '\n')
    }
  }

  return {
    name: 'vite-plugin-qrcode',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          printQr(server.resolvedUrls?.network?.[0])
        }, 300)
      })
    },
    configurePreviewServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          printQr(server.resolvedUrls?.network?.[0])
        }, 300)
      })
    },
  }
}

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    basicSsl(),
    qrcodePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: '내 차 어디에?',
        short_name: '주차 위치',
        description: '사진과 메모로 내 차의 주차 위치를 기록합니다.',
        theme_color: '#174d40',
        background_color: '#f9fbfa',
        display: 'standalone',
        lang: 'ko',
        start_url: base,
        scope: base,
        icons: [{
          src: `${base.replace(/\/$/, '')}/pwa-icon.svg`,
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        }],
      },
    }),
  ],
})
