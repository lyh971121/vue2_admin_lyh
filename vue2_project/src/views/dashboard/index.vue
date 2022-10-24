<template>
  <div class="dashboard">
    <!-- <TopView />
    <MiddleView />
    <BottomView /> -->
    <h2>首页</h2>
  </div>
</template>

<script>
import TopView from './components/TopView.vue'
import MiddleView from './components/MiddleView.vue'
import BottomView from './components/BottomView.vue'
export default {
  name: 'Dashboard',
  components: {
    TopView,
    MiddleView,
    BottomView
  },
  // 页面加载后,先获取mock的数据
  mounted() {
    this.$store.dispatch('data/getReportData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  padding: 20px;
  background: #eee;
}
</style>
