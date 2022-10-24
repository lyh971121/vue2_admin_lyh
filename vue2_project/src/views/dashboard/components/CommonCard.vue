<template>
  <el-card class="common-card">
    <!--标题-->
    <div class="title">{{title}}</div>
    <!--数据值-->
    <div class="value">{{value}}</div>
    <!--chart-->
    <div class="chart">
      <!--默认插槽-->
      <slot></slot>
    </div>
    <!--标尺线-->
    <div class="line"></div>
    <!--底部-->
    <div class="bottom">
      <!--具名插槽-->
      <slot name="bottom"></slot>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'CommonCard',
  // 接收父级组件传递进来的数据
  props: ['title', 'value']
}
</script>
<style lang="scss">
.common-card {
  .title {
    font-size: 12px;
    color: #999;
  }
  .value {
    font-size: 25px;
    margin: 5px 0;
    letter-spacing: 1px;
  }
  .chart {
    height: 50px;
    background-color: #eee;
  }
  .line {
    border: 1px #eee solid;
    margin: 5px 0;
  }
  .bottom {
    font-size: 12px;
    color: #666;
  }
}
</style>