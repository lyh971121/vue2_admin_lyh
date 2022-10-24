<template>
  <div>
    <el-form>
      <el-form-item>
        <el-input
          placeholder="请输入内容"
          clearable
          style="width: 200px; margin: 0 20px"
          v-model="tempSearchObj.username"
        >
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button  @click="resetSearch">清空</el-button>
      </el-form-item>
      <el-button type="primary" style="margin-left: 20px" @click="showAddUser">添加</el-button>
      <el-button type="danger" :disabled="selectedIds.length===0" @click="revomveUsers">批量删除</el-button>

      <!-- 表格内容 -->
      <!-- show-overflow-tooltip 过长被隐藏 -->
      <el-table
        border
        style="margin: 20px"
        :data="userInfo"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" width="60" align='center' type="index">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称">
        </el-table-column>
        <el-table-column prop="roleName" label="角色列表" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{row,$index}">
            <el-tooltip content="分配角色" placement="top">
            <el-button type="info" icon="el-icon-user-solid" size="mini"  @click="showAssignRole(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改用户" placement="top" >
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateUser(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top">
            <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="removeUser(row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @current-change="getUserList"
        @size-change = "handlerPage"
        :page-sizes="[3, 5, 7]"
        :page-size="100"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户权限 -->
      <el-dialog :title="user.id?'修改用户':'添加用户'" :visible.sync="dialogFormVisible">
        <el-form label-width="120px" :model="user">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" >
           <el-input v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
           <el-input  v-model="user.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate"
            >确 定</el-button
          >
        </div>
      </el-dialog>


      <!-- 给用户分配角色 -->
    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <!-- indeterminate 设置 indeterminate 状态，只负责样式控制 -->
        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button  type="primary" @click="assignRole">保存</el-button>
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>

    </el-form>
  </div>
</template>

<script>
//引入请求函数
import {reqUserList,reqAddOrUpdateUser,reqRemove,reqAllRemove,reqRoles} from '../../../api/user/user'
// import cloneDeep from 'lodash/cloneDeep'
export default {

  name: "User",
  data() {
    return {
      //当前页数
      page:1,
      limit:3,
      total:0,
      
      dialogFormVisible:false, //添加对话框
      dialogRoleVisible:false, //分配角色对话框
      //存储用户数据
      userInfo:[],

      //收集添加用户信息
      user:{},
      //收集搜索条件输入对象
      tempSearchObj:{
        username:''
      },
       searchObj: { // 包含请求搜索条件数据的对象
        username: ''
      },
      //收集批量删除的数据
      selectedIds: [],
      //存储角色数据
      allRoles: [],
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
    };
  },
  mounted() {
    this.getUserList()
  },
  methods: {
  //页面挂载展示数据
  async getUserList(pager=1){
    this.page = pager
    let result = await reqUserList(this.page,this.limit,this.searchObj)
    // console.log(result);
    if(result.code == 20000){
      this.userInfo = result.data.items
      this.total = result.data.total
    }
  },
  //选择每页展示多少条
  handlerPage(limit){
    this.limit = limit
    this.getUserList()
  },
  //点击添加按钮
  showAddUser(){
      //对话框打开
      this.dialogFormVisible = true
      //二次点击清空数据
      this.user = {}
    },

  //取消按钮
  cancel(){
    this.dialogFormVisible = false
    this.user = {}
  },
  //添加确定按钮
  async addOrUpdate(){
    //关闭对话框
    this.dialogFormVisible=false
    //结构出收集的用户信息
    const {user} = this
    let result = await reqAddOrUpdateUser(user)
    // console.log(result);
    if(result.code == 20000){
      this.$notify({
          title: this.user.id ? '修改用户' : '添加用户',
          message: this.user.id ? "恭喜您，修改成功" : "恭喜您,添加成功",
          offset: 100,
          type:'success'
        });
        this.getUserList()
        this.user = {}
    }
  },
  //修改按钮
  updateUser(user){
    this.dialogFormVisible = true
    this.user = {...user}
  },
  //删除
  removeUser(id){
    
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await reqRemove(id)
        this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });     
  },
  //搜索
  search(){
    this.searchObj = {...this.tempSearchObj}
    this.getUserList()
  },
  //重置搜索
  resetSearch(){
    this.searchObj={
      username:''
    }
    this.tempSearchObj = {
      username:''
    }
    this.getUserList()
  },
  //批量删除
  revomveUsers(){
    this.$confirm('确定删除吗?').then(async () => {
         await reqAllRemove(this.selectedIds)
        this.$message.success('删除成功')
        this.getUserList()
      }).catch(() => {
        this.$message.info('取消删除')
      })
  },
  //列表选中状态发生改变的监听回调
  handleSelectionChange(selection){
    this.selectedIds = selection.map(item => item.id)
  },

  //分配角色按钮的回调
  showAssignRole(user){
    this.user = user
    this.dialogRoleVisible = true
    this.getRoles()
  },
  
  //异步获取用户的角色列表
  async getRoles(){
    const result = await this.$API.user.getRoles(this.user.id)
    const {allRolesList, assignRoles} = result.data
    this.allRoles = allRolesList
    this.userRoleIds = assignRoles.map(item => item.id)
    this.checkAll = allRolesList.length===assignRoles.length
    this.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
  },

  //全勾选状态发生改变的监听
  handleCheckAllChange(value){
    //value 当前勾选状态true/false
    //如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
    this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
    // 如果当前不是全选也不全不选时, 指定为false
    this.isIndeterminate = false
  },

 
    //角色列表选中项发生改变的监听
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },

     /* 
    请求给用户进行角色授权
    */
    async assignRole () {
      const userId = this.user.id
      const roleIds = this.userRoleIds.join(',')
      this.loading = true
      const result = await this.$API.user.assignRoles(userId, roleIds)
      this.loading = false
      this.$message.success(result.message || '分配角色成功')
      this.resetRoleData()

      // console.log(this.$store.getters.name, this.user)
      if (this.$store.getters.name===this.user.username) {
        window.location.reload()
      }
    },

        /* 
    重置用户角色的数据
    */
    resetRoleData () {
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    },



  },
};
</script>

<style lang="scss" scoped>
</style>