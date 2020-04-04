const buildnumgen = require('build-number-generator')
module.exports = {
  chainWebpack: config => {
    config
      .plugin('define')
        .tap(args => {
          let v = JSON.stringify(require('./package.json').version)
          args[0]['process.env']['VUE_APP_VERSION'] = v
          args[0]['process.env']['VUE_APP_BUILD_NUMBER'] = buildnumgen.generate()
          return args
        })
  },
  "transpileDependencies": [
    "vuetify"
  ]
}