module.exports = {
  // 通过chainWebpack自定义打包入口
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => { // 发布模式
      config.entry('app').clear().add('./src/main-prod.js')
      // 通过 externals 加载外部资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: 'lodash',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })

    config.when(process.env.NODE_ENV === 'development', config => { // 开发模式
        config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}