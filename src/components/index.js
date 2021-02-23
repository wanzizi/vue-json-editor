import Vue from 'vue'
import vueJsonEditor from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'

const install = function (Vue, options = {}) {
// 判断是否安装
  if (install.installed) return
  Vue.component('vueJsonEditor', vueJsonEditor)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(Vue || window.Vue)
}

export default vueJsonEditor
