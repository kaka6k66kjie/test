<template>
  <div class="hotList">
    <div class="top_image">
      <img class="top_content" src="//s.thsi.cn/iwencai/jgy/images/hotList_title.png" alt="同花顺热榜">
      <div class="top_font">聚集千万人投资动向</div>
    </div>
    <List/>
  </div>
</template>

<script>
import List from '@/components/List'
import { backWashFn, createShareInfo, buryPoint } from '@/lib/tools'

export default {
  name: 'Home',
  components: {
    List
  },
  data() {
    return {
      
    }
  },
  created() {
    if (!window.getAppVersion()) {
      backWashFn()
    }
    createShareInfo()
    buryPoint()
  }
}
</script>

<style lang="less">
.hotList{
  .top_image{
    width: 100%;
    background-image: url(../assets/images/top-bg.png);
    background-size: 100% 100%;
    height: 100px;
    .top_content{
      padding: 14px 0 2px;
      height: 44px;
      display: table;
      margin: 0 auto;
    }
    .top_font{
      display: table;
      margin: 0 auto;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
    }
  }
}
</style>
