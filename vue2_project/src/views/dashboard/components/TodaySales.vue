<template>
  <!--传入title和value,并且数据要过滤-->
  <CommonCard class="today-sales" title="今日销售额" :value="salesToday|numberFormat">
    <!--默认插槽-->
    <template>
      <div class="compare-warp">
        <div class="compare">
          <div>日同比</div>
          <div class="number">{{salesGrowthLastDay}}%</div>
          <div class="decrement"></div>
        </div>
        <div class="compare">
          <div>月同比</div>
          <div class="number">{{salesGrowthLastMonth}}%</div>
          <div class="increment"></div>
        </div>
      </div>
    </template>
    <!--具名插槽-->
    <template #bottom>
      <span>昨日销售额</span>
      <span class="number">{{salesLastDay|moneyFormat}}</span>
    </template>
  </CommonCard>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'TodaySales',
  computed: {
    // 今日销售额,日同比,月同比,昨日销售额
    ...mapState({
      salesToday:state=>state.data.reportData.salesToday,
      salesGrowthLastDay:state=>state.data.reportData.salesGrowthLastDay,
      salesGrowthLastMonth:state=>state.data.reportData.salesGrowthLastMonth,
      salesLastDay:state=>state.data.reportData.salesLastDay,
    })
  }
}
</script>
<style lang="scss" scoped>
.today-sales {
  .compare-warp {
    height: 100%;
    // display: flex;
    // flex-direction: column;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    .compare {
      padding: 5px 0;
      display: flex;
      // flex: 1;
      align-items: center;
    }
  }
}
</style>