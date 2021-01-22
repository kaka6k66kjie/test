# thsTopRank

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
.
├── README.md
├── build                   # build 脚本
├── config                  # prod/dev build config 文件
├── index.html              # 最基础的网页
|—— babel.config.js         # ES 语法兼容性配置文件
├── package.json
├── src                     # Vue.js 核心业务
│   ├── App.vue             # App Root Component
│   ├── api                 # 接入后端服务的基础 API
│   ├── assets              # 静态文件
│   ├── components          # 组件
│   ├── main.js             # Vue 入口文件
│   ├── router              # 路由
│   ├── service             # 服务  处理服务端返回的数据（类似data format），例如 service 同时调用了不同的api，把不
|   |                        同的返回数据整合在一起在统一发送到 store 中
│   ├── store               # Vuex 状态管理
│   ├── util                # 存放项目全局的工具函数，mixin 还有绑定到 Vue.prototype 的函数
│   └── view                # 各个页面
├── static                  # DevServer 静态文件
└── test                    # 测试