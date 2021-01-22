/**
 * @description 响应式行情数据
 * @author panhailiang
 * @usage
 * 1. main.js
 *   import HQObserver from '@/lib/HQObserver';
 *   // 注册 Vue 插件
 *   Vue.use(HQObserver)
 *
 * 2. Vue 组件中
 *   <template>
 *     <!-- 模板渲染读取数据时完成依赖收集，数据变化时 DOM 自动更新 -->
 *     <div>
 *       <p>现价：{{$hqData[300033].price}}</p>
 *       <p>涨幅：{{$hqData[300033].chg}}</p>
 *     </div>
 *   </template>
 *   <script>
 *   export default {
 *     created() {
 *       // 模板渲染前添加该股票
 *       // 执行后 Vue.prototype.$hqData[300033] 为响应式属性
 *       this.$hqData.addStockSub(300033, 17);
 *     }
 *   }
 *   </script>
 * @tips
 * - 模板渲染前调用 add 添加股票代码
 * - 行情数据会被初始化为 '--' 注意数据处理时 NaN 的情况
 */

let _Vue;
// 已添加监听股票列表
const stocks = new Set();
// 响应式股票行情数据
let reactiveStocks = {};

/**
 * 注册 Vue 全局属性 $hqData
 * @param {any} Vue
 */
export default function HQObserver(Vue) {
  if (_Vue) {
    return;
  }
  _Vue = Vue;

  reactiveStocks = _Vue.observable(reactiveStocks);

  _Vue.prototype.$hqData = reactiveStocks;
  _Vue.prototype.$hqData.addStockSub = addStockSub;
}

let HQConnectionDebounceTimer;
/**
 * 添加行情股票订阅
 * @param {string | number} stockCode
 * @param {string | number} marketId
 */
function addStockSub(stockCode, marketId) {
  stockCode = `${stockCode}`;
  marketId = `${marketId}`;
  if (stocks.has(stockCode)) {
    return false;
  }
  stocks.add(stockCode);
  // 初始化行情数据
  _Vue.set(reactiveStocks, stockCode, {
    marketId,
    price: '--', // 现价
    chg: '--', // 涨幅
  })
  if (HQConnectionDebounceTimer) {
    clearTimeout(HQConnectionDebounceTimer);
  }
  HQConnectionDebounceTimer = setTimeout(openHQDataConnection.bind(null, stocks), 500)
}

/**
 * 与客户端建立行情数据连接
 * @param {Array<{marketId: string; price: string; chg: string; closePrice: string;}>} stocks
 */
function openHQDataConnection(stocks) {
  // [现价, 涨幅]
  const columOrder = ['10', '34818'];
  const stockList = [];
  const marketList = [];
  for (const code of stocks) {
    const { marketId } = reactiveStocks[code];
    stockList.push(code);
    marketList.push(marketId);
  }
  disConnectHQ();
  registerWebHandlerForStock({
    columOrder,
    stockList,
    marketList
  }, function(HQRes) {
    const {
      '10': price,
      '34818': chg,
    } = HQRes;
    for (let i = 0; i < stockList.length; i++) {
      const stockCode = stockList[i];
      const curStockData = reactiveStocks[stockCode] || {};
      _Vue.set(reactiveStocks, stockCode, {
        marketId: curStockData.marketId,
        price: price[i],
        chg: chg[i],
      })
    }
  })
}

let hasRegister = false;
let hasSetHideOrShow = false;

let mockConnectionInterval;

//实时请求股票行情数据
//注册事件
function registerWebHandlerForStock(param, cb, type) {
  // MOCK
  if (!getAppVersion()) {
    mockConnectionInterval && clearInterval(mockConnectionInterval);
    mockConnectionInterval = setInterval(() => {
      const price = param.stockList.map(_ => parseFloat(Math.random() * 100).toFixed(2))
      const chg = param.stockList.map(_ => parseFloat(Math.random() * 10 - 5).toFixed(2))
      cb && cb({
        10: price,
        34818: chg,
      })
    }, 2000);
  }

  var isOnce = (type == "once")

  if (!hasRegister) { //未注册
    hasRegister = true;
    if (getPlatform() == "gphone") {
      var columnOrderStr = param.columOrder.join('|');
      var stockStr = param.stockList.join('|');
      var marketStr = param.marketList.join('|');

      var ajaxParam = {
        protocolId: isOnce ? "1264" : "1201",
        pageId: "9001",
        requestDic: 'startrow=0\r\nrowcount=' + param.stockList.length +
            '\r\nsortid=-1\r\ncolumnorder=' + columnOrderStr +
            '\r\nnewrealtime=' + (isOnce ? "1" : "0") + '\r\nselfstockcustom=1\r\nstocklist=' + stockStr +
            '\r\nmarketlist=' + marketStr
      }
      var ajaxParamStr = JSON.stringify(ajaxParam);

      if (isOnce) {
        callNativeHandler('UnifiedRequestBridge', ajaxParamStr, function (data) {
          if (data.body && data.body.dataDict) {
            data = JSON.parse(data.body.dataDict);
            typeof cb == 'function' && cb(data);
          }
        });
      } else {
        registerWebHandler('UnifiedRequestBridge', function (data) {
          if (data.body && data.body.dataDict) {
            data = JSON.parse(data.body.dataDict);
            typeof cb == 'function' && cb(data);
          }
        });
        callOnlineHandler('UnifiedRequestBridge', 'theOne', ajaxParamStr);
      }
    } else {
      //注册事件
      callNativeHandler(
          'getHQ', {
            columnorder: param.columOrder, // 现价 涨跌幅 涨跌额
            stocklist: param.stockList, //股票代码列表
            marketlist: param.marketList //市场id类别
          }
      );

      //注册获取行情
      registerWebHandler(
          'getHQ',
          function (data) {
            if (data.method == 'normal') {
              if (data.data) {
                data = data.data;
                typeof cb == 'function' && cb(data);
                if (isOnce) {
                  disConnectHQ();
                }
              }
            }
          }
      );
    }
  } else { //已注册
    disConnectHQ(function () {
      registerWebHandlerForStock(param, cb);
    });
  }

  if (!hasSetHideOrShow) {
    let url = window.location.href
    let title = '同花顺热榜'
    let content = '聚集千万人投资动向，把握权威财富热点。来同花顺查看最新股市热榜'
    const share = () => {
      window.callNativeHandler('notifyWebHandleEvent', {
        method: 'HXBottomOptionMenu',
        params: {
          show: 1,
          optionConfig: {
            shareInfo: {
              url,
              title,
              content
            },
            func: ['feedback', 'fankui', 'report', 'font']
          }
        }
      })
    }
    hasSetHideOrShow = true;
    registerWebListener('onShow', function () {
      share();
      registerWebHandlerForStock(param, cb);
    });

    registerWebListener('onHide', function () {
      disConnectHQ(); //断开
    });
  }
}

//通知客户端关闭行情
function disConnectHQ(callback) {
  if (getPlatform() == 'gphone') {
    clearOnlineHandler(['theOne']);
    hasRegister = false;
    (typeof callback == "function") && (callback());
  } else {
    callNativeHandler(
        'getHQ', {
          method: 'disconnect'
        },
        function (data) {
          hasRegister = false;
          (typeof callback == "function") && (callback());
        }
    );
  }
}

function callOnlineHandler(action, id, param) {
  !id && (id = "theOne");
  webJSHandlerfnDone('callOnlineHandler', function (cb) {
    cb(action, id, param);
  });
}

function clearOnlineHandler(id) {
  if (!id && typeof id != 'number') {
    return;
  }
  webJSHandlerfnDone('clearOnlineHandler', function (cb) {
    cb(id);
  });
}

function webJSHandlerfnDone(fnName, cb) {
  if (typeof WebViewJavascriptBridge == 'object') {
    typeof WebViewJavascriptBridge[fnName] == "function" && cb(WebViewJavascriptBridge[fnName]);
  } else {
    document.addEventListener(
        'WebViewJavascriptBridge',
        function () {
          typeof WebViewJavascriptBridge[fnName] == "function" && cb(WebViewJavascriptBridge[fnName]);
        }, false);
  }
}
