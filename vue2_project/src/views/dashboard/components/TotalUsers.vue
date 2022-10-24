<template>
  <CommonCard class="total-users" title="累积用户数" :value="usersTotal | numberFormat">
    <template>
      <v-chart :option="getOptions()" autoresize />
    </template>
    <template #bottom>
      <div class="total-users-bottom">
        <div>日同比</div>
        <div class="number">{{userGrowthLastDay}}</div>
        <div class="increment"></div>
        <div class="right">月同比</div>
        <div class="number">{{userGrowthLastMonth}}</div>
        <div class="decrement"></div>
      </div>
    </template>
  </CommonCard>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'TotalUsers',
  computed: {
    // 用户数,日数据,月数据,日同比,月同比
    ...mapState({
      usersTotal: (state) => state.data.reportData.usersTotal,
      usersLastDay: (state) => state.data.reportData.usersLastDay,
      usersLastMonth: (state) => state.data.reportData.usersLastMonth,
      userGrowthLastDay: (state) => state.data.reportData.userGrowthLastDay,
      userGrowthLastMonth: (state) => state.data.reportData.userGrowthLastMonth
    })
  },
  methods: {
    getOptions() {
      return {
        // x轴
        xAxis: {
          // 去掉两边留白
          boundaryGap: false,
          show: false, // 不显示x轴
          min: 0, // x轴最小值
          max: this.usersTotal // x轴最大值
        },
        // y轴
        yAxis: {
          type: 'category', // y轴为类目轴==>水平柱状图
          show: false // 不显示y轴
        },
        // 系列组件
        series: {
          name: '用户增长量',
          type: 'bar', // 柱状图
          // 用户总数减掉上个月的数据
          data: [this.usersTotal - this.usersLastMonth],
          barWidth: 10, // 柱条的宽度
          showBackground: true, // 展示背景
          // 背景样式
          backgroudStyle: {
            color: '#eee' // 背景色
          },
          // 柱条样式
          itemStyle: {
            color: 'yellowgreen'
          },
          // 柱条显示内容
          label: {
            show: true, // 显示
            formatter: '|', // 显示具体内容
            position: 'right', // 内容的位置
            color: 'yellowgreen' // 颜色
          }
        },
        // 图标位置
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        // 提示信息
        tooltip: {
          formatter(params) {
            const { seriesName, marker, value } = params
            return `${seriesName}<br> ${marker} ${value} `
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.total-users {
  .total-users-bottom {
    display: flex;
    align-items: center;
    .right {
      margin-left: 10px;
    }
  }
}
</style>