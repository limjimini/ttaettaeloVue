const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'C:/Users/TANINE/Desktop/spring/ttaettaelo/src/main/resources/static',
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
