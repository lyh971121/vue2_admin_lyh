<template>
  <el-row :gutter="20" class="top-view">
    <el-col :span="6">
      <TodaySales />
    </el-col>
    <el-col :span="6">
      <TodayOrders />
    </el-col>
    <el-col :span="6">
      <TodayUsers />
    </el-col>
    <el-col :span="6">
      <TotalUsers />
    </el-col>
  </el-row>
</template>
<script>
import TodaySales from './TodaySales.vue'
import TodayOrders from './TodayOrders.vue'
import TodayUsers from './TodayUsers.vue'
import TotalUsers from './TotalUsers.vue'
export default {
  name: 'TopView',
  components: {
    TodaySales,
    TodayOrders,
    TodayUsers,
    TotalUsers
  }
}
</script>
<style lang="scss">
.top-view {
  .number {
    font-weight: 700;
    margin: 0 5px;
  }
  .increment {
    border-color: transparent transparent green transparent;
    border-width: 5px;
    border-style: solid;
  }
  .decrement {
    border-color: red transparent transparent transparent;
    border-width: 5px;
    border-style: solid;
  }
}
</style>