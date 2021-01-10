<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加（栅格布局） -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <!-- data——数据源，label——当前列标题，prop——对应标题列的数据 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!--  slot-scope="scope" 来取得作用域插槽:data绑定的数据，scope可以随便替换其他名称 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <!-- size-change——处理每页显示多少条数据，current-change——处理页码切换，current-page——当前显示第几页数据 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 对话框主体内容区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部（按钮）区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 修改对话框主体 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="selectedRoleId = '', userInfo = {}">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 添加用户中的邮箱正则验证
    const validEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确！'))
      } else {
        callback()
      }
    }
    // 添加用户中的手机正则验证
    const validMobile = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!reg.test(value)) {
        callback(new Error('手机格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 搜索框中的值
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      userlist: [], // 所有的用户列表
      total: 0, // 总数据描述
      addDialogVisible: false, // 控制添加对话框的显示和隐藏
      addForm: { // 添加用户的表单数据，用于作添加用户的请求
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: { // 添加表单的验证规则
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: validEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: validMobile,
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false, // 控制修改用户对话框的显示和隐藏
      editForm: {}, // 查询到的用户信息对象
      editFormRules: { // 修改表单的验证规则对象
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: validEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: validMobile,
            trigger: 'blur'
          }
        ]
      },
      setRoleDialogVisible: false, // 控制分配角色对话框的显示与隐藏
      userInfo: {}, // 需要被分配角色的用户信息
      rolesList: [], // 所有角色的数据列表
      selectedRoleId: '' // 已选中的角色 id 值
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 请求用户列表的用户信息
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 每页显示多少条数据 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 状态按钮 状态的改变
    async userStateChanged(userInfo) {
      // 状态改变后，重新发起请求，修改数据库数据，并同步到页面
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 更新失败，页面的状态按钮也应该是处于原有状态，所以需要重新赋值刷新
        userInfo.mg_state = !userInfo.mg_state
        this.$message.closeAll()
        return this.$message.error('更新用户状态失败！')
      }
      // 防止重复点击，弹出多个提示窗
      this.$message.closeAll()
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件（关闭后清空（重置）用户添加表单）
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    adduser() {
      // 添加新用户前，先获取格式验证是否全部通过的一个布尔值
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 通过后发起添加用户的请求
        const { data: res } = await this.$http.post('/users', this.addForm)
        console.log(res)
        switch (res.meta.status) {
          case 201: this.$message.success('添加用户成功！'); break
          case 400: this.$message.error('用户已存在！'); break
          default : this.$message.error('添加用户失败！')
        }
        // 添加成功后关闭对话框
        this.addDialogVisible = false
        // 重新获取数据渲染
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件（关闭后清空（重置）用户修改表单）
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息与提交
    editUserInfo() {
      // 修改用户前，先获取格式验证是否全部通过的一个布尔值
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 修改成功后关闭对话框
        this.editDialogVisible = false
        // 重新获取数据渲染
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据 id 删除对应的用户信息
    async removeUserById(id) {
      // 询问是否删除数据
      this.$confirm('此操作将永久删除该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户信息失败！')
        }
        this.$message.closeAll()
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        // 删除成功后重新渲染列表
        this.getUserList()
      }).catch(() => {
        this.$message.closeAll()
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    },
    // 展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles/')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      this.$message.success('更新角色成功！')
      // 分配角色后重新渲染
      this.getUserList()
      // 关闭对话框
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style></style>
