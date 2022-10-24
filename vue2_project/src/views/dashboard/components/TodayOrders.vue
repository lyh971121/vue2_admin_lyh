<template>
  <CommonCard class="today-orders" title="今日订单" :value="orderToday | numberFormat">
    <template>
      <!-- <div ref="chart" style="width:100%;height:100%"></div> -->
      <v-chart :option="getOptions()" autoresize />
    </template>
    <template #bottom>
      <span>昨日订单量</span>
      <span class="number">{{orderLastDay | numberFormat}}</span>
    </template>
  </CommonCard>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'TodayOrders',
  computed: {
    // 今日订单,昨日订单,实时订单数据,时间数据
    ...mapState({
      orderToday:state=>state.data.reportData.orderToday,
      orderLastDay:state=>state.data.reportData.orderLastDay,
      orderTrend:state=>state.data.reportData.orderTrend||[],
      orderTrendAxis:state=>state.data.reportData.orderTrendAxis||[]
    })
  },
  // watch:{
  //   // 监视实时订单数据,重新配置
  //   orderTrend(){
  //      this.chart.setOption(this.getOptions())
  //   }
  // },
  // mounted() {
  //   // 初始化一个图表
  //   this.chart = this.$echarts.init(this.$refs.chart)
  //   // 设置配置项
  //   this.chart.setOption(this.getOptions())

  //   // 需要重新绘制
  //   window.addEventListener('resize',()=>{
  //     this.chart.resize()
  //   })
  // },
  methods: {
    getOptions() {
      return {
        // x轴
        xAxis: {
          show: false, // 是否显示x轴
          boundaryGap: false, // 是否留白
          data:this.orderTrendAxis
        },
        // y轴
        yAxis: {
          show: false // 不显示y轴
        },
        // 提示框组件,鼠标滑动过去有提示消息
        tooltip: {
          trigger:'axis' // 触发时机,
        },
        // 系列组件
        series: [
          {
            name: '实时订单数', // 在提示框中显示的
            type: 'line', // 线形图
            data:this.orderTrend,
            smooth: true, // 是否平滑线显示
            areaStyle:{ // 背景色
              color:'purple'
            },
            itemStyle: { // 设置小圆圈透明度
              opacity: 0
            },
            lineStyle: { // 设置曲线透明度
              opacity: 0
            }
          }
        ],
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }
      }
    }
  }
}
</script>
<style lang="scss">
</style>