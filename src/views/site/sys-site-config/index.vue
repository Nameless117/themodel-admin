
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['site:sysSiteConfig:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['site:sysSiteConfig:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['site:sysSiteConfig:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="sysSiteConfigList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要修改吗?"
                confirm-button-text="修改"
                @confirm="handleUpdate(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['site:sysSiteConfig:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @confirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['site:sysSiteConfig:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px"> <!-- 增加弹窗宽度 -->
          <el-form ref="form" :model="form" :rules="rules" label-width="120px"> <!-- 增加label宽度 -->
            <el-form-item label="左上角大logo" prop="logoLarge" class="form-item">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="(res) => handleUploadSuccess(res, 'logoLarge')"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传大logo</el-button>
                <template #tip>
                  <div v-if="form.logoLarge" class="upload-preview">
                    <img :src="form.logoLarge" class="preview-img">
                    <div class="image-url">{{ form.logoLarge }}</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="右上角小logo" prop="logoSmall" class="form-item">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="(res) => handleUploadSuccess(res, 'logoSmall')"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传小logo</el-button>
                <template #tip>
                  <div v-if="form.logoSmall" class="upload-preview">
                    <img :src="form.logoSmall" class="preview-img">
                    <div class="image-url">{{ form.logoSmall }}</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="背景图片" prop="bannerBgImg" class="form-item">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="(res) => handleUploadSuccess(res, 'bannerBgImg')"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传背景图片</el-button>
                <template #tip>
                  <div v-if="form.bannerBgImg" class="upload-preview">
                    <img :src="form.bannerBgImg" class="preview-img">
                    <div class="image-url">{{ form.bannerBgImg }}</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="书封面图片" prop="bannerBook" class="form-item">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="(res) => handleUploadSuccess(res, 'bannerBook')"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传书封面</el-button>
                <template #tip>
                  <div v-if="form.bannerBook" class="upload-preview">
                    <img :src="form.bannerBook" class="preview-img">
                    <div class="image-url">{{ form.bannerBook }}</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addSysSiteConfig, delSysSiteConfig, getSysSiteConfig, listSysSiteConfig, updateSysSiteConfig } from '@/api/site/sys-site-config'
import { getToken } from '@/utils/auth'

export default {
  name: 'SysSiteConfig',
  components: {
  },
  data() {
    return {
      // 设置上传的请求头部
      headers: { 'Authorization': 'Bearer ' + getToken() },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysSiteConfigList: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {},
      // 添加上传地址
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile', // 替换成你的实际上传接口

      // 添加文件上传限制
      fileLimit: {
        types: ['image/jpeg', 'image/png', 'image/gif'],
        size: 10 // MB
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysSiteConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.sysSiteConfigList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        logoLarge: undefined,
        logoSmall: undefined,
        bannerBgImg: undefined,
        bannerBook: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加站点配置管理'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getSysSiteConfig(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改站点配置管理'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSysSiteConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysSiteConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysSiteConfig({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    },
    // 添加上传相关方法
    handleUploadSuccess(res, field) {
      if (res.code === 200) {
        this.form[field] = res.data.url // 根据实际返回格式调整
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    beforeUpload(file) {
      // 文件类型检查
      if (!this.fileLimit.types.includes(file.type)) {
        this.$message.error('只能上传JPG/PNG/GIF格式的图片！')
        return false
      }

      // 文件大小检查
      const isLtLimit = file.size / 1024 / 1024 < this.fileLimit.size
      if (!isLtLimit) {
        this.$message.error(`上传图片大小不能超过 ${this.fileLimit.size}MB!`)
        return false
      }

      return true
    }
  }
}
</script>
<style scoped>
.form-item {
  margin-bottom: 22px;
  text-align: left;
}

.upload-preview {
  margin-top: 10px;
  width: 100%;
}

.preview-img {
  width: 200px;  /* 统一图片宽度 */
  height: 120px; /* 统一图片高度 */
  object-fit: contain; /* 保持图片比例 */
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px;
  background: #f5f7fa;
}

.image-url {
  margin-top: 5px;
  word-break: break-all;
  color: #606266;
  font-size: 12px;
}

.el-upload__tip {
  margin-top: 10px;
  text-align: left;
}

/* 调整表单项标签的对齐方式 */
/deep/ .el-form-item__label {
  text-align: left;
  padding-right: 20px;
}

/* 上传按钮样式统一 */
.upload-demo .el-button {
  width: 120px;
}
</style>
