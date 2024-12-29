
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
          <!--                    <el-col :span="1.5">-->
          <!--                        <el-button-->
          <!--                                v-permisaction="['site:sysSiteBanners:add']"-->
          <!--                                type="primary"-->
          <!--                                icon="el-icon-plus"-->
          <!--                                size="mini"-->
          <!--                                @click="handleAdd"-->
          <!--                        >新增-->
          <!--                        </el-button>-->
          <!--                    </el-col>-->
          <el-col :span="1.5">
            <el-button
              v-permisaction="['site:sysSiteBanners:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <!--                    <el-col :span="1.5">-->
          <!--                        <el-button-->
          <!--                                v-permisaction="['site:sysSiteBanners:remove']"-->
          <!--                                type="danger"-->
          <!--                                icon="el-icon-delete"-->
          <!--                                size="mini"-->
          <!--                                :disabled="multiple"-->
          <!--                                @click="handleDelete"-->
          <!--                        >删除-->
          <!--                        </el-button>-->
          <!--                    </el-col>-->
        </el-row>

        <el-table v-loading="loading" :data="sysSiteBannersList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="Banner类型" prop="type" align="center" />
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
                  v-permisaction="['site:sysSiteBanners:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
                </el-button>
              </el-popconfirm>
              <!--                         <el-popconfirm-->
              <!--                            class="delete-popconfirm"-->
              <!--                            title="确认要删除吗?"-->
              <!--                            confirm-button-text="删除"-->
              <!--                            @confirm="handleDelete(scope.row)"-->
              <!--                         >-->
              <!--                            <el-button-->
              <!--                              slot="reference"-->
              <!--                              v-permisaction="['site:sysSiteBanners:remove']"-->
              <!--                              size="mini"-->
              <!--                              type="text"-->
              <!--                              icon="el-icon-delete"-->
              <!--                            >删除-->
              <!--                            </el-button>-->
              <!--                         </el-popconfirm>-->
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
        <el-dialog :title="title" :visible.sync="open" width="60%">
          <el-form ref="form" :model="form" :rules="rules" label-width="200px">

            <el-form-item label="Banner类型：home/audio" prop="type">
              <el-input
                v-model="form.type"
                placeholder="Banner类型：home/audio"
                disabled
              />
            </el-form-item>
            <el-form-item label="Banner描述" prop="description">
              <el-input
                v-model="form.description"
                placeholder="Banner描述"
                type="textarea"
                :autosize="false"
                style="resize: vertical;"
              />
            </el-form-item>
            <el-form-item v-if="form.type === 'audio'" label="二级描述（用于audio）" prop="subDescription">
              <el-input
                v-model="form.subDescription"
                placeholder="二级描述（用于audio）"
                type="textarea"
                :autosize="false"
                style="resize: vertical;"
              />
            </el-form-item>
            <el-form-item
              v-if="form.type === 'audio'"
              label="PDF标题"
              prop="pdfTitle"
            >
              <el-input
                v-model="form.pdfTitle"
                placeholder="PDF标题（用于audio）"
              />
            </el-form-item>
            <el-form-item v-if="form.type === 'audio'" label="PDF下载链接" prop="pdfUrl" class="form-item">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="(res) => handleUploadSuccess(res, 'pdfUrl')"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传PDF</el-button>
                <template #tip>
                  <!-- <div v-if="form.pdfUrl" class="upload-preview">
                                            <iframe :src="previewPdfUrl" class="preview-pdf" frameborder="0"></iframe>
                                            <div class="image-url">{{ form.pdfUrl }}</div>
                                          </div> -->
                  <div v-if="form.pdfUrl" class="upload-preview">
                    <!-- PDF 预览图 -->
                    <div class="preview-wrapper">
                      <img
                        :src="previewPdfUrl"
                        class="preview-pdf"
                        @click="handlePreviewPDF"
                      >

                    </div>
                    <div class="file-info">
                      <i class="el-icon-document" />
                      <span class="file-name">{{ getFileName(form.pdfUrl) }}</span>
                    </div>
                  </div>
                  <!-- 添加 PDF 预览弹窗 -->
                  <el-dialog
                    title="PDF 预览"
                    :visible.sync="pdfPreviewVisible"
                    width="90%"
                    :before-close="handlePreviewClose"
                    class="pdf-preview-dialog"
                    append-to-body
                  >
                    <iframe
                      :src="fullPdfUrl"
                      class="pdf-viewer"
                      frameborder="0"
                    />
                  </el-dialog>
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
import { addSysSiteBanners, delSysSiteBanners, getSysSiteBanners, listSysSiteBanners, updateSysSiteBanners } from '@/api/site/sys-site-banners'
import { getToken } from '@/utils/auth'

export default {
  name: 'SysSiteBanners',
  components: {
  },
  data() {
    return {
      // 添加预览相关数据
      pdfPreviewVisible: false,
      baseUrl: process.env.VUE_APP_BASE_API,
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
      sysSiteBannersList: [],

      // 关系表类型

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
      // 设置上传的请求头部
      headers: { 'Authorization': 'Bearer ' + getToken() },
      // 添加上传地址
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile',
      // 添加文件上传限制
      fileLimit: {
        types: ['application/pdf'],
        size: 50 // MB
      }
    }
  },
  computed: {
    // 获取预览图URL
    previewPdfUrl() {
      if (!this.form.pdfUrl) return ''
      // 使用后端预览图生成接口，如果有的话
      return this.baseUrl + '/static/images/pdf-icon.png'
      // 如果没有预览图生成接口，可以使用默认的 PDF 图标
      // return '/static/images/pdf-icon.png'
    },

    // 获取完整的 PDF URL
    fullPdfUrl() {
      if (!this.form.pdfUrl) return ''
      console.log(this.getFullPath(this.form.pdfUrl))
      return this.getFullPath(this.form.pdfUrl)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getFullPath(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      // 确保路径正确拼接，避免重复的斜杠
      const basePath = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl
      const relativePath = path.startsWith('/') ? path : '/' + path
      return basePath + relativePath
    },
    // 获取文件名
    getFileName(path) {
      if (!path) return ''
      return path.split('/').pop()
    },

    // PDF 预览处理
    handlePreviewPDF() {
      if (!this.form.pdfUrl) {
        this.$message.warning('没有可预览的PDF文件')
        return
      }
      this.pdfPreviewVisible = true
    },

    handlePreviewClose(done) {
      done()
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysSiteBanners(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.sysSiteBannersList = response.data.list
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
        type: undefined,
        description: undefined,
        subDescription: undefined,
        pdfTitle: undefined,
        pdfUrl: undefined
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
      this.title = '添加站点Banner管理'
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
      getSysSiteBanners(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改站点Banner管理'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSysSiteBanners(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysSiteBanners(this.form).then(response => {
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
        return delSysSiteBanners({ 'ids': Ids })
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
        const relativePath = res.data.path // 保存相对路径
        this.form[field] = relativePath // 存储相对路径
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    beforeUpload(file) {
      // 文件类型检查
      if (!this.fileLimit.types.includes(file.type)) {
        this.$message.error('只能上传PDF！')
        return false
      }

      // 文件大小检查
      const isLtLimit = file.size / 1024 / 1024 < this.fileLimit.size
      if (!isLtLimit) {
        this.$message.error(`上传PDF大小不能超过 ${this.fileLimit.size}MB!`)
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

  .preview-wrapper {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 400px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;

    &:hover .preview-overlay {
      opacity: 1;
    }

    .preview-pdf {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;

      i {
        font-size: 32px;
        margin-bottom: 10px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .file-info {
    margin-top: 10px;
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 14px;

    i {
      margin-right: 5px;
    }

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.preview-pdf {
  width: 100%; /* 预览宽度自动适配父容器 */
  height: 600px; /* 固定高度，可以根据需要调整 */
  border: 1px solid #dcdfe6; /* 边框 */
  border-radius: 4px; /* 圆角 */
  background: #f5f7fa; /* 背景颜色 */
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

.pdf-preview-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    height: calc(90vh - 108px);
  }

  .pdf-viewer {
    width: 100%;
    height: 100%;
  }
}

/* 调整表单项标签的对齐方式 */
.el-form-item__label {
  text-align: left;
  padding-right: 20px;
}

/* 上传按钮样式统一 */
.upload-demo .el-button {
  width: 120px;
}
</style>
