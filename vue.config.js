const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    publicPath: process.env.NODE_ENV === 'production' ? '/NFT-DApp/' : '/',
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        protocol: process.env.WSS_PROTOCOL || 'wss',
        hostname: process.env.WEB_SOCKET_HOST || 'localhost',
        port: process.env.WEB_SOCKET_PORT || '8080',
        pathname: '/ws',
      },
    },
  }
})
