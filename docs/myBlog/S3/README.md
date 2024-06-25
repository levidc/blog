---
title: 对象上传及大文件分段
date: 2024-05-08
categories:
  - js

tags:
  - js原生
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/15.jpg)

<!-- more -->



## 文件上传（文件拖拽、文件夹上传）

```js
<template>
  <div>
    <el-row>
      <el-col :span="24" class="manage-area-title">
        <h2>备份</h2>
      </el-col>
    </el-row>
    <!-- <BreadCrumbs /> -->
    <div v-loading="getHostLoading" class="page_content_wrap">
      <el-form ref="form" class="form" :model="form" style="width: 40%;" label-width="150px" :rules="rules">
        <el-form-item label="hostName">
          <el-input v-model="form.hostName" placeholder="请输入hostName" readonly />
        </el-form-item>
        <el-form-item label="endpoint" prop="endpoint">
          <el-input v-model="form.endpoint" clearable placeholder="请输入endpoint" />
        </el-form-item>
        <el-form-item label="Access Key" prop="accessKeyId">
          <el-input v-model="form.accessKeyId" clearable placeholder="请输入Access Key" />
        </el-form-item>
        <el-form-item label="Secret Key" prop="secretAccessKey">
          <el-input v-model="form.secretAccessKey" type="password" show-password clearable placeholder="请输入Secret Key" style="width: 80%;" />
          <el-button style="position: absolute; right: 0;top:8px" @click="getBucketList">连接</el-button>
        </el-form-item>
        <el-form-item v-if="bucketList&&bucketList.length" label="bucket" prop="Bucket">
          <el-select v-model="form.Bucket" clearable placeholder="请选择一个bucket" filterable>
            <el-option v-for="x in bucketList" :key="x" :value="x" :label="x" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="golden" @click="validateBucket()">备份</el-button>
          <el-button class="blue" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="备份" :visible.sync="dirFlag" width="65%" destroy-on-close>
      <el-form ref="createForm" :model="createForm" size="mini" label-width="150px" style="padding:0 5%">
        <!-- :before-upload="validateFileRule" -->
        <!-- :accept=",,拼接可接受文件类型 image/* 任意图片文件" -->
        <!-- :http-request="uploadFile"  覆盖原生action上传方法-->
        <!-- var formData = new FormData();  //  用FormData存放上传文件 -->
        <!-- formData.append('paramsName','file') -->
        <el-row>
          <el-col :span="3">
            <el-upload
              ref="uploadFile"
              action="#"
              multiple
              :show-file-list="false"
              :http-request="handleRequest"
              :before-upload="handleSizeValidate"
              :on-change="changeFile"
            >
              <!-- <el-button size="small" class="golden" @click="postFolder('file')">上传文件</el-button> -->
              <el-button size="small" class="golden" @click="postFolder('folder')">上传文件夹</el-button>
            </el-upload>
          </el-col>
          <el-col :span="3">
            <el-button class="blue" @click="cleafFile">清空</el-button>
          </el-col>
        </el-row>
        <!-- <input type="file" id="upload" ref="inputer" name="file" multiple /> -->
        <div
          draggable="true"
          class="drag tableBox"
          @dragover="(e)=>e.preventDefault()"
          @drop="onDrop"
        >
          <div v-show="!fileListArr.length" class="el-upload__text">
            <i class="el-icon-upload" style="margin-right: 6px" />拖拽文件夹到此处
            <!-- <el-button type="text" @click="addFiles">添加文件</el-button> -->
          </div>
          <div v-show="!fileListArr.length" class="el-upload__text">
            <!-- 文件上传数量不能超过100个，总大小不超过5GB -->
            单个文件大小不超过50GB
          </div>
          <el-table v-show="fileListArr.length" :data="fileListArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
            <el-table-column label="对象key" prop="name" min-width="120px" />
            <el-table-column label="目录" min-width="120px">
              <template slot-scope="scope">
                {{ (scope.row.webkitRelativePath ? form.hostName +'/'+ scope.row.webkitRelativePath : form.hostName +'/'+ scope.row.relativePath) | renderPath }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="180px">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column label="大小" width="120px">
              <template slot-scope="scope">
                {{ byteConvert(scope.row.size) }}
              </template>
            </el-table-column>
            <el-table-column label="移除" width="100px">
              <template slot-scope="scope">
                <svg class="icon" aria-hidden="true" @click="removeItem(scope)">
                  <use xlink:href="#icon-trash" />
                </svg>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="fileListArr.length"
            :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fileListArr.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="golden" :disabled="fileListArr.length==0" @click="confirmPut()">{{ $trans('button.confirm') }}</el-button>
        <el-button @click="dirFlag = false;">{{ $trans('button.cancel') }}</el-button>
      </div>
    </el-dialog></div>
</template>
<script>
import {
  upload,
  hostname
} from '@/api/agent'
const AWS = require('aws-sdk')
// const FileSaver = require('file-saver')
import moment from 'moment'
export default {
  filters: {
    renderPath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    }
  },
  data () {
    return {
      createForm: {
        folderName: ''
      },
      dirFlag: false,
      form: {
        hostName: '',
        accessKeyId: '',
        secretAccessKey: '',
        // endpoint: 'http://10.0.2.154:8300',
        endpoint: '',
        path: '',
        Bucket: ''
      },
      bucketList: [],
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      fileListArr: [],
      executeTime: '',
      rules: {
        // hostName: { required: true, message: '请输入hostName' },
        accessKeyId: { required: true, message: '请输入accessKeyId' },
        secretAccessKey: { required: true, message: '请输入secretAccessKey' },
        endpoint: { required: true, message: '请输入endpoint' },
        Bucket: { required: true, message: '请选择bucket' }
      },
      S3: null,
      noBucket: false,
      getHostLoading: false,
      uploadSizeLimt: 1024 ** 4, // 上传文件大小限制 1T
      uploadPartSize: 1024 * 1024 * 5, // 分段大小&&文件启用分段大小
      sizeError: [],
      enableReUpload: true,
      readFileList: []
    }
  },
  watch: {
    dirFlag (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['uploadFile'].clearFiles()
        })
        this.fileListArr = []
      } else {
        this.releaseDisable()
        this.doClearFileLog()
      }
    }
  },
  mounted () {
    // get HostName、默认传递
    this.init()
    // setTimeout(() => {
    //   this.getBucketList()
    // })
  },
  methods: {
    handlePutPath (file) {
      const {
        webkitRelativePath,
        relativePath
      } = file
      return webkitRelativePath || relativePath
    },
    cleafFile () {
      this.fileListArr = [] // 清除表格展示
      this.$refs['uploadFile'].clearFiles() // 清除组件FileList
    },
    handleRequest (val) {
      // 无功能、为自定义请求触发 beforeUpload校验文件
      // console.log(val, '123')
    },
    handleSizeValidate (file) {
      const size = file.size
      if (size > this.uploadSizeLimt) {
        this.sizeError.push(file.name)
        return false
      } else {
        // put到上传列表
        // 此处去重、判断Key和目录同时一致、就移除之前的旧文件、替代新文件（暂无提示）
        const isExist = this.fileListArr.findIndex(x => x.name === file.name && x.webkitRelativePath === file.webkitRelativePath)
        if (isExist > -1) {
          this.fileListArr.splice(isExist, 1)
        }
        this.fileListArr.push(file)
      }
    },
    init () {
      // const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
      // this.form.accessKeyId = accessKeyId
      // this.form.endpoint = endpoint
      // this.form.hostName = 'Dc'

      this.getHostLoading = true
      hostname().then(res => {
        this.form.hostName = res.data || ''
      }).finally(() => {
        this.getHostLoading = false
        const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
        this.form.accessKeyId = accessKeyId
        this.form.endpoint = endpoint
      })
    },
    removeItem (row) {
      const index = this.fileListArr.findIndex(x => x.uid === row.row.uid)
      this.fileListArr.splice(index, 1)
      // 最后一页删除后、切到1
      if (this.fileListArr.length / this.pageSize <= 1) {
        this.currentPage = 1
      } else if (Math.ceil(this.fileListArr.length / this.pageSize) < this.currentPage) {
        this.currentPage = this.currentPage - 1
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    changeFile (file, fileList) {
      // console.log(file, fileList, 12333)
      // this.fileListArr = fileList
      // this.total = this.fileListArr.length
      // 本地记录分段上传文件 abortMultiple
      return
      var blob = file.raw
      // 测试大文件分片
      const fileSize = file.raw.size
      const chunkSize = this.uploadPartSize
      const chunks = Math.ceil(fileSize / chunkSize)
      const {
        Bucket,
        hostName,
        endpoint,
        accessKeyId
      } = this.form
      const Key = hostName + '/' + file.raw.webkitRelativePath
      this.S3.createMultipartUpload({
        Bucket,
        Key
      }, (err, data) => {
        if (err) {
          console.error('Error creating multipart upload:', err)
          return
        } else {
          const keyList = JSON.parse(localStorage.getItem('keyList')) || []
          const UploadId = data.UploadId
          keyList.push({
            Bucket,
            Key,
            UploadId: data.UploadId,
            accessKeyId,
            endpoint
          })
          localStorage.setItem('keyList', JSON.stringify(keyList))
          const multiplePart = []
          // uploadPart
          for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
            const start = chunkCount * chunkSize
            const end = Math.min(start + chunkSize, fileSize)
            const body = blob.slice(start, end)
            const reqParams = {
              PartNumber: chunkCount + 1,
              Body: body,
              Bucket,
              Key,
              UploadId: data.UploadId
            }
            const p = new Promise((res, rej) => {
              this.S3.uploadPart(reqParams
                , (err, data) => {
                  if (err) rej(err)
                  else res(data)
                })
            })
            multiplePart.push(p)
          }
          // uploadPart End
          Promise.allSettled(multiplePart).then(listPartFin => {
            console.log(listPartFin, 'finish')
            const partOver = listPartFin.every(x => x.status === 'fulfilled')
            if (partOver) {
              // listParts
              var params = {
                Bucket,
                Key: hostName + '/' + file.raw.webkitRelativePath,
                UploadId: data.UploadId
              }
              // this.S3.listMultipartUploads({ Bucket }, (err, data) => {
              //   console.log(err, data, '123')
              // })
              this.S3.listParts(params, (err, res) => {
                if (err) return
                else {
                  const Parts = res.Parts.map(x => {
                    return {
                      PartNumber: x.PartNumber,
                      ETag: x.ETag
                    }
                  }).sort((a, b) => a.PartNumber - b.PartNumber)
                  // finish
                  this.S3.completeMultipartUpload({
                    Bucket,
                    Key,
                    UploadId: data.UploadId,
                    MultipartUpload: { Parts }
                  }, (err, data) => {
                    // 测试取消分段上传
                    console.log(err, data)
                  })
                }
              })
            } else {
              // handle reUploadPart
            }
          })
        }
      })
    },

    handleMultUpload (fileArr) {
      const chunkSize = this.uploadPartSize
      const {
        Bucket,
        hostName,
        accessKeyId,
        endpoint
      } = this.form
      const arr = localStorage.getItem('fileList')
      if (!arr) localStorage.setItem('fileList', '[]')
      this.readFileList = JSON.parse(arr || '[]')
      // return PromiseMultiple
      return fileArr.map(file => {
        const fileSize = file.size
        const chunks = Math.ceil(fileSize / chunkSize)
        const Key = hostName + '/' + this.handlePutPath(file)
        file['Key'] = Key
        return new Promise((resolve, rejected) => {
          // 检测文件检测失败重传
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss')

          const isExistReUploadPart = this.readFileList.find(x => {
            return x.Key === Key && x.Bucket === Bucket && x.accessKeyId === accessKeyId && x.endpoint === endpoint && x.reUpload
          })
          if (isExistReUploadPart) {
            // 存在切片、在有效期且开启续传
            const {
              parts
            } = isExistReUploadPart
            const multiplePart = []
            for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
              const start = chunkCount * chunkSize
              const end = Math.min(start + chunkSize, fileSize)
              const body = file.slice(start, end)
              const reqParams = {
                PartNumber: chunkCount + 1,
                Body: body,
                Bucket,
                Key,
                UploadId: isExistReUploadPart.UploadId
              }
              const jumpPass = parts.some(x => x.PartNumber === chunkCount + 1)
              if (jumpPass) continue
              const p = new Promise((res, rej) => {
                this.S3.uploadPart(reqParams
                  , (uploadPartErr, uploadPartData) => {
                    if (uploadPartErr) rej(uploadPartErr)
                    else res(uploadPartData)
                  })
              })
              multiplePart.push(p)
            }
            // afterUploadPart
            Promise.allSettled(multiplePart).then(listPartFin => {
              // console.log(listPartFin, 'finish')
              const partOver = listPartFin.every(x => x.status === 'fulfilled')
              if (partOver) {
                // listParts
                var params = {
                  Bucket,
                  Key,
                  UploadId: isExistReUploadPart.UploadId
                }
                this.S3.listParts(params, (partErr, partRes) => {
                  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  if (partErr) {
                    rejected({
                      err: partErr,
                      file,
                      startTime,
                      endTime
                    })
                  } else {
                    const Parts = partRes.Parts.map(x => {
                      return {
                        PartNumber: x.PartNumber,
                        ETag: x.ETag
                      }
                    }).sort((a, b) => a.PartNumber - b.PartNumber)
                    // finish
                    this.S3.completeMultipartUpload({
                      Bucket,
                      Key,
                      UploadId: isExistReUploadPart.UploadId,
                      MultipartUpload: { Parts }
                    }, (compErr, compErrData) => {
                      if (compErr) {
                        const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                        rejected({
                          err: compErr,
                          file,
                          startTime,
                          endTime
                        })
                      } else {
                        resolve(compErrData)
                      }
                      // console.log(compErr, compErrData)
                    })
                  }
                })
              } else {
                // 处理uploadpart错误、取其中一个error
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                const err = listPartFin.find(x => x.status === 'rejected')?.reason
                rejected({
                  err: err,
                  file,
                  startTime,
                  endTime
                })
                // handle reUploadPart
              }
            })
          } else {
            this.S3.createMultipartUpload({
              Bucket,
              Key
            }, (createErr, createData) => {
              const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
              if (createErr) {
              // console.error('Error creating multipart upload:', createErr)
                console.log(createErr, 'listPartFin')
                rejected({ err: createErr, file, startTime, endTime })
              } else {
                const multiplePart = []
                // writeAbortLog
                this.readFileList.push({
                  accessKeyId,
                  endpoint,
                  Bucket,
                  Key,
                  UploadId: createData.UploadId
                })
                // 此处同步的所以有问题了vuex先缓存一下
                // endWrite 此处记录及最终Promise处处理完成判断、清楚记录或执行abortMultiple
                for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                  const start = chunkCount * chunkSize
                  const end = Math.min(start + chunkSize, fileSize)
                  const body = file.slice(start, end)
                  const reqParams = {
                    PartNumber: chunkCount + 1,
                    Body: body,
                    Bucket,
                    Key,
                    UploadId: createData.UploadId
                  }
                  const p = new Promise((res, rej) => {
                    // if (chunkCount > chunks - 2) {
                    //   reqParams.Bucket = '666'
                    // }
                    this.S3.uploadPart(reqParams
                      , (uploadPartErr, uploadPartData) => {
                        if (uploadPartErr) rej(uploadPartErr)
                        else res(uploadPartData)
                      })
                  })
                  multiplePart.push(p)
                }
                // uploadPart End
                Promise.allSettled(multiplePart).then(listPartFin => {
                // console.log(listPartFin, 'finish')
                  const partOver = listPartFin.every(x => x.status === 'fulfilled')
                  if (partOver) {
                  // listParts
                    var params = {
                      Bucket,
                      Key,
                      UploadId: createData.UploadId
                    }
                    this.S3.listParts(params, (partErr, partRes) => {
                      const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                      if (partErr) {
                        rejected({
                          err: partErr,
                          file,
                          startTime,
                          endTime
                        })
                      } else {
                        const Parts = partRes.Parts.map(x => {
                          return {
                            PartNumber: x.PartNumber,
                            ETag: x.ETag
                          }
                        }).sort((a, b) => a.PartNumber - b.PartNumber)
                        // finish
                        this.S3.completeMultipartUpload({
                          Bucket,
                          Key,
                          UploadId: createData.UploadId,
                          MultipartUpload: { Parts }
                        }, (compErr, compErrData) => {
                          if (compErr) {
                            const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                            rejected({
                              err: compErr,
                              file,
                              startTime,
                              endTime
                            })
                          } else {
                            resolve(compErrData)
                          }
                          // console.log(compErr, compErrData)
                        })
                      }
                    })
                  } else {
                  // 处理uploadpart错误、取其中一个error
                    const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    const err = listPartFin.find(x => x.status === 'rejected')?.reason
                    rejected({
                      err: err,
                      file,
                      startTime,
                      endTime
                    })
                  // handle reUploadPart
                  }
                })
              }
            })
          }
        })
      })
    },
    postFolder (type) {
      if (type === 'file') {
        $('.el-upload__input')[0].webkitdirectory = false
      } else {
        $('.el-upload__input')[0].webkitdirectory = true
      }
    },
    releaseDisable () {
      document.oncontextmenu = function () { }
      document.onkeydown = function (event) {}
      window.onbeforeunload = function () {}
    },
    resetForm (formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].resetFields()
      }
    },

    onDrop (e) {
      e.preventDefault()
      const dataTransfer = e.dataTransfer
      if (
        dataTransfer.items &&
        dataTransfer.items[0] &&
        dataTransfer.items[0].webkitGetAsEntry
      ) {
        this.webkitReadDataTransfer(dataTransfer)
      }
    },
    webkitReadDataTransfer (dataTransfer) {
      let fileNum = dataTransfer.items.length
      const files = []
      this.loading = true

      // 递减计数，当fileNum为0，说明读取文件完毕
      const decrement = () => {
        if (--fileNum === 0) {
          this.handleFiles(files)
          this.loading = false
        }
      }

      // 递归读取文件方法
      const readDirectory = (reader) => {
        // readEntries() 方法用于检索正在读取的目录中的目录条目，并将它们以数组的形式传递给提供的回调函数。
        reader.readEntries((entries) => {
          if (entries.length) {
            fileNum += entries.length
            entries.forEach((entry) => {
              if (entry.isFile) {
                entry.file((file) => {
                  readFiles(file, entry.fullPath)
                }, readError)
              } else if (entry.isDirectory) {
                readDirectory(entry.createReader())
              }
            })

            readDirectory(reader)
          } else {
            decrement()
          }
        }, readError)
      }
      // 文件对象
      const items = dataTransfer.items
      // 拖拽文件遍历读取
      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry()
        if (!entry) {
          decrement()
          return
        }

        if (entry.isFile) {
          // 读取单个文件
          return
          // readFiles(items[i].getAsFile(), entry.fullPath, 'file')
        } else {
          // entry.createReader() 读取目录。
          readDirectory(entry.createReader())
        }
      }

      function readFiles (file, fullPath) {
        file.relativePath = fullPath.substring(1)
        files.push(file)
        decrement()
      }
      function readError (fileError) {
        throw fileError
      }
    },

    handleFiles (files) {
      // 按文件名称去存储列表，考虑到批量拖拽不会有同名文件出现
      const dirObj = {}
      // console.log(files, '1233')
      // return
      files.forEach((item) => {
        // relativePath 和 name 一致表示上传的为文件，不一致为文件夹
        // 文件直接放入table表格中
        // 仍需考虑去重问题
        const isExist = this.fileListArr.findIndex(x => x.name === item.name && x.relativePath === item.relativePath)
        if (isExist > -1) {
          this.fileListArr.splice(isExist, 1)
        }
        this.fileListArr.push(item)
        // if (item.relativePath === item.name) {
        //   this.tableData.push({
        //     name: item.name,
        //     filesList: [item.file],
        //     isFolder: false,
        //     size: item.size
        //   })
        // }
        // // 文件夹，需要处理后放在表格中
        // if (item.relativePath !== item.name) {
        //   const filderName = item.relativePath.split('/')[0]
        //   if (dirObj[filderName]) {
        //     // 放入文件夹下的列表内
        //     const dirList = dirObj[filderName].filesList || []
        //     dirList.push(item)
        //     dirObj[filderName].filesList = dirList
        //     // 统计文件大小
        //     const dirSize = dirObj[filderName].size
        //     dirObj[filderName].size = dirSize ? dirSize + item.size : item.size
        //   } else {
        //     dirObj[filderName] = {
        //       filesList: [item],
        //       size: item.size
        //     }
        //   }
        // }
      })

      // 放入tableData
      Object.keys(dirObj).forEach((key) => {
        this.tableData.push({
          name: key,
          filesList: dirObj[key].filesList,
          isFolder: true,
          size: dirObj[key].size
        })
      })
    },

    validateBucket () {
      if (!this.form.Bucket) {
        if (this.bucketList.length) {
          this.$notify({
            type: 'error',
            title: '请选择一个bucket'
          })
        } else {
          if (this.noBucket) {
            this.$notify({
              type: '无bucket可用，请先创建bucket'
            })
          } else {
            this.$notify({
              type: 'error',
              title: '请点击“连接”按钮，设置bucket'
            })
          }
        }
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            document.onkeydown = function (event) {
              var e = event || window.event || arguments.callee.caller.arguments[0]
              if (e && e.keyCode == 116) {
                return false
              }
            }
            window.onbeforeunload = function (e) {
              // 兼容ie
              // 触发条件 产生交互、当前不支持自定义文字
              e = e || window.event
              if (e) e.returnValue = 'none'
              return 'none'
            }
            document.oncontextmenu = function () { return false }
            this.dirFlag = true
            const { endpoint, accessKeyId } = this.form
            localStorage.setItem('form', JSON.stringify({
              endpoint,
              accessKeyId
            }))
          }
        })
      }
    },
    getBucketList () {
      const {
        accessKeyId,
        secretAccessKey,
        endpoint
      } = this.form
      if (!endpoint) {
        this.$notify({
          type: 'error',
          title: '请输入endpoint'
        })
        return
      }
      if (!accessKeyId) {
        this.$notify({
          type: 'error',
          title: '请输入Access Key'
        })
        return
      }
      if (!secretAccessKey) {
        this.$notify({
          type: 'error',
          title: '请输入Secret Key'
        })
        return
      }
      this.S3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: 'EastChain-1',
        s3ForcePathStyle: true
      })
      this.S3.listBuckets((err, data) => {
        if (err) {
          // console.dir(err)
          // console.log('%c 123', 'color:red;font-size:20px')
          // "NetworkingError"
          let title = ''
          let message = ''
          if (err.code === 'AccessDenied') {
            title = '连接S3失败'
            message = '请检查ak/sk是否输入正确'
          } else if (Number(err.code) === 12) {
            title = '网络异常'
            message = '请检查endpoint是否正确'
          } else if (err.code === 'NetworkingError') {
            title = '网络异常'
            message = '请检查endpoint是否正确,或稍后再试'
          } else {
            title = '连接S3失败'
            message = this.$trans(err.message || '')
          }
          // console.dir(err, 'err')
          this.$notify({
            type: 'error',
            title,
            message,
            showClose: false,
            customClass: 'errorTip'
          })
          this.noBucket = false
          this.bucketList = []
          this.form.Bucket = ''
        } else {
          this.bucketList = (data.Buckets || []).map(x => x.Name)
          if (!this.bucketList.length) {
            this.$notify({
              type: 'error',
              title: '无bucket可用，请先创建bucket'
            })
            this.noBucket = true
          } else {
            this.form.Bucket = this.bucketList[0]
            this.$notify({
              type: 'success',
              title: '连接S3成功'
            })

            // 确保断网或刷新页面导致未完成的上传记录清除
            this.doClearFileLog()
          }
        }
      })
    },
    doClearFileLog () {
      const {
        accessKeyId,
        endpoint
      } = this.form
      const keyList = JSON.parse(JSON.stringify(this.readFileList))
      const doAbortTasks = keyList.map((x, i) => {
        return new Promise((resolve, rejected) => {
          if (accessKeyId === x.accessKeyId && endpoint === x.endpoint) {
            // 一致性确保listPart正常
            const params = {
              Bucket: x.Bucket,
              Key: x.Key,
              UploadId: x.UploadId
            }
            this.S3.listParts(params, (err, data) => {
              // 不存在err、complete完还有part、上传大文件失败
              // console.log(data, 'err', err)
              if (!err) {
                // doAbort
                const reUpload = data.Parts && data.Parts.length > 0
                // console.log(data, '1233', reUpload)
                if (reUpload && this.enableReUpload) {
                  keyList[i].reUpload = true
                  keyList[i].parts = data.Parts
                  const expireTime = keyList[i].expireTime
                  if (expireTime) {
                    if (
                      expireTime < moment().valueOf()) {
                      this.S3.abortMultipartUpload(params, (err, data) => {
                        if (!err) {
                          keyList[i].delete = true
                          resolve('clearTask')
                          // 清除该条记录
                        }
                      })
                    } else {
                      resolve('keepReUpload')
                    }
                  } else {
                    keyList[i].expireTime = moment().add(15, 'day').valueOf()
                    resolve('reUpload')
                  }
                  // 有切片需要支持后续上传
                } else {
                  this.S3.abortMultipartUpload(params, (err, data) => {
                    if (!err) {
                      keyList[i].delete = true
                      resolve('clearTask')
                      // 清除该条记录
                    }
                  })
                }
              } else {
                // 此处问题、
                keyList[i].delete = true
                resolve('clearTask')
                // 清除该条记录
              }
            })
          } else {
            rejected('notMatch')
            // noThingTodo
          }
        })
      })
      Promise.allSettled(doAbortTasks).then(res => {
        // localStorage.setItem('fileList', JSON.stringify(iterateArr))
        // 结束清理status为删除的
        const fileList = keyList.filter(x => x.delete !== true)
        this.readFileList = []
        localStorage.setItem('fileList', JSON.stringify(fileList))
        // console.log('checkOver', keyList, localStorage.getItem('fileList'))
      })
    },

    confirmPut () {
      const {
        Bucket,
        hostName
      } = this.form

      const putObjectArr = []
      const multUploadArr = []

      const judgeUploadType = async () => {
        this.fileListArr.forEach(x => {
          if (x.size <= this.uploadPartSize) {
            putObjectArr.push({
              Bucket,
              Key: hostName + '/' + this.handlePutPath(x),
              Body: x
            })
          } else {
            multUploadArr.push(x)
          }
        })
      }
      // 区分大文件
      (async () => {
        await judgeUploadType()
        // startPutObject
        // console.log(putObjectArr, multUploadArr)
        // return
        const loading = this.$loading({
          lock: true,
          text: '文件上传中，请勿关闭当前页面',
          spinner: 'el-icon-loading',
          background: 'rgba(1,1,1,.3)',
          customClass: 'putLoading'
        })
        try {
          const putObejcts = putObjectArr.map(file => {
            return new Promise((res, rej) => {
              const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
              this.S3.putObject(file, (err, data) => {
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                if (err) rej({ err, file, startTime, endTime })
                else res({ success: 'success', file, startTime, endTime })
              })
            })
          })
          const multipleObjects = this.handleMultUpload(multUploadArr)
          Promise.allSettled(
            [Promise.allSettled(putObejcts),
              Promise.allSettled(multipleObjects)
            ]
          ).then(result => {
            this.releaseDisable()
            loading.close()
            // console.log(result, 'result')
            this.writeErrorLog(result)
            // 上传及分段上传全部结束
          })
        } catch (error) {
          console.log('errorOperate')
        }
      })()
    },
    writeErrorLog (result) {
      const file = [...result[0].value, ...result[1].value]
      const failList = file.filter(x => x.status === 'rejected')
      const log = failList.reduce((pre, cur, i) => {
        return pre + '结束时间：' + cur.reason.endTime + ' ' + '对象Key: ' + cur.reason.file.Key + ' ' + ' ' + '错误原因: ' + cur.reason.err.message + '\n'
      }, '')
      const total = file.length
      const failCount = failList.length
      const successCount = total - failCount
      // console.log('===============', failList)
      if (failCount && failCount > 0) {
        upload({
          log
        }).then(res => {
          this.$notify({
            title: '上传完成',
            dangerouslyUseHTMLString: true,
            type: 'success',
            message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
          <br/> <span style="color:#d3d6d8;font-size:15px">请到备份历史查看详情</span>
        </p>`
          })
        }).finally(() => {
          this.dirFlag = false
        })
      } else {
        this.$notify({
          title: '上传完成',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
        </p>`
        })
        this.dirFlag = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.form){
  label.el-form-item__label{
    margin-left: 0!important;
    width: 150px!important;
  }
  .el-select{
    width: 100%;
  }
}

:deep(.el-dialog){
  .icon {
    cursor: pointer;
    font-size: 17px;
    margin: 0 18px 0 3px;
    vertical-align: middle !important;
  }
}
:deep(.errorTip){
  background-color: aqua!important;
  width: fit-content!important;
  .el-notification__group{
    .el-notification__content{
      p{
        color: #d3d6d8;
      }
    }
  }
}

.el-icon-upload {
  font-size: 19px;
  margin: 0;
}

.el-upload__text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #d3d6d8;
}

.addFiles {
  color: #337dff;
}

.drag {
  width: 100%;
  margin-top: 10px;
  padding: 50px 10px 50px;
  border: 1px dashed #ccc;
}
.el-table{
  max-height:600px;
  overflow-y: auto;
}
</style>
<style>
.putLoading {
  .el-loading-spinner{
    margin-top: -100px!important;
  }
  .el-loading-spinner i{
    font-size: 25px;
  }
  .el-loading-text{
    font-size: 25px;
  }
}
</style>
```


## 分片上传、

### 上传对象并发不同步
```js
<template>
  <div>
    <el-row>
      <el-col
        :span="24"
        class="manage-area-title"
      >
        <h2>备份</h2>
      </el-col>
    </el-row>
    <!-- <BreadCrumbs /> -->
    <div
      v-loading="getHostLoading"
      class="page_content_wrap"
    >
      <el-form
        ref="form"
        class="form"
        :model="form"
        style="width: 40%;"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="hostName">
          <el-input
            v-model="form.hostName"
            placeholder="请输入hostName"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="endpoint"
          prop="endpoint"
        >
          <el-input
            v-model="form.endpoint"
            clearable
            placeholder="请输入endpoint"
          />
        </el-form-item>
        <el-form-item
          label="Access Key"
          prop="accessKeyId"
        >
          <el-input
            v-model="form.accessKeyId"
            clearable
            placeholder="请输入Access Key"
          />
        </el-form-item>
        <el-form-item
          label="Secret Key"
          prop="secretAccessKey"
        >
          <el-input
            v-model="form.secretAccessKey"
            type="password"
            show-password
            clearable
            placeholder="请输入Secret Key"
            style="width: 80%;"
          />
          <el-button
            style="position: absolute; right: 0;top:8px"
            @click="getBucketList"
          >连接</el-button>
        </el-form-item>
        <el-form-item
          v-if="bucketList&&bucketList.length"
          label="bucket"
          prop="Bucket"
        >
          <el-select
            v-model="form.Bucket"
            clearable
            placeholder="请选择一个bucket"
            filterable
          >
            <el-option
              v-for="x in bucketList"
              :key="x"
              :value="x"
              :label="x"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="golden"
            @click="validateBucket()"
          >备份</el-button>
          <el-button
            class="blue"
            @click="resetForm('form')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- <div
      id="loadChart"
      style="width:400px;height:300px"
    /> -->

    <el-dialog
      title="备份"
      :visible.sync="dirFlag"
      width="65%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        size="mini"
        label-width="150px"
        style="padding:0 5%;position:relative"
      >
        <!-- :before-upload="validateFileRule" -->
        <!-- :accept=",,拼接可接受文件类型 image/* 任意图片文件" -->
        <!-- :http-request="uploadFile"  覆盖原生action上传方法-->
        <!-- var formData = new FormData();  //  用FormData存放上传文件 -->
        <!-- formData.append('paramsName','file') -->
        <el-row class="uploadMenu">
          <el-upload
            ref="uploadFile"
            action="#"
            multiple
            :show-file-list="false"
            :http-request="handleRequest"
            :before-upload="handleSizeValidate"
          >
            <!-- <el-button
                size="small"
                class="golden"
                @click="postFolder('file')"
              >上传文件</el-button> -->
            <el-button
              size="small"
              class="golden"
              @click="postFolder('folder')"
            >上传</el-button>
          </el-upload>
          <el-button
            class="blue"
            :disabled="!fileListArr.length"
            @click="cleafFile"
          >清空</el-button>
        </el-row>
        <!-- <input type="file" id="upload" ref="inputer" name="file" multiple /> -->
        <div
          draggable="true"
          class="drag tableBox"
          :style="renderPadding"
        >
          <div
            v-show="!fileListArr.length"
            class="el-upload__text"
          >
            <i
              class="el-icon-upload"
              style="margin-right: 6px"
            />点击上传或拖拽文件夹到此处
            <!-- <el-button type="text" @click="addFiles">添加文件</el-button> -->
          </div>
          <div
            v-show="!fileListArr.length"
            class="el-upload__text"
          >
            <!-- 文件上传数量不能超过100个，总大小不超过5GB -->
            单个文件大小不超过50GB
          </div>
          <el-table
            v-show="fileListArr.length"
            :data="fileListArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          >
            <el-table-column
              label="对象key"
              prop="name"
              min-width="120px"
            />
            <el-table-column
              label="目录"
              min-width="120px"
            >
              <template slot-scope="scope">
                {{ (scope.row.webkitRelativePath ? form.hostName +'/'+ scope.row.webkitRelativePath : form.hostName +'/'+ scope.row.relativePath) | renderPath }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="180px"
            >
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column
              label="大小"
              width="120px"
            >
              <template slot-scope="scope">
                {{ byteConvert(scope.row.size) }}
              </template>
            </el-table-column>
            <el-table-column
              label="移除"
              width="100px"
            >
              <template slot-scope="scope">
                <svg
                  class="icon"
                  aria-hidden="true"
                  @click="removeItem(scope)"
                >
                  <use xlink:href="#icon-trash" />
                </svg>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="fileListArr.length"
            :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fileListArr.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="golden"
          :disabled="fileListArr.length==0"
          @click="confirmPut()"
        >{{ $trans('button.confirm') }}</el-button>
        <el-button @click="dirFlag = false;">{{ $trans('button.cancel') }}</el-button>
      </div>
      <div
        id="loadChart"
        style="width:400px;height:300px;display:none"
      />
    </el-dialog>
    <div
      v-if="showDrop"
      class="picker__drop-zone"
      @dragover="(e)=>e.preventDefault()"
      @drop="onDrop"
    >
      <div class="drop-arrow">
        <div class="arrow anim-floating" />
        <div class="base" />
      </div>
      <div
        data-v-6a50ffaa=""
        class="picker__drop-zone-label"
      >拖拽文件夹到此处</div>
    </div>
  </div>
</template>
<script>
import {
  upload,
  getHostname
} from '@/api/agent'
const AWS = require('aws-sdk')
// const FileSaver = require('file-saver')
//  AWS 设置超时时间 默认2min、当前60min
const initialTime = 5000
let catchNetFail = false
AWS.config.update({
  httpOptions: {
    timeout: 1000 * 60 * 5
  },
  maxRetries: 0 // 默认
  // maxRedirects: 10,
  // retryDelayOptions: {
  //   // base 默认100ms
  //   customBackoff: (count, err) => {
  //     // catchNetFail = true
  //     initialTime = count * 1000 + 5000
  //     // console.log(count, initialTime)
  //     // 重试时间间隔、默认5000，线性增长、最大增长5min、总重试时间12h
  //     // y= kx+b k、b为常数、by轴的偏移量
  //     // an = a1+(n-1) sn = n(a1+an)/2
  //     // 420=>24h
  //     return initialTime
  //   }
  // }
})
import moment from 'moment'
export default {
  filters: {
    renderPath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    }
  },
  data () {
    return {
      continueArr: [],
      finalList: [],
      loadingBg: null,
      putObjectNameArr: [],
      timer: null,
      myecharts: null,
      datas_outer: [],
      mockPutSize: 0,
      needMock: false,
      putSize: 0,
      totalSize: 0,
      createForm: {
        folderName: ''
      },
      dirFlag: false,
      form: {
        hostName: '',
        accessKeyId: '',
        secretAccessKey: '',
        // endpoint: 'http://10.0.2.154:8300',
        endpoint: '',
        path: '',
        Bucket: ''
      },
      bucketList: [],
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      fileListArr: [],
      executeTime: '',
      rules: {
        // hostName: { required: true, message: '请输入hostName' },
        accessKeyId: { required: true, message: '请输入accessKeyId' },
        secretAccessKey: { required: true, message: '请输入secretAccessKey' },
        endpoint: {
          required: true,
          validator: (_, val, cb) => {
            const reg = /^(http:\/\/)?(.)*/
            if (!val) {
              return cb('请输入endpoint')
            } else if (reg.test(val)) {
              if (val.indexOf('http://') === -1) {
                // 匹配http://替换
                const regPrefix = /(h)?(t)?(t)?(p)?(:)?(\/)?(\/)?/
                const matchStr = val.match(regPrefix)?.[0]
                this.form.endpoint = 'http://' + val.substring(matchStr.length)
              } else {
                return cb()
              }
            }
          }
        },
        Bucket: { required: true, message: '请选择bucket' }
      },
      S3: null,
      noBucket: false,
      getHostLoading: false,
      uploadSizeLimt: 5 * 1024 ** 3, // 上传文件大小限制 1T
      uploadPartSize: 1024 * 1024 * 5, // 分段大小&&文件启用分段大小
      sizeError: [],
      enableReUpload: true,
      readFileList: [],
      showDrop: false
    }
  },
  computed: {
    renderPadding () {
      return this.fileListArr.length ? {
        padding: '50px 10px'
      } : {
        padding: '150px 20px'
      }
    },
    options () {
      return {
        tooltip: {
          show: false
        },
        title: {
          // text超出最大数字16位
          text: this.renderLoadingText(),
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '30px' // 中间标题文字大小设置
          }
        },
        series: [
          {
            name: '完成情况外层',
            type: 'pie',
            padAngle: 5,
            // radius: ['40%', '60%'],
            radius: ['52%', '75%'],
            center: ['50%', '50%'],
            clockwise: false,
            data: this.datas_outer,
            // startAngle: 100,
            hoverAnimation: false,
            legendHoverLink: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
    }
  },
  watch: {
    dirFlag (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['uploadFile'].clearFiles()
        })
        this.enableDrop()
        this.fileListArr = []
        this.datas_outer = []
        for (let i = 30; i > 0; i--) {
          this.datas_outer.push({
            value: 1, // 占位用
            name: '未完成',
            itemStyle: { color: '#19272e' }
          })
        }
      } else {
        this.mockPutSize = 0
        this.needMock = false
        this.myecharts = null
        this.continueArr = []
        this.putSize = 0 // 记录进度
        this.totalSize = 0
        this.readFileList = []
        catchNetFail = false
        clearTimeout(this.timer)
        this.releaseDisable()
        this.disableDrop()
        // this.doClearFileLog()
      }
    }
  },
  mounted () {
    // AWS.events.on('send', (req) => {
    //   console.log('req', req)
    //   if (req.retryCount > 5) {
    //     this.S3.uploadPart(
    //       { ...req.request.params }
    //       , (error, success) => {
    //         console.log(error, success, req)
    //       })
    //   }
    // })
    // this.needMock = true
    // this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
    // this.renderChartPart()
    // setTimeout(async () => {
    //   await this.renderLoadingChart(5)
    // }, 1000)
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Escape') {
        event.preventDefault() // 取消默认行为
      }
    })
    const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
    this.form.accessKeyId = accessKeyId || 'http://10.0.2.153:9000'
    this.form.endpoint = endpoint
    //  || 'http://10.0.2.153:9000'
    this.form.secretAccessKey = 'minioadmin'
    setTimeout(() => {
      this.getBucketList()
    })
    // this.init()

    // get HostName、默认传递
    // setTimeout(() => {
    //   this.getBucketList()
    //   // this.init()
    // })
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    dragEnterHandler (e) {
      e.preventDefault()
      if (!this.showDrop) {
        this.showDrop = true
      }
    },
    dragLeaveHandler (e) {
      e.preventDefault()
      e.relatedTarget || (this.showDrop = false)
      // e.relatedTarget有效值仍在界面内
    },
    dropHandler (e) {
      e.preventDefault()
      this.showDrop = false
    },
    renderLoadingText () {
      return this.needMock ? String(this.mockPutSize).replace('.00', '') + '%' : Number((this.putSize / this.totalSize) * 100).toFixed(2).replace('.00', '') + '%'
    },
    async renderLoadingChart (timeSeconds, initialValue = 0) {
      // console.log(timeSeconds, 123)
      const totalValue = initialValue ? 100 - initialValue : 100
      const res = this.getMockTime(timeSeconds, totalValue)
      this.mockPutSize = initialValue == 100 ? 100 : initialValue + Number(res[0]).toFixed(2)
      this.renderChartPart()
      // 比如5s
      for (let i = 1; i <= timeSeconds; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            // 这里放置每隔一秒执行的代码
            this.mockPutSize = Number(res.shift()).toFixed(2)
            this.renderChartPart()
            // 进度 xdata 最终是 100
            resolve(i)
          }, 1000) // i * 1000 表示每次延迟 i 秒
        })
      }
      return Promise.resolve(true)
    },

    renderChartPart () {
      //
      var num = 30 // 定义小块个数
      var rate = this.needMock ? this.mockPutSize / 100 : this.putSize / this.totalSize // 完成率
      const count = rate * 30
      //
      // 填充
      for (let i = 1; i <= num; i++) {
        if (i <= count) {
          this.datas_outer[num - i].itemStyle.color = '#ff8746'
        } else {
          this.datas_outer[num - i].itemStyle.color = '#19272e'
        }
      }
      this.myecharts && this.myecharts.setOption(this.options)
      if (this.needMock) {
        clearTimeout(this.timer)
      } else {
        this.timer = setTimeout(() => {
          this.renderChartPart()
        }, 1000)
      }
    },
    getMockTime (totalTime, count) {
      const res = []
      count = count || 100
      function nonLinearIncrease (currentTime, totalTime) {
        // 非线性增长函数，这里使用了sin函数作为示例
        const progress = Math.sin((Math.PI / 2) * (currentTime / totalTime))
        const result = progress * count
        return result
      }
      // 测试函数，模拟从0到100的非线性增长过程
      function testNonLinearIncrease (totalTime) {
        for (let t = 1; t <= totalTime; t++) {
          const value = nonLinearIncrease(t, totalTime)
          res.push(value)
          // console.log(`Time: ${t}, Value: ${value}`)
        }
        return res
      }
      return testNonLinearIncrease(totalTime)
    },
    handlePutPath (file) {
      const {
        webkitRelativePath,
        relativePath
      } = file
      return webkitRelativePath || relativePath
    },
    cleafFile () {
      this.fileListArr = [] // 清除表格展示
      this.$refs['uploadFile'].clearFiles() // 清除组件FileList
    },
    handleRequest (val) {
      // 无功能、为自定义请求触发 beforeUpload校验文件
      // console.log(val, '123')
    },
    handleSizeValidate (file) {
      const size = file.size
      const isExist = this.fileListArr.findIndex(x => {
        return x.name === file.name && (x.webkitRelativePath || x.relativePath) === (file.webkitRelativePath || file.relativePath)
      })
      if (isExist > -1 || size > this.uploadSizeLimt) {
        return false
      }
      this.fileListArr.push(file)
    },
    init () {
      // const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
      // this.form.accessKeyId = accessKeyId
      // this.form.endpoint = endpoint
      // this.form.hostName = 'Dc'

      this.getHostLoading = true
      getHostname().then(res => {
        this.form.hostName = res.data || ''
      }).finally(() => {
        this.getHostLoading = false
        const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
        this.form.accessKeyId = accessKeyId
        this.form.endpoint = endpoint
      })
    },
    removeItem (row) {
      const index = this.fileListArr.findIndex(x => x.relativePath === row.row.relativePath && x.name === row.row.name)
      this.fileListArr.splice(index, 1)
      // 最后一页删除后、切到1
      if (this.fileListArr.length / this.pageSize <= 1) {
        this.currentPage = 1
      } else if (Math.ceil(this.fileListArr.length / this.pageSize) < this.currentPage) {
        this.currentPage = this.currentPage - 1
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },

    async handleMultUpload (fileArr) {
      const {
        Bucket,
        hostName,
        accessKeyId,
        endpoint
      } = this.form
      // const arr = localStorage.getItem('fileList')
      // if (!arr) localStorage.setItem('fileList', '[]')
      // this.readFileList = JSON.parse(arr || '[]')
      // 此处做断点续传
      // return PromiseMultiple
      // 此处不能统一执行、依次加入任务队列
      const asyncTask = (file) => {
        const fileSize = file.size
        // 大于5GB、分片10m、500、
        let chunkSize = ''
        if (fileSize > 1024 * 1024 * 1024 * 10) {
          chunkSize = 1024 * 1024 * 10
        } else if (fileSize > 1024 * 1024 * 1024 * 5) {
          chunkSize = 1024 * 1024 * 8
        } else {
          chunkSize = 1024 * 1024 * 5
        }
        // > 1000 ? 1024 * 1024 * 10 : this.uploadPartSize //5MB
        const chunks = Math.ceil(fileSize / chunkSize)
        const Key = hostName + '/' + this.handlePutPath(file)
        file['Key'] = Key
        return new Promise((resolve, rejected) => {
          // 检测文件检测失败重传
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss')

          const isExistReUploadPart = this.readFileList.find(x => {
            return x.Key === Key && x.Bucket === Bucket && x.accessKeyId === accessKeyId && x.endpoint === endpoint
          })
          // console.log(
          //   isExistReUploadPart, '分片续传'
          // )
          // 存在文件的分片、调用listPart获取已上传的分片、并在下面的上传分片中跳过已有的分片
          // 触发前置条件、 分片处理完添加分片到fileList上传列表、处理成功移除、
          // 故递归处理的函数在此只有分片失败会进入此、createMultipartUpload和complete不会在此处理？
          if (isExistReUploadPart) {
            const {
              UploadId
            } = isExistReUploadPart
            // 存在切片、在有效期且开启续传
            const params = {
              Bucket,
              Key,
              UploadId
            }
            this.S3.listParts(params, (err, data) => {
              // 不存在err、complete完还有part、上传大文件失败
              // console.log(data, 'err', err)
              if (!err) {
                // console.log(data.Parts, '===已上传的分片===')
                // 分片续传、data.Parts 参数为已上传的分片list、需重置非空
                isExistReUploadPart.parts = data.Parts || [];
                (async () => {
                  const {
                    parts
                  } = isExistReUploadPart
                  let multiplePart = []
                  const listPartFin = []
                  for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                    const start = chunkCount * chunkSize
                    const end = Math.min(start + chunkSize, fileSize)
                    const doneUploadSize = end - start
                    const body = file.slice(start, end)
                    const PartNumber = chunkCount + 1
                    const reqParams = {
                      PartNumber,
                      Body: body,
                      Bucket,
                      Key,
                      UploadId: isExistReUploadPart.UploadId
                    }
                    const jumpPass = parts.some(x => x.PartNumber === chunkCount + 1)
                    if (jumpPass) {
                      this.putSize += doneUploadSize
                      if (chunkCount === chunks - 1) {
                        const partRes = await Promise.allSettled(multiplePart)
                        this.putSize += partRes.reduce((pre, cur) => {
                          pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                            : cur.reason.doneUploadSize
                          return pre
                        }, 0)
                        listPartFin.push(...partRes)
                        multiplePart = []
                        continue
                      } else {
                        continue
                        // 此处continue跳过已有的循环、若为最后循环、需等待任务队列结束并拿到分片结果
                      }
                    }
                    const p = new Promise((res, rej) => {
                      this.S3.uploadPart(reqParams
                        , (uploadPartErr, uploadPartData) => {
                          if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                          else res({ ...uploadPartData, doneUploadSize, PartNumber })
                        })
                    })
                    multiplePart.push(p)
                    if (multiplePart.length == 5 || chunkCount === chunks - 1) {
                      const partRes = await Promise.allSettled(multiplePart)
                      this.putSize += partRes.reduce((pre, cur) => {
                        pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                          : cur.reason.doneUploadSize
                        return pre
                      }, 0)
                      listPartFin.push(...partRes)
                      multiplePart = []
                    }
                  }
                  // console.log(listPartFin, '=====剩下的分片=====')
                  const partOver = listPartFin.every(x => x.status === 'fulfilled')
                  if (partOver) {
                    // listParts
                    const Parts = [...listPartFin, ...parts]
                      .map(x => {
                        return {
                          PartNumber: x.PartNumber || x.value.PartNumber,
                          ETag: x.ETag || x.value.ETag
                        }
                      })
                      .sort((a, b) => a.PartNumber - b.PartNumber)
                    this.S3.completeMultipartUpload({
                      Bucket,
                      Key,
                      UploadId: isExistReUploadPart.UploadId,
                      MultipartUpload: { Parts }
                    }, (compErr, compErrData) => {
                      if (compErr) {
                        const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                        rejected({
                          err: compErr,
                          file,
                          startTime,
                          endTime
                        })
                      } else {
                        const delIndex = this.readFileList.findIndex(x => {
                          return x.UploadId === isExistReUploadPart.UploadId
                        })
                        this.readFileList.splice(delIndex, 1)
                        resolve(compErrData)
                      }
                      // console.log(compErr, compErrData)
                    })
                  } else {
                    // 处理uploadpart错误、取其中一个error
                    const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    const uploadPartError = listPartFin.find(x => x.status === 'rejected')?.reason
                    rejected({
                      err: uploadPartError,
                      file,
                      startTime,
                      endTime
                    })
                    // handle reUploadPart
                  }
                })()
              } else {
                this.putSize += fileSize
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                rejected({ err, file, startTime, endTime })
              }
            })
          } else {
            // 处理上传进度
            this.S3.createMultipartUpload({
              Bucket,
              Key
            }, async (createErr, createData) => {
              const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
              if (createErr) {
                // console.error('Error creating multipart upload:', createErr)
                this.putSize += fileSize
                // console.log(createErr, 'listPartFin')
                rejected({ err: createErr, file, startTime, endTime })
              } else {
                let multiplePart = []
                // writeAbortLog
                this.readFileList.push({
                  accessKeyId,
                  endpoint,
                  Bucket,
                  Key,
                  UploadId: createData.UploadId
                })
                const listPartFin = []
                // 此处同步的所以有问题了vuex先缓存一下
                // endWrite 此处记录及最终Promise处处理完成判断、清楚记录或执行abortMultiple
                for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                  const start = chunkCount * chunkSize
                  const end = Math.min(start + chunkSize, fileSize)
                  const doneUploadSize = end - start
                  const body = file.slice(start, end)
                  const reqParams = {
                    PartNumber: chunkCount + 1,
                    Body: body,
                    Bucket,
                    Key,
                    UploadId: createData.UploadId
                  }
                  const p = new Promise((res, rej) => {
                    // if (chunkCount > chunks - 2) {
                    //   reqParams.Bucket = '666'
                    // }
                    this.S3.uploadPart(reqParams
                      , (uploadPartErr, uploadPartData) => {
                        if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                        else res({ ...uploadPartData, doneUploadSize })
                      })
                  })
                  multiplePart.push(p)
                  if (multiplePart.length == 3 || chunkCount === chunks - 1) {
                    const partRes = await Promise.allSettled(multiplePart)
                    // console.log(partRes, '123')
                    this.putSize += partRes.reduce((pre, cur) => {
                      pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                        : cur.reason.doneUploadSize
                      return pre
                    }, 0)
                    listPartFin.push(...partRes)
                    multiplePart = []
                  }
                }
                // uploadPart End

                const partOver = listPartFin.every(x => x.status === 'fulfilled')
                if (partOver) {
                  // listParts
                  // var params = {
                  //   Bucket,
                  //   Key,
                  //   UploadId: createData.UploadId
                  // }
                  const Parts = listPartFin.map((x, i) => {
                    return {
                      PartNumber: i + 1,
                      ETag: x.value.ETag
                    }
                  })
                  this.S3.completeMultipartUpload({
                    Bucket,
                    Key,
                    UploadId: createData.UploadId,
                    MultipartUpload: { Parts }
                  }, (compErr, compErrData) => {
                    if (compErr) {
                      const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                      rejected({
                        err: compErr,
                        file,
                        startTime,
                        endTime
                      })
                    } else {
                      const delIndex = this.readFileList.findIndex(x => {
                        return x.UploadId === createData.UploadId
                      })
                      this.readFileList.splice(delIndex, 1)
                      resolve(compErrData)
                    }
                  })
                  // this.S3.listParts(params, (partErr, partRes) => {
                  //   const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  //   if (partErr) {
                  //     rejected({
                  //       err: partErr,
                  //       file,
                  //       startTime,
                  //       endTime
                  //     })
                  //   } else {
                  //     const Parts = partRes.Parts.map(x => {
                  //       return {
                  //         PartNumber: x.PartNumber,
                  //         ETag: x.ETag
                  //       }
                  //     }).sort((a, b) => a.PartNumber - b.PartNumber)
                  //     // finish
                  //     this.S3.completeMultipartUpload({
                  //       Bucket,
                  //       Key,
                  //       UploadId: createData.UploadId,
                  //       MultipartUpload: { Parts }
                  //     }, (compErr, compErrData) => {
                  //       if (compErr) {
                  //         const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  //         rejected({
                  //           err: compErr,
                  //           file,
                  //           startTime,
                  //           endTime
                  //         })
                  //       } else {
                  //         resolve(compErrData)
                  //       }
                  //       // console.log(compErr, compErrData)
                  //     })
                  //   }
                  // })
                } else {
                  // 处理uploadpart错误、取其中一个error
                  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  const err = listPartFin.find(x => x.status === 'rejected')?.reason
                  rejected({
                    err: err,
                    file,
                    startTime,
                    endTime
                  })
                  // handle reUploadPart
                }
              }
            })
          }
        })
      }
      const finalList = []
      while (fileArr.length) {
        const file = fileArr.shift()
        finalList.push(await asyncTask(file).catch(err => {
          return {
            hasError: true,
            err
          }
        }))
      }
      //
      return finalList[0].hasError ? Promise.reject(finalList) : Promise.resolve(finalList)
    },
    postFolder (type) {
      if (type === 'file') {
        document.querySelector('.el-upload__input').webkitdirectory = false
      } else {
        document.querySelector('.el-upload__input').webkitdirectory = true
      }
    },
    releaseDisable () {
      document.oncontextmenu = function () { }
      document.onkeydown = function (event) { }
      window.onbeforeunload = function () { }
    },
    enableDrop () {
      window.addEventListener('dragenter', this.dragEnterHandler)
      window.addEventListener('dragleave', this.dragLeaveHandler)
      window.addEventListener('drop', this.dropHandler)
    },
    disableDrop () {
      window.removeEventListener('dragenter', this.dragEnterHandler)
      window.removeEventListener('dragleave', this.dragLeaveHandler)
      window.removeEventListener('drop', this.dropHandler)
    },
    resetForm (formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].resetFields()
      }
    },

    onDrop (e) {
      e.preventDefault()
      const dataTransfer = e.dataTransfer
      if (
        dataTransfer.items &&
        dataTransfer.items[0] &&
        dataTransfer.items[0].webkitGetAsEntry
      ) {
        this.webkitReadDataTransfer(dataTransfer)
      }
    },
    webkitReadDataTransfer (dataTransfer) {
      let fileNum = dataTransfer.items.length
      const files = []
      this.loading = true

      // 递减计数，当fileNum为0，说明读取文件完毕
      const decrement = () => {
        if (--fileNum === 0) {
          this.handleFiles(files)
          this.loading = false
        }
      }

      // 递归读取文件方法
      const readDirectory = (reader) => {
        // readEntries() 方法用于检索正在读取的目录中的目录条目，并将它们以数组的形式传递给提供的回调函数。
        reader.readEntries((entries) => {
          if (entries.length) {
            fileNum += entries.length
            entries.forEach((entry) => {
              if (entry.isFile) {
                entry.file((file) => {
                  readFiles(file, entry.fullPath)
                }, readError)
              } else if (entry.isDirectory) {
                readDirectory(entry.createReader())
              }
            })

            readDirectory(reader)
          } else {
            decrement()
          }
        }, readError)
      }
      // 文件对象
      const items = dataTransfer.items
      // 拖拽文件遍历读取
      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry()
        if (!entry) {
          decrement()
          return
        }

        if (entry.isFile) {
          // 读取单个文件
          return
          // readFiles(items[i].getAsFile(), entry.fullPath, 'file')
        } else {
          // entry.createReader() 读取目录。
          readDirectory(entry.createReader())
        }
      }

      function readFiles (file, fullPath) {
        file.relativePath = fullPath.substring(1)
        files.push(file)
        decrement()
      }
      function readError (fileError) {
        throw fileError
      }
    },

    handleFiles (files) {
      // 按文件名称去存储列表，考虑到批量拖拽不会有同名文件出现
      const dirObj = {}
      // console.log(files, '1233')
      // return
      files.forEach((item) => {
        // relativePath 和 name 一致表示上传的为文件，不一致为文件夹
        // 文件直接放入table表格中
        // 仍需考虑去重问题
        const isExist = this.fileListArr.findIndex(x => x.name === item.name && (x.webkitRelativePath || x.relativePath) === (item.webkitRelativePath || item.relativePath))
        if (isExist > -1 || item.size > this.uploadSizeLimt) {
          return
          // this.fileListArr.splice(isExist, 1)
        }
        this.fileListArr.push(item)
        // if (item.relativePath === item.name) {
        //   this.tableData.push({
        //     name: item.name,
        //     filesList: [item.file],
        //     isFolder: false,
        //     size: item.size
        //   })
        // }
        // // 文件夹，需要处理后放在表格中
        // if (item.relativePath !== item.name) {
        //   const filderName = item.relativePath.split('/')[0]
        //   if (dirObj[filderName]) {
        //     // 放入文件夹下的列表内
        //     const dirList = dirObj[filderName].filesList || []
        //     dirList.push(item)
        //     dirObj[filderName].filesList = dirList
        //     // 统计文件大小
        //     const dirSize = dirObj[filderName].size
        //     dirObj[filderName].size = dirSize ? dirSize + item.size : item.size
        //   } else {
        //     dirObj[filderName] = {
        //       filesList: [item],
        //       size: item.size
        //     }
        //   }
        // }
      })

      // 放入tableData
      Object.keys(dirObj).forEach((key) => {
        this.tableData.push({
          name: key,
          filesList: dirObj[key].filesList,
          isFolder: true,
          size: dirObj[key].size
        })
      })
    },

    validateBucket () {
      if (!this.form.Bucket) {
        if (this.bucketList.length) {
          this.$notify({
            type: 'error',
            title: '请选择一个bucket'
          })
        } else {
          if (this.noBucket) {
            this.$notify({
              type: '无bucket可用，请先创建bucket'
            })
          } else {
            this.$notify({
              type: 'error',
              title: '请点击“连接”按钮，设置bucket'
            })
          }
        }
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            document.onkeydown = function (event) {
              var e = event || window.event || arguments.callee.caller.arguments[0]
              if (e && e.keyCode == 116) {
                return false
              }
            }
            window.onbeforeunload = function (e) {
              // 兼容ie
              // 触发条件 产生交互、当前不支持自定义文字
              e = e || window.event
              if (e) e.returnValue = 'none'
              return 'none'
            }
            document.oncontextmenu = function () { return false }
            this.dirFlag = true
            const { endpoint, accessKeyId } = this.form
            localStorage.setItem('form', JSON.stringify({
              endpoint,
              accessKeyId
            }))
          }
        })
      }
    },
    getBucketList () {
      const {
        accessKeyId,
        secretAccessKey,
        endpoint
      } = this.form
      if (!endpoint) {
        this.$notify({
          type: 'error',
          title: '请输入endpoint'
        })
        return
      }
      if (!accessKeyId) {
        this.$notify({
          type: 'error',
          title: '请输入Access Key'
        })
        return
      }
      if (!secretAccessKey) {
        this.$notify({
          type: 'error',
          title: '请输入Secret Key'
        })
        return
      }
      this.S3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: 'EastChain-1',
        s3ForcePathStyle: true
      })
      this.S3.listBuckets((err, data) => {
        if (err) {
          // console.dir(err)
          // console.log('%c 123', 'color:red;font-size:20px')
          // "NetworkingError"
          let title = ''
          let message = ''
          if (err.code === 'AccessDenied') {
            title = '连接S3失败'
            message = '请检查ak/sk是否输入正确'
          } else if (Number(err.code) === 12) {
            title = '网络异常'
            message = '请检查endpoint是否正确'
          } else if (err.code === 'NetworkingError') {
            title = '网络异常'
            message = '请检查endpoint是否正确,或稍后再试'
          } else {
            title = '连接S3失败'
            message = this.$trans(err.message || '')
          }
          // console.dir(err, 'err')
          this.$notify({
            type: 'error',
            title,
            message,
            showClose: false,
            customClass: 'errorTip'
          })
          this.noBucket = false
          this.bucketList = []
          this.form.Bucket = ''
        } else {
          this.bucketList = (data.Buckets || []).map(x => x.Name)
          if (!this.bucketList.length) {
            this.$notify({
              type: 'error',
              title: '无bucket可用，请先创建bucket'
            })
            this.noBucket = true
          } else {
            this.form.Bucket = this.bucketList[0]
            this.$notify({
              type: 'success',
              title: '连接S3成功'
            })
            this.form.Bucket = 'test'
            // 确保断网或刷新页面导致未完成的上传记录清除
            // this.doClearFileLog()
          }
        }
      })
    },
    doClearFileLog () {
      const {
        accessKeyId,
        endpoint
      } = this.form
      const keyList = JSON.parse(JSON.stringify(this.readFileList))
      // console.log(keyList, 'null')
      const doAbortTasks = keyList.map((x, i) => {
        return new Promise((resolve, rejected) => {
          if (accessKeyId === x.accessKeyId && endpoint === x.endpoint) {
            // 一致性确保listPart正常
            const params = {
              Bucket: x.Bucket,
              Key: x.Key,
              UploadId: x.UploadId
            }
            this.S3.listParts(params, (err, data) => {
              // 不存在err、complete完还有part、上传大文件失败
              // console.log(data, 'err', err)
              if (!err) {
                // doAbort
                const reUpload = data.Parts && data.Parts.length > 0
                // console.log(data, '1233', reUpload)
                if (reUpload && this.enableReUpload) {
                  keyList[i].reUpload = true
                  keyList[i].parts = data.Parts
                  const expireTime = keyList[i].expireTime
                  if (expireTime) {
                    if (
                      expireTime < moment().valueOf()) {
                      this.S3.abortMultipartUpload(params, (err, data) => {
                        if (!err) {
                          keyList[i].delete = true
                          resolve('clearTask')
                          // 清除该条记录
                        }
                      })
                    } else {
                      resolve('keepReUpload')
                    }
                  } else {
                    keyList[i].expireTime = moment().add(15, 'day').valueOf()
                    resolve('reUpload')
                  }
                  // 有切片需要支持后续上传
                } else {
                  this.S3.abortMultipartUpload(params, (err, data) => {
                    if (!err) {
                      keyList[i].delete = true
                      resolve('clearTask')
                      // 清除该条记录
                    }
                  })
                }
              } else {
                // 此处问题、
                keyList[i].delete = true
                resolve('clearTask')
                // 清除该条记录
              }
            })
          } else {
            rejected('notMatch')
            // noThingTodo
          }
        })
      })
      Promise.allSettled(doAbortTasks).then(res => {
        // localStorage.setItem('fileList', JSON.stringify(iterateArr))
        // 结束清理status为删除的
        const fileList = keyList.filter(x => x.delete !== true)
        this.readFileList = []
        localStorage.setItem('fileList', JSON.stringify(fileList))
        // console.log('checkOver', keyList, localStorage.getItem('fileList'))
      })
    },
    confirmPut () {
      const {
        Bucket,
        hostName
      } = this.form
      this.finalList = []
      const putObjectArr = []
      const multUploadArr = []
      this.disableDrop()
      document.querySelector('#loadChart').style.display = 'block'
      const judgeUploadType = async () => {
        // 文件分流
        this.fileListArr.forEach(x => {
          this.totalSize = this.totalSize + x.size
          if (x.size <= this.uploadPartSize) {
            putObjectArr.push({
              Bucket,
              Key: hostName + '/' + this.handlePutPath(x),
              Body: x
            })
          } else {
            multUploadArr.push(x)
          }
        })
      }
      // 区分大文件
      (async () => {
        await judgeUploadType()
        // startPutObject
        // console.log(putObjectArr, multUploadArr)
        // return
        this.loadingBg = this.$loading({
          lock: true,
          text: '文件上传中，请勿关闭当前页面',
          spinner: 'el-icon-loading',
          background: 'rgba(1,1,1,.3)',
          customClass: 'putLoading'
        })
        try {
          const putObjectFin = []
          // const taskList = []
          this.putObjectNameArr = []
          const needMock = multUploadArr.length === 0
          // const putObjectStart = +new Date()
          // const putObjectCount = putObjectArr.length
          this.needMock = needMock && putObjectArr.length <= 5
          this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
          this.renderChartPart()
          //
          const _this = this
          // 任务队列3
          class AsyncQueue {
            constructor (maxConcurrent = 2) {
              this.maxConcurrent = maxConcurrent
              this.running = 0
              this.queue = []
            }

            // 优化单个上传大文件、分片任务并发改为非同步任务
            async run () {
              while (this.running < this.maxConcurrent && this.queue.length > 0) {
                const file = this.queue.shift()
                this.running++
                let asyncTask = null
                if (file.size <= _this.uploadPartSize) {
                  asyncTask = new Promise((res, rej) => {
                    const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    _this.S3.putObject({
                      Bucket,
                      Key: hostName + '/' + _this.handlePutPath(file)
                    }, (err, data) => {
                      const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                      if (err) rej({ err, file, startTime, endTime })
                      else res({ success: 'success', file, startTime, endTime })
                    })
                  })
                } else {
                  const uploadResult = await Promise.allSettled([_this.handleMultUpload([file])])
                  console.log(uploadResult, '1233')
                  asyncTask = new Promise((resolve, reject) => {
                    uploadResult[0].status === 'rejected' ? reject({ ...uploadResult[0].reason[0], isMultUpload: true }) : resolve({ ...uploadResult[0].value, isMultUpload: true })
                  })
                  // 与putObject区分
                }
                await Promise.allSettled([asyncTask]).then(res => {
                  console.log(res, '=========')
                  const result = res[0]
                  // 这里分段处理得promise只返回最终处理成功得数据注意和putObject区分
                  if (result.status === 'fulfilled') {
                    if (!result.value.isMultUpload) {
                      _this.putSize += result.value.file.size
                    }
                  } else {
                    if (!result.reason.isMultUpload) {
                      _this.putSize += result.reason.file.size
                    }
                  }
                  putObjectFin.push(result)
                  this.running--
                  if (putObjectFin.length === _this.fileListArr.length) {
                    setTimeout(() => {
                      _this.releaseDisable()
                      _this.loadingBg.close()
                      console.log(putObjectFin)
                      // console.log(result, 'result')
                      _this.writeErrorLog(putObjectFin)
                    }, 1200)
                  } else {
                    this.run()
                  }
                })
              }
              // console.log(putObjectFin, '12333')
            }

            add (task) {
              this.queue.push(task)
              this.run()
            }
          }
          const asyncQueue = new AsyncQueue(2)
          let totalCount = this.fileListArr.length
          let index = 0
          while (totalCount > 0) {
            totalCount--
            const file = this.fileListArr[index]
            asyncQueue.add(file)
            index++
          }
          // for (let i = 0; i < putObjectCount; i++) {
          //   const file = putObjectArr[i]
          //   // i > 0 ? file.Bucket = '123' : null
          //   const p = new Promise((res, rej) => {
          //     const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
          //     this.S3.putObject(file, (err, data) => {
          //       const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          //       if (err) rej({ err, file, startTime, endTime })
          //       else res({ success: 'success', file, startTime, endTime })
          //     })
          //   })
          //   taskList.push(p)
          //   if (taskList.length == 5 || i === putObjectCount - 1) {
          //     const partRes = await Promise.allSettled(taskList)
          //     this.putSize += partRes.reduce((pre, cur) => {
          //       pre += cur.status === 'fulfilled' ? cur.value.file.Body.size
          //         : cur.reason.file.Body.size
          //       return pre
          //     }, 0)
          //     putObjectFin.push(...partRes)
          //     taskList = []
          //   }
          // }
          // 文件索引不对、记录上传功能的文件名、并移除、记录余下文件
          // this.continueArr = putObjectArr.filter(x => {
          //   return this.putObjectNameArr.every(y => {
          //     return x.Key !== y
          //   })
          // })
          // if (this.continueArr.length) {
          //   this.loadingBg.close()
          //   setTimeout(() => {
          //     // 判断网络连接情况
          //     this.$confirm('恢复上传对象', '请确认', {
          //       confirmButtonText: '确定',
          //       cancelButtonText: '取消',
          //       closeOnClickModal: false,
          //       closeOnPressEscape: false,
          //       showClose: false,
          //       type: 'warning',
          //       dangerouslyUseHTMLString: true
          //     }).then(() => {
          //       this.continueUpload(putObjectFin, multUploadArr)
          //     }).catch(() => {
          //       this.dirFlag = false
          //     })
          //   }, 1000)
          //   return
          // }
          // putObject小于5、
          // if (needMock) {
          //   if (putObjectArr.length <= 5 && !catchNetFail) {
          //     const putObjectEnd = +new Date()
          //     const timeSeconds = Math.ceil((putObjectEnd - putObjectStart) / 1000)
          //     await this.renderLoadingChart(timeSeconds, Number(((this.putSize / this.totalSize) * 100).toFixed(2)))
          //   } else {
          //     catchNetFail = false
          //   }
          // }
          // const multipleObjects = await this.handleMultUpload(multUploadArr)
          // console.log(multipleObjects, '====分片文件list====')
          // console.log(this.totalSize, this.putSize, 'fin')
          // setTimeout(() => {
          //   this.releaseDisable()
          //   this.loadingBg.close()
          //   console.log(putObjectFin)
          //   // console.log(result, 'result')
          //   this.writeErrorLog(putObjectFin)
          // }, 1200)
          // 上传及分段上传全部结束
        } catch (error) {
          console.log('errorOperate', error)
        }
      })()
    },
    writeErrorLog (result) {
      console.log(result, '================')
      const file = result
      // console.log(result, '123')
      const failList = file.filter(x => x.status === 'rejected' || (x.hasError))
      // .map(x => {
      //   // while大文件异步promise格式化
      //   if (x.hasError) {
      //     x.reason = x.err
      //   }
      //   return x
      // })
      // const log = failList.reduce((pre, cur, i) => {
      //   return pre + '结束时间：' + cur.reason.endTime + ' ' + '对象Key: ' + cur.reason.file.Key + ' ' + ' ' + '错误原因: ' + cur.reason.err.message + '\n'
      // }, '')
      const total = file.length
      const failCount = failList.length
      const successCount = total - failCount
      // console.log('===============', failList, log, result)
      if (failCount && failCount > 0) {
        this.$notify({
          title: '上传完成',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
          <br/>
        </p>`
        })
        this.dirFlag = false
        // upload({
        //   log
        // }).then(res => {
        //   this.$notify({
        //     title: '上传完成',
        //     dangerouslyUseHTMLString: true,
        //     type: 'success',
        //     message: `<p>
        //   <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
        //   <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
        //   <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
        //   <br/> <span style="color:#d3d6d8;font-size:15px">请到备份历史查看详情</span>
        // </p>`
        //   })
        // }).finally(() => {
        //   this.dirFlag = false
        // })
      } else {
        this.$notify({
          title: '上传完成',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
        </p>`
        })
        this.dirFlag = false
      }
    },
    async continueUpload (putObjectFin, multUploadArr) {
      // case putObject
      this.loadingBg = this.$loading({
        lock: true,
        text: '文件上传中，请勿关闭当前页面',
        spinner: 'el-icon-loading',
        background: 'rgba(1,1,1,.3)',
        customClass: 'putLoading'
      })
      const {
        hostName
      } = this.form
      let taskList = []
      const needMock = multUploadArr.length === 0
      const putObjectStart = +new Date()
      this.needMock = needMock && this.continueArr.length <= 5

      // putObject 待上传的文件、
      const count = this.continueArr.length
      for (let i = 0; i < count; i++) {
        const file = this.continueArr[i]
        // i > 0 ? file.Bucket = '123' : null
        const p = new Promise((res, rej) => {
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
          this.S3.putObject(file, (err, data) => {
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
            if (err) rej({ err, file, startTime, endTime })
            else res({ success: 'success', file, startTime, endTime })
          })
        })
        taskList.push(p)
        if (taskList.length == 5 || i === count - 1) {
          const partRes = await Promise.allSettled(taskList)
          // 罗列list 记录上传后的状态
          // 存在reject newworkFailure 停止当前for循环putObject
          if (partRes.some(x => x.status === 'rejected' && x.reason.err.code === 'NetworkingError')) {
            break
          } else {
            console.log(partRes, '1233')
            // 记录上传成功及非网络异常导致的上传失败
            this.putObjectNameArr.push(...partRes.map(x => {
              return x.status === 'fulfilled'
                ? hostName + '/' + this.handlePutPath(x.value.file.Body)
                : hostName + '/' + this.handlePutPath(x.reason.file.Body)
            }))
          }
          this.putSize += partRes.reduce((pre, cur) => {
            pre += cur.status === 'fulfilled' ? cur.value.file.Body.size
              : cur.reason.file.Body.size
            return pre
          }, 0)
          putObjectFin.push(...partRes)
          taskList = []
        }
      }
      this.continueArr = this.continueArr.filter(x => {
        return this.putObjectNameArr.every(y => {
          return x.Key !== y
        })
      })
      if (this.continueArr.length) {
        this.loadingBg.close()
        setTimeout(() => {
          // 判断网络连接情况
          this.$confirm('恢复上传对象', '请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.continueUpload(putObjectFin, multUploadArr)
          })
        }, 1000)
        return
      }
      if (this.needMock) {
        const putObjectEnd = +new Date()
        const timeSeconds = Math.ceil((putObjectEnd - putObjectStart) / 1000)
        await this.renderLoadingChart(timeSeconds)
      }
      const multipleObjects = await this.handleMultUpload(multUploadArr)
      // console.log(this.totalSize, this.putSize, 'fin')
      setTimeout(() => {
        this.releaseDisable()
        this.loadingBg.close()
        // console.log(result, 'result')
        this.writeErrorLog([...multipleObjects, ...putObjectFin])
      }, 1200)
    },
    handleRemoveErrorUpload (arr) {
      arr = JSON.parse(JSON.stringify(arr))
      const ErrorConnect = arr.filter(x => x.hasError && x.err.err.code === 'NetworkingError')
      if (ErrorConnect.length) {
        const index = arr.findIndex(x => {
          return x.Key === ErrorConnect[0].err.file.Key
        })
        arr.splice(index, 1)
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.form) {
  label.el-form-item__label {
    margin-left: 0 !important;
    width: 150px !important;
  }
  .el-select {
    width: 100%;
  }
}

:deep(.el-dialog) {
  .icon {
    cursor: pointer;
    font-size: 17px;
    margin: 0 18px 0 3px;
    vertical-align: middle !important;
  }
}
:deep(.errorTip) {
  background-color: aqua !important;
  width: fit-content !important;
  .el-notification__group {
    .el-notification__content {
      p {
        color: #d3d6d8;
      }
    }
  }
}

.el-icon-upload {
  font-size: 40px;
  margin: 0;
}

.el-upload__text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin: 40px 10px;
  line-height: 25px;
  text-align: center;
  color: #d3d6d8;
}

.addFiles {
  color: #337dff;
}

.drag {
  width: 100%;
  margin-top: 10px;
}
.el-table {
  max-height: 600px;
  overflow-y: auto;
}
#loadChart {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<style lang="scss">
.putLoading {
  .el-loading-spinner {
    position: fixed;
    top: 10%;
    left: 50%;
    width: fit-content;
    transform: translate(-50%);
  }
  .el-loading-spinner i {
    font-size: 25px;
  }
  .el-loading-text {
    font-size: 25px;
  }
}
.uploadMenu {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  .el-button {
    font-size: 25px;
    height: 60px;
    width: 120px;
    padding: 15px;
    margin-right: 50px;
    box-sizing: border-box;
  }
}
.picker__drop-zone {
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 100%, 0.9);
  border: 6px solid #ff8746;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .anim-floating {
    animation-name: anim-floating-6a50ffaa;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
  .picker__drop-zone-label {
    margin-top: 30px;
    font-size: 25px;
    color: #333;
  }
  .drop-arrow {
    display: inline-block;
    div {
      display: block;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    .arrow {
      width: 38.68px;
      height: 63.76px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 38.68 63.76' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M34.2 42.63 21.68 55V3c0-1.42-.88-3-2.34-3a3 3 0 0 0-2.66 3v52L4.47 42.63a2.68 2.68 0 0 0-1.85-.76 2.57 2.57 0 0 0-1.85.76 2.51 2.51 0 0 0 0 3.63L17.49 63a2.7 2.7 0 0 0 1.85.76 2.58 2.58 0 0 0 1.85-.76l16.72-16.75a2.51 2.51 0 0 0 0-3.63 2.69 2.69 0 0 0-3.7 0Zm0 0' fill='%23333'/%3E%3C/svg%3E");
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 0;
    }
    .base {
      width: 88.98px;
      height: 28.61px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 88.98 28.61' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M86.42.38A2.26 2.26 0 0 0 84 2.73v9.07a12.34 12.34 0 0 1-12 11.93H15.78C9.44 23.73 5 18.05 5 11.73V2.28A2.22 2.22 0 0 0 2.56 0 2.55 2.55 0 0 0 0 2.56v9.45a16.48 16.48 0 0 0 16.44 16.6h56.22A16.38 16.38 0 0 0 89 12.02V2.95A2.35 2.35 0 0 0 86.72.38h-.28z' fill='%23333'/%3E%3C/svg%3E");
    }
  }
}
@keyframes anim-floating-6a50ffaa {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(25%);
  }

  to {
    transform: translateY(0);
  }
}
</style>

```


### 上传对象并发同步

```js
<template>
  <div>
    <el-row>
      <el-col
        :span="24"
        class="manage-area-title"
      >
        <h2>备份</h2>
      </el-col>
    </el-row>
    <!-- <BreadCrumbs /> -->
    <div
      v-loading="getHostLoading"
      class="page_content_wrap"
    >
      <el-form
        ref="form"
        class="form"
        :model="form"
        style="width: 40%;"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="hostName">
          <el-input
            v-model="form.hostName"
            placeholder="请输入hostName"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="endpoint"
          prop="endpoint"
        >
          <el-input
            v-model="form.endpoint"
            clearable
            placeholder="请输入endpoint"
          />
        </el-form-item>
        <el-form-item
          label="Access Key"
          prop="accessKeyId"
        >
          <el-input
            v-model="form.accessKeyId"
            clearable
            placeholder="请输入Access Key"
          />
        </el-form-item>
        <el-form-item
          label="Secret Key"
          prop="secretAccessKey"
        >
          <el-input
            v-model="form.secretAccessKey"
            type="password"
            show-password
            clearable
            placeholder="请输入Secret Key"
            style="width: 80%;"
          />
          <el-button
            style="position: absolute; right: 0;top:8px"
            @click="getBucketList"
          >连接</el-button>
        </el-form-item>
        <el-form-item
          v-if="bucketList&&bucketList.length"
          label="bucket"
          prop="Bucket"
        >
          <el-select
            v-model="form.Bucket"
            clearable
            placeholder="请选择一个bucket"
            filterable
          >
            <el-option
              v-for="x in bucketList"
              :key="x"
              :value="x"
              :label="x"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="golden"
            @click="validateBucket()"
          >备份</el-button>
          <el-button
            class="blue"
            @click="resetForm('form')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- <div
      id="loadChart"
      style="width:400px;height:300px"
    /> -->

    <el-dialog
      title="备份"
      :visible.sync="dirFlag"
      width="65%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        size="mini"
        label-width="150px"
        style="padding:0 5%;position:relative"
      >
        <!-- :before-upload="validateFileRule" -->
        <!-- :accept=",,拼接可接受文件类型 image/* 任意图片文件" -->
        <!-- :http-request="uploadFile"  覆盖原生action上传方法-->
        <!-- var formData = new FormData();  //  用FormData存放上传文件 -->
        <!-- formData.append('paramsName','file') -->
        <el-row class="uploadMenu">
          <el-upload
            ref="uploadFile"
            action="#"
            multiple
            :show-file-list="false"
            :http-request="handleRequest"
            :before-upload="handleSizeValidate"
          >
            <!-- <el-button
                size="small"
                class="golden"
                @click="postFolder('file')"
              >上传文件</el-button> -->
            <el-button
              size="small"
              class="golden"
              @click="postFolder('folder')"
            >上传</el-button>
          </el-upload>
          <el-button
            class="blue"
            :disabled="!fileListArr.length"
            @click="cleafFile"
          >清空</el-button>
        </el-row>
        <!-- <input type="file" id="upload" ref="inputer" name="file" multiple /> -->
        <div
          draggable="true"
          class="drag tableBox"
          :style="renderPadding"
        >
          <div
            v-show="!fileListArr.length"
            class="el-upload__text"
          >
            <i
              class="el-icon-upload"
              style="margin-right: 6px"
            />点击上传或拖拽文件夹到此处
            <!-- <el-button type="text" @click="addFiles">添加文件</el-button> -->
          </div>
          <div
            v-show="!fileListArr.length"
            class="el-upload__text"
          >
            <!-- 文件上传数量不能超过100个，总大小不超过5GB -->
            单个文件大小不超过50GB
          </div>
          <el-table
            v-show="fileListArr.length"
            :data="fileListArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          >
            <el-table-column
              label="对象key"
              prop="name"
              min-width="120px"
            />
            <el-table-column
              label="目录"
              min-width="120px"
            >
              <template slot-scope="scope">
                {{ (scope.row.webkitRelativePath ? form.hostName +'/'+ scope.row.webkitRelativePath : form.hostName +'/'+ scope.row.relativePath) | renderPath }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              width="180px"
            >
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column
              label="大小"
              width="120px"
            >
              <template slot-scope="scope">
                {{ byteConvert(scope.row.size) }}
              </template>
            </el-table-column>
            <el-table-column
              label="移除"
              width="100px"
            >
              <template slot-scope="scope">
                <svg
                  class="icon"
                  aria-hidden="true"
                  @click="removeItem(scope)"
                >
                  <use xlink:href="#icon-trash" />
                </svg>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="fileListArr.length"
            :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fileListArr.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="golden"
          :disabled="fileListArr.length==0"
          @click="confirmPut()"
        >{{ $trans('button.confirm') }}</el-button>
        <el-button @click="dirFlag = false;">{{ $trans('button.cancel') }}</el-button>
      </div>
      <div
        id="loadChart"
        style="width:400px;height:300px;display:none"
      />
    </el-dialog>
    <div
      v-if="showDrop"
      class="picker__drop-zone"
      @dragover="(e)=>e.preventDefault()"
      @drop="onDrop"
    >
      <div class="drop-arrow">
        <div class="arrow anim-floating" />
        <div class="base" />
      </div>
      <div
        data-v-6a50ffaa=""
        class="picker__drop-zone-label"
      >拖拽文件夹到此处</div>
    </div>
  </div>
</template>
<script>
import {
  upload,
  getHostname
} from '@/api/agent'
const AWS = require('aws-sdk')
// const FileSaver = require('file-saver')
//  AWS 设置超时时间 默认2min、当前60min
let initialTime = 5000
let catchNetFail = false
AWS.config.update({
  httpOptions: {
    timeout: 1000 * 60 * 5
  },
  maxRetries: 420, // 默认
  retryDelayOptions: {
    // base 默认100ms
    customBackoff: (count, err) => {
      initialTime = count * 1000 + 5000
      // console.log(count, initialTime)
      // 重试时间间隔、默认5000，线性增长、最大增长5min、总重试时间12h
      // y= kx+b k、b为常数、by轴的偏移量
      // an = a1+(n-1) sn = n(a1+an)/2
      // 420=>24h
      console.log(err, '123')
      return initialTime
    }
  }
})
import moment from 'moment'
export default {
  filters: {
    renderPath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    }
  },
  data () {
    return {
      continueArr: [],
      finalList: [],
      loadingBg: null,
      putObjectNameArr: [],
      timer: null,
      myecharts: null,
      datas_outer: [],
      mockPutSize: 0,
      needMock: false,
      putSize: 0,
      totalSize: 0,
      createForm: {
        folderName: ''
      },
      dirFlag: false,
      form: {
        hostName: '',
        accessKeyId: '',
        secretAccessKey: '',
        // endpoint: 'http://10.0.2.154:8300',
        endpoint: '',
        path: '',
        Bucket: ''
      },
      bucketList: [],
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      fileListArr: [],
      executeTime: '',
      rules: {
        // hostName: { required: true, message: '请输入hostName' },
        accessKeyId: { required: true, message: '请输入accessKeyId' },
        secretAccessKey: { required: true, message: '请输入secretAccessKey' },
        endpoint: {
          required: true,
          validator: (_, val, cb) => {
            const reg = /^(http:\/\/)?(.)*/
            if (!val) {
              return cb('请输入endpoint')
            } else if (reg.test(val)) {
              if (val.indexOf('http://') === -1) {
                // 匹配http://替换
                const regPrefix = /(h)?(t)?(t)?(p)?(:)?(\/)?(\/)?/
                const matchStr = val.match(regPrefix)?.[0]
                this.form.endpoint = 'http://' + val.substring(matchStr.length)
              } else {
                return cb()
              }
            }
          }
        },
        Bucket: { required: true, message: '请选择bucket' }
      },
      S3: null,
      noBucket: false,
      getHostLoading: false,
      uploadSizeLimt: 5 * 1024 ** 3, // 上传文件大小限制 1T
      uploadPartSize: 1024 * 1024 * 5, // 分段大小&&文件启用分段大小
      sizeError: [],
      enableReUpload: true,
      readFileList: [],
      showDrop: false
    }
  },
  computed: {
    renderPadding () {
      return this.fileListArr.length ? {
        padding: '50px 10px'
      } : {
        padding: '150px 20px'
      }
    },
    options () {
      return {
        tooltip: {
          show: false
        },
        title: {
          // text超出最大数字16位
          text: this.renderLoadingText(),
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '30px' // 中间标题文字大小设置
          }
        },
        series: [
          {
            name: '完成情况外层',
            type: 'pie',
            padAngle: 5,
            // radius: ['40%', '60%'],
            radius: ['52%', '75%'],
            center: ['50%', '50%'],
            clockwise: false,
            data: this.datas_outer,
            // startAngle: 100,
            hoverAnimation: false,
            legendHoverLink: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
    }
  },
  watch: {
    dirFlag (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['uploadFile'].clearFiles()
        })
        this.enableDrop()
        this.fileListArr = []
        this.datas_outer = []
        for (let i = 30; i > 0; i--) {
          this.datas_outer.push({
            value: 1, // 占位用
            name: '未完成',
            itemStyle: { color: '#19272e' }
          })
        }
      } else {
        this.mockPutSize = 0
        this.needMock = false
        this.myecharts = null
        this.continueArr = []
        this.putSize = 0 // 记录进度
        this.totalSize = 0
        this.readFileList = []
        catchNetFail = false
        clearTimeout(this.timer)
        this.releaseDisable()
        this.disableDrop()
        // this.doClearFileLog()
      }
    }
  },
  mounted () {
    // AWS.events.on('send', (req) => {
    //   console.log('req', req)
    //   if (req.retryCount > 5) {
    //     this.S3.uploadPart(
    //       { ...req.request.params }
    //       , (error, success) => {
    //         console.log(error, success, req)
    //       })
    //   }
    // })
    // this.needMock = true
    // this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
    // this.renderChartPart()
    // setTimeout(async () => {
    //   await this.renderLoadingChart(5)
    // }, 1000)
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Escape') {
        event.preventDefault() // 取消默认行为
      }
    })
    const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
    this.form.accessKeyId = accessKeyId
    // || 'http://10.0.2.153:9000'
    this.form.endpoint = endpoint
    // || 'http://10.0.2.153:9000'
    // this.form.secretAccessKey = 'minioadmin'
    // setTimeout(() => {
    //   this.getBucketList()
    // })
    this.init()

    // get HostName、默认传递
    // setTimeout(() => {
    //   this.getBucketList()
    //   // this.init()
    // })
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    dragEnterHandler (e) {
      e.preventDefault()
      if (!this.showDrop) {
        this.showDrop = true
      }
    },
    dragLeaveHandler (e) {
      e.preventDefault()
      e.relatedTarget || (this.showDrop = false)
      // e.relatedTarget有效值仍在界面内
    },
    dropHandler (e) {
      e.preventDefault()
      this.showDrop = false
    },
    renderLoadingText () {
      return this.needMock ? String(this.mockPutSize).replace('.00', '') + '%' : Number((this.putSize / this.totalSize) * 100).toFixed(2).replace('.00', '') + '%'
    },
    async renderLoadingChart (timeSeconds, initialValue = 0) {
      // console.log(timeSeconds, 123)
      const totalValue = initialValue ? 100 - initialValue : 100
      const res = this.getMockTime(timeSeconds, totalValue)
      this.mockPutSize = initialValue == 100 ? 100 : initialValue + Number(res[0]).toFixed(2)
      this.renderChartPart()
      // 比如5s
      for (let i = 1; i <= timeSeconds; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            // 这里放置每隔一秒执行的代码
            this.mockPutSize = Number(res.shift()).toFixed(2)
            this.renderChartPart()
            // 进度 xdata 最终是 100
            resolve(i)
          }, 1000) // i * 1000 表示每次延迟 i 秒
        })
      }
      return Promise.resolve(true)
    },

    renderChartPart () {
      //
      var num = 30 // 定义小块个数
      var rate = this.needMock ? this.mockPutSize / 100 : this.putSize / this.totalSize // 完成率
      const count = rate * 30
      //
      // 填充
      for (let i = 1; i <= num; i++) {
        if (i <= count) {
          this.datas_outer[num - i].itemStyle.color = '#ff8746'
        } else {
          this.datas_outer[num - i].itemStyle.color = '#19272e'
        }
      }
      this.myecharts && this.myecharts.setOption(this.options)
      if (this.needMock) {
        clearTimeout(this.timer)
      } else {
        this.timer = setTimeout(() => {
          this.renderChartPart()
        }, 1000)
      }
    },
    getMockTime (totalTime, count) {
      const res = []
      count = count || 100
      function nonLinearIncrease (currentTime, totalTime) {
        // 非线性增长函数，这里使用了sin函数作为示例
        const progress = Math.sin((Math.PI / 2) * (currentTime / totalTime))
        const result = progress * count
        return result
      }
      // 测试函数，模拟从0到100的非线性增长过程
      function testNonLinearIncrease (totalTime) {
        for (let t = 1; t <= totalTime; t++) {
          const value = nonLinearIncrease(t, totalTime)
          res.push(value)
          // console.log(`Time: ${t}, Value: ${value}`)
        }
        return res
      }
      return testNonLinearIncrease(totalTime)
    },
    handlePutPath (file) {
      const {
        webkitRelativePath,
        relativePath
      } = file
      return webkitRelativePath || relativePath
    },
    cleafFile () {
      this.fileListArr = [] // 清除表格展示
      this.$refs['uploadFile'].clearFiles() // 清除组件FileList
    },
    handleRequest (val) {
      // 无功能、为自定义请求触发 beforeUpload校验文件
      // console.log(val, '123')
    },
    handleSizeValidate (file) {
      const size = file.size
      const isExist = this.fileListArr.findIndex(x => {
        return x.name === file.name && (x.webkitRelativePath || x.relativePath) === (file.webkitRelativePath || file.relativePath)
      })
      if (isExist > -1 || size > this.uploadSizeLimt) {
        return false
      }
      this.fileListArr.push(file)
    },
    init () {
      // const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
      // this.form.accessKeyId = accessKeyId
      // this.form.endpoint = endpoint
      // this.form.hostName = 'Dc'

      this.getHostLoading = true
      getHostname().then(res => {
        this.form.hostName = res.data || ''
      }).finally(() => {
        this.getHostLoading = false
        const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
        this.form.accessKeyId = accessKeyId
        this.form.endpoint = endpoint
      })
    },
    removeItem (row) {
      const index = this.fileListArr.findIndex(x => x.relativePath === row.row.relativePath && x.name === row.row.name)
      this.fileListArr.splice(index, 1)
      // 最后一页删除后、切到1
      if (this.fileListArr.length / this.pageSize <= 1) {
        this.currentPage = 1
      } else if (Math.ceil(this.fileListArr.length / this.pageSize) < this.currentPage) {
        this.currentPage = this.currentPage - 1
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },

    async handleMultUpload (fileArr) {
      const {
        Bucket,
        hostName,
        accessKeyId,
        endpoint
      } = this.form
      // const arr = localStorage.getItem('fileList')
      // if (!arr) localStorage.setItem('fileList', '[]')
      // this.readFileList = JSON.parse(arr || '[]')
      // 此处做断点续传
      // return PromiseMultiple
      // 此处不能统一执行、依次加入任务队列
      const asyncTask = (file) => {
        const fileSize = file.size
        // 大于5GB、分片10m、500、
        let chunkSize = ''
        if (fileSize > 1024 * 1024 * 1024 * 10) {
          chunkSize = 1024 * 1024 * 10
        } else if (fileSize > 1024 * 1024 * 1024 * 5) {
          chunkSize = 1024 * 1024 * 8
        } else {
          chunkSize = 1024 * 1024 * 5
        }
        // > 1000 ? 1024 * 1024 * 10 : this.uploadPartSize //5MB
        const chunks = Math.ceil(fileSize / chunkSize)
        const Key = hostName + '/' + this.handlePutPath(file)
        file['Key'] = Key
        return new Promise((resolve, rejected) => {
          // 检测文件检测失败重传
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss')

          const isExistReUploadPart = this.readFileList.find(x => {
            return x.Key === Key && x.Bucket === Bucket && x.accessKeyId === accessKeyId && x.endpoint === endpoint
          })
          // console.log(
          //   isExistReUploadPart, '分片续传'
          // )
          // 存在文件的分片、调用listPart获取已上传的分片、并在下面的上传分片中跳过已有的分片
          // 触发前置条件、 分片处理完添加分片到fileList上传列表、处理成功移除、
          // 故递归处理的函数在此只有分片失败会进入此、createMultipartUpload和complete不会在此处理？
          if (isExistReUploadPart) {
            const {
              UploadId
            } = isExistReUploadPart
            // 存在切片、在有效期且开启续传
            const params = {
              Bucket,
              Key,
              UploadId
            }
            this.S3.listParts(params, (err, data) => {
              // 不存在err、complete完还有part、上传大文件失败
              // console.log(data, 'err', err)
              if (!err) {
                // console.log(data.Parts, '===已上传的分片===')
                // 分片续传、data.Parts 参数为已上传的分片list、需重置非空
                isExistReUploadPart.parts = data.Parts || [];
                (async () => {
                  const {
                    parts
                  } = isExistReUploadPart
                  let multiplePart = []
                  const listPartFin = []
                  for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                    const start = chunkCount * chunkSize
                    const end = Math.min(start + chunkSize, fileSize)
                    const doneUploadSize = end - start
                    const body = file.slice(start, end)
                    const PartNumber = chunkCount + 1
                    const reqParams = {
                      PartNumber,
                      Body: body,
                      Bucket,
                      Key,
                      UploadId: isExistReUploadPart.UploadId
                    }
                    const jumpPass = parts.some(x => x.PartNumber === chunkCount + 1)
                    if (jumpPass) {
                      this.putSize += doneUploadSize
                      if (chunkCount === chunks - 1) {
                        const partRes = await Promise.allSettled(multiplePart)
                        this.putSize += partRes.reduce((pre, cur) => {
                          pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                            : cur.reason.doneUploadSize
                          return pre
                        }, 0)
                        listPartFin.push(...partRes)
                        multiplePart = []
                        continue
                      } else {
                        continue
                        // 此处continue跳过已有的循环、若为最后循环、需等待任务队列结束并拿到分片结果
                      }
                    }
                    const p = new Promise((res, rej) => {
                      this.S3.uploadPart(reqParams
                        , (uploadPartErr, uploadPartData) => {
                          if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                          else res({ ...uploadPartData, doneUploadSize, PartNumber })
                        })
                    })
                    multiplePart.push(p)
                    if (multiplePart.length == 5 || chunkCount === chunks - 1) {
                      const partRes = await Promise.allSettled(multiplePart)
                      this.putSize += partRes.reduce((pre, cur) => {
                        pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                          : cur.reason.doneUploadSize
                        return pre
                      }, 0)
                      listPartFin.push(...partRes)
                      multiplePart = []
                    }
                  }
                  // console.log(listPartFin, '=====剩下的分片=====')
                  const partOver = listPartFin.every(x => x.status === 'fulfilled')
                  if (partOver) {
                    // listParts
                    const Parts = [...listPartFin, ...parts]
                      .map(x => {
                        return {
                          PartNumber: x.PartNumber || x.value.PartNumber,
                          ETag: x.ETag || x.value.ETag
                        }
                      })
                      .sort((a, b) => a.PartNumber - b.PartNumber)
                    this.S3.completeMultipartUpload({
                      Bucket,
                      Key,
                      UploadId: isExistReUploadPart.UploadId,
                      MultipartUpload: { Parts }
                    }, (compErr, compErrData) => {
                      if (compErr) {
                        const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                        rejected({
                          err: compErr,
                          file,
                          startTime,
                          endTime
                        })
                      } else {
                        const delIndex = this.readFileList.findIndex(x => {
                          return x.UploadId === isExistReUploadPart.UploadId
                        })
                        this.readFileList.splice(delIndex, 1)
                        resolve(compErrData)
                      }
                      // console.log(compErr, compErrData)
                    })
                  } else {
                    // 处理uploadpart错误、取其中一个error
                    const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    const uploadPartError = listPartFin.find(x => x.status === 'rejected')?.reason
                    rejected({
                      err: uploadPartError,
                      file,
                      startTime,
                      endTime
                    })
                    // handle reUploadPart
                  }
                })()
              } else {
                this.putSize += fileSize
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                rejected({ err, file, startTime, endTime })
              }
            })
          } else {
            // 处理上传进度
            this.S3.createMultipartUpload({
              Bucket,
              Key
            }, async (createErr, createData) => {
              const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
              if (createErr) {
                // console.error('Error creating multipart upload:', createErr)
                this.putSize += fileSize
                // console.log(createErr, 'listPartFin')
                rejected({ err: createErr, file, startTime, endTime })
              } else {
                let multiplePart = []
                // writeAbortLog
                this.readFileList.push({
                  accessKeyId,
                  endpoint,
                  Bucket,
                  Key,
                  UploadId: createData.UploadId
                })
                const listPartFin = []
                // 此处同步的所以有问题了vuex先缓存一下
                // endWrite 此处记录及最终Promise处处理完成判断、清楚记录或执行abortMultiple
                for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                  const start = chunkCount * chunkSize
                  const end = Math.min(start + chunkSize, fileSize)
                  const doneUploadSize = end - start
                  const body = file.slice(start, end)
                  const reqParams = {
                    PartNumber: chunkCount + 1,
                    Body: body,
                    Bucket,
                    Key,
                    UploadId: createData.UploadId
                  }
                  const p = new Promise((res, rej) => {
                    // if (chunkCount > chunks - 2) {
                    //   reqParams.Bucket = '666'
                    // }
                    this.S3.uploadPart(reqParams
                      , (uploadPartErr, uploadPartData) => {
                        if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                        else res({ ...uploadPartData, doneUploadSize })
                      })
                  })
                  multiplePart.push(p)
                  if (multiplePart.length == 3 || chunkCount === chunks - 1) {
                    const partRes = await Promise.allSettled(multiplePart)
                    // console.log(partRes, '123')
                    this.putSize += partRes.reduce((pre, cur) => {
                      pre += cur.status === 'fulfilled' ? cur.value.doneUploadSize
                        : cur.reason.doneUploadSize
                      return pre
                    }, 0)
                    listPartFin.push(...partRes)
                    multiplePart = []
                  }
                }
                // uploadPart End

                const partOver = listPartFin.every(x => x.status === 'fulfilled')
                if (partOver) {
                  // listParts
                  // var params = {
                  //   Bucket,
                  //   Key,
                  //   UploadId: createData.UploadId
                  // }
                  const Parts = listPartFin.map((x, i) => {
                    return {
                      PartNumber: i + 1,
                      ETag: x.value.ETag
                    }
                  })
                  this.S3.completeMultipartUpload({
                    Bucket,
                    Key,
                    UploadId: createData.UploadId,
                    MultipartUpload: { Parts }
                  }, (compErr, compErrData) => {
                    if (compErr) {
                      const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                      rejected({
                        err: compErr,
                        file,
                        startTime,
                        endTime
                      })
                    } else {
                      const delIndex = this.readFileList.findIndex(x => {
                        return x.UploadId === createData.UploadId
                      })
                      this.readFileList.splice(delIndex, 1)
                      resolve(compErrData)
                    }
                  })
                  // this.S3.listParts(params, (partErr, partRes) => {
                  //   const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  //   if (partErr) {
                  //     rejected({
                  //       err: partErr,
                  //       file,
                  //       startTime,
                  //       endTime
                  //     })
                  //   } else {
                  //     const Parts = partRes.Parts.map(x => {
                  //       return {
                  //         PartNumber: x.PartNumber,
                  //         ETag: x.ETag
                  //       }
                  //     }).sort((a, b) => a.PartNumber - b.PartNumber)
                  //     // finish
                  //     this.S3.completeMultipartUpload({
                  //       Bucket,
                  //       Key,
                  //       UploadId: createData.UploadId,
                  //       MultipartUpload: { Parts }
                  //     }, (compErr, compErrData) => {
                  //       if (compErr) {
                  //         const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  //         rejected({
                  //           err: compErr,
                  //           file,
                  //           startTime,
                  //           endTime
                  //         })
                  //       } else {
                  //         resolve(compErrData)
                  //       }
                  //       // console.log(compErr, compErrData)
                  //     })
                  //   }
                  // })
                } else {
                  // 处理uploadpart错误、取其中一个error
                  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  const err = listPartFin.find(x => x.status === 'rejected')?.reason
                  rejected({
                    err: err,
                    file,
                    startTime,
                    endTime
                  })
                  // handle reUploadPart
                }
              }
            })
          }
        })
      }
      const finalList = []
      while (fileArr.length) {
        const file = fileArr.shift()
        finalList.push(await asyncTask(file).catch(err => {
          return {
            hasError: true,
            err
          }
        }))
      }
      //
      return finalList[0].hasError ? Promise.reject(finalList) : Promise.resolve(finalList)
    },
    postFolder (type) {
      if (type === 'file') {
        document.querySelector('.el-upload__input').webkitdirectory = false
      } else {
        document.querySelector('.el-upload__input').webkitdirectory = true
      }
    },
    releaseDisable () {
      document.oncontextmenu = function () { }
      document.onkeydown = function (event) { }
      window.onbeforeunload = function () { }
    },
    enableDrop () {
      window.addEventListener('dragenter', this.dragEnterHandler)
      window.addEventListener('dragleave', this.dragLeaveHandler)
      window.addEventListener('drop', this.dropHandler)
    },
    disableDrop () {
      window.removeEventListener('dragenter', this.dragEnterHandler)
      window.removeEventListener('dragleave', this.dragLeaveHandler)
      window.removeEventListener('drop', this.dropHandler)
    },
    resetForm (formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].resetFields()
      }
    },

    onDrop (e) {
      e.preventDefault()
      const dataTransfer = e.dataTransfer
      if (
        dataTransfer.items &&
        dataTransfer.items[0] &&
        dataTransfer.items[0].webkitGetAsEntry
      ) {
        this.webkitReadDataTransfer(dataTransfer)
      }
    },
    webkitReadDataTransfer (dataTransfer) {
      let fileNum = dataTransfer.items.length
      const files = []
      this.loading = true

      // 递减计数，当fileNum为0，说明读取文件完毕
      const decrement = () => {
        if (--fileNum === 0) {
          this.handleFiles(files)
          this.loading = false
        }
      }

      // 递归读取文件方法
      const readDirectory = (reader) => {
        // readEntries() 方法用于检索正在读取的目录中的目录条目，并将它们以数组的形式传递给提供的回调函数。
        reader.readEntries((entries) => {
          if (entries.length) {
            fileNum += entries.length
            entries.forEach((entry) => {
              if (entry.isFile) {
                entry.file((file) => {
                  readFiles(file, entry.fullPath)
                }, readError)
              } else if (entry.isDirectory) {
                readDirectory(entry.createReader())
              }
            })

            readDirectory(reader)
          } else {
            decrement()
          }
        }, readError)
      }
      // 文件对象
      const items = dataTransfer.items
      // 拖拽文件遍历读取
      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry()
        if (!entry) {
          decrement()
          return
        }

        if (entry.isFile) {
          // 读取单个文件
          return
          // readFiles(items[i].getAsFile(), entry.fullPath, 'file')
        } else {
          // entry.createReader() 读取目录。
          readDirectory(entry.createReader())
        }
      }

      function readFiles (file, fullPath) {
        file.relativePath = fullPath.substring(1)
        files.push(file)
        decrement()
      }
      function readError (fileError) {
        throw fileError
      }
    },

    handleFiles (files) {
      // 按文件名称去存储列表，考虑到批量拖拽不会有同名文件出现
      const dirObj = {}
      // console.log(files, '1233')
      // return
      files.forEach((item) => {
        // relativePath 和 name 一致表示上传的为文件，不一致为文件夹
        // 文件直接放入table表格中
        // 仍需考虑去重问题
        const isExist = this.fileListArr.findIndex(x => x.name === item.name && (x.webkitRelativePath || x.relativePath) === (item.webkitRelativePath || item.relativePath))
        if (isExist > -1 || item.size > this.uploadSizeLimt) {
          return
          // this.fileListArr.splice(isExist, 1)
        }
        this.fileListArr.push(item)
        // if (item.relativePath === item.name) {
        //   this.tableData.push({
        //     name: item.name,
        //     filesList: [item.file],
        //     isFolder: false,
        //     size: item.size
        //   })
        // }
        // // 文件夹，需要处理后放在表格中
        // if (item.relativePath !== item.name) {
        //   const filderName = item.relativePath.split('/')[0]
        //   if (dirObj[filderName]) {
        //     // 放入文件夹下的列表内
        //     const dirList = dirObj[filderName].filesList || []
        //     dirList.push(item)
        //     dirObj[filderName].filesList = dirList
        //     // 统计文件大小
        //     const dirSize = dirObj[filderName].size
        //     dirObj[filderName].size = dirSize ? dirSize + item.size : item.size
        //   } else {
        //     dirObj[filderName] = {
        //       filesList: [item],
        //       size: item.size
        //     }
        //   }
        // }
      })

      // 放入tableData
      Object.keys(dirObj).forEach((key) => {
        this.tableData.push({
          name: key,
          filesList: dirObj[key].filesList,
          isFolder: true,
          size: dirObj[key].size
        })
      })
    },

    validateBucket () {
      if (!this.form.Bucket) {
        if (this.bucketList.length) {
          this.$notify({
            type: 'error',
            title: '请选择一个bucket'
          })
        } else {
          if (this.noBucket) {
            this.$notify({
              type: '无bucket可用，请先创建bucket'
            })
          } else {
            this.$notify({
              type: 'error',
              title: '请点击“连接”按钮，设置bucket'
            })
          }
        }
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            document.onkeydown = function (event) {
              var e = event || window.event || arguments.callee.caller.arguments[0]
              if (e && e.keyCode == 116) {
                return false
              }
            }
            window.onbeforeunload = function (e) {
              // 兼容ie
              // 触发条件 产生交互、当前不支持自定义文字
              e = e || window.event
              if (e) e.returnValue = 'none'
              return 'none'
            }
            document.oncontextmenu = function () { return false }
            this.dirFlag = true
            const { endpoint, accessKeyId } = this.form
            localStorage.setItem('form', JSON.stringify({
              endpoint,
              accessKeyId
            }))
          }
        })
      }
    },
    getBucketList () {
      const {
        accessKeyId,
        secretAccessKey,
        endpoint
      } = this.form
      if (!endpoint) {
        this.$notify({
          type: 'error',
          title: '请输入endpoint'
        })
        return
      }
      if (!accessKeyId) {
        this.$notify({
          type: 'error',
          title: '请输入Access Key'
        })
        return
      }
      if (!secretAccessKey) {
        this.$notify({
          type: 'error',
          title: '请输入Secret Key'
        })
        return
      }
      this.S3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: 'EastChain-1',
        s3ForcePathStyle: true
      })
      this.S3.listBuckets((err, data) => {
        if (err) {
          // console.dir(err)
          // console.log('%c 123', 'color:red;font-size:20px')
          // "NetworkingError"
          let title = ''
          let message = ''
          if (err.code === 'AccessDenied') {
            title = '连接S3失败'
            message = '请检查ak/sk是否输入正确'
          } else if (Number(err.code) === 12) {
            title = '网络异常'
            message = '请检查endpoint是否正确'
          } else if (err.code === 'NetworkingError') {
            title = '网络异常'
            message = '请检查endpoint是否正确,或稍后再试'
          } else {
            title = '连接S3失败'
            message = this.$trans(err.message || '')
          }
          // console.dir(err, 'err')
          this.$notify({
            type: 'error',
            title,
            message,
            showClose: false,
            customClass: 'errorTip'
          })
          this.noBucket = false
          this.bucketList = []
          this.form.Bucket = ''
        } else {
          this.bucketList = (data.Buckets || []).map(x => x.Name)
          if (!this.bucketList.length) {
            this.$notify({
              type: 'error',
              title: '无bucket可用，请先创建bucket'
            })
            this.noBucket = true
          } else {
            this.form.Bucket = this.bucketList[0]
            this.$notify({
              type: 'success',
              title: '连接S3成功'
            })
            // this.form.Bucket = 'test'
            // 确保断网或刷新页面导致未完成的上传记录清除
            // this.doClearFileLog()
          }
        }
      })
    },
    doClearFileLog () {
      const {
        accessKeyId,
        endpoint
      } = this.form
      const keyList = JSON.parse(JSON.stringify(this.readFileList))
      // console.log(keyList, 'null')
      const doAbortTasks = keyList.map((x, i) => {
        return new Promise((resolve, rejected) => {
          if (accessKeyId === x.accessKeyId && endpoint === x.endpoint) {
            // 一致性确保listPart正常
            const params = {
              Bucket: x.Bucket,
              Key: x.Key,
              UploadId: x.UploadId
            }
            this.S3.listParts(params, (err, data) => {
              // 不存在err、complete完还有part、上传大文件失败
              // console.log(data, 'err', err)
              if (!err) {
                // doAbort
                const reUpload = data.Parts && data.Parts.length > 0
                // console.log(data, '1233', reUpload)
                if (reUpload && this.enableReUpload) {
                  keyList[i].reUpload = true
                  keyList[i].parts = data.Parts
                  const expireTime = keyList[i].expireTime
                  if (expireTime) {
                    if (
                      expireTime < moment().valueOf()) {
                      this.S3.abortMultipartUpload(params, (err, data) => {
                        if (!err) {
                          keyList[i].delete = true
                          resolve('clearTask')
                          // 清除该条记录
                        }
                      })
                    } else {
                      resolve('keepReUpload')
                    }
                  } else {
                    keyList[i].expireTime = moment().add(15, 'day').valueOf()
                    resolve('reUpload')
                  }
                  // 有切片需要支持后续上传
                } else {
                  this.S3.abortMultipartUpload(params, (err, data) => {
                    if (!err) {
                      keyList[i].delete = true
                      resolve('clearTask')
                      // 清除该条记录
                    }
                  })
                }
              } else {
                // 此处问题、
                keyList[i].delete = true
                resolve('clearTask')
                // 清除该条记录
              }
            })
          } else {
            rejected('notMatch')
            // noThingTodo
          }
        })
      })
      Promise.allSettled(doAbortTasks).then(res => {
        // localStorage.setItem('fileList', JSON.stringify(iterateArr))
        // 结束清理status为删除的
        const fileList = keyList.filter(x => x.delete !== true)
        this.readFileList = []
        localStorage.setItem('fileList', JSON.stringify(fileList))
        // console.log('checkOver', keyList, localStorage.getItem('fileList'))
      })
    },
    confirmPut () {
      const {
        Bucket,
        hostName
      } = this.form
      this.finalList = []
      const putObjectArr = []
      const multUploadArr = []
      this.disableDrop()
      document.querySelector('#loadChart').style.display = 'block'
      const judgeUploadType = async () => {
        // 文件分流
        this.fileListArr.forEach(x => {
          this.totalSize = this.totalSize + x.size
          if (x.size <= this.uploadPartSize) {
            putObjectArr.push({
              Bucket,
              Key: hostName + '/' + this.handlePutPath(x),
              Body: x
            })
          } else {
            multUploadArr.push(x)
          }
        })
      }
      // 区分大文件
      (async () => {
        await judgeUploadType()
        // startPutObject
        // console.log(putObjectArr, multUploadArr)
        // return
        this.loadingBg = this.$loading({
          lock: true,
          text: '文件上传中，请勿关闭当前页面',
          spinner: 'el-icon-loading',
          background: 'rgba(1,1,1,.3)',
          customClass: 'putLoading'
        })
        try {
          const putObjectFin = []
          // const taskList = []
          this.putObjectNameArr = []
          const needMock = multUploadArr.length === 0
          // const putObjectStart = +new Date()
          // const putObjectCount = putObjectArr.length
          this.needMock = needMock && putObjectArr.length <= 5
          this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
          this.renderChartPart()
          //
          const _this = this
          let taskList = []
          const len = this.fileListArr.length
          for (let i = 0; i < len; i++) {
            const file = this.fileListArr[i]
            let asyncTask = null
            if (file.size <= this.uploadPartSize) {
              asyncTask = new Promise((res, rej) => {
                const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
                _this.S3.putObject({
                  Bucket,
                  Key: hostName + '/' + _this.handlePutPath(file)
                }, (err, data) => {
                  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  if (err) rej({ err, file, startTime, endTime })
                  else res({ success: 'success', file, startTime, endTime })
                })
              })
            } else {
              asyncTask = this.handleMultUpload([file])
              // 与putObject区分
            }
            taskList.push(asyncTask)
            if (taskList.length == 2 || i === len - 1) {
              const partRes = await Promise.allSettled(taskList)
              this.putSize += partRes.reduce((pre, cur) => {
                if (cur.status === 'fulfilled' && !Array.isArray(cur.value)) {
                  pre += cur.value.file.size
                }
                return pre
              }, 0)
              putObjectFin.push(...partRes)
              taskList = []
            }
          }
          setTimeout(() => {
            _this.releaseDisable()
            _this.loadingBg.close()
            console.log(putObjectFin)
            // console.log(result, 'result')
            _this.writeErrorLog(putObjectFin)
          }, 1200)
        } catch (error) {
          console.log('errorOperate', error)
        }
      })()
    },
    writeErrorLog (result) {
      // console.log(result, '================')
      const file = result
      // console.log(result, '123')
      const failList = file.filter(x => x.status === 'rejected' || (x.hasError))
      // .map(x => {
      //   // while大文件异步promise格式化
      //   if (x.hasError) {
      //     x.reason = x.err
      //   }
      //   return x
      // })
      // const log = failList.reduce((pre, cur, i) => {
      //   return pre + '结束时间：' + cur.reason.endTime + ' ' + '对象Key: ' + cur.reason.file.Key + ' ' + ' ' + '错误原因: ' + cur.reason.err.message + '\n'
      // }, '')
      const total = file.length
      const failCount = failList.length
      const successCount = total - failCount
      // console.log('===============', failList, log, result)
      if (failCount && failCount > 0) {
        this.$notify({
          title: '上传完成',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
          <br/>
        </p>`
        })
        this.dirFlag = false
        // upload({
        //   log
        // }).then(res => {
        //   this.$notify({
        //     title: '上传完成',
        //     dangerouslyUseHTMLString: true,
        //     type: 'success',
        //     message: `<p>
        //   <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
        //   <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
        //   <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
        //   <br/> <span style="color:#d3d6d8;font-size:15px">请到备份历史查看详情</span>
        // </p>`
        //   })
        // }).finally(() => {
        //   this.dirFlag = false
        // })
      } else {
        this.$notify({
          title: '上传完成',
          dangerouslyUseHTMLString: true,
          type: 'success',
          message: `<p>
          <strong style="color:#d3d6d8;font-size:15px">总计: ${total}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">成功: ${successCount}个</strong>
          <br/> <strong style="color:#d3d6d8;font-size:15px">失败: ${failCount}个</strong>
        </p>`
        })
        this.dirFlag = false
      }
    },
    async continueUpload (putObjectFin, multUploadArr) {
      // case putObject
      this.loadingBg = this.$loading({
        lock: true,
        text: '文件上传中，请勿关闭当前页面',
        spinner: 'el-icon-loading',
        background: 'rgba(1,1,1,.3)',
        customClass: 'putLoading'
      })
      const {
        hostName
      } = this.form
      let taskList = []
      const needMock = multUploadArr.length === 0
      const putObjectStart = +new Date()
      this.needMock = needMock && this.continueArr.length <= 5

      // putObject 待上传的文件、
      const count = this.continueArr.length
      for (let i = 0; i < count; i++) {
        const file = this.continueArr[i]
        // i > 0 ? file.Bucket = '123' : null
        const p = new Promise((res, rej) => {
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
          this.S3.putObject(file, (err, data) => {
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
            if (err) rej({ err, file, startTime, endTime })
            else res({ success: 'success', file, startTime, endTime })
          })
        })
        taskList.push(p)
        if (taskList.length == 5 || i === count - 1) {
          const partRes = await Promise.allSettled(taskList)
          // 罗列list 记录上传后的状态
          // 存在reject newworkFailure 停止当前for循环putObject
          if (partRes.some(x => x.status === 'rejected' && x.reason.err.code === 'NetworkingError')) {
            break
          } else {
            console.log(partRes, '1233')
            // 记录上传成功及非网络异常导致的上传失败
            this.putObjectNameArr.push(...partRes.map(x => {
              return x.status === 'fulfilled'
                ? hostName + '/' + this.handlePutPath(x.value.file.Body)
                : hostName + '/' + this.handlePutPath(x.reason.file.Body)
            }))
          }
          this.putSize += partRes.reduce((pre, cur) => {
            pre += cur.status === 'fulfilled' ? cur.value.file.Body.size
              : cur.reason.file.Body.size
            return pre
          }, 0)
          putObjectFin.push(...partRes)
          taskList = []
        }
      }
      this.continueArr = this.continueArr.filter(x => {
        return this.putObjectNameArr.every(y => {
          return x.Key !== y
        })
      })
      if (this.continueArr.length) {
        this.loadingBg.close()
        setTimeout(() => {
          // 判断网络连接情况
          this.$confirm('恢复上传对象', '请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.continueUpload(putObjectFin, multUploadArr)
          })
        }, 1000)
        return
      }
      if (this.needMock) {
        const putObjectEnd = +new Date()
        const timeSeconds = Math.ceil((putObjectEnd - putObjectStart) / 1000)
        await this.renderLoadingChart(timeSeconds)
      }
      const multipleObjects = await this.handleMultUpload(multUploadArr)
      // console.log(this.totalSize, this.putSize, 'fin')
      setTimeout(() => {
        this.releaseDisable()
        this.loadingBg.close()
        // console.log(result, 'result')
        this.writeErrorLog([...multipleObjects, ...putObjectFin])
      }, 1200)
    },
    handleRemoveErrorUpload (arr) {
      arr = JSON.parse(JSON.stringify(arr))
      const ErrorConnect = arr.filter(x => x.hasError && x.err.err.code === 'NetworkingError')
      if (ErrorConnect.length) {
        const index = arr.findIndex(x => {
          return x.Key === ErrorConnect[0].err.file.Key
        })
        arr.splice(index, 1)
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.form) {
  label.el-form-item__label {
    margin-left: 0 !important;
    width: 150px !important;
  }
  .el-select {
    width: 100%;
  }
}

:deep(.el-dialog) {
  .icon {
    cursor: pointer;
    font-size: 17px;
    margin: 0 18px 0 3px;
    vertical-align: middle !important;
  }
}
:deep(.errorTip) {
  background-color: aqua !important;
  width: fit-content !important;
  .el-notification__group {
    .el-notification__content {
      p {
        color: #d3d6d8;
      }
    }
  }
}

.el-icon-upload {
  font-size: 40px;
  margin: 0;
}

.el-upload__text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin: 40px 10px;
  line-height: 25px;
  text-align: center;
  color: #d3d6d8;
}

.addFiles {
  color: #337dff;
}

.drag {
  width: 100%;
  margin-top: 10px;
}
.el-table {
  max-height: 600px;
  overflow-y: auto;
}
#loadChart {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<style lang="scss">
.putLoading {
  .el-loading-spinner {
    position: fixed;
    top: 10%;
    left: 50%;
    width: fit-content;
    transform: translate(-50%);
  }
  .el-loading-spinner i {
    font-size: 25px;
  }
  .el-loading-text {
    font-size: 25px;
  }
}
.uploadMenu {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  .el-button {
    font-size: 25px;
    height: 60px;
    width: 120px;
    padding: 15px;
    margin-right: 50px;
    box-sizing: border-box;
  }
}
.picker__drop-zone {
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 100%, 0.9);
  border: 6px solid #ff8746;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .anim-floating {
    animation-name: anim-floating-6a50ffaa;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
  .picker__drop-zone-label {
    margin-top: 30px;
    font-size: 25px;
    color: #333;
  }
  .drop-arrow {
    display: inline-block;
    div {
      display: block;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    .arrow {
      width: 38.68px;
      height: 63.76px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 38.68 63.76' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M34.2 42.63 21.68 55V3c0-1.42-.88-3-2.34-3a3 3 0 0 0-2.66 3v52L4.47 42.63a2.68 2.68 0 0 0-1.85-.76 2.57 2.57 0 0 0-1.85.76 2.51 2.51 0 0 0 0 3.63L17.49 63a2.7 2.7 0 0 0 1.85.76 2.58 2.58 0 0 0 1.85-.76l16.72-16.75a2.51 2.51 0 0 0 0-3.63 2.69 2.69 0 0 0-3.7 0Zm0 0' fill='%23333'/%3E%3C/svg%3E");
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 0;
    }
    .base {
      width: 88.98px;
      height: 28.61px;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 88.98 28.61' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M86.42.38A2.26 2.26 0 0 0 84 2.73v9.07a12.34 12.34 0 0 1-12 11.93H15.78C9.44 23.73 5 18.05 5 11.73V2.28A2.22 2.22 0 0 0 2.56 0 2.55 2.55 0 0 0 0 2.56v9.45a16.48 16.48 0 0 0 16.44 16.6h56.22A16.38 16.38 0 0 0 89 12.02V2.95A2.35 2.35 0 0 0 86.72.38h-.28z' fill='%23333'/%3E%3C/svg%3E");
    }
  }
}
@keyframes anim-floating-6a50ffaa {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(25%);
  }

  to {
    transform: translateY(0);
  }
}
</style>


```
