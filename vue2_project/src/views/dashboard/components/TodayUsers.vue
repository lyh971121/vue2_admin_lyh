<template>
  <CommonCard class="today-users" title="今日交易用户数" :value="orderUser | numberFormat">
    <template>
      <v-chart :option="getOptions()" autoresize />
    </template>
    <template #bottom>
      <span>退货率</span>
      <span class="number">{{returnRate|numberFormat}}%</span>
    </template>
  </CommonCard>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'TodayUsers',
  computed: {
    // 用户交易数,退货率,交易数据,时间数据
    ...mapState({
      orderUser: (state) => state.data.reportData.orderUser,
      returnRate: (state) => state.data.reportData.returnRate,
      orderUserTrend: (state) => state.data.reportData.orderUserTrend || [],
      orderUserTrendAxis: (state) =>
        state.data.reportData.orderUserTrendAxis || []
    })
  },
  methods: {
    getOptions() {
      return {
        // x轴
        xAxis: {
          data: this.orderUserTrendAxis
        },
        // y轴
        yAxis: {
          show: false
        },
        // 提示框组件
        tooltip: {
          // trigger: 'axis',
          formatter (params){
            // console.log(params)
            const {name,value,marker,seriesName} = params
            return `${name}<br/> ${marker} ${seriesName}:${value}`
          }
        },
        // 图表显示位置
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        color: ['#3398DB'],
        // 系列组件
        series: [
          {
            name: '用户实时交易量',
            type: 'bar',
            // 列表数据
            data: this.orderUserTrend,
            barWidth: '60%' // 宽度占用比例
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>