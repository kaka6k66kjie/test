import config from '@/config/index'

let lenMap = { "0": 8, "1": 8, "2": 8, "3": 8, "4": 8, "5": 8, "6": 8, "7": 8, "8": 8, "9": 8, "a": 8, "b": 8, "c": 7, "d": 8, "e": 8, "f": 4, "g": 8, "h": 8, "i": 3, "j": 3, "k": 7, "l": 3, "m": 12, "n": 8, "o": 8, "p": 8, "q": 8, "r": 5, "s": 7, "t": 4, "u": 8, "v": 7, "w": 10, "x": 7, "y": 7, "z": 7, "A": 9, "B": 9, "C": 10, "D": 10, "E": 9, "F": 9, "G": 11, "H": 10, "I": 4, "J": 7, "K": 9, "L": 8, "M": 12, "N": 10, "O": 11, "P": 9, "Q": 11, "R": 10, "S": 9, "T": 9, "U": 10, "V": 9, "W": 13, "X": 9, "Y": 9, "Z": 9, ";": 4, "(": 5, ")": 5, "[": 4, "]": 4, ":": 4, "'": 3, "_": 8, "-": 10, ".": 5, "%": 12, ",": 4, "<": 8, ">": 8, "=": 8, " ": 8 }

export function buryPoint (str) {
  window.hxmClickStat(`${str ? 'thshotlist_iwconf_result_26598.loca0.' + str : 'thshotlist_iwconf_result_26598.loca0'}`)
}

export function backWashFn() {
  let tmpUrl = window.location.protocol + '//eq.10jqka.com.cn/frontend/thsTopRank/index.html#/'
  tmpUrl = window.getPlatform() === 'gphone' ? encodeURIComponent(tmpUrl) : tmpUrl
  backWash.init({
    url: tmpUrl,
    pageStatConfig: {
      pageId: 'share_thshotlist_iwconf_result_26598.loca0',
      extendStatObj: { url_ver: 'SJCGBS-24832' }
    },
    navConfig:{
      openBtn:{
        statId:'share_thshotlist_iwconf_result_26598.loca0.open',
        extendStatObj: { url_ver:'SJCGBS-24832' },
      },
      closeBtn:{
        statId:'share_thshotlist_iwconf_result_26598.loca0.close',
        extendStatObj: { url_ver:'SJCGBS-24832' },
      }
    }         
  })
}

export function createShareInfo () {
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
  try {
    window.registerWebListener("onShow", share);
    share();
    window.callNativeHandler("notifyWebHandleEvent", "");
    window.registerWebHandler('notifyWebHandleEvent', function (data) {
      if (data && data.method === 'HXBottomOptionMenu') {
        if (data.params.type === 'share') {
          // hxmClickStat('djzxg_iwconf.openShare');
        }
        if (data.params.type === 'other' && data.params.name === 'menu') {
          window.callNativeHandler('notifyWebHandleEvent', JSON.stringify({
            method: 'HXBottomOptionMenuShow'
          }));
        }
      }
    });
    window.callNativeHandler("NotifyNativeEventToWeb", "");
    window.registerWebHandler("NotifyNativeEventToWeb", function (data) {
      // 点击分享
      if (data.key === 'share_1') {
        buryPoint(`${window.tableData.maidian}.share`)
      }
      // 取消分享
      if (data.key === 'share_2') {
        buryPoint(`${window.tableData.maidian}.share.cancel`)
      }
      // 分享到具体app
      if (data.key === 'share_3') {
        buryPoint(`${window.tableData.maidian}.success`)
      }
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * 对象操作方法
 */

/**
 * 深拷贝
 * @param obj 待拷贝的对象
 */
export function deepClone (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let clone = JSON.parse(JSON.stringify(obj))
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  if (Array.isArray(obj)) {
    clone.length = obj.length
    return Array.from(clone)
  } else {
    return clone
  }
}

/**
 * 合并对象，如果两个对象key相同，则后面的覆盖前面的，如果相同key的值还是一个字面量对象则继续往下递归
 * 表现请看单元测试用例 
 */
export function merge (obj1, obj2) {
  return [obj1, obj2].reduce(
    (acc, obj) =>
      Object.keys(obj = obj || {}).reduce((_a, k) => {
        acc[k] = acc.hasOwnProperty(k)
          && Object.prototype.toString.call(acc[k]) === '[object Object]'
          && Object.prototype.toString.call(obj[k]) === '[object Object]'
          ? merge(acc[k], obj[k])
          : obj[k]
        return acc
      }, acc),
    {}
  )
}

/**
 * 获取文本内容长度
 * 默认以字体为14px为基准，可以通过传参改变
 * @param {string} text 文本内容
 * @param {int} size 字体尺寸
 * @returns {int} 内容尺寸长度
 */
export function getTextLen (text, size) {
  let textLen = 0
  if (!size) {
    size = 14
  }
  if (typeof text === 'number' || typeof text === 'string') {
    // 过滤不合法的数据
    text = text.toString()
    for (let i = 0; i < text.length; i++) {
      if (lenMap[text[i]]) {
        textLen += lenMap[text[i]] * size / 14
      } else {
        textLen += size
      }
    }
  }
  return textLen
}

/**
 * 根据长度截取文本
 * @param {string} text 文本内容
 * @param {int} width 限制长度
 * @param {int} size 字体大小
 */
export function getTextByWidth (text, width, size) {
  if (width > 0) {
    // 有长度的时候才进行截取
    text = text.toString()
    let max = text.length
    let ret = ''
    let bcWidth = 0
    for (let i = 0; i < max; i++) {
      bcWidth += lenMap[text[i]] * size / 14 || size
      if (bcWidth > width) {
        break
      }
      ret += text[i]
    }

    return ret
  } else {
    return text
  }
}

export function getJgyDta (type) {
  if (window['jgy']) {
    return
  }
  window['jgy'] = true
  return new Promise((resolve) => {
    $.ajax({
      type: 'get',
      url: config.api.index,
      data: {
        // tag: `同花顺热榜_${type}`,
        uuid: getUuid(type),
        userid: window.getUserid(),
        // version: 'v3',
        // logid: `jgy_${new Date().getTime()}`
      },
      dataType: 'json',
      success: (resp) => {
        window['jgy'] = false
        try {
          if (type === '热文') {
            resolve(resp.answer.components[0].data.datas.sort((a, b) => {
              return a['rank'] - b['rank']
            }))
          }
          resolve(resp.answer.components)
        } catch (error) {
          resolve(false)
        }
      },
      error: () => {
        window['jgy'] = false
        resolve(false)
      }
    })
  })
}

// export function getNewsDetails (newsIdArr) {
//   let newsString = []
//   newsIdArr.forEach(item => newsString.push(item['文章ID']))
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       type: 'get',
//       url: config.api.index,
//       data: {
//         uuid: 28747,
//         pid: newsString.join(','),
//       },
//       dataType: 'json',
//       success: (resp) => {
//         resolve(resp.answer.components[0])
//       }
//     })
//   })
// }

export function getFundMoreData (page, vim) {
  if (window['fund']) {
    return
  }
  window['fund'] = true
  let filter = JSON.stringify({
    offset: (page - 1) * 20,
    limit: 20,
    sort: [
      ['list_rank_1d', 'ASC']
    ],
    where: {
      list_rank_1d: {
        $lte: 200
      },
      class_name: {
        $eq: '人气'
      }
    }
  })
  // let filter = `{offset: ${page * 20}, limit: 20, sort: [[list_rank_1d, ASC]], where: { list_rank_1d: { $lte: 100 }, }}`
  $.ajax({
    type: 'get',
    url: config.api.index,
    data: {
      uuid: getUuid('热基'),
      userid: window.getUserid(),
      filter
    },
    dataType: 'json',
    success: (resp) => {
      let { body } = resp.answer.components[0].data.datas[0]
      let fundData = body.map((item) => {
        return {
          '基金简称': item[3],
          '基金代码': item[4],
          type: item[1],
          '涨跌幅': item[2],
          '基金净值': item[0]
        }
      })
      vim.tableData.data = vim.tableData.data.concat(fundData)
      if (vim.tableData.data.length >= 100 || fundData.length === 0) {
        vim.isShowMore = false
      }
      vim.isLoading = false
      window['fund'] = false
    },
    error: () => {
      vim.isLoading = false
      vim.isShowMore = false
      vim.needDoudi = false
      window['fund'] = false
    }
  })
}

export function getConMoreData (url, vim) {
  $.ajax({
    type: 'get',
    url,
    dataType: 'json',
    success: (result) => {
      try {
        if (result.status_code === '0' && result.answer.components[0].data.datas.length > 0) {
          vim.isLoading = false
          let codeArr = []
          let resData = result.answer.components[0].data.datas
          resData.forEach(item => {
            codeArr.push(item.code)
            vim.$hqData.addStockSub(item.code, item.market_code)
          })
          vim.tableData.data = vim.tableData.data.concat(resData)
          getRepingDta(codeArr.join(','), (res) => {
            vim.$parent.repingObj = {...vim.$parent.repingObj, ...res}
          })
          if (vim.tableData.data.length >= 100) {
            vim.tableData.data = vim.tableData.data.slice(0, 100)
            vim.isShowMore = false
          }
        }
      } catch (error) {
        vim.isShowMore = false
      }
    },
    error: () => {
      vim.isLoading = false
      vim.isShowMore = false
      vim.needDoudi = false
    }
  })
}

export function getStockMoreData (url, vim) {
  $.ajax({
    type: 'get',
    url,
    dataType: 'json',
    success: (result) => {
      try {
        if (result.status_code === '0' && result.answer.components[0].data.datas.length > 0) {
          vim.isLoading = false
          let resData = result.answer.components[0].data.datas
          resData.forEach(item => {
            vim.$hqData.addStockSub(item["股票代码"], item.market_code)
          })
          let res = resData.map(item => {
            return merge(item, vim.saveData.find(temp => temp["股票代码"] === item["股票代码"]))
          })
          vim.tableData.data = vim.tableData.data.concat(res)
          if (vim.tableData.data.length >= 100) {
            vim.tableData.data = vim.tableData.data.slice(0, 100)
            vim.isShowMore = false
          }
        }
      } catch (error) {
        vim.isShowMore = false
      }
    },
    error: () => {
      vim.isLoading = false
      vim.isShowMore = false
      vim.needDoudi = false
    }
  })
}

// 获得论股堂热评接口
export function getRepingDta (codeStr, callback) {
  // return new Promise((resolve) => {
    $.ajax({
      type: 'get',
      url: config.api.index,
      data: {
        uuid: 28742,
        codes: codeStr,
        userid: window.getUserid()
      },
      dataType: 'json',
      success: (resp) => {
        try {
          let res = resp.answer.components[0].data.datas[0].result
          if (typeof res === 'object') {
            callback(res)
          } else {
            return false
          }
        } catch (error) {
          return false
        }
      },
      error: () => {
        return false
      }
    })
  // })
}

function getUuid (type) {
  switch (type) {
    case '热股':
      return 28764
    case '热股2':
      return 28743
    case '热评':
      return 28741
    case '热文':
      return 28747
    case '热基':
      return 26624
  }
}

function getNewsString (newsId, newsType) {
  let type = ''
  switch (newsType) {
    case 'news':
    case 'copynews':
      type = 1
      break
    case 'snslivepost':
      type = 8
      break
    case 'pkgnote':
      type = 17
  }
  return `${type}_${newsId},`
}
