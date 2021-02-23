module.exports = {
  productionSourceMap: false,
  css: {
    // 是否开启 CSS source map？
    sourceMap: false
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = ['element-ui', 'vue']
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8068,
    https: false,
    hotOnly: false
  }
}
