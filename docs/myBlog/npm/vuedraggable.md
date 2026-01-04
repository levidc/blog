---
title: 拖拽上传文件夹
date: 2024-03-08
categories:
  - 前端

tags:
  - vue2
  - npm

sticky: 2
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/54.jpg)

<!-- more -->

##
```js
<template>
  <div>
    <el-dialog title="上传文件" :visible.sync="dirFlag" width="1000px" destroy-on-close :close-on-press-escape="false"
      :close-on-click-modal="false" :before-close="closeModal">
      <el-form ref="form" :model="form" size="mini" label-width="150px" :rules="rules">
        <el-row class="uploadMenu">
          <el-col :span="12">
            <el-form-item label="虚拟存储" prop="storageId">
              <el-select v-model="form.storageId" :placeholder="storageList.length ? '请选择虚拟存储' : '请先分配虚拟存储'"
                style="width: 100%;">
                <el-option v-for="item in storageList" :key="item.Id" :value="item.Id"
                  :label="`${item.Name}： (${item.Id})`">
                  <span style="margin-left: 10px;">{{ item.Name }}：</span>
                  <span>({{ item.Id }})</span>
                </el-option>
              </el-select>
              <!-- <el-input v-model="form.storageId" clearable /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" style="display: flex;justify-content: flex-end;">
            <el-upload ref="uploadFile" action="#" :http-request="() => { }" multiple :show-file-list="false"
              :before-upload="handleSizeValidate">
              <!-- <el-button size="small" type="primary" @click="postFolder('folder')">上传目录</el-button> -->
              <el-button size="small" type="primary" @click="postFolder('file')">上传文件</el-button>
            </el-upload>
            <el-button type="danger" :disabled="!fileListArr.length" @click="cleafFile">清空</el-button>
          </el-col>
        </el-row>
        <!-- <input type="file" id="upload" ref="inputer" name="file" multiple /> -->
        <div class="drag tableBox" :style="renderPadding">
          <div v-show="!fileListArr.length" class="el-upload__text">
            <i class="el-icon-upload" style="margin-right: 6px" />
            点击上传文件或拖拽文件到此处
            <!-- <el-button type="text" @click="addFiles">添加文件</el-button> -->
          </div>
          <div v-show="!fileListArr.length" class="el-upload__text">
            <!-- 文件上传限制提示 -->
            单个文件大小不超过300MB
          </div>
          <el-table v-show="fileListArr.length"
            :data="fileListArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)" max-height="600">
            <el-table-column label="对象key" prop="name" min-width="120px" />
            <!-- <el-table-column label="目录" min-width="120px">
              <template slot-scope="scope">
                {{ renderFileRelative(scope.row) }}
              </template>
</el-table-column> -->
            <el-table-column label="类型" width="230px">
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
                <svg style="cursor: pointer;color: #f34e4e;position: relative;top: 0px;" class="icon"
                  @click="removeItem(scope)">
                  <use xlink:href="#icon-trash" />
                </svg>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-show="fileListArr.length" class="right_page" :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="fileListArr.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="fileListArr.length == 0" @click="handleDebounceDown">确定</el-button>
        <el-button @click="closeModal">{{ $t('button.cancel') }}</el-button>
      </div>
      <!-- <div id="loadChart" style="width:400px;height:300px;display:none" /> -->
    </el-dialog>

    <div v-if="showDrop" class="picker__drop-zone" @dragover="(e) => e.preventDefault()" @drop="onDrop">
      <div class="drop-arrow">
        <div class="arrow anim-floating" />
        <div class="base" />
      </div>
      <div class="picker__drop-zone-label">拖拽文件到此处</div>
    </div>
  </div>
</template>

<script>
import { getAppliedStoragesForUserBase } from '@/api/emp'
import { debounce } from '@/utils/index'
export default {
  name: '',
  components: {},
  props: {
    dirFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploadSizeLimt: 300 * 1024 ** 2, // 上传文件大小限制 300MB
      createForm: {},
      fileListArr: [],
      showDrop: false,
      currentPage: 1,
      pageSize: 10,
      storageList: [],
      loading: false,
      form: {
        storageId: ''
      },
      rules: {
        storageId: {
          required: true,
          message: '请选择虚拟存储',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  computed: {},
  watch: {
    dirFlag (val) {
      if (!val) {
        this.disableDrop()
        this.currentPage = 1
        this.pageSize = 10
        this.fileListArr = []
        this.storageList = []
      } else {
        // this.form.storageId = '3107555750843026470'
        this.form.storageId = ''
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
          this.$refs['uploadFile'].clearFiles()
        })
        this.enableDrop()
        this.fileListArr = []
        this.getStorageList()
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    getStorageList () {
      this.loading = true
      getAppliedStoragesForUserBase({
        userId: this.$store.state.user.ownerId
      }).then(res => {
        this.storageList = res
        if (this.storageList.length) {
          this.form.storageId = this.storageList[0].Id
        }
      }).finally(() => {
        this.loading = false
      })
    },
    closeModal () {
      this.$emit('closeModal')
    },
    renderPath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    },
    renderFileRelative (row) {
      return row.isDirectory ? row.relativePath.split('/')[0] : (row.webkitRelativePath
        ? this.renderPath(row.webkitRelativePath) : this.renderPath(row.relativePath))
    },
    renderPadding () {
      return this.fileListArr.length ? {
        padding: '50px 10px'
      } : {
        padding: '150px 20px'
      }
    },
    handleSizeValidate (file) {
      const size = file.size
      // console.log(file, 'file', this.fileListArr, '1233')

      // 检查是否为文件夹，如果是则不添加到表格
      if (file.isDirectory) {
        // console.log(`跳过文件夹: ${file.name}`);
        return false
      }

      const isExist = this.fileListArr.findIndex(x => {
        return this.showFileDir(x) ? (x.webkitRelativePath || x.relativePath) === (file.webkitRelativePath || file.relativePath) : x.name === file.name
      })
      if (isExist > -1) return false
      if (size > this.uploadSizeLimt) {
        this.$notify({
          type: 'error',
          message: '当前上传文件大于300M'
        })
        return false
      }
      this.fileListArr.push(file)
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    renderRelativePath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    },
    showFileDir (file) {
      return file && file.webkitRelativePath ? file.webkitRelativePath : this.renderRelativePath(file.relativePath)
    },
    handleFiles (files) {
      // console.log('开始处理文件，传入的文件数量:', files.length);
      // 分批处理文件，避免大量DOM操作导致的卡顿
      const BATCH_SIZE = 100;
      let currentIndex = 0;
      let newFilesAdded = 0;

      // 显示处理进度通知
      // const notificationId = `fileProcessing${Date.now()}`;

      const processBatch = () => {
        // 处理当前批次的文件
        const batch = files.slice(currentIndex, currentIndex + BATCH_SIZE);
        // console.log(`处理第${Math.floor(currentIndex / BATCH_SIZE) + 1}批文件，批次文件数量:`, batch.length);

        batch.forEach((item, index) => {
          if (!item) {
            // console.warn(`跳过第${currentIndex + index}个无效文件`);
            return;
          }

          // 检查是否为文件夹，如果是则不添加到表格
          if (item.isDirectory) {
            // console.log(`跳过文件夹: ${item.name}`);
            return;
          }

          // 检查文件是否已存在
          const isExist = this.fileListArr.findIndex(x => {
            if (!x) return false;
            const xPath = x.webkitRelativePath || x.relativePath || '';
            const itemPath = item.webkitRelativePath || item.relativePath || '';
            const result = this.showFileDir(x) ? xPath === itemPath : x.name === item.name;
            // if (result) {
            //   console.log(`文件重复，跳过添加: ${item.name}, 路径: ${itemPath}`);
            // }
            return result;
          });

          if (isExist > -1) return;

          // 检查文件大小限制
          if (item.size > this.uploadSizeLimt) {
            // console.warn(`文件大小超过限制，跳过添加: ${item.name}, 大小: ${item.size}字节`);
            this.$notify({
              type: 'error',
              message: `文件 ${item.name} 大于300M，无法上传`
            });
            return;
          }

          // 添加文件到上传列表
          this.fileListArr.push(item);
          newFilesAdded++;
          // console.log(`成功添加文件: ${item.name}, 索引: ${this.fileListArr.length - 1}`);
        });

        // 更新索引
        currentIndex += BATCH_SIZE;

        // 更新通知内容显示进度
        if (currentIndex < files.length) {
          // this.$notify.close(notificationId);
          //const progress = Math.round((currentIndex / files.length) * 100);
          // this.$notify({
          //   title: '处理中',
          //   message: `正在处理文件，请稍候... (${progress}%)`,
          //   duration: 0,
          //   id: notificationId
          // });

          // 使用setTimeout处理下一批
          setTimeout(processBatch, 16); // 约60fps的频率处理，避免UI卡顿
        } else {
          // 处理完成，关闭通知
          // this.$notify.close(notificationId);

          if (newFilesAdded > 0) {
            // console.log(`文件处理完成，总共添加了${newFilesAdded}个新文件，当前上传列表总数: ${this.fileListArr.length}`);
            this.$notify({
              type: 'success',
              message: `成功添加 ${newFilesAdded} 个文件`
            });
          } else {
            // console.log('没有添加新文件，可能所有文件都已存在或超过大小限制');
          }
        }
      };

      // 显示初始通知
      // this.$notify({
      //   title: '处理中',
      //   message: '正在处理文件，请稍候...',
      //   duration: 0,
      //   id: notificationId
      // });

      // 开始处理第一批
      processBatch();
    },
    cleafFile () {
      this.fileListArr = [] // 清除表格展示
      this.$refs['uploadFile'].clearFiles() // 清除组件FileList
    },
    postFolder (type) {
      if (type === 'file') {
        document.querySelector('.el-upload__input').webkitdirectory = false
      } else {
        document.querySelector('.el-upload__input').webkitdirectory = true
      }
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
    onDrop (e) {
      // 阻止默认行为
      e.preventDefault();
      e.stopPropagation();

      // 获取拖拽的数据传输对象
      const dataTransfer = e.dataTransfer;
      const filesToProcess = [];

      // 优先处理dataTransfer.items来正确识别文件夹
      if (dataTransfer.items && dataTransfer.items.length > 0) {
        // console.log(`检测到${dataTransfer.items.length}个拖拽项，开始筛选文件`);

        // 遍历所有拖拽项
        for (let i = 0; i < dataTransfer.items.length; i++) {
          const item = dataTransfer.items[i];
          if (!item) continue;

          // 获取文件系统条目以检查是否为文件夹
          const entry = item.webkitGetAsEntry();

          // 如果是文件，则添加到处理队列
          if (entry && entry.isFile) {
            const file = item.getAsFile();
            if (file && !file.isDirectory) { // 再次确保不是文件夹
              filesToProcess.push(file);
              // console.log(`添加文件到处理队列: ${file.name}`);
            }
          } else if (entry && entry.isDirectory) {
            // console.log(`跳过文件夹: ${entry.name || '未命名文件夹'}`);
          } else {
            // 如果无法获取entry，尝试直接获取文件
            const file = item.getAsFile();
            if (file && !file.isDirectory) { // 确保不是文件夹
              filesToProcess.push(file);
              // console.log(`添加文件到处理队列(备用方式): ${file.name}`);
            }
          }
        }
      }
      // 备用方案：直接处理files集合
      else if (dataTransfer.files && dataTransfer.files.length > 0) {
        // console.log(`通过备用方式检测到${dataTransfer.files.length}个文件，开始筛选`);

        // 筛选出非文件夹的文件
        for (let i = 0; i < dataTransfer.files.length; i++) {
          const file = dataTransfer.files[i];
          if (file && !file.isDirectory) {
            filesToProcess.push(file);
            // console.log(`添加文件到处理队列(备用files方式): ${file.name}`);
          } else {
            // console.log(`跳过文件夹(备用files方式): ${file.name || '未命名文件夹'}`);
          }
        }
      }

      // 如果有文件需要处理，则调用handleFiles
      if (filesToProcess.length > 0) {
        // console.log(`筛选后共有${filesToProcess.length}个文件需要处理`);
        this.handleFiles(filesToProcess);
      } else {
        // console.warn('拖拽事件中未检测到有效的文件项');
      }

      // 关闭拖放区域显示
      this.showDrop = false;
    },
    // 不再需要的方法已移除
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
    showPutFileKey (file) {
      const {
        webkitRelativePath,
        relativePath
      } = file
      const hasDirPath = webkitRelativePath || relativePath
      return (this.$route.query.filename || '') + (hasDirPath || file.name)
    },
    handleDebounceDown: debounce.call(this, function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirmPut()
        }
      })
    }, 500),
    confirmPut () {
      try {
        this.$nextTick(() => {
          document.querySelector('.upload + span').classList.add('circleStatus')
        })
        // end
        document.querySelector('.upload + span').classList.add('active')
        // 刷新下载状态
        setTimeout(() => {
          document.querySelector('.upload + span').classList.remove('active')
        }, 1000)
        const uniqueKey = Date.now()
        // 同步vuex
        const totalSize = this.fileListArr.reduce((pre, cur) => pre + (cur.size || 0), 0)
        const firstFile = this.fileListArr[0]
        const taskName = this.fileListArr.length > 1 ? this.showPutFileKey(firstFile) + ' ... ' : this.showPutFileKey(firstFile)
        // 展示进度
        // console.log(this.fileListArr, 'filelistarr')
        this.$store.commit('ADD_UPLOAD_TASK', {
          taskName,
          execSize: 0,
          totalSize,
          uniqueKey,
          execCount: 0,
          totalCount: this.fileListArr.length,
          pending: true
        })
        // path 区分是否是共享目录
        const dirPath = this.$route.params.name.split('/')
        const generatedPath = dirPath.reduce((pre, cur) => pre + cur + '/', '')
        const path = dirPath.length === 1 ? `/${dirPath[0]}/` : generatedPath.startsWith('/') ? generatedPath : '/' + generatedPath
        // 判断是否以'/'开头，不满足则手动添加
        this.$store.commit('ADD_UPLOAD_QUEUE', {
          fileList: this.fileListArr,
          prefix: this.$route.query.filename,
          Bucket: this.$route.params.id,
          taskName,
          uniqueKey,
          storageId: this.form.storageId || '3107555750843026470',
          path,
          shareFileId: this.$route.query.id || ''
        })
        this.$emit('closeModal')
        this.$bus.$emit('upload')
      } catch (error) {
        console.log(error, '123')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 进度条样式 */
.upload-progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.progress-content {
  background-color: #fff;
  padding: 30px 50px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 400px;
  text-align: center;
}

.progress-text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #303133;
}

/* 调整表格样式 */
.tableBox {
  position: relative;
  overflow: hidden;
}

/* 拖拽区域样式优化 */
.picker__drop-zone {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 184, 148, 0.05);
  border: 2px dashed #00b894;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.picker__drop-zone-label {
  font-size: 20px;
  color: #00b894;
  margin-top: 20px;
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

.drag {
  width: 100%;
  margin-top: 10px;

  .right_page {
    float: none;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

::v-deep .uploadMenu {
  width: 100%;

  .el-button {
    margin-right: 30px;
  }
}

.el-upload__text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin: 40px 10px;
  line-height: 25px;
  text-align: center;
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

.el-steps {
  padding: 20px 100px;
}
</style>



```

