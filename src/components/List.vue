<template>
  <div>
    <div class="List_tab">
      <div class="List_tabItem" v-for="(item, index) in tabList" :key="item.logid" @click="changeTab(index)">
        <span class="font" :class="nowTabIndex === index ? 'highLight' : ''">{{item.name}}</span>
      </div>
    </div>
    <ListTable :componentData="tabList[nowTabIndex]" :saveData="saveData" :reguType="reguType" :repingObj="repingObj" :newsData="newsData" :outerDoudi="outerDoudi"></ListTable>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
import { deepClone, merge, getJgyDta, getRepingDta, buryPoint } from '@/lib/tools'

export default {
  data () {
    return {
      tabList: [
        {
          name: '热股',
          type: '1小时',
          maidian: 'regu',
          data: [],
          logid: 123,
          topContent: {
            '1小时': '根据个股搜索指数排序，五分钟更新',
            '24小时': '根据个股搜索指数排序，每小时更新'
          },
          useHours: true
        },
        {
          name: '热评',
          maidian: 'reping',
          data: [],
          logid: 666,
          topContent: '根据个股社区热度排序，五分钟更新'
        },
        {
          name: '热文',
          maidian: 'rewen',
          data: [],
          logid: 789,
          topContent: '根据阅读、点赞、评论等数据排序，五分钟更新'
        },
        {
          name: '热基',
          maidian: 'reji',
          data: [],
          logid: 999,
          topContent: '根据加自选数据排序，每日更新',
        }
      ],
      reguType: '1小时',
      repingObj: {},
      nowTabIndex: 0,
      saveData: [],
      newsData: [],
      outerDoudi: false
    };
  },
  components: {
    ListTable
  },
  methods: {
    async changeTab (index, type, noBury, first) {
      if (window.isClick) {
        return false
      }
      if (this.nowTabIndex === index && this.reguType === type && !first) {
        return
      }
      window.isClick = true
      this.outerDoudi = false
      let { name, maidian } = this.tabList[index]
      if (window.scrollY >= 90) {
        $(window).scrollTop(90)
      }
      this.nowTabIndex = index
      if (type) {
        this.tabList[0].data = []
        this.reguType = type
      }
      if (!noBury) {
        buryPoint(`${maidian}`)
      }
      if (name === '热股' && this.reguType === '1小时') {
        name = '热股2'
      }
      let data = await getJgyDta(name)
      let res = {}
      try {
        if (name === '热股2') {
          res = deepClone(data[0])
          this.saveData = data[1].data.datas
          res.data.datas.forEach(item => {
            this.$hqData.addStockSub(item["股票代码"], item.market_code)
          })
          res.data.datas = res.data.datas.map((item, index) => {
            let reDate = merge(item, data[1].data.datas.find(j => j["股票代码"] === item["股票代码"]))
            reDate["最新涨跌幅"] = reDate["最新涨跌幅"] || ''
            reDate["最新价"] = reDate["最新价"] || ''
            return reDate
          })
          res.config.display = data[1].config.display
          this.tabList[index].data = res
        }
        if (name === '热股') {
          res = deepClone(data[0])
          res.data.datas.forEach(item => {
            this.$hqData.addStockSub(item["股票代码"], item.market_code)
          })
          this.tabList[index].data = res
        }
        if (name === '热评') {
          let codeArr = []
          res = deepClone(data[0])
          res.data.datas.forEach(item => {
            codeArr.push(item.code)
            this.$hqData.addStockSub(item.code, item.market_code)
          })
          getRepingDta(codeArr.join(','), (res) => {
            this.repingObj = res
          })
        }
        if (name === '热基') {
          res = deepClone(data[0])
          let { body } = data[0].data.datas[0]
          let fundData = body.map((item) => {
            return {
              '基金简称': item[3],
              '基金代码': item[4],
              type: item[1],
              '涨跌幅': item[2],
              '基金净值': item[0]
            }
          })
          res.data.datas = fundData
        }
        if (name === '热文') {
          // 添加涨跌幅
          data.forEach(item => {
            let stockInfoArr = []
            if (item.stockInfo && item.stockInfo.length > 0) {
              item.stockInfo.forEach((i,j) => {
                if (i && i.stockZdf) {
                  stockInfoArr.push(i)
                }
              })
              item.stockInfo = stockInfoArr
            } else {
              item.stockInfoArr = []
            }
          })
          
          let repingData = {
            data: {
              datas: data
            }
          }
          res = repingData
        }
      } catch (error) {
        console.log(error)
        this.outerDoudi = true
      }
      this.tabList[index].data = res
      window.isClick = false
    },
    isElementInViewport (el, offset = 0) {
      const box = el.getBoundingClientRect();
      const top = (box.top >= 0);
      const left = (box.left >= 0);
      const bottom = ((box.bottom - 30) <= (window.innerHeight || document.documentElement.clientHeight) + offset);
      const right = (box.right <= (window.innerWidth || document.documentElement.clientWidth) + offset)
      return (top && left && bottom && right)
    },
    changeTypeRG (type) {
      let strMap = {
        '1小时': '1h',
        '24小时': '24h'
      }
      buryPoint(`regu.${strMap[type]}`)
      this.changeTab(this.nowTabIndex, type, true)
    },
    getNameIndex (name) {
      switch (name) {
        case 'regu':
          return 0
        case 'reping':
          return 1
        case 'rewen':
          return 2
        case 'reji':
          return 3
      }
    },
    getIndexName (index) {
      switch (index) {
        case 0:
          return 'regu'
        case 1:
          return 'reping'
        case 2:
          return 'rewen'
        case 3:
          return 'reji'
      }
    }
  },
  mounted () {
    if (window.getParaByName('tabName')) {
      this.nowTabIndex = this.getNameIndex(window.getParaByName('tabName'))
    }
    buryPoint(this.getIndexName(this.nowTabIndex))
    this.changeTab(this.nowTabIndex, this.reguType, true, true)
    window.callNativeHandler('notifyWebHandleEvent', {
      method: 'showFirstPageQuickAddDialog',
      params: {
        addAppId: '212'
      }
    })
  }
}

</script>
<style lang='less' scoped>
.List_tab{
  display: flex;
  width: 100%;
  background: #fff;
  z-index: 1;
  .List_tabItem{
    height: 44px;
    flex-grow: 1;
    text-align: center;
    box-sizing: border-box;
    padding-top: 13px;
    .font{
      height: 25px;
      display: inline-block;
      font-size:16px;
      font-family:PingFangSC-Semibold,PingFang SC;
      line-height:20px;
      color: #262626;
    }
    .highLight{
      font-weight:bold;
      color:rgba(233,48,48,1);
      position: relative;
      &::after{
        position: absolute;
        bottom: -3px;
        content: "";
        width: 32px;
        border: 3px solid #e93030;
        left: 50%;
        margin-left: -16px;
        border-radius: 2px;
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        box-sizing: border-box;
      }
    }
  }
}
</style>
