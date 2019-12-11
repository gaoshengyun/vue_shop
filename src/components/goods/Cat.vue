<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddCatDialog"
          >添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="catList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index='true'
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable">
        <!-- 是否有效 -->
        <template
          slot="isok"
          slot-scope="scope"
        >
          <i style="color: lightgreen;" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
          <i style="color: red;" v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template
          slot="order"
          slot-scope="scope">
          <el-tag
            v-if="scope.row.cat_level === 0"
            type="primary"
            size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini">二级</el-tag>
          <el-tag
            v-else
            type="warning"
            size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template
          slot="opt"
          slot-scope=""
        >
          <el-button type="warning" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      @close="addCateDialogClosed"
      width="50%">
      <!-- 添加分类表单 -->
      <el-form
        :model="addCatForm"
        :rules="addCatFormRules"
        ref="addCatFormRef"
        label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来绑定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', ...this.cascaderProps}"
            :clearable="true"
            popper-class="catePopper"
            @change="parentCateChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Cat',
  data () {
    return {
      // 商品分类数据列表
      catList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数数据条数
      total: 0,
      // table指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCatDialogVisible: false,
      // 添加分类表单数据对象
      addCatForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 父级分类id
        cat_level: 0 // 分类的等级默认要添加的是一级分类
      },
      // 验证规则
      addCatFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称',
            triggle: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true // 是否可以选择父节点
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  methods: {
    async getCatList () {
      const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catList = res.data.result
      this.total = res.data.total
    },
    // 监听paesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatList()
    },
    // 添加按钮事件
    showAddCatDialog () {
      this.getParentCateList()
      this.addCatDialogVisible = true
    },
    // 获取低级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取低级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生改变触发函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 的length大于0,说明选中父级分类,反之没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCatForm.cat_level = this.selectedKeys.length
        return false
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 添加分类
    addCate () {
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCatList()
        this.addCatDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.cat_pid = 0
    }
  },
  mounted () {
    this.getCatList()
  }
}
</script>
<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.catePopper {
  height: 500px;
  overflow: scroll;
  background-color: #c00;
}
</style>
