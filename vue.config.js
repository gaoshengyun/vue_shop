module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.Node_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        ngprocess: 'NGprocess',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.Node_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
