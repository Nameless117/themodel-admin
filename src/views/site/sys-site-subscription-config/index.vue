
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
<!--                                v-permisaction="['site:sysSiteSubscriptionConfig:add']"-->
<!--                                type="primary"-->
<!--                                icon="el-icon-plus"-->
<!--                                size="mini"-->
<!--                                @click="handleAdd"-->
<!--                        >新增-->
<!--                        </el-button>-->
<!--                    </el-col>-->
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['site:sysSiteSubscriptionConfig:edit']"
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
<!--                                v-permisaction="['site:sysSiteSubscriptionConfig:remove']"-->
<!--                                type="danger"-->
<!--                                icon="el-icon-delete"-->
<!--                                size="mini"-->
<!--                                :disabled="multiple"-->
<!--                                @click="handleDelete"-->
<!--                        >删除-->
<!--                        </el-button>-->
<!--                    </el-col>-->
                </el-row>

                <el-table v-loading="loading" :data="sysSiteSubscriptionConfigList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="订阅标题" prop="title" align="center" />
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
                             v-permisaction="['site:sysSiteSubscriptionConfig:edit']"
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
<!--                              v-permisaction="['site:sysSiteSubscriptionConfig:remove']"-->
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
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                                    <el-form-item label="订阅标题" prop="title">
                                        <el-input v-model="form.title" placeholder="订阅标题"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="样章描述" prop="exampleDesc">
                                      <el-input
                                        v-model="form.exampleDesc"
                                        placeholder="样章描述"
                                        type="textarea"
                                        :autosize="false"
                                        style="resize: vertical;"
                                      />
                                    </el-form-item>
                                    <el-form-item label="样章下载链接" prop="exampleUrl" class="form-item">
                                      <el-upload
                                        class="upload-demo"
                                        :headers="headers"
                                        :action="uploadImgUrl"
                                        :show-file-list="false"
                                        :on-success="(res) => handleUploadSuccess(res, 'exampleUrl')"
                                        :before-upload="beforeUpload"
                                      >
                                        <el-button type="primary">上传PDF</el-button>
                                        <template #tip>
                                          <div v-if="form.exampleUrl" class="upload-preview">
                                            <img :src="form.exampleUrl" class="preview-pdf">
                                            <div class="image-url">{{ form.exampleUrl }}</div>
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
    import {addSysSiteSubscriptionConfig, delSysSiteSubscriptionConfig, getSysSiteSubscriptionConfig, listSysSiteSubscriptionConfig, updateSysSiteSubscriptionConfig} from '@/api/site/sys-site-subscription-config'

    import { getToken } from '@/utils/auth'

    export default {
        name: 'SysSiteSubscriptionConfig',
        components: {
        },
        data() {
            return {
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
                sysSiteSubscriptionConfigList: [],

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
        created() {
            this.getList()
            },
        methods: {
          /** 查询参数列表 */
          getList() {
            this.loading = true
            listSysSiteSubscriptionConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.sysSiteSubscriptionConfigList = response.data.list
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
              title: undefined,
              exampleDesc: undefined,
              exampleUrl: undefined,
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
            this.title = '添加站点订阅配置'
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
            getSysSiteSubscriptionConfig(id).then(response => {
              this.form = response.data
              this.open = true
              this.title = '修改站点订阅配置'
              this.isEdit = true
            })
          },
          /** 提交按钮 */
          submitForm: function() {
            this.$refs['form'].validate(valid => {
              if (valid) {
                if (this.form.id !== undefined) {
                  updateSysSiteSubscriptionConfig(this.form).then(response => {
                    if (response.code === 200) {
                      this.msgSuccess(response.msg)
                      this.open = false
                      this.getList()
                    } else {
                      this.msgError(response.msg)
                    }
                  })
                } else {
                  addSysSiteSubscriptionConfig(this.form).then(response => {
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
              return delSysSiteSubscriptionConfig({ 'ids': Ids })
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
              this.form[field] = res.data.path // 根据实际返回格式调整
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
  width: 100%;
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

