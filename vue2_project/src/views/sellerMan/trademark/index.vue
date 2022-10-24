<template>
  <div>
    <el-button type="primary" @click="addTrademark">+添加</el-button>
    <el-table
      v-loading="loading"
      border
      style="width: 100%; margin-top: 20px"
      :data="trademarkList"
    >
      <el-table-column
        prop="data"
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="280"
        align="center"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleted(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTradeMarkList"
      :page-sizes="[3, 5, 7, 9]"
      layout=" prev, pager, next, jumper,->,sizes,total "
      :total="total"
      style="text-align: center; margin-top: 20px"
    >
    </el-pagination>
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
    <!-- 点击确定按钮全部ref="ruleForm" -->
    <!-- 对话框 -->
    <el-dialog
      :title="tmFrom.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmFrom" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称:" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO:" label-width="100px" prop="logoUrl">
          <!-- 上传图片 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" >取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqTradeMarkList,
  reqAddOrUpdateTradeMark,
  reqDetetedTradeMark
} from "../../../api/trademark/trademark";
import {nextTick} from 'vue'


export default {
  name: "Trademark",
  data() {
    var validateName = (rule, value, callback) => {
        if(value.length<2||value.length>10){
            callback(new Error('品牌名称2-10位'))
        }else{
            callback()
        }
      };
    return {
      //代表的分页器第几页
      page: 1,
      limit: 3,
      //存储一共多少数据
      total: 0,
      //存数数据
      trademarkList: [],
      //对话框显示与隐藏
      dialogFormVisible: false,
      //收集品牌信息
      tmFrom: {
        tmName: "",
        logoUrl: "",
      },
      //加载
      loading:false,
      //表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateName, trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传图片", trigger: "change" }],
      },
    };
    
  },

  //组件挂载完毕发请求
  mounted() {
    //获取列表数据方法
    this.getTradeMarkList();
  },

  methods: {
    //获取品牌列表的数据
    async getTradeMarkList(pager = 1) {
      //点击页数跳转
      this.page = pager;
      //显示loading
      this.loading = true
      //结构出数据
      const { page, limit } = this;
      let result = await reqTradeMarkList(page, limit);
      //隐藏loading
      this.loading = false
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.trademarkList = result.data.records;
      }
    },

    // 点击第几页跳转
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getTradeMarkList();
    },

    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      this.tmFrom.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //点击添加按钮的回调
    addTrademark() {
      this.dialogFormVisible = true;
      // 在显示了提示信息后, 立即清除提示信息
        // 此时dialog界面还没有显示 ==> 必须延迟到界面更新显示后再执行
        this.$nextTick(() => {// 回调函数是迟延到界面更新后执行的   面试说
          this.$refs.ruleForm.clearValidate()
        })
      //再次点击清空数据
      this.tmFrom.tmName = "";
      this.tmFrom.logoUrl = "";
    },

    //点击修改按钮的回调
    updateTrademark(row) {
      this.dialogFormVisible = true;
      //浅拷贝------因为不能直接操作数组 数组是在页面中展示的
      this.tmFrom = { ...row };
    },

    //点击确认的按钮的回调
    addOrUpdate() {
      //当全部验证字段通过 再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          //关闭窗口
          this.dialogFormVisible = false;
          let result = await reqAddOrUpdateTradeMark(this.tmFrom);
          if (result.code == 200) {
            this.$message({
              message: this.tmFrom.id ? "恭喜您，修改成功" : "恭喜您,添加成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "很抱歉，请检查您的网络链接",
              type: "warning",
            });
          }

          //再次发请求
          //判断是修改还是添加 修改留在袁页
          this.getTradeMarkList(this.tmFrom.id ? this.page : 1);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    
    
    },
    

    //点击删除按钮
    deleted(row){
      this.$confirm(`您确定要删除${row.tmName}吗？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          //确定的回调
          let result = await reqDetetedTradeMark(row.id)
          if(result.code == 200){
            this.$notify({
            title:'成功',
            type: 'success',
            message: '删除成功!'
          });
          }
          this.getTradeMarkList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
    }

   
}
     
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>