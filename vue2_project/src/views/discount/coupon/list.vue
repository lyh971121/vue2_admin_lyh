<template>
  <div class="app-container">

    <div style="margin-bottom:10px;">
      <el-button type="primary" size="small" @click="$router.push('/discount/coupon/add')">添加</el-button>
      <el-button type="danger" size="small" @click="removeRows">批量删除</el-button>
    </div>

    <el-table
      border
      fit
      highlight-current-row
      v-loading="listLoading"
      element-loading-text="数据正在加载......"
      :data="list"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="couponName" label="购物券名称" />
      <el-table-column prop="couponTypeString" label="购物券类型" />
      <el-table-column prop="conditionAmount" label="规则">
        <template slot-scope="scope">
          {{ scope.row.couponType == 'CASH' ? '减金额' + scope.row.benefitAmount + '元' :
              scope.row.couponType == 'DISCOUNT' ? '打' + scope.row.benefitDiscount + '折' :
              scope.row.couponType == 'FULL_REDUCTION' ? '满' + scope.row.conditionAmount + '元减' + scope.row.benefitAmount + '元' : '满' + scope.row.conditionNum + '件打' + scope.row.benefitDiscount + '折' }}
        </template>
      </el-table-column>
      <el-table-column prop="rangeTypeString" label="范围类型 "/>
      <el-table-column prop="limitNum" label="最多领用次数" />
      <el-table-column prop="expireTime" label="过期时间" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/discount/coupon/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          </router-link>
          <router-link :to="'/discount/coupon/rule/'+scope.row.id">
            <el-button type="" size="mini">规则</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // 列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      multipleSelection: [] // 批量选择中选择的记录列表
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    /* 
    当页码发生改变的时候
    */
    changeSize(size) {
      this.limit = size
      this.fetchData(1)
    },

    /* 
    异步获取分页列表数据显示
    */
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      this.$API.couponInfo.getPageList(this.page, this.limit)
        .then(
          result => {
            this.list = result.data.records
            this.total = result.data.total
          }
        )
        .finally(() => {
          this.listLoading = false
        })
    },

    /* 
    根据id删除一条数据
    */
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => { // promise
        return this.$API.couponInfo.removeById(id)
      })
      .then((result) => {
        this.fetchData(this.page)
        if (result.code) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /* 
    当表格复选框选项发生变化的时候触发
    */
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    /* 
    批量删除
    */
    removeRows() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录!'
        })
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => { // promise
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return this.$API.couponInfo.removeRows(idList)
      })
      .then((response) => {
        this.fetchData(this.page)
        if (response.code) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

