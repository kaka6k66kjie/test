<template>
  <div>
    <div class="ListTable_top">
      <span v-if="tableData.name === '热股'" class="font" style="left: 12px;">{{tableData.topContent[reguType]}}</span>
      <span v-else class="font" style="left: 12px;">{{tableData.topContent}}</span>
      <template v-if="tableData.name === '热基'">
        <span class="font fond_font_mid" :style="`${isSmallPx ? 'right: 82px;' : ''}`">日涨幅</span>
        <span class="font fond_font_end" :style="`${isSmallPx ? 'right: 24px;' : ''}`">最新净值</span>
      </template>
      <template v-if="tableData.name === '热股'">
        <span class="font fond_font_mid2" :class="{'choosen': reguType === '1小时'}" :style="`${isSmallPx ? 'right: 82px;' : ''}`" @click.stop="changeType('1小时')">1小时</span>
        <span class="line"></span>
        <span class="font fond_font_end" :class="{'choosen': reguType === '24小时'}" :style="`${isSmallPx ? 'right: 24px;' : ''}`" @click.stop="changeType('24小时')">24小时</span>
      </template>
    </div>
    <div class="content" v-show="tableData.data && tableData.data.length > 0">
      <div class="content_container">
        <div class="outer" v-for="(item, index) in tableData.data" :key="index">
          <div class="rank" :style="`${tableData.name === '热基' ? 'height:48px;padding:15px 0;' : ''}${item['排名变动'] ? 'padding: 10px 0;' : ''}`">
            <div class="rank_outer" :class="`index${index + 1}`"><span>{{index + 1}}</span></div>
            <div class="rank_change" v-if="item['排名变动']">
              <img :src="`//s.thsi.cn/iwencai/jgy/images/hotlist_${parseInt(item['排名变动']) > 0 ? 'rise' : 'die'}.png`">
              <span>{{Math.abs(item['排名变动'])}}</span>
            </div>
          </div>
          <div class="stock_content" :style="`width: ${screenWidth}px;`">
            <div v-if="tableData.name === '热股'" @click="jumpHangqing(item['股票代码'], item.market_code, '', index)">
              <div class="fir_row">
                <div class="stock_name" :style="`${isSmallPx ? 'width:81px;' : ''}` + `${isSmallPx && item['股票名称'].length > 4 ? 'font-size: 15px;' : ''}`">{{item["股票名称"]}}</div>
                <div v-if="item['停牌状态']" class="rise" :style="`${isSmallPx ? 'width:78px;padding-left: 12px;' : ''};`">停牌</div>
                <div v-if="inTHS" class="rise" :style="`${isSmallPx ? 'width:78px;padding-left: 12px;' : ''}color:${formatChgColor($hqData[item['股票代码']].chg)};`">{{formatChg($hqData[item['股票代码']].chg)}}</div>
                <div v-else class="rise" :style="`${isSmallPx ? 'width:78px;padding-left: 12px;' : ''};`"></div>
                <div v-if="reguType === '1小时'" class="hotTel" :style="`${isSmallPx ? 'padding-left: 12px;width: 68px;' : ''}`"><span style="font-size:15px;font-weight: 500;font-family: THSMoneyfont-Medium;">{{dealHotTel(item["rate"])}}</span><span style="font-weight: bold;font-size:15px;">{{parseFloat(item["rate"]) > 10000 ? 'w' : ''}}</span><span v-if="!isSmallPx">热度</span></div>
                <div v-else class="hotTel" :style="`${isSmallPx ? 'padding-left: 12px;width: 68px;' : ''}`"><span style="font-size:15px;font-weight: 500;font-family: THSMoneyfont-Medium;">{{dealHotTel(item["个股热度"])}}</span><span style="font-weight: bold;font-size:15px;">{{parseFloat(item["个股热度"]) > 10000 ? 'w' : ''}}</span><span v-if="!isSmallPx">热度</span></div>
              </div>
              <div class="sec_row">
                <div v-if="item['关注激增'] || item['持续上榜']" class="stock_status">{{item['关注激增'] ? '关注激增' : '持续上榜'}}</div>
                <div v-else class="stock_code">{{item["股票代码"]}}</div>
                <span v-for="(tag, inx) in dealGaiNian(item['所属概念'])" :key="inx" class="tag">{{tag}}</span>
              </div>
              <div class="third_row" @click.stop="jumpHangqing(item['股票代码'], item.market_code, 'jiedu', index)" v-if="item['涨停原因标题'] && reguType === '1小时'">{{item['涨停原因标题']+'。'}}<span v-if="item['涨停原因揭秘']">{{item['涨停原因揭秘']}}</span></div>
            </div>
            <div v-if="tableData.name === '热评'">
              <div class="fir_row" @click.stop="jumpRPFS(item.code, item.market_code, index)">
                <div class="stock_name" :style="`${isSmallPx ? 'width:81px;' : ''}` + `${isSmallPx && item['name'].length > 4 ? 'font-size: 15px;' : ''}`">{{item["name"]}}</div>
                <div v-if="inTHS" class="rise" :style="`${isSmallPx ? 'width:78px;padding-left: 12px;' : ''}color:${formatChgColor($hqData[item.code].chg)};`">{{formatChg($hqData[item.code].chg)}}</div>
                <div v-else class="rise" :style="`${isSmallPx ? 'width:78px;padding-left: 12px;' : ''};`"></div>                
                <div class="hotTel" :style="`${isSmallPx ? 'padding-left: 12px;width: 68px;' : ''}`"><span style="font-size:15px;font-weight: 500;font-family: THSMoneyfont-Medium;">{{dealHotTel(item["interact"])}}</span><span style="font-weight: bold;font-size:15px;">{{parseFloat(item["interact"]) > 10000 ? 'w' : ''}}</span><span v-if="!isSmallPx">热度</span></div>
              </div>
              <div class="sec_row flex jc-sb">
                <div class="stock_code">{{item["code"]}}</div>
                <!-- <div class="up_down flex ai-c">
                  <p class="up">看涨</p>
                  <div class="barCover flex flex-1">
                    <p class="mid" :style="`left:${49}%;`"></p>
                    <p class="left" :style="`width:${50}%;`"></p>
                    <p class="right" :style="`width:${50}%;`"></p>
                  </div>
                  <p class="down">看跌</p>
                </div> -->
              </div>
              <div class="hot-content flex jc-fs" v-if="repingObj[item.code] && repingObj[item.code].content && repingObj[item.code].pid" @click.stop="jumpDis(repingObj[item.code].pid, index)">
                <div class="title-img"></div>
                <div class="hotcontent flex-1" v-html="formatHtml(repingObj[item.code].content)"></div>
              </div>
            </div>
            <div v-if="tableData.name === '热文'" @click="jumpNews(item.contentUrl[0], tableData.maidian, index)">
              <div class="hotNews_content">
                {{item.title}}
              </div>
              <div class="stock-list" v-if="item.stockInfo && item.stockInfo.length>0">
                <div class="stock-item" v-for="x in item.stockInfo.slice(0,2)" :key="x.stockCode" @click.stop="jumpFS(x.stockCode, x.stockMarket, index)">
                  <div class="stock-item-flex flex ai-c jc-sb">
                    <div class="stock-name">{{x.stockName}}</div>
                    <div class="stock-rate" :style="`color:${formatRateColor(x.stockZdf)};`">{{Number(x.stockZdf).toFixed(2)}}%</div>
                  </div>
                </div>
              </div>
              <div class="hotNews_tel">
                <span style="color:#b3b3b3;font-size: 15px;">
                  <span style="font-family: THSMoneyfont-Medium;">{{dealHotTel(item["score"])}}</span>
                  <span style="font-family:PingFangSC-Regular,PingFang SC;font-weight: bold;font-size:15px;line-height:18px">{{parseFloat(item["score"]) > 10000 ? 'w' : ''}}</span>
                  <span style="font-size: 13px;line-height: 17px;">热度</span>
                </span>
                <div v-if="dealHotNews(item['commentRatio'], item['zanRatio'])" class="hotNews_tel_stock_status" style="height: 18px; padding: 2px 4px;margin-left: 4px;">{{dealHotNews(item['commentRatio'], item['zanRatio'])}}</div>
              </div>
            </div>
            <div v-if="tableData.name === '热基'" @click="jumpFund(item['基金代码'], tableData.maidian, index)">
              <div class="fund">
                <div class="fund_outer" :style="`${isSmallPx ? 'width: 98px;' : ''}`">
                  <div class="fund_name">{{dealFundName(item['基金简称'])}}</div>
                  <div class="fund_code">
                    <!-- <span class="stock_status">严选</span> -->
                    <span class="code">{{item['基金代码']}}</span>
                    <span v-show="item.type" class="type">{{item.type}}</span>
                  </div>
                </div>
                <div class="fund_rise" :style="`${isSmallPx ? 'width: 71px;' : ''}color:${formatRateColor(item['涨跌幅'])};`">{{formatRate(item['涨跌幅'])}}</div>
                <div class="fund_value" :style="`${isSmallPx ? 'width: 58px;' : ''}`">{{item['基金净值']}}</div>
              </div>
            </div>
          </div>
        </div>
         <div v-show="isLoading" class="loading">
          <img src="//s.thsi.cn/js/m/publicImg/loading.png" class="turn-around" alt="loading">
          <span>正在加载...</span>
        </div>
      </div>
    </div>
    <div v-show="needDoudi" class="noData">
      <img src="//s.thsi.cn/iwencai/jgy/sdkNoData.png" alt="noData">
    </div>
    <div ref="bottom" class="mianze">
      <span style="color:#595959;">免责声明</span>
      <span style="color:#B3B3B3;">：本信息由同花顺金融研究中心提供，仅供参考，同花顺力求但不保证数据的完全准确。如有错漏请以中国证监会指定上市
        公司信息披露媒体为准。用户查看或依据这些内容所进行的任何行为造成的风险和结果都自行负责，与同花顺无关。
      </span>
    </div>

  </div>
</template>

<script>
import { getTextLen, getTextByWidth, deepClone, merge, getFundMoreData, getStockMoreData, buryPoint, getConMoreData } from '@/lib/tools'

export default {
  data () {
    return {
      nowHour: false,
      // 48为 左右margin + padding, 计算大小使用最长的值作为边界
      isSmallPx: (window.screen.width - 48) * (1 - 0.16) * (1 - 0.35 - 0.287) < getTextLen('1111.0w热度', 15),
      screenWidth: window.screen.width - 93,
      pageNum: 1,
      isShowMore: false,
      tableData: {
        data: {}
      },
      needDoudi: false,
      isLoading: false,
      // moreUrlList: [],
      url: ''
    };
  },
  props: ['componentData', 'saveData', 'reguType', 'repingObj', 'newsData', 'outerDoudi'],
  watch: {
    componentData: {
      immediate: true,
      deep: true,
      handler (val, oldValue) {
        if (oldValue && val.name !== oldValue.name) {
          this.pageNum = 1
        }
        let configData = val.data
        let isShowMore = false
        let url = ''
        // this.moreUrlList = configData.moreUrlList
        let row_count = 0
        let res = {}
        try {
          res = deepClone(val.data.data.datas)
          url = configData.config.other_info.footer_info.url
          if (url) {
            isShowMore = true
          }
        } catch (error) {
          isShowMore = true
        }
        this.isShowMore = isShowMore
        // this.moreUrlList = [url]
        this.url = url
        this.tableData = {
          ...deepClone(val),
          data: res
        }
        window.tableData = this.tableData
        this.row_count = row_count
      },
    },
    outerDoudi: {
      handler (value) {
        this.needDoudi = value
      },
      immediate: true
    }
  },
  computed: {
    inTHS() {
      return window.getAppVersion()
    }
  },
  methods: {
    jumpFund (fundCode, listName, index) {
      buryPoint(`reji.${index}`)
      if (window.getAppVersion()) {
        window.location.href = `client://client.html?action=ijijin^tjid=yuyinzhushou^action=fund,code=${fundCode},operator=2012`
      } else {
        let url = `//www.iwencai.com/unifiedmobile/#/result?question=${fundCode}&queryType=fund`
        window.location.href = url
      }
    },
    jumpHangqing (stock_code, market_id, listName, index) {
      let strMap = {
        '1小时': '1h',
        '24小时': '24h'
      }
      buryPoint(`regu.${strMap[this.reguType]}.${listName?'jiedu.':''}${index}`)
      if (window.getAppVersion()) {
        window.location.href = 'client://client.html?action=ymtz^webid=2205^stockcode=' + stock_code + '^marketid=' + market_id
      } else {
        let url = `//www.iwencai.com/unifiedmobile/#/result?question=${stock_code}`
        window.location.href = url
      }
    },
    jumpNews (url, listName, index) {
      buryPoint(`rewen.${index}`)
      if (window.getAppVersion()) {
        window.location.href = 'client://client.html?action=ymtz^webid=2804^url=' + url
      } else {
        window.location.href = url
      }
    },
    changeType (type) {
      this.$parent.changeTypeRG(type)
    },
    dealFundName (name) {
      let allowWidth = this.isSmallPx ? 98 : this.screenWidth * 0.498
      return allowWidth > getTextLen(name, 14) ? name : getTextByWidth(name, allowWidth - 14, 14) + '...'
    },
    dealHotNews (comment, zan) {
      return (comment <= 30 && comment !== 0) ? '评论火爆' : ((zan <= 15 && zan !== 0) ? '点赞激增' : '')
    },
    dealGaiNian (str) {
      if (!str) {
        return ''
      }
      // str = '余额宝;硅铁;参股基金;涉矿;小额贷款;融资融券;互联网金融;阿里巴巴概念;沪股通;转融券标的;电石;独角兽概念;血液制品;参股券商;水泥;煤化工;富时罗素概念股;PVC;生物疫苗;烧碱;MSCI概念;蚂蚁金服概念;循环经济;氢能源;标普道琼斯A股'
      return str.split(';').slice(0, 2)
    },
    changeTime () {
      // this.nowHour = !this.nowHour
    },
    dealHotTel (number) {
      if (!isFinite(number) || number === null) {
        return '--'
      }
      let num = parseFloat(number)
      return num > 10000 ? (num / 10000).toFixed(1) : Math.floor(num)
    },
    jumpDis(pid, index) {
      if (!pid) return false
      buryPoint(`reping.reping.${index}`)
      let url = '//t.10jqka.com.cn/m/post/discussDetail/?pid=' + pid
      if (window.getAppVersion()) {
        window.location.href = 'client://client.html?action=ymtz^webid=2804^url=' + window.location.protocol + url
      } else {
        window.location.href = url
      }
    },
    jumpFS(stock_code, market_id, index) {
      buryPoint(`rewen.stock.${index}`)
      if (market_id && (market_id == 178 || market_id == 177) && stock_code.indexOf('0') === 0) {
        window.location.href = 'client://client.html?action=ymtz^webid=2205^stockcode=HK' + stock_code.substr(1) + '^marketid=' + market_id
      } else {
        window.location.href = 'client://client.html?action=ymtz^webid=2205^stockcode=' + stock_code + '^marketid=' + market_id
      }
    },
    jumpRPFS(stock_code, market_id, index) {
      buryPoint(`reping.${index}`)
      if (window.getAppVersion()) {
        window.location.href = 'client://client.html?action=ymtz^webid=2205^stockcode=' + stock_code + '^marketid=' + market_id
      } else {
        let url = `//www.iwencai.com/unifiedmobile/#/result?question=${stock_code}`
        window.location.href = url
      }
    },
    formatRateColor(data) {
      if (!data) return ''
      if (data) {
        let num = Number(data)
        if (num > 0) {
          return 'rgb(233, 48, 48)'
        } else if (num < 0) {
          return 'rgb(45, 173, 58)'
        } else {
          return ''
        }
      }
    },
    formatRate(data) {
      if (data === null || data === undefined) return '--'
      let num = Number(data).toFixed(2)
      if (num > 0) {
        return '+' + num + '%'
      } else if (num < 0) {
        return num + '%'
      } else {
        return num
      }
    },
    // 格式化客户端协议获取的涨跌幅颜色
    formatChgColor(chg) {
      if (!chg) return ''
      if (chg.indexOf('%') > -1) {
        let data = Number(chg.split('%')[0])
        if (data > 0) {
          return 'rgb(233, 48, 48)'
        } else if (data < 0) {
          return 'rgb(45, 173, 58)'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    // 格式化客户端协议获取的涨跌幅
    formatChg(chg) {
      if (!chg) return '--'
      if (chg.indexOf('%') > -1) {
        let data = Number(chg.split('%')[0])
        if (data > 0) {
          return '+' + chg
        } else {
          return chg
        }
      } else {
        return chg
      }
    },
    // 格式化html
    formatHtml(str) {
      return str.replace('<br />', '').replace('<br/>', '').replace('<br>', '')
    }
  },
  created () {
    let self = this
    window.tableData = this.tableData
    window.onscroll = () => {
      if (window.scrollY >= 90) {
        $('.List_tab')[0].setAttribute('style', 'position: fixed;top: 0px;')
        $('.ListTable_top')[0].setAttribute('style', 'position: fixed;top: 44px;')
        $('.content_container')[0].setAttribute('style', 'margin-top: 77px;')
      } else {
        $('.List_tab')[0].setAttribute('style', '')
        $('.ListTable_top')[0].setAttribute('style', '')
        $('.content_container')[0].setAttribute('style', '')
      }
      if (self.$parent.isElementInViewport(self.$refs.bottom) && !window.isClick && self.isShowMore && !self.isLoading) {
        self.isLoading = true
        console.log('底部了')
        let reg = /&page=\d/
        self.pageNum += 1
        if (self.tableData.name === '热股' && this.reguType === '24小时') {
          buryPoint(`${self.tableData.maidian}.24h.loadmore.end`)
          self.isLoading = false
          self.isShowMore = false
        }
        if (self.tableData.name === '热股' && this.reguType === '1小时') {
          buryPoint(`${self.tableData.maidian}.1h.loadmore.${self.pageNum}`)
          getStockMoreData(self.url.replace(reg, '&page=' + self.pageNum), self)
        }
        if (self.tableData.name === '热评') {
          buryPoint(`${self.tableData.maidian}.loadmore.${self.pageNum}`)
          getConMoreData(self.url.replace(reg, '&page=' + self.pageNum), self)
        }
        if (self.tableData.name === '热基') {
          buryPoint(`${self.tableData.maidian}.loadmore.${self.pageNum}`)
          getFundMoreData(self.pageNum, self)
        }
        if (self.tableData.name === '热文') {
            buryPoint(`${self.tableData.maidian}.loadmore.end`)
            self.isLoading = false
            self.isShowMore = false
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
@font-face {
  font-family: "THSMoneyfont-Medium";
  src: url(//i.thsi.cn/m/fonts/THSMoneyfont-Medium.ttf);
}
.noData{
  padding: 92px 0;
  img{
    display: table;
    margin: 0 auto;
    width: 200px;
    height: 186px;
  }
}
.loading{
  display: table;
  margin: 0 auto;
  padding-top: 16px;
  .turn-around {
    -webkit-animation: turnround infinite linear .5s;
    animation: turnround infinite linear .5s;
    margin-right: 8px;
    width: 18px;
    height: 18px;
    position: relative;
    top:3px;
  }
}
@-webkit-keyframes turnround {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes turnround {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.stock_status{
  display: inline-block;
  height: 14px;
  font-size:10px;
  padding: 0 4px;
  line-height: 14px;
  background-color: #ffebeb;
  font-family:PingFangSC-Regular,PingFang SC;
  line-height: 15px;
  border-radius: 2px;
  color: #e93030;
  vertical-align: super;
}
.ListTable_top{
  position: relative;
  height:33px;
  background:#fff;
  border-top: 1px solid #f5f5f5;
  width: 100%;
  z-index: 1;
  .font{
    position: absolute;
    top: 8px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #B3B3B3;
    &.choosen {
      color: #262626;
      font-weight: bold;
    }
  }
  .line {
    position: absolute;
    top: 12.5px;
    right: 18.93%;
    display: inline-block;
    width: 1px;
    height: 8px;
    background-color: #EBEBEB;
  }
  .fond_font{
    left: 24px;
  }
  .fond_font_mid{
    right: 23.2%;
  }
  .fond_font_mid2{
    right: 21.3%;
  }
  .fond_font_end{
    right: 6.4%;
  }
  .btn{
    position: absolute;
    right:12px;
    margin-top: 8px;
    display: inline-block;
    font-size:12px;
    font-family:PingFangSC-Semibold,PingFang SC;
    color:#b3b3b3;
    line-height:17px;
    .on{
      color: #262626;
      font-weight: bold;
    }
    .icon{
      margin: 0px 8px;
      display: inline-block;
      width: 1px;
      height: 8px;
      background-color: #ebebeb;
    }
  }
}
.content{
  margin: 8px 12px;
  background-color: #f5f5f5;
  .content_container{
    width: 100%;
    padding: 8px 12px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    .outer{
      display: flex;
      margin-bottom: 4px;
      .rank{
        box-sizing: border-box;
        padding: 17px 0;
        width: 45px;
        height: 52px;
        .index1{
          background-color: #e93030;
          color: #fff !important;
        }
        .index2{
          background-color: #FF6600;
          color: #fff !important;
        }
        .index3{
          background-color: #FFBB00;
          color: #fff !important;
        }
        .rank_outer{
          box-sizing: border-box;
          color: #595959;
          width: 44.4%;
          height: 18px;
          border-radius:2px;
          font-size:14px;
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight: bold;
          line-height: 18px;
          text-align: center;
        }
        .rank_change{
          margin-top: 2px;
          display: flex;
          align-items: baseline;
          img{
            display:inline-block;
            margin-right: 2px;
            width: 7px;
            height: 8px;
          }
          span{
            font-size:10px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(179,179,179,1);
            line-height:12px;
          }
        }
      }
      .stock_content{
        display: flex;
        flex-direction: column;
        .fund{
          display: flex;
          padding: 6px 0px;
          .fund_outer{
            width: 49.8%;
            font-family: PingFangSC-Regular, PingFang SC;
            .fund_name{
              font-size: 14px;
              color: #262626;
              line-height: 20px;
              margin-bottom: 2px;
            }
            .fund_code{
              font-size: 12px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 500;
              color: #B3B3B3;
              line-height: 14px;
              display: flex;
              .type{
                margin-left: 4px;
                font-weight: normal;
                height: 14px;
                font-size: 10px;
                padding: 0 4px;
                line-height: 15px;
                background-color: #f0f7ff;
                font-family: PingFangSC-Medium, PingFang SC;
                border-radius: 2px;
                color: #3377ff;
              }
            }
          }
          .fund_rise,.fund_value{
            width: 27.76%;
            text-align: right;
            padding-top: 7px;
            font-size: 18px;
            font-family: THSMoneyfont-Medium, THSMoneyfont;
            font-weight: 500;
            line-height: 22px;
          }
          .fund_value{
            padding-top: 9px;
            width: 22.42%;
            font-size: 15px;
            color: #262626;
            line-height: 18px;
          }
        }
        .hotNews_content{
          margin-bottom: 4px;
          padding-top: 6px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          color:rgba(38,38,38,1);
          line-height:22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal !important;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .stock_item{
          display: inline-block;
          margin-right: 4px;
          box-sizing: border-box;
          height: 28px;
          padding: 4px;
          background:#f7fbfa;
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          color:rgba(89,89,89,1);
          line-height:20px;
        }
        .stock-list {
          height: 28px;
          overflow: hidden;
          .stock-item-flex {
            height: 28px;
          }
          .stock-item {
            display: inline-block;
            padding: 0 8px;
            height: 28px;
            box-sizing: border-box;
            background-color: #F7F8FA;
            border-radius: 4px;
            font-family: PingFangSC-Regular, PingFang SC;
            &:nth-child(1) {
              margin-right: 4px;
            }
            .stock-name {
              margin-right: 12px;
              font-size: 14px;
              color: #595959;
            }
            .stock-rate {
              font-size: 14px;
            }
          }
        }
        .hotNews_tel{
          margin-top: 4px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          display: flex;
          align-items: flex-end;
          padding-bottom: 4px;
          .hotNews_tel_stock_status{
            position: relative;
            line-height: 14px;
            display: inline-block;
            background: #FFF2F0;
            box-sizing: border-box;
            border-radius: 2px;
            font-size: 11px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #E93030;
          }
        }
        .fir_row{
          display: flex;
          height: 24px;
          margin-top: 6px;
          .stock_name{
            width: 35%;
            font-size:17px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(38,38,38,1);
            line-height:24px;
          }
          .rise{
            font-size:18px;
            font-family:THSMoneyfont-Medium;
            font-weight: 500;
            line-height: 22px;
            width: 28.7%;
            box-sizing: border-box;
            padding: 1px 0 1px 16px;
            color: #262626;
            text-align: right;
          }
          .hotTel{
            width: auto;
            font-family:THSMoneyfont-Medium;
            font-weight: bold;
            font-size: 15px;
            line-height: 17px;
            box-sizing: border-box;
            padding: 3px 0 3px 16px;
            width: 36.3%;
            text-align: right;
            span{
              font-size: 13px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color: #262626;
              line-height: 17px;
            }
          }
        }
        .sec_row{
          height: 14px;
          margin-top: 2px;
          .stock_code{
            font-size:12px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight: 500;
            color:rgba(179,179,179,1);
            line-height:14px;
            display: inline-block;
            vertical-align: top;
          }
          .tag{
            margin-left: 4px;
            vertical-align: top;
            display: inline-block;
            height: 14px;
            box-sizing: border-box;
            padding: 0px 4px;
            font-size:10px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #3377FF;
            background:rgba(240,247,255,1);
            border-radius:2px;
            line-height: 15px;
          }
          .up_down {
            font-size: 10px;
            .up {
              margin-right: 8px;
              color: rgb(233, 48, 48);
            }
            .barCover {
              position: relative;
              height: 3px;
              border-radius: 1.5px;
              overflow: hidden;
              width: 108px;
              .mid {
                position: absolute;
                top: 0;
                left: 49%;
                width: 2%;
                height: 3px;
                -webkit-transform: -webkit-skew(-32deg);
                -webkit-transform: skewX(-32deg);
                transform: -webkit-skew(-32deg);
                transform: skewX(-32deg);
                background-color: #fff;
              }
              .right {
                width: 50%;
                height: 3px;
                background-color: #4EBA55;
              }
              .left {
                width: 50%;
                height: 3px;
                background-color: #F5605B;
              }
            }
            .down {
              color: rgb(45, 173, 58);
              margin-left: 8px;
            }
          }
        }
        .third_row {
          margin: 6px 0 4px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-size: 12px;
          line-height: 17px;
          color: #595959;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: -o-ellipsis-lastline;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .hot-content {
          margin-top: 6px;
          padding: 8px;
          box-sizing: border-box;
          border-radius: 4px;
          background-color: #F7F8FA;
          .title-img {
            margin-right: 8px;
            width: 24px;
            height: 17px;
            background-image: url(../assets/images/title-img.png);
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
          }
          .hotcontent {
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 12px;
            line-height: 17px;
            color: #595959;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: -o-ellipsis-lastline;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            /deep/ img {
              display: inline-block;
              vertical-align: bottom;
              max-width: 17px!important;
              max-height: 17px!important;
            }
          }
        }
        .unscramble{
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #595959;
          line-height: 17px;
          margin-top:6px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.mianze{
  margin: 16px 12px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  line-height: 14px;
}
</style>
