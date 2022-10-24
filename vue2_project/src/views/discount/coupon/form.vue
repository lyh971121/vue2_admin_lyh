<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="优惠券名称">
        <el-input v-model="couponInfo.couponName"/>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-radio-group v-model="couponInfo.couponType">
          <el-radio label="CASH">现金券</el-radio>
          <el-radio label="DISCOUNT">折扣券</el-radio>
          <el-radio label="FULL_REDUCTION">满减券</el-radio>
          <el-radio label="FULL_DISCOUNT">满量打折券</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="最多领用次数">
        <el-input type="number" v-model="couponInfo.limitNum"/>
      </el-form-item>
      <el-form-item label="领取时间">
        <el-date-picker
          v-model="startEnd"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="{disabledDate}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="过期时间">
        <el-date-picker
          v-model="couponInfo.expireTime"
          type="datetime"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd HH:mm:ss" 
          :picker-options="{disabledDate: disabledET}"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button @click="$router.push('/discount/coupon/list')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
const defaultForm = {
  id: '',
  couponName: '',
  couponType: 'CASH',
  createTime: '',
  limitNum: '',
  startTime: '',
  endTime: '',
  expireTime: '',
}

export default {
  data() {
    return {
      couponInfo: defaultForm,
      saveBtnDisabled: false,
      startEnd: [],
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      this.init()
    },

    startEnd (value) {
     if (value.length===2) {
       this.couponInfo.startTime = value[0]
       this.couponInfo.endTime = value[1]
     } 
    }
  },

  created() {
    this.init()
  },

  methods: {

    /* 
    禁用当天之后的时间选择, 返回true是禁用
    */
    disabledET (time) {
      console.dir(time)
      // return time.getTime() < Date.now()
      if (this.couponInfo.endTime) {
        return dayjs(time.getTime()).isBefore(this.couponInfo.endTime)
      } else {
        return time.getTime() < Date.now()
      }
    },

    disabledDate(time) {
      // new Date(new Date().toLocaleDateString()).getTime(): 得到当天的起始时间
      return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
    },

    // 表单初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        this.couponInfo = { ...defaultForm }
      }
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true // 防止表单重复提交
      this.$API.couponInfo[!this.couponInfo.id ? 'save' : 'updateById'](this.couponInfo)
        .then(response => {
          if (response.code) {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.$router.replace({ path: '/discount/coupon/list' })
          }
        })
        .finally(() => {
          this.saveBtnDisabled = false
        })
    },

    // 根据id查询记录
    fetchDataById(id) {
      this.$API.couponInfo.getById(id)
      .then(response => {
        this.couponInfo = response.data
        this.startEnd = [this.couponInfo.startTime,this.couponInfo.endTime]
      })
    }
  }
}
</script>
