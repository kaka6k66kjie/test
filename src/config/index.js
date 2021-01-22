import dev from './config.dev'
import prerelease from './config.prerelease'
import release from './config.release'

const config = {
  dev,
  prerelease,
  release,
}

// 获取当前env环境下的api
const api = config[process.env.VUE_APP_CURRENTMODE].api;

export default {
  // 当前环境
  env: process.env.VUE_APP_CURRENTMODE,

  // 接口地址
  api: {
    index: api.apiHost + '/urp/v7/index/robot-index',
  },

  // 静态资源服务器上地址
  cdn: {
    ...config[process.env.VUE_APP_CURRENTMODE].cdn
  }
}