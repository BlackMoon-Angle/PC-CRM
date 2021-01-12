<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i style="color: lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <el-form
      :model="addCateForm"
      :rules="addCateFormRules"
      ref="addCateFormRef"
      label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 下拉菜单 -->
          <!-- options：指定数据源 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }"
            @change="parentCateChanged"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: { // 查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [], // 商品分类的数据列表
      total: 0, // 总数据条数
      columns: [{ // 为table指定列的定义
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template', // 将当前列定义为模板列
        template: 'isok' // 当前这一列使用模板名称
      },
      {
        label: '排序',
        type: 'template', // 将当前列定义为模板列
        template: 'order' // 当前这一列使用模板名称
      },
      {
        label: '操作',
        type: 'template', // 将当前列定义为模板列
        template: 'opt' // 当前这一列使用模板名称
      }],
      addCateDialogVisible: false, // 控制添加分类对话框的显示和隐藏
      addCateForm: { // 添加分类的表单数据对象
        cat_name: '',
        cat_pid: 0, // 父级分类的id
        cat_level: 0 // 分类的等级，默认要添加的是1级分类
      },
      addCateFormRules: { // 添加分类表单的验证规则对象
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      parentCateList: [], // 父级分类的列表
      selectedKeys: [] // 选中的父级分类的 id 数组
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get('categories/', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.message.error('获取商品分类失败！')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCatelist()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCatelist()
    },
    // 展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories/', +{ params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发的函数
    parentCateChanged() {
      // 如果 selectedKeys 数组中的 length 大于0，说明选中了分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCatelist()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treetable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
