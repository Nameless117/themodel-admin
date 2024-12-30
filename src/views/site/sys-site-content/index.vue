//SysSiteContent.vue
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 保持原有的查询表单部分 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 保持原有的按钮操作部分 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['site:sysSiteContent:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
        </el-row>

        <!-- 保持原有的表格部分 -->
        <el-table v-loading="loading" :data="sysSiteContentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="内容类型" prop="type" align="center" />
          <el-table-column label="内容标题" prop="title" align="center" />
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
                  v-permisaction="['site:sysSiteContent:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
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

        <!-- 优化后的编辑对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="80%" :before-close="handleClose">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="内容类型" prop="type">
              <el-input
                v-model="form.type"
                placeholder="内容类型：home/about/audio"
                disabled
              />
            </el-form-item>
            <el-form-item label="内容名称" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入内容名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="富文本内容" prop="content">
              <div class="editor-container">
                <Toolbar
                  class="toolbar-container"
                  :editor="editor"
                  :default-config="toolbarConfig"
                  :mode="mode"
                />
                <Editor
                  v-model="html"
                  class="editor-content"
                  :default-config="editorConfig"
                  :mode="mode"
                  style="height: 400px"
                  @onChange="handleChange"
                  @onCreated="handleCreated"
                  @onDestroyed="handleDestroyed"
                />
                <div class="word-count">
                  {{ currentLength }}/{{ maxLength }}字
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="form.type === 'about'" label="附加内容">
              <div v-for="(quote, index) in form.subContent" :key="index">
                <el-card style="margin-bottom: 10px;">
                  <el-input
                    v-model="quote.saying"
                    placeholder="请输入格言"
                    style="margin-bottom: 10px;"
                  />
                  <el-input
                    v-model="quote.author"
                    placeholder="请输入作者"
                  />
                  <el-button
                    v-if="form.subContent.length > 1"
                    type="danger"
                    style="margin-top: 10px;"
                    @click="removeQuote(index)"
                  >删除</el-button>
                </el-card>
              </div>
              <el-button type="primary" @click="addQuote">
                添加格言
              </el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="html" @click="previewContent">预览</el-button>
            <el-button type="primary" :loading="submitting" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 预览对话框 -->
        <el-dialog
          title="内容预览"
          :visible.sync="previewVisible"
          append-to-body
          width="60%"
        >
          <div class="preview-content" v-html="html" />
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { getSysSiteContent, listSysSiteContent, updateSysSiteContent } from '@/api/site/sys-site-content'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { getToken } from '@/utils/auth'
import axios from 'axios' // 添加这行

export default {
  name: 'SysSiteContent',
  components: {
    Editor,
    Toolbar
  },
  data() {
    return {
      // 原有的数据部分
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      title: '',
      open: false,
      isEdit: false,
      typeOptions: [],
      sysSiteContentList: [],
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },

      // 编辑器相关数据
      editor: null,
      html: '',
      mode: 'default',
      toolbarConfig: {
        excludeKeys: ['fullScreen']
      },
      editorConfig: {
        placeholder: '请输入内容...',
        maxLength: 20000,
        MENU_CONF: {
          uploadImage: {
            // 自定义上传
            customUpload: this.customUpload,
            // 上传之前触发
            onBeforeUpload: this.onBeforeImageUpload,
            // 上传成功触发
            onSuccess: this.onImageUploadSuccess,
            // 上传失败触发
            onError: this.onImageUploadError,
            // 上传进度变化时触发
            onProgress: this.onImageUploadProgress,
            // 插入图片时的回调
            onInserted: this.onImageInserted,
            // 上传配置
            fieldName: 'file',
            maxFileSize: 50 * 1024 * 1024, // 50MB
            maxNumberOfFiles: 10,
            allowedFileTypes: ['image/*', 'application/pdf'],
            // meta信息
            meta: {},
            // 自定义headers
            headers: {
              Authorization: 'Bearer ' + getToken()
            },
            // 自定义请求参数
            formData: {}
          }
        }
      },
      // 文件上传相关配置
      uploadConfig: {
        headers: { 'Authorization': 'Bearer ' + getToken() },
        uploadUrl: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile',
        fileLimit: {
          types: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
          size: 50 // MB
        }
      },
      // 表单相关数据
      form: {
        subContent: [{ saying: '', author: '' }] // 初始化一个空的格言
      },
      rules: {
        title: [
          { required: true, message: '请输入内容名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入富文本内容', trigger: 'blur' }
        ]
      },

      // 新增的数据
      submitting: false,
      previewVisible: false,
      currentLength: 0,
      maxLength: 20000
    }
  },
  created() {
    this.getList()
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    // 添加新格言
    addQuote() {
      if (!this.form.subContent) {
        this.$set(this.form, 'subContent', [])
      }
      this.form.subContent.push({
        saying: '',
        author: ''
      })
    },

    removeQuote(index) {
      this.form.subContent.splice(index, 1)
    },
    // 保持原有的方法
    getList() {
      this.loading = true
      listSysSiteContent(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.sysSiteContentList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },

    // 编辑器相关方法
    // handleCreated(editor) {
    //   this.editor = Object.seal(editor)
    // },

    handleDestroyed() {
      this.editor = null
    },

    // 图片上传相关方法
    async customUpload(file, insertFn) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        // 使用 axios 或其他 HTTP 客户端发送请求
        const response = await axios.post(
          this.uploadConfig.uploadUrl,
          formData,
          { headers: this.uploadConfig.headers }
        )

        if (response.data.code === 200) {
          // 上传成功，插入图片
          insertFn(response.data.data.full_path, file.name, response.data.data.full_path)
          this.$message.success('文件上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
          return false
        }
      } catch (error) {
        this.$message.error('上传出错: ' + error.message)
        console.error('Upload error:', error)
        return false
      }
    },

    onBeforeImageUpload(file) {
      // 文件类型检查
      if (!this.uploadConfig.fileLimit.types.includes(file.type)) {
        this.$message.error('只能上传JPG/PNG/GIF/PDF格式文件！')
        return false
      }

      // 文件大小检查
      const isLtLimit = file.size / 1024 / 1024 < this.uploadConfig.fileLimit.size
      if (!isLtLimit) {
        this.$message.error(`文件大小不能超过 ${this.uploadConfig.fileLimit.size}MB!`)
        return false
      }

      return true
    },

    onImageUploadSuccess(file, res) {
      this.$message.success('文件上传成功')
    },

    onImageUploadError(file, err) {
      this.$message.error('文件上传失败: ' + (err.msg || '未知错误'))
      console.error('Upload failed:', err)
    },

    onImageUploadProgress(progress) {
      console.log('Upload progress:', progress)
    },

    onImageInserted(imageNode) {
      console.log('Image inserted:', imageNode)
    },

    // 预览相关方法
    previewContent() {
      if (!this.html) {
        this.$message.warning('没有内容可预览')
        return
      }
      this.previewVisible = true
    },

    // 更新的编辑器事件处理方法
    handleCreated(editor) {
      this.editor = Object.seal(editor)
      // 设置编辑器配置
      if (this.editor) {
        this.editor.config.uploadImage = {
          ...this.editor.config.uploadImage,
          ...this.editorConfig.MENU_CONF.uploadImage
        }
      }
    },

    handleChange(editor) {
      this.form.content = this.html
      // 修改获取长度的方法
      this.currentLength = this.html.length // 直接使用 html 内容的长度

      if (this.currentLength >= this.maxLength) {
        this.$message.warning(`内容长度已达到最大限制 ${this.maxLength} 个字符`)
      }
    },

    // 修改原有的方法
    // handleUpdate(row) {
    //   this.reset()
    //   const id = row.id || this.ids
    //   getSysSiteContent(id).then(response => {
    //     this.form = response.data
    //     this.html = this.form.content // 设置编辑器内容
    //     this.open = true
    //     this.title = '修改站点内容管理'
    //     this.isEdit = true
    //   })
    // },
    handleUpdate(row) {
      this.reset() // 这会初始化一个空的格言数组
      const id = row.id || this.ids
      getSysSiteContent(id).then(response => {
        this.form = {
          ...response.data,
          // 确保 subContent 是数组
          subContent: response.data.subContent
            ? (typeof response.data.subContent === 'string'
              ? JSON.parse(response.data.subContent)
              : response.data.subContent)
            : [{ saying: '', author: '' }]
        }
        this.html = this.form.content
        this.open = true
        this.title = '修改站点内容管理'
        this.isEdit = true
      })
    },

    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.submitting = true
          try {
            if (this.form.id !== undefined) {
              const response = await updateSysSiteContent(this.form)
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }
          } catch (error) {
            this.msgError('保存失败')
            console.error('Save error:', error)
          } finally {
            this.submitting = false
          }
        }
      })
    },

    cancel() {
      this.open = false
      this.reset()
    },

    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        title: undefined,
        content: undefined,
        subContent: [{ saying: '', author: '' }] // 重置时保持一个空的格言
      }
      this.html = ''
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.editor) {
        this.editor.clear()
      }
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
      this.title = '添加站点内容管理'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleClose(done) {
      if (this.html && !this.submitting) {
        this.$confirm('确认关闭？未保存的内容将会丢失', '提示', {
          type: 'warning'
        }).then(() => {
          done()
          this.reset()
        }).catch(() => {})
      } else {
        done()
        this.reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &:hover {
    border-color: #c0c4cc;
  }

  .toolbar-container {
    border-bottom: 1px solid #dcdfe6;
  }

  .editor-content {
    height: 400px;
    overflow-y: auto;
  }

  .word-count {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 12px;
    color: #909399;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
  }
}

.preview-content {
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
}

// 添加上传相关样式
.upload-preview {
  margin-top: 10px;
  width: 100%;

  img {
    max-width: 100%;
    max-height: 200px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.upload-progress {
  margin-top: 5px;

  .el-progress-bar {
    width: 100%;
  }
}

:deep(.w-e-text-container) {
  height: calc(400px - 40px) !important;
}
.editor-container {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &:hover {
    border-color: #c0c4cc;
  }

  .toolbar-container {
    border-bottom: 1px solid #dcdfe6;
  }

  .editor-content {
    height: 400px;
    overflow-y: auto;
  }

  .word-count {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 12px;
    color: #909399;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
  }
}

.preview-content {
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
}

// 添加上传相关样式
.upload-preview {
  margin-top: 10px;
  width: 100%;

  img {
    max-width: 100%;
    max-height: 200px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.upload-progress {
  margin-top: 5px;

  .el-progress-bar {
    width: 100%;
  }
}
.quote-item {
  .el-card {
    margin-bottom: 15px;
  }

  .el-input {
    margin-top: 5px;
  }
}

.mb-4 {
  margin-bottom: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.text-gray-500 {
  color: #909399;
}

:deep(.w-e-text-container) {
  height: calc(400px - 40px) !important;
}

:deep(.w-e-toolbar) {
  border-bottom: 1px solid #dcdfe6;
}

:deep(.w-e-text-container) {
  border: none;
}
</style>
