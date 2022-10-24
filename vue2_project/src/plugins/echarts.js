import Vue from 'vue'
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'

Vue.prototype.$echarts = echarts
Vue.component('v-chart', ECharts)
// Vue.use(ECharts) // 不可以