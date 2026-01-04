---
title: 对象上传及大文件分段
date: 2025-12-14
categories:
  - js

tags:
  - js原生
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/15.jpg)

<!-- more -->



## 页面上传
```js
<template>
  <div>
    <el-row>
      <el-col :span="24" class="manage-area-title">
        <h2>数据网关</h2>
        <div class="selectConfig">
          <el-select v-model="selform" class="config" @change="handleFillForm" filterable>
            <el-option v-for="({ location, endpoint, accessKeyId, id }) in localConfigList"
              :label="`${location} —— ${endpoint} —— ${accessKeyId}`" :value="id" :key="id">
              <span style="float: left;margin-right: 20px;"> Manager: ({{ location }})</span>
              <span style="float: right;margin-right: 20px;"> accessKeyId: ({{ accessKeyId }})</span>
              <span style="float: right;margin-right: 20px;"> endpoint: ({{ endpoint }})</span>
            </el-option>
          </el-select>
          <el-tooltip content="添加配置" placement="top">
            <svg class="icon add" @click="addConfig">
              <use xlink:href="#icon-btn_add" />
            </svg>
          </el-tooltip>
          <el-tooltip content="移除配置" placement="top">
            <svg class="icon del" @click="delConfig" v-if="selform">
              <use xlink:href="#icon-btn_delete" />
            </svg>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <!-- <BreadCrumbs /> -->
    <div class="page_content_wrap">
      <el-form ref="form" class="form" :model="form" style="width: 40%;" label-width="150px" :rules="rules"
        :disabled="optType !== 'add' && optType !== 'modify'">
        <el-form-item label="Manager" prop="location">
          <el-input v-model="form.location" placeholder="请输入服务地址" style="width: 80%;" />
          <el-button class="blue" style="position: absolute; right: 0;top:8px" @click="initManager()">连接</el-button>
        </el-form-item>

        <template v-if="checkManager">
          <el-form-item label="Endpoint" prop="endpoint">
            <el-select v-model="form.endpoint" clearable placeholder="请选择endpoint" filterable>
              <el-option v-for="x in endPointList" :key="x.endpoint" :value="x.endpoint" :label="x.endpoint" />
            </el-select>
          </el-form-item>
          <el-form-item label="Access Key" prop="accessKeyId">
            <el-input v-model="form.accessKeyId" clearable placeholder="请输入Access Key" style="width: 80%;" />
            <el-button type="primary" class="golden" style="position: absolute; right: -15px;top:8px"
              @click="getBucketList(true)">连接S3</el-button>
          </el-form-item>
        </template>

        <!-- {{ form.secretAccessKey }} -->
        <!-- <el-form-item label="Secret Key" prop="secretAccessKey">
          <el-input v-model="form.secretAccessKey" type="password" show-password clearable placeholder="请输入Secret Key"
            style="width: 80%;" />
        </el-form-item> -->
        <!-- <el-form-item v-if="bucketList && bucketList.length" label="bucket" prop="Bucket">
          <el-select v-model="form.Bucket" clearable placeholder="请选择一个bucket" filterable>
            <el-option v-for="x in bucketList" :key="x" :value="x" :label="x" />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="checkFlag">
          <!-- <el-button class="golden" @click="validateBucket()">上传</el-button> -->
          <el-button class="blue" @click="saveConfig">{{ selform === '' ? '保存' : '修改' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Bucket :bucketList="bucketList" @refreshTable="refreshBucket"></Bucket>
    <!-- <bucketList v-if="form.Bucket" :bucket-name="form.Bucket"></bucketList> -->
    <!-- <div
      id="loadChart"
      style="width:400px;height:300px"
    /> -->

    <el-dialog title="上传" :visible.sync="dirFlag" width="65%" destroy-on-close :close-on-press-escape="false"
      :close-on-click-modal="false">
      <el-form ref="createForm" :model="createForm" size="mini" label-width="150px"
        style="padding:0 5%;position:relative">
        <!-- :before-upload="validateFileRule" -->
        <!-- :accept=",,拼接可接受文件类型 image/* 任意图片文件" -->
        <!-- :http-request="uploadFile"  覆盖原生action上传方法-->
        <!-- var formData = new FormData();  //  用FormData存放上传文件 -->
        <!-- formData.append('paramsName','file') -->
        <el-row class="uploadMenu">
          <el-upload ref="uploadFile" action="#" multiple :show-file-list="false" :http-request="handleRequest"
            :before-upload="handleSizeValidate">
            <!-- <el-button
                size="small"
                class="golden"
                @click="postFolder('file')"
              >上传文件</el-button> -->
            <el-button size="small" class="golden" @click="postFolder('folder')">上传</el-button>
          </el-upload>
          <el-button class="blue" :disabled="!fileListArr.length" @click="cleafFile">清空</el-button>
        </el-row>
        <!-- <input type="file" id="upload" ref="inputer" name="file" multiple /> -->
        <div draggable="true" class="drag tableBox" :style="renderPadding">
          <div v-show="!fileListArr.length" class="el-upload__text">
            <i class="el-icon-upload" style="margin-right: 6px" />点击上传或拖拽文件夹到此处
            <!-- <el-button type="text" @click="addFiles">添加文件</el-button> -->
          </div>
          <div v-show="!fileListArr.length" class="el-upload__text">
            <!-- 文件上传数量不能超过100个，总大小不超过5GB -->
            单个文件大小不超过50GB
          </div>
          <el-table v-show="fileListArr.length"
            :data="fileListArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
            <el-table-column label="对象key" prop="name" min-width="120px" />
            <el-table-column label="目录" min-width="120px">
              <template slot-scope="scope">
                {{ (scope.row.webkitRelativePath ? form.hostName + '/' + scope.row.webkitRelativePath : form.hostName
                  + '/' + scope.row.relativePath) | renderPath }}
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
                <svg class="icon" @click="removeItem(scope)">
                  <use xlink:href="#icon-trash" />
                </svg>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-show="fileListArr.length" :current-page="currentPage" :page-sizes="[5, 10, 50, 100]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="fileListArr.length"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="golden" :disabled="fileListArr.length == 0" @click="confirmPut()">{{ $ts('button.confirm')
        }}</el-button>
        <el-button @click="dirFlag = false;">{{ $ts('button.cancel') }}</el-button>
      </div>
      <div id="loadChart" style="width:400px;height:300px;display:none" />
    </el-dialog>
    <div v-if="showDrop" class="picker__drop-zone" @dragover="(e) => e.preventDefault()" @drop="onDrop">
      <div class="drop-arrow">
        <div class="arrow anim-floating" />
        <div class="base" />
      </div>
      <div data-v-6a50ffaa="" class="picker__drop-zone-label">拖拽文件夹到此处</div>
    </div>
  </div>
</template>
<script>
import {
  // upload,
  // getHostname,
  getServer,
  getUser
} from '@/api/agent'
const AWS = require('aws-sdk')
// AWS.config.logger = console;  // 关键配置
// AWS.config.logLevel = 'warn';  // 仅警告和错误
// import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
// const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");


// const FileSaver = require('file-saver')
//  AWS 设置超时时间 默认2min、当前60min
// const initialTime = 5000
AWS.config.update({
  s3ForcePathStyle: true,
  httpOptions: {
    timeout: 1000 * 60 * 10 // 保证超时时间、不会因为时间超时导致失败
  },
  maxRetries: 0
  // maxRetries: 1, // 无重试、断网自动添加判断续传
  // retryDelayOptions: {
  //   // base 默认100ms
  //   customBackoff: (count, err) => {
  //     console.log(err, '123')
  //     return count * 1000 + 5000
  //     // console.log(count, initialTime)
  //     // 重试时间间隔、默认5000，线性增长、最大增长5min、总重试时间12h
  //     // y= kx+b k、b为常数、by轴的偏移量
  //     // an = a1+(n-1) sn = n(a1+an)/2
  //     // 420=>24h
  //   }
  // }
})
// console.log(AWS.config, 'AWWWWs')
// import bucketList from '../Bucket/bucketListObject'
// import JSZip from 'jszip'
import Bucket from '@/components/page/Bucket/Bucket.vue'
import moment from 'moment'
export default {
  filters: {
    renderPath (path) {
      path = String(path) || ''
      const lastIndex = path.lastIndexOf('/')
      return path.substr(0, lastIndex)
    }
  },
  components: {
    Bucket,
    // bucketList
  },
  data () {
    return {
      checkManager: false,
      checkFlag: false,
      endPointList: [],
      localConfigList: [],
      optType: '',
      selform: '',
      connectingFlag: false,
      timerFail: null,
      netWorkFail: false,
      continueArr: [],
      loadingBg: null,
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
        // selectConfig: '',
        // hostName: 'TestDC',
        id: '',
        location: '',
        accessKeyId: '',
        secretAccessKey: '',
        // minioadmin
        endpoint: '',
        // endpoint: '',
        // path: '',
        // Bucket: ''
      },
      bucketList: [],
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      fileListArr: [],
      executeTime: '',
      rules: {
        location: { required: true, message: '请输入location' },
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
                return cb()
                // 匹配http://替换
                // const regPrefix = /(h)?(t)?(t)?(p)?(:)?(\/)?(\/)?/
                // const matchStr = val.match(regPrefix)?.[0]
                // this.form.endpoint = 'http://' + val.substring(matchStr.length)
              } else {
                return cb()
              }
            } else {
              return cb()
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
      showDrop: false,
      finList: []
    }
  },
  computed: {
    jsonConfigList () {
      return JSON.stringify(this.localConfigList)
    },
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
    'form.location' (val) {
      this.checkManager = false
    },
    jsonConfigList () {
      this.updateConfigList()
    },
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
        this.currentPage = 1
        this.pageSize = 10
        this.mockPutSize = 0
        // this.needMock = false
        this.myecharts = null
        this.continueArr = []
        this.putSize = 0 // 记录进度
        this.totalSize = 0
        this.readFileList = [] // 记录大文件上传
        this.finList = []
        clearTimeout(this.timer)
        this.releaseDisable()
        this.disableDrop()
        // this.doClearFileLog()
      }
    }
  },
  mounted () {
    this.loadConfigList()
    // window.addEventListener('online', function () {
    //   console.log('网络连接恢复！')
    // })
    // window.addEventListener('offline', function () {
    //   console.log('网络连接中断！')
    // })
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
    // this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
    // this.renderChartPart()
    // setTimeout(async () => {
    //   await this.renderLoadingChart(5)
    // }, 1000)
    // document.addEventListener('keydown', function (event) {
    //   if (event.code === 'Escape') {
    //     event.preventDefault() // 取消默认行为
    //   }
    // })
    // const { accessKeyId = '', endpoint = '', secretAccessKey = '' } = JSON.parse(localStorage.getItem('s3Client')) || {}

    // this.form.endpoint = endpoint || 'http://10.0.2.174:9000'
    // this.form.accessKeyId = accessKeyId || 'minioadmin'
    // this.form.secretAccessKey = secretAccessKey || 'minioadmin'



    // jsZip

    // const zip = new JSZip()
    // // 指定文件夹名称、文件内容
    // zip.file("text/file.txt", "content");
    // zip.forEach(function (relativePath, file) {
    //   console.log(`path: ${relativePath}, file: ${file.name}`)
    //   // 输出：path: text/file.txt, file: text/file.txt
    // });

    // 文件名可以是目录的名称、要是多个目录或者其他混合文件的文件名按时间 file_list构建
    // 打包输出blob数据、
    // zip.generateAsync({ type: "blob" }).then(function (content) {
    //   document.body.appendChild(document.createElement("a"));
    //   document.querySelector("a").href = URL.createObjectURL(content);
    //   document.querySelector("a").download = "test.zip";
    //   document.querySelector("a").click();
    // });


    // this.init()
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    initManager () {
      const loading = this.$loading({
        lock: true,
        text: 'loading...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 返回 Promise，确保调用者可以使用 .then()
      return getServer(this.form.location).then(res => {
        // res.planMsg[0].gatewayEndpoints[1] = '1.2.3.4'
        // res.planMsg[1] = {
        //   gatewayEndpoints: [
        //     '10.0.2.179:83001',
        //     '3.12.1.3'
        //   ],
        //   location:
        //     "000000-0000-00000-179",
        //   resId: '123'
        // }
        this.endPointList = (res.planMsg || []).reduce((pre, cur) => {
          // gatewayEndpoints 扁平化且 合入cur的属性
          pre.push(...cur.gatewayEndpoints.map(item => ({ endpoint: item, ...cur })))
          return pre
        }, [])
        this.checkManager = true
      }).finally(() => {
        loading.close()
      })
    },
    handleFillForm (val) {
      this.optType = 'modify'
      const index = this.localConfigList.findIndex(x => x.id === val)
      Object.assign(this.form, {
        ...this.localConfigList[index === -1 ? 0 : index]
      })
      const {
        accessKeyId,
        secretAccessKey,
        endpoint,
        location,
        id
      } = this.form
      localStorage.setItem('s3Client', JSON.stringify({
        accessKeyId,
        secretAccessKey,
        endpoint,
        location,
        id
      }))
      // 有效配置执行，确保顺序执行
      this.initManager().then(() => {
        this.getBucketList()
      })
      // 加载配置后连接S3
    },
    resetConifg () {
      this.checkManager = false
      this.checkFlag = false
      this.form = {
        location: '',
        // location: 'http://10.0.2.179:29084',
        endpoint: '',
        // endpoint: 'http://10.0.2.173:9000',
        accessKeyId: '',
        // secretAccessKey: 'minioadmin',
        secretAccessKey: '',
        id: ''
      }
      this.selform = ''
      this.bucketList = []
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    addConfig () {
      this.optType = 'add'
      this.resetConifg()
    },
    delConfig () {
      this.optType = 'del'
      // 删除条件 有选择的配置
      if (this.selform) {
        this.$confirm('确定删除当前配置,请确认!', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
          .then(() => {
            this.$msg({
              type: 'success',
              text: '配置已删除'
            })
            // toDo selform 保留id
            // 删除匹配
            const index = this.localConfigList.findIndex(x => x.id === this.selform)
            this.localConfigList.splice(index, 1)
            this.optType = ''
            this.resetConifg()
            localStorage.removeItem('s3Client')
          })
          .catch(() => {
            this.optType = 'modify'
          })
        // doConfirm
      }
    },
    saveConfig () {
      // this.optType = 'save'
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const {
            location,
            endpoint,
            accessKeyId,
            secretAccessKey,
          } = this.form
          if (!this.selform) {

            // 新增配置
            const id = Date.now()
            this.localConfigList.push({
              location,
              endpoint,
              accessKeyId,
              secretAccessKey,
              id
            })
            this.selform = id
            this.$msg({
              type: 'success',
              text: '配置已保存'
            })
            localStorage.setItem('s3Client', JSON.stringify({
              accessKeyId,
              secretAccessKey,
              endpoint,
              location,
              id: this.selform
            }))
          } else {
            // 覆盖原先配置
            const index = this.localConfigList.findIndex(x => x.id === this.selform)
            Object.assign(
              this.localConfigList[index],
              {
                location,
                endpoint,
                accessKeyId,
                secretAccessKey,
              }
            )
            localStorage.setItem('s3Client', JSON.stringify({
              accessKeyId,
              secretAccessKey,
              endpoint,
              location,
              id: this.selform
            }))
            // this.$msg({
            //   type: 'success',
            //   text: '配置已修改'
            // })
            // 修改缓存配置
          }
          // this.getBucketList()
        }
      })
      // 保存并且校验通过之后、自动切换select到当前
    },
    loadConfigList () {
      const configList = JSON.parse(localStorage.getItem('localConfigList') || '[]')
      this.localConfigList = configList
      // 加载配置(无缓存则空)
      const localConfig = JSON.parse(localStorage.getItem('s3Client') || '{}')
      if (JSON.stringify(localConfig) !== '{}') {
        // console.log(localConfig, 'ReadConfigS3Client')
        this.handleFillForm(localConfig.id)
        this.selform = localConfig.id
      }
    },
    updateConfigList () {
      localStorage.setItem('localConfigList', JSON.stringify(this.localConfigList))
    },
    doCheckNetWork () {
      // 检测网络
      return new Promise((resolve, reject) => {
        this.connectingFlag = true
        this.S3.listBuckets((err, data) => {
          this.connectingFlag = false
          if (err && (err.code === 'NetworkingError' || err.code === 'TimeoutError')) {
            reject(err)
            // console.log(err, 'ConnectTest')
          } else {
            resolve()
          }
        })
      })
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
    renderLoadingText () {
      // return this.needMock ? String(this.mockPutSize).replace('.00', '') + '%' : Number((this.putSize / this.totalSize) * 100).toFixed(2).replace('.00', '') + '%'
      return Number((this.putSize / this.totalSize) * 100).toFixed(2).replace('.00', '') + '%'
    },
    // 测试上传进度图表
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
      // var rate = this.needMock ? this.mockPutSize / 100 : this.putSize / this.totalSize // 完成率
      var rate = this.putSize / this.totalSize // 完成率
      const count = rate * 30
      // 填充
      for (let i = 1; i <= num; i++) {
        if (i <= count) {
          this.datas_outer[num - i].itemStyle.color = '#ff8746'
        } else {
          this.datas_outer[num - i].itemStyle.color = '#19272e'
        }
      }
      this.myecharts && this.myecharts.setOption(this.options)
      this.timer = setTimeout(() => {
        this.renderChartPart()
      }, 1000)
      // if (this.needMock) {
      //   clearTimeout(this.timer)
      // } else {
      //   this.timer = setTimeout(() => {
      //     this.renderChartPart()
      //   }, 1000)
      // }
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
    // init () {
    //   // const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
    //   // this.form.accessKeyId = accessKeyId
    //   // this.form.endpoint = endpoint
    //   // this.form.hostName = 'Dc'

    //   this.getHostLoading = this.$loading(this.loadingOption)
    //   getHostname().then(res => {
    //     this.form.hostName = res.data || ''
    //   }).finally(() => {
    //     this.getHostLoading.close()
    //     const { accessKeyId = '', endpoint = '' } = JSON.parse(localStorage.getItem('form')) || {}
    //     this.form.accessKeyId = accessKeyId
    //     this.form.endpoint = endpoint
    //   })
    // },
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
          // this.readFileList = [{ 'accessKeyId': 'minioadmin', 'endpoint': 'http://10.0.2.153:9000', 'Bucket': 'test', 'Key': '/testBig/1223.exe', 'UploadId': 'N2IwOTE3MDctYzgxZi00NTFlLThjZGMtM2FiNGZkYjE0MjIzLjAyMTJiNjExLWRlMDItNDNiMi04OWIzLWUwMjA2NjA1NWRlNg' }]
          const isExistReUploadPart = this.readFileList.find(x => {
            return x.Key === Key && x.Bucket === Bucket && x.accessKeyId === accessKeyId && x.endpoint === endpoint
          })

          // 存在文件的分片、调用listPart获取已上传的分片、并在下面的上传分片中跳过已有的分片
          // 一旦uploadPart开始进行中途断网则需要恢复
          // 所以断网续传2中、重试和重传
          // 重传下面得逻辑得调用listPart辅助记录已上传得文件并跳过进度
          // 且用于记录上传part的uploadId得同步新的uploadId
          // 多次中断会有问题、所以得记录已上传的partNumber、在新的上传失败时
          // 譬如、第一次上传1、2、3、4、5、5失败、则记录到4的size
          // 第二次1、2、3、5成功、4失败、则5不会同步
          // 所以断网对于大文件的记录得全部清空、从头开始？？
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
            // console.log(this.readFileList, params)
            this.S3.listParts(params, async (err, data) => {
              if (!err) {
                let {
                  parts
                } = isExistReUploadPart
                parts = parts && parts.length
                  ? [...new Set([...(data.Parts || []).map(x => x.PartNumber), ...parts])]
                  : (data.Parts || []).map(x => x.PartNumber)
                // console.log('data', data)
                // console.log(parts, '=====已上传的part', this.readFileList, <isEx></isEx>istReUploadPart)
                let multiplePart = []
                const listPartFin = []
                if (chunks !== data.Parts.length) {
                  // 1)删除已上传得part、进度会倒退
                  // 2)fileList记录上传part、并在每次listPart后去重part
                  const res = await this.S3.createMultipartUpload({ Bucket, Key }).promise()
                  const newUploadId = res.UploadId
                  isExistReUploadPart.UploadId = newUploadId
                  let netBreak = false
                  for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                    if (netBreak) break
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
                      UploadId: newUploadId
                    }
                    const jumpPass = parts.some(x => x === chunkCount + 1)

                    const p = new Promise((res, rej) => {
                      this.S3.uploadPart(reqParams
                        , (uploadPartErr, uploadPartData) => {
                          if (uploadPartErr) {
                            rej({ ...uploadPartErr, doneUploadSize })
                          } else {
                            res(jumpPass ? { ...uploadPartData, doneUploadSize: 0, PartNumber }
                              : { ...uploadPartData, doneUploadSize, PartNumber }
                            )
                          }
                        })
                    })
                    multiplePart.push(p)
                    if (multiplePart.length == 6 || chunkCount === chunks - 1) {
                      const partRes = await Promise.allSettled(multiplePart)
                      // console.log(partRes, '123')
                      this.putSize += partRes.reduce((pre, cur) => {
                        if (cur.status === 'fulfilled') {
                          pre += cur.value.doneUploadSize
                        } else {
                          netBreak = cur.reason.code === 'NetworkingError' || cur.reason.code === 'TimeoutError'
                        }
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
                    const Parts = [...listPartFin]
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
                      UploadId: newUploadId,
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
                    const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    const err = listPartFin.find(x => x.status === 'rejected')?.reason
                    rejected({
                      err: err,
                      file,
                      startTime,
                      endTime
                    })
                  }
                } else {
                  // 上传成功、complete失败
                  const Parts = [...data.Parts]
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
                    UploadId,
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
                  })
                  // console.log('合并')
                }
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
                // this.putSize += fileSize
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
                let netBreak = false
                for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                  if (netBreak) break
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
                        else {
                          console.log(uploadPartData, '123')
                          res({ ...uploadPartData, doneUploadSize })
                        }
                      })
                  })
                  multiplePart.push(p)
                  if (multiplePart.length == 6 || chunkCount === chunks - 1) {
                    const partRes = await Promise.allSettled(multiplePart)
                    // console.log(partRes, '123')
                    this.putSize += partRes.reduce((pre, cur) => {
                      if (cur.status === 'fulfilled') {
                        pre += cur.value.doneUploadSize
                      } else {
                        // console.log(cur, 'uploadPartERROR======')
                        netBreak = cur.reason.code === 'NetworkingError' ||
                          cur.reason.code === 'TimeoutError'
                      }
                      return pre
                    }, 0)
                    listPartFin.push(...partRes)
                    multiplePart = []
                  }
                }
                // uploadPart End

                const partOver = listPartFin.every(x => x.status === 'fulfilled') && listPartFin.length === chunks
                if (partOver) {
                  // listParts
                  // var params = {
                  //   Bucket,
                  //   Key,
                  //   UploadId: createData.UploadId
                  // }
                  // const Parts = listPartFin.map((x, i) => {
                  //   console.log(x, '12333')
                  //   return {
                  //     PartNumber: i + 1,
                  //     ETag: x.value.ETag
                  //   }
                  // })
                  const resListParts = await this.S3.listParts({
                    Bucket,
                    Key,
                    UploadId: createData.UploadId
                  }).promise()
                  const Parts = resListParts.Parts.map(x => {
                    return {
                      PartNumber: x.PartNumber,
                      ETag: x.ETag
                    }
                  }).sort((a, b) => a.PartNumber - b.PartNumber)
                  console.log(resListParts, '12PartsPartsParts=====3')
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
                      resolve({ ...compErrData, Key })
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
              }
            })
          }
        })
      }
      let finalRes = null
      while (fileArr.length) {
        const file = fileArr.shift()
        finalRes = await asyncTask(file).catch(err => {
          return {
            hasError: true,
            err
          }
        })
      }
      //
      return finalRes.hasError ? Promise.reject(finalRes) : Promise.resolve(finalRes)
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
        this.$refs['accessKeyId'] = ''
        this.$refs['secretAccessKey'] = ''
        this.$refs['endpoint'] = ''
        // this.$refs[formName].resetFields()
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
              title: '请点击"连接"按钮'
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
    async getBucketList (flag) {
      let {
        accessKeyId,
        endpoint,
        location
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

      // console.log('调用接口获取ak、')

      const p = new Promise((resolve, reject) => {
        getUser({ user: this.form.accessKeyId }, location).then(res => {
          if (String(res) === '') {
            this.$msg({
              type: 'error',
              text: '当前用户不存在'
            })
            reject(res)
          } else {
            this.form.secretAccessKey = String(res)
            resolve(true)
          }
        })
      })
      const valid = await p
      if (!valid) return
      this.checkFlag = true
      endpoint = endpoint.startsWith('http') || endpoint.startsWith('https') ? endpoint : 'http://' + endpoint
      let secretAccessKey = this.form.secretAccessKey
      this.$store.state._S3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: 'EastChain-1',
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        sslEnabled: true,
      })
      this.saveConfig()
      this.getHostLoading = this.$loading(this.loadingOption)
      this.$store.state._S3.listBuckets((err, data) => {
        // const data = await this.S3.send(new ListBucketsCommand({}));
        if (err) {
          // console.dir(err)
          // console.log('%c 123', 'color:red;font-size:20px')
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
            message = this.$ts(err.message || '')
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
          this.getHostLoading.close()
        } else {
          this.bucketList = (data.Buckets || []).map(x => ({ BucketName: x.Name, CreationDate: x.CreationDate }))
          if (!this.bucketList.length) {
            this.$notify({
              type: 'error',
              title: '无bucket可用，请先创建bucket'
            })
            this.noBucket = true
            this.getHostLoading.close()
          } else {
            this.form.Bucket = this.bucketList[0]
            if (flag) {
              this.$notify({
                type: 'success',
                title: `连接S3成功`
                // ${this.selform === '' ? ', 请点击保存!' : ', 请点击修改!'}`
              })
            }
            this.$store.dispatch('initS3', { S3: this.$store.state._S3, accessKeyId, secretAccessKey, endpoint })
              .finally(() => {
                this.getHostLoading.close()
              })
            // this.form.Bucket = 'test'
            // this.dirFlag = true
            // 确保断网或刷新页面导致未完成的上传记录清除
            // this.doClearFileLog()
          }
        }
      })
    },
    refreshBucket () {
      this.$store.state._S3.listBuckets((err, data) => {
        if (err) {
          // console.dir(err)
          // console.log('%c 123', 'color:red;font-size:20px')
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
            message = this.$ts(err.message || '')
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
          this.bucketList = (data.Buckets || []).map(x => ({ BucketName: x.Name, CreationDate: x.CreationDate }))
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
      this.disableDrop()
      document.querySelector('#loadChart').style.display = 'block'
      this.totalSize = this.fileListArr.reduce((pre, cur) => pre + cur.size, 0)
      // 区分大文件
      this.loadingBg = this.$loading({
        lock: true,
        text: '文件上传中，请勿关闭当前页面',
        spinner: 'el-icon-loading',
        background: 'rgba(1,1,1,.3)',
        customClass: 'putLoading'
      })
      this.myecharts = this.$echarts.init(document.getElementById('loadChart'))
      this.renderChartPart()
      this.finList = []
      const onProgree = async (fileList) => {
        try {
          const successFileList = []
          let taskList = []
          const len = fileList.length
          this.netWorkFail = false
          for (let i = 0; i < len; i++) {
            if (this.netWorkFail) {
              break
            }
            const file = fileList[i]
            let asyncTask = null
            if (file.size <= this.uploadPartSize) {
              asyncTask = new Promise((res, rej) => {
                const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
                const Key = hostName + '/' + this.handlePutPath(file)
                file['Key'] = Key
                this.S3.putObject({
                  Bucket,
                  Key,
                  Body: file
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
            // 并发上传文件数1、上传文件分片6
            const partRes = await Promise.allSettled(taskList)
            // console.log(partRes, '上传文件结束')
            this.putSize += partRes.reduce((pre, cur) => {
              if (cur.status === 'fulfilled') {
                // 不具有Bucket、putObject、上传结束进度++
                if (!cur.value.Bucket) {
                  pre += cur.value.file.size
                  successFileList.push(cur.value.file.Key)
                } else {
                  successFileList.push(cur.value.Key)
                }
                this.finList.push(cur)
              } else if (cur.status === 'rejected') {
                // console.log(cur, 'errrorrrr')
                if (cur.reason.err?.err?.code === 'NetworkingError' || cur.reason.err?.code === 'NetworkingError' || cur.reason.err?.err?.code === 'TimeoutError' || cur.reason.err?.code === 'TimeoutError') {
                  this.netWorkFail = true
                } else {
                  this.finList.push(cur)
                }
              }
              return pre
            }, 0)
            taskList = []
          }
          // End
          if (this.netWorkFail) {
            const recoverFile = fileList.filter(x => {
              return !successFileList.includes(x.Key)
            })
            // console.log(recoverFile, '=====ERROR', successFileList, fileList)
            this.timerFail = setInterval(() => {
              if (!this.connectingFlag) {
                this.doCheckNetWork().then(() => {
                  clearInterval(this.timerFail)
                  this.netWorkFail = false
                  setTimeout(() => {
                    onProgree(recoverFile)
                  }, 500)
                })
              }
              // doCheckNetWork
            }, 10000)

            // 待重试文件
          } else {
            setTimeout(() => {
              this.releaseDisable()
              this.loadingBg.close()
              console.log(this.finList, '===OVER===')
              // console.log(result, 'result')
              this.writeErrorLog(this.finList)
            }, 1200)
          }
        } catch (error) {
          console.log('errorOperate', error)
        }
      }
      onProgree(this.fileListArr)
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
          duration: 1000 * 10,
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
.page_content_wrap {
  margin-top: 50px;
}

.manage-area-title {
  display: flex;

  .selectConfig {
    display: flex;
    align-items: center;
    width: 500px;

    .el-select {
      width: 100%;
    }
  }

  svg {
    margin: 0 0 0 20px;
    cursor: pointer;

    &.del {
      color: #cf3a3a;
      position: relative;
      top: .2px;
      margin-left: 20px;
    }

    &.add {
      color: #ff8746;
    }
  }
}



::v-deep .form {
  .el-form-item__label {
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
    font-size: 16px;
    min-width: 60px;
    height: fit-content;
    width: fit-content;
    padding: 10px;
    margin-right: 30px;
    box-sizing: border-box;
    margin-left: 0;
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



## 下载服务
```js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

let s3Client = null;

// 创建 logs 目录
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 日志记录函数
function writeLog (data) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const { timestamp, message } = data;
  const logEntry = `[${timestamp}] ${JSON.stringify(message)}\n`;
  const logFile = path.join(logsDir, `${dateStr}.txt`);
  fs.appendFileSync(logFile, logEntry);
}

// API路由
app.post('/init-s3', (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, endpoint } = req.body;

    s3Client = new S3Client({
      region: "EastChain-1",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey
      },
      forcePathStyle: true
    });

    res.json({ success: true, message: 'S3 client initialized successfully' });
  } catch (error) {
    console.error('S3 initialization error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-signed-url', async (req, res) => {
  if (!s3Client) {
    return res.status(400).json({ error: 'S3 client not initialized' });
  }

  const { bucket, key, start, end } = req.body;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    // Range: `bytes=${start}-${end}`
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (err) {
    console.error('Generate signed URL error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 添加CORS中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

// 修改代理下载接口使用 axios
app.post('/proxy-download', async (req, res) => {
  console.log('Received request body:', req.body);

  const { url, range } = req.body;

  if (!url) {
    console.error('Missing URL parameter');
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  if (!range) {
    console.error('Missing range parameter');
    return res.status(400).json({ error: 'Missing range parameter' });
  }

  try {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!parsedUrl.protocol || !parsedUrl.hostname) {
        throw new Error('Invalid URL format');
      }
    } catch (e) {
      console.error('URL validation error:', e.message);
      return res.status(400).json({
        error: 'Invalid URL format',
        details: e.message,
        url: url
      });
    }

    console.log('Making request to:', {
      url: parsedUrl.toString(),
      range: range
    });

    // 使用 axios 发送请求
    const response = await axios({
      method: 'get',
      url: parsedUrl.toString(),
      headers: {
        Range: range
      },
      responseType: 'stream'
    });

    // 转发响应头
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Length', response.headers['content-length']);
    res.setHeader('Content-Range', response.headers['content-range']);
    res.setHeader('Accept-Ranges', 'bytes');

    // 流式转发响应体
    response.data.pipe(res);

  } catch (error) {
    console.error('Proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.post('/logData', (req, res) => {
  try {
    const data = req.body;
    writeLog(data);
    res.json({ success: true, message: '数据已成功记录' });
  } catch (error) {
    console.error('记录日志时出错:', error);
    res.status(500).json({ success: false, message: '记录日志失败', error: error.message });
  }
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 所有其他路由重定向到 index.html（支持 Vue Router 的 history 模式）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});


```


## 打包命令
```js
// package.json---
"package": "build.bat && node build.js && npm run build"
// build.bat && node build.js

chcp 65001
@echo off
REM 构建脚本：执行 NCC 编译并整合 PM2 配置

set ENTRY_FILE=server/app.js
set OUTPUT_DIR=nodeJs
set PACKAGE_DIR=frontEnd.zip
set PM2_CONFIG=server/ecosystem.config.js

echo [1/3] 清理旧构建目录...
if exist %OUTPUT_DIR% rmdir /s /q %OUTPUT_DIR%
if exist %PACKAGE_DIR% del /q %PACKAGE_DIR%

echo [2/3] 使用 NCC 编译项目...
ncc build %ENTRY_FILE% -o %OUTPUT_DIR%

echo [3/3] 复制 PM2 配置文件...
copy %PM2_CONFIG% %OUTPUT_DIR%\%PM2_CONFIG% > nul

echo 构建完成！输出目录：%OUTPUT_DIR%
pause



// copyEcosystem.js
const fs = require('fs');
const path = require('path');
const sourcePath = path.join(__dirname, 'server', 'ecosystem.config.js');
const destinationPath = path.join(__dirname, 'nodeJs', 'ecosystem.config.js');
fs.copyFile(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error('复制文件时出错:', err);
  } else {
    console.log('文件成功复制到 nodeJs 目录');
  }
});


```



## route && vuex
```js
import router from './router'
import store from './vuex'
const AWS = require('aws-sdk');
router.beforeEach((to, from, next) => {
  const s3 = store.state._S3
  if (!s3 && to.name !== 'BackUp') {
    const s3Client = JSON.parse(
      localStorage.getItem('s3Client')
    )
    if (!s3Client) {
      next('/main/bucket')
    } else {
      let { accessKeyId, secretAccessKey, endpoint } = s3Client
      endpoint = endpoint.startsWith('http') || endpoint.startsWith('https') ? endpoint : 'http://' + endpoint
      // AWS.config.logger = console;  // 关键配置
      // AWS.config.logLevel = 'warn';  // 仅警告和错误
      var S3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: 'EastChain-1',
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        sslEnabled: true,
      })
      // 初始化S3客户端
      store.dispatch('initS3', { S3, accessKeyId, secretAccessKey, endpoint })
        .then(() => {
          next()
        })
        .catch((error) => {
          console.error('Error initializing S3:', error)
          next('/main/bucket')
        })
    }
  } else {
    next()
  }
})


// vuex

import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import { constantRouterMap, asyncRouterMap } from '../router'
import { refreshToken, getDIH, checkUserRole } from '@/api/dashboard'
import { getPermission } from '@/api/policy'
import { statusCode } from '@/utils/statusCode'
import { permission } from '@/utils/permission-language'
import { Gateway } from '@/api/gateway-request'
import config from '../../proxy.config'
import download from './download'
import upload from './upload'
import axios from 'axios'
Vue.use(Vuex)
// function hasPermission (roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return false
//   }
// }

// function filterAsyncRouter (asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }
const store = new Vuex.Store({
  // 全局变量
  state: {
    user: null,
    ws: null, // websocket
    socketStatus: false, // websocket status
    websocketLastHeartBeat: 0,
    isCollapse: false,
    redCount: 0,
    orangeCount: 0,
    yellowCount: 0,
    countFlag: 0,
    toPool: false,
    isListHistroy: false,
    dosVersion: 'v1',
    port: null,
    addRouters: [],
    routers: [],
    token: '',
    isHtGateway: '',
    isOpenDih: '',
    refreshToken: '',
    api: [],
    statusCode,
    permission,
    updateTime: '',
    logoInfo: {},
    _S3: '', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    _gatewayS3: '',
    role: 'user',
    isEip: false
  },
  // 修改全局变量必须通过mutations中的方法
  // mutations只能采用同步方法
  mutations: {
    login (state, payload) {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    getPort (state, payload) {
      state.port = payload
    },
    eipLogout () {
      Cookies.remove('EIPGW-TOKEN')
      sessionStorage.setItem('refreshToken', null)
      sessionStorage.setItem('token', null)
      localStorage.setItem('port', null)
      localStorage.setItem('api', null)
      localStorage.setItem('role', false)
      localStorage.setItem('isEip', false)
      localStorage.setItem('loginId', '')
      window.location.reload()
    },
    logout (state) {
      localStorage.setItem('port', null)
      localStorage.setItem('api', null)
      localStorage.setItem('role', false)
      localStorage.setItem('isEip', false)
      sessionStorage.setItem('refreshToken', null)
      sessionStorage.setItem('token', null)
      // localStorage.setItem('logoInfo', null)
      Cookies.remove('token')
      state.user = null
      state.port = null
      state._S3 = null
      state._gatewayS3 = null
      // state.ws && state.ws.close()
    },
    upLogoConfig (state, payload) {
      sessionStorage.setItem('logoInfo', JSON.stringify(payload))
      state.logoInfo = payload
      document.title = payload.title
    },
    getS3 (state, payload) {
      state._S3 = payload
    },
    gatewayS3 (state, payload) {
      state._gatewayS3 = payload
    },

    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_TOKEN: (state, payload) => {
      state.token = payload
      sessionStorage.setItem('token', payload)
    },
    SET_EXPIRE_TOKEN: (state, payload) => {
      // token=>expire 10min
      state.refreshToken = payload
      sessionStorage.setItem('refreshToken', payload)
      const expires = new Date(new Date() * 1 + 540 * 1000)
      Cookies.set('token', payload, { expires: expires })
    },
    SET_ACTION: (state, payload) => {
      state.api = payload
      localStorage.setItem('api', JSON.stringify(payload))
    },

    SET_ServiceFlag: (state, payload) => {
      state['serviceFlag'] = payload
    },
    isHtGateway: (state, payload) => {
      state.isHtGateway = payload
    },
    isOpenDih: (state, payload) => {
      state.isOpenDih = payload
    },
    SET_ROLE: (state, payload) => {
      state.role = payload
      localStorage.setItem('role', payload)
    },
    SET_ISEIP: (state, payload) => {
      state.isEip = payload
      localStorage.setItem('isEip', payload)
    }
  },
  actions: {
    login ({ dispatch, commit, state }, payload) {
      return new Promise((resolve, rej) => {
        commit('login', payload)
        // 获取权限菜单
        const p1 = store.dispatch('setS3EndPoint')

        const p2 = getPermission().then(res => {
          const obj = {}
          for (let i = 0; i < res.data.actionList.length; i++) {
            obj[res.data.actionList[i]] = true
          }
          commit('SET_ACTION', obj)
        }).catch((err) => {
          rej(err)
        })
        const p3 = getDIH().then((res) => {
          localStorage.setItem('isHtGateway', res.data.data.isHtGateway)
          localStorage.setItem('isOpenDih', res.data.data.isOpenDih)
          commit('SET_ServiceFlag', res.data.data.isOpenDih)
          return res.data && res.data.data
        }).catch(() => {
          localStorage.setItem('isHtGateway', 'false')
        })
        const p4 = checkUserRole().then((res) => {
          commit('SET_ROLE', res.data)
        })
        // const p4 = store.dispatch('getinterface')
        // 创建s3JDK服务
        Promise.allSettled([p1, p2, p3, p4]).then(res => {
          const api = state.api || {}
          api['isAdmin'] = ['superAdmin', 'fullPolicyAdmin'].includes(state.role)
          commit('SET_ACTION', api)
          resolve(res)
        }).catch((err) => {
          rej('err')
        })
      })
    },

    logout (context) {
      context.commit('logout')
    },
    // js获取一个当前时间十秒过期时间戳
    getToken ({ commit, state }) {
      const token = sessionStorage.getItem('refreshToken') || state.refreshToken
      if (String(state.isEip) === 'true') {
        // eipLogin()
        //   .then((res) => {
        //     store.commit('SET_TOKEN', res.data.accessToken)
        //     store.commit('SET_EXPIRE_TOKEN', res.data.refreshToken)
        //   })
        refreshToken(token)
          .then((res) => {
            store.commit('SET_TOKEN', res.data.accessToken)
            store.commit('SET_EXPIRE_TOKEN', res.data.refreshToken)
          })
          .catch(error => {
            console.error(error)
          })
      } else {
        refreshToken(token)
          .then((res) => {
            store.commit('SET_TOKEN', res.data.accessToken)
            store.commit('SET_EXPIRE_TOKEN', res.data.refreshToken)
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    setS3EndPoint ({ commit, state, dispatch }) {
      const AWS = require('aws-sdk')
      return new Promise((resolve, reject) => {
        let port = ''
        const htLocation = [
          'eipsit.htsc.com.cn',
          'eip.htsc.com.cn',
          'eipnew.htsc.com.cn',
          'eipuat.htsc.com.cn'
        ]
        const isHtEnv = htLocation.some(x => window.location.href.indexOf(x) > -1)
        if (window.location.host.indexOf('localhost') > -1) {
          port = config['devServerProxy']['/api/']['target'] + '/dos'
        } else if (isHtEnv) {
          port = window.location.origin + '/s3sg/dos'
        } else {
          port = window.location.origin + '/dos'
        }
        localStorage.setItem('port', port)
        commit('getPort', port)
        var S3 = new AWS.S3({
          accessKeyId: 'test',
          secretAccessKey: 'test',
          endpoint: port,
          region: 'EastChain-1',
          s3ForcePathStyle: true
        })
        AWS.events.on('send', (req) => {
          req.request.httpRequest.headers['Authentication'] = sessionStorage.getItem('token')
          req.request.httpRequest.headers['request-target'] = 'gateway'
        })
        var gatewayS3 = Gateway.S3({
          accessKeyId: 'test',
          secretAccessKey: 'test',
          endpoint: port,
          region: 'EastChain-1'
        })
        store.dispatch('getS3', data)
        store.commit('gatewayS3', gatewayS3)
        resolve(port)
      })
    },
    async initS3 ({ commit }, { S3, accessKeyId, secretAccessKey, endpoint }) {
      commit('getS3', S3)
      // 初始化服务器端S3客户端
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? window.location.origin  // 生产环境使用当前域名
          : 'http://localhost:8081' // 开发环境使用本地服务器
        // console.log('Requesting URL:', `${baseUrl}/init-s3`); // 添加调试日志
        const response = await axios.post(`${baseUrl}/init-s3`, {
          accessKeyId,
          secretAccessKey,
          endpoint
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status !== 200) {
          throw new Error(`Failed to initialize server S3 client: ${response.status} ${response.statusText}`);
        }
        // console.log('Server S3 client initialized:', response.data);
      } catch (error) {
        console.error('Server S3 initialization error:', error);
        // this.$notify({
        //   type: 'error',
        //   title: '初始化失败',
        //   message: error.message
        // });
      }
    },
    GenerateRoutes ({ commit }, { name }) {
      return new Promise((res, rej) => {
        let permissionRoute
        if (name !== 'admin') {
          permissionRoute = []
          // permissionRoute = filterAsyncRouter(role,route)
        } else {
          permissionRoute = asyncRouterMap
        }
        commit('SET_ROUTERS', permissionRoute)
        res()
      })
    }
  },
  getters: {
  },
  modules: {
    download,
    upload
  }
})

export default store

download.js

const state = {
  downLoadTaskLists: [], // 存储下载任务列表
  downLoadTaskQueue: [], //控制进度
  downLoadAbortController: {}, // 存储中止请求的控制器
};

const getters = {
  downLoadTaskLists: (state) => state.downLoadTaskLists,
  downLoadTaskQueue: (state) => state.downLoadTaskQueue
};

const mutations = {
  ADD_DOWNLOAD_TASK (state, task) {
    state.downLoadTaskLists.push(task);
  },
  ADD_DOWNLOAD_QUEUE (state, task) {
    state.downLoadTaskQueue.push(task);
  },
};

const actions = {
  addTask ({ commit }, task) {
    commit('ADD_TASK', task);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};


upload.js

const state = {
  uploadTaskLists: [], // 存储下载任务列表
  uploadTaskQueue: [], //控制进度
  uploadAbortController: {}, // 存储中止请求的控制器
};

const getters = {
  uploadTaskLists: (state) => state.uploadTaskLists,
  // .concat([
  //   { "taskName": "testDownload/postman-win64-9.31.30.rar", "execSize": 15728640, "totalSize": 119722352, "uniqueKey": 1750039264853, "execCount": 0, "totalCount": 1, "pending": false }
  // ]),
  uploadTaskQueue: (state) => state.uploadTaskQueue
};

const mutations = {
  ADD_UPLOAD_TASK (state, task) {
    state.uploadTaskLists.push(task);
  },
  ADD_UPLOAD_QUEUE (state, task) {
    state.uploadTaskQueue.push(task);
  },
};

const actions = {
  addTask ({ commit }, task) {
    commit('ADD_TASK', task);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};



```



## 上传下载组件
```js
        <upload />
<template>
  <el-popover ref="uploadPopover" placement="left" width="400" trigger="click">
    <div class="customProgressContainer">
      <div class="customProgressC title">
        <span>上传任务名称</span>
        <div
          style="width: 105px;height: fit-content;display: flex;flex-wrap: wrap;justify-content: flex-end;height: 44px;">
          <span>已完成/总对象数</span>
          <el-tooltip placement="left" content="清空任务">
            <i @click="removeTask" class="el-icon-delete"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="customProgressC"
        v-for="({ pending, key, taskName, execSize, totalSize, execCount, totalCount }, index) in uploadTaskLists"
        :key="key">
        <div class="flexName">
          <showToolTip :text="taskName" />
          <el-tooltip placement="left" content="移除任务">
            <i @click="removeTask(index)" class="el-icon-close"></i>
          </el-tooltip>
        </div>
        <div class="customProgress" v-loading="pending">
          <el-progress text-color="#d3d6d8" :percentage="renderLoadingTask(pending, execSize, totalSize)"
            :color="'#4ccb92'">
          </el-progress>
          <showToolTip use-slot :text="preciseDemi(execCount) + '/' + preciseDemi(totalCount)">
            <span slot="data" class="txt">{{ preciseDemi(execCount) + '/' + preciseDemi(totalCount) }}</span>
          </showToolTip>
        </div>
      </div>
    </div>
    <div slot="reference" @click="handleActive" class="downLoadList">
      <el-tooltip content="上传">
        <div>
          <svg class="icon upload">
            <use xlink:href="#icon-upload" />
          </svg>
          <span class=""></span>
        </div>
      </el-tooltip>
    </div>
  </el-popover>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex';
import { writeLog } from '@/api/uploadLog'
export default {
  name: '',
  props: {},
  components: {},
  data () {
    return {
      breakUpload: false,
      readFileList: [],
      finList: [], //上传记录
      netWorkFail: false, //断点续传
      visible: false,
      abortController: {},
      maxConcurrentRequests: 1, // 设置最大并发请求数
      currentRequests: 0,  // 当前进行的请求数
      uploadPartSize: 1024 * 1024 * 5, // 分段大小&&文件启用分段大小,
    };
  },
  computed: {
    ...mapGetters(['uploadTaskLists', 'uploadTaskQueue'])
  },
  watch: {
  },
  created () { },
  mounted () {
    this.$bus.on("upload", () => {
      // console.log('getUploadddd')
      this.processQueue()
    });
  },
  methods: {
    doCheckNetWork () {
      // 检测网络
      return new Promise((resolve, reject) => {
        this.connectingFlag = true
        this.$store.state._S3.listBuckets((err, data) => {
          this.connectingFlag = false
          if (err && (err.code === 'NetworkingError' || err.code === 'TimeoutError')) {
            reject(err)
            // console.log(err, 'ConnectTest')
          } else {
            resolve()
          }
        })
      })
    },
    showPutFileKey (prefix, file) {
      const {
        webkitRelativePath,
        relativePath
      } = file
      const hasDirPath = webkitRelativePath || relativePath
      return (prefix || '') + (!!hasDirPath ? hasDirPath : file.name)
    },
    handleActive () {
      document.querySelector('.upload + span') && document.querySelector('.upload + span').classList.remove('circleStatus')
      this.visible = !this.visible
    },
    renderLoadingTask (pending, execSize, totalSize) {
      if (pending) return 0
      return execSize === 0 ? totalSize === 0 ? 100 : 0 : parseFloat(((execSize / totalSize) * 100).toFixed(2))
    },
    async processQueue () {
      // if (this.isProcessingQueue || this.uploadTaskQueue.length === 0) {
      //   return
      // }
      // this.isProcessingQueue = true
      if (this.uploadTaskQueue.length === 0) return
      try {
        while (this.uploadTaskQueue.length > 0) {
          // 等待当前请求数量低于最大并发数
          while (this.currentRequests >= this.maxConcurrentRequests) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          // 任务队列和展示队列、任务队列没有同步移除、所以执行前需要判断是否存在
          // 获取任务需要正确的截取数组
          // const task = this.uploadTaskQueue.find(x => x.key === key)
          // console.log('gggg')
          if (!this.uploadTaskQueue.length) return
          const task = this.uploadTaskQueue[0]
          const { uniqueKey } = task
          // 检查任务是否被取消
          const taskIndex = this.uploadTaskLists.findIndex(x => x.uniqueKey === uniqueKey)
          if (taskIndex === -1) {
            this.uploadTaskQueue.shift()
            continue
          }
          await this.doUploadFile(task, uniqueKey)
          this.uploadTaskQueue.shift()
          // this.finList = []
          // try {
          //   if (task.type === 'd') {
          //     await this.processDirectoryTask(task, key)
          //   } else {
          //     await this.processFileTask(task, key)
          //   }
          // } catch (error) {
          //   console.error(`Task failed: ${task.taskName}`, error)
          //   // 可以添加失败状态显示
          // }
          //移除任务
        }
      } finally {
        this.isProcessingQueue = false
      }
    },
    async removeTask (index) {
      // console.log(this.abortController, 'abortController')
      // 清除分片
      // 需要注意若是分片、清理还需额外调用 abortMultipartUpload
      if (!isNaN(index)) {
        // console.log(index, '123')
        const item = this.uploadTaskLists.splice(index, 1); // 移除任务
        const id = item[0]?.uniqueKey
        // keys是目录才执行
        // 区分目录和单一文件需要将request请求 包装
        // console.log(this.abortController[id], this.abortController, id, index, item)
        // 任务列表是存在的、但abortController未添 加、需全部清除
        // 移除单个上传的任务、需要找出带有uploadId的、即需要清除分片、同时需要过滤后续的分片任务
        // console.log(this.abortController[id], 'idTest', item)
        // const partUpload = {}
        if (this.abortController[id]) {
          const arr = this.abortController[id]
          // 目录打包下载需要遍历调用
          const len = arr.length
          for (let i = 0; i < len; i++) {
            // console.log(arr[i], 'iii')
            // 中断所有请求
            if (arr[i].abort) {
              arr[i].abort()
            }

            // toDo
            // 取消分片清除
            // const { UploadId, Bucket, Key } = arr[i].params
            // // 如果是分片上传，需要调用abortMultipartUpload、分片调用一次即可
            // if (UploadId && !partUpload[UploadId]) {
            //   partUpload[UploadId] = true
            //   await this.$store.state._S3.abortMultipartUpload({
            //     Bucket,
            //     Key,
            //     UploadId
            //   }, (err) => {
            //     if (err) console.error('终止分片上传失败:', err);
            //     else console.log('分片上传已终止');
            //   })
            // }
          }
        }
        delete this.abortController[id]
        if (this.currentRequests > 0) {
          this.currentRequests -= 1
        }
      } else {
        this.uploadTaskLists.splice(0)
        this.currentRequests = 0
        Object.keys(this.abortController).forEach((x) => {
          // arr是数组索引
          Object.keys(this.abortController[x]).forEach(y => {
            if (this.abortController[x][y]) {
              // 中断所有请求
              if (this.abortController[x][y].abort) {
                this.abortController[x][y].abort()
              }

              // 如果是分片上传，需要调用abortMultipartUpload
              // toDo
              // 取消分片清除
              // if (this.abortController[x][y].uploadId) {
              //   this.$store.state._S3.abortMultipartUpload({
              //     Bucket: this.abortController[x][y].Bucket,
              //     Key: this.abortController[x][y].Key,
              //     UploadId: this.abortController[x][y].uploadId
              //   }, (err) => {
              //     if (err) console.error('终止分片上传失败:', err);
              //     else console.log('分片上传已终止');
              //   })
              // }
            }
          })
        })
        this.abortController = {}
      }
      if (!this.uploadTaskLists.length) {
        this.$refs['uploadPopover'].doClose()
        // this.visible = false; // 如果没有任务，关闭打开的popover
      }
    },
    getRenderZipPath (path, dir, prefix) {
      return prefix ?
        path.substring(prefix.length + dir.length)
        : path.substring(dir.length)
    },
    doUploadFile (task, taskKey) {
      // task: Bucket,fileList,taskName,prefix
      this.currentRequests++
      const findExist = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
      if (findExist === -1) {
        // console.log('iam gone')
        return
      }
      // 添加重试记录
      if (!this.abortController[taskKey]) {
        this.abortController[taskKey] = []
      }
      this.uploadTaskLists[findExist].pending = false
      const { Bucket, fileList, prefix } = task
      // 处理分片及小文件
      // this.finList = []
      const onProgree = async (fileList) => {
        try {
          const successFileList = []
          let taskList = []
          const len = fileList.length
          this.netWorkFail = false
          for (let i = 0; i < len; i++) {
            // 中断请求
            if (this.netWorkFail || !this.abortController[taskKey]) {
              break
            }
            const file = fileList[i]
            const { size } = file
            const Key = this.showPutFileKey(prefix, file)
            // 添加
            file['Key'] = Key
            let asyncTask = null
            // 默认5M开启分片
            writeLog(
              `开始上传: Bucket:${Bucket}, Key: ${Key} `
            )
            if (size <= this.uploadPartSize) {
              asyncTask = new Promise((res, rej) => {
                const reqParams = {
                  Bucket,
                  Key,
                  Body: file
                }
                if (size === 0) {
                  reqParams.Body = new Blob()
                  reqParams.ContentType = 'application/octet-stream'
                }
                let uploadSize = 0
                let activeRequest = this.$store.state._S3.putObject(
                  reqParams
                  , (err, data) => {
                    if (err) rej({ err, file, Bucket, Key })
                    else res({ success: 'success', file, Bucket, Key })
                  }).on('httpUploadProgress', (progress) => {
                    // 计算上传进度
                    // const percent = Math.round((progress.loaded / progress.total) * 100);
                    // console.log(`上传进度: ${percent}%`, progress);
                    const loaded = progress.loaded - uploadSize
                    // 更新下载的进度
                    // loaded 已下载的大小、
                    uploadSize = progress.loaded
                    // this.putSize += loaded
                    const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                    if (currentIdx > -1) {
                      // 这里得判断是否已经是重试
                      this.uploadTaskLists[currentIdx].execSize += loaded
                      if (progress.loaded === size) {
                        // 上传结束
                        this.uploadTaskLists[currentIdx].execCount += 1
                        // 当前上传任务完成、需要判断是否已结束当前执行任务、即判断
                      }
                    }
                    // console.log(progress, 'progress')
                  });
                this.abortController[taskKey].push(activeRequest)
              })
            } else {
              asyncTask = this.handleMultUpload([file], Bucket, taskKey)
              // 与putObject区分
            }
            taskList.push(asyncTask)
            // 并发上传文件数1、上传文件分片6
            if (taskList.length === 1 || i == len - 1) {
              try {
                const partRes = await Promise.allSettled(taskList)
                // console.log(partRes, '上传文件结束')
                // this.putSize +=
                partRes.reduce((pre, cur) => {
                  if (cur.status === 'fulfilled') {
                    // 不具有Bucket、putObject、上传结束进度++
                    if (!cur.value.Bucket) {
                      // pre += cur.value.file.size
                      successFileList.push(cur.value.file.Key)
                      writeLog(
                        `上传结束: Bucket:${cur.value.Bucket}, Key: ${cur.value.Key} `
                      )
                    } else {
                      successFileList.push(cur.value.Key)
                      writeLog(
                        `上传结束: Bucket:${cur.value.Bucket}, Key: ${cur.value.Key} `
                      )
                    }
                    // this.finList.push(cur)
                  } else if (cur.status === 'rejected') {
                    // console.log(cur, 'errrorrrr')
                    if (cur.reason.err?.err?.code === 'NetworkingError' || cur.reason.err?.code === 'NetworkingError' || cur.reason.err?.err?.code === 'TimeoutError' || cur.reason.err?.code === 'TimeoutError') {
                      // console.log('cur', cur)
                      this.netWorkFail = true
                      // console.log('Upload error details:', {
                      //   error: cur.reason.err,
                      //   errorType: cur.reason.err.constructor.name,
                      //   errorCode: cur.reason.err.code,
                      //   errorMessage: cur.reason.err.message,
                      //   errorStack: cur.reason.err.stack,
                      //   bucket: cur.reason.Bucket,
                      //   key: cur.reason.Key,
                      //   statusCode: cur.reason.err.statusCode,
                      //   requestId: cur.reason.err.requestId,
                      //   cfId: cur.reason.err.cfId,
                      //   extendedRequestId: cur.reason.err.extendedRequestId
                      // });

                      // 构建详细的错误信息
                      let errorDetails = `中断上传: `;
                      errorDetails += `Bucket: ${cur.reason.Bucket}, `;
                      errorDetails += `Key: ${cur.reason.Key}, `;
                      errorDetails += `错误类型: ${cur.reason.err.constructor.name}, `;
                      errorDetails += `错误代码: ${cur.reason.err.code || 'N/A'}, `;
                      errorDetails += `状态码: ${cur.reason.err.statusCode || 'N/A'}, `;
                      errorDetails += `错误信息: ${cur.reason.err.message}`;

                      // 添加错误描述
                      if (cur.reason.err.code) {
                        errorDetails += `, 错误描述: ${this.getErrorDescription(cur.reason.err)}`;
                      }
                      if (cur.reason.err.statusCode) {
                        errorDetails += `, 状态描述: ${this.getStatusCodeDescription(cur.reason.err.statusCode)}`;
                      }

                      // 添加额外的错误信息
                      if (cur.reason.err.requestId) {
                        errorDetails += `, RequestId: ${cur.reason.err.requestId}`;
                      }
                      if (cur.reason.err.cfId) {
                        errorDetails += `, CF-Id: ${cur.reason.err.cfId}`;
                      }
                      if (cur.reason.err.extendedRequestId) {
                        errorDetails += `, ExtendedRequestId: ${cur.reason.err.extendedRequestId}`;
                      }
                      // console.dir(cur, '123')
                      // writeLog(errorDetails);
                    } else {
                      // console.dir(cur, '123')
                      writeLog(
                        `中断上传: message:${decodeURIComponent(cur.reason.err.message)}, Bucket:${cur.reason.Bucket}, Key: ${cur.reason.Key} `
                      )
                      // this.finList.push(cur)
                    }
                  }
                  return pre
                }, 0)
                taskList = []
              } catch (error) {
                console.error('Error during file upload:', error);
                // this.netWorkFail = true; // 标记网络失败
              }
            }
          }
          // End
          if (this.netWorkFail) {
            const recoverFile = fileList.filter(x => {
              return !successFileList.includes(x.Key)
            })
            // console.log(recoverFile, 'recoverFile', this.uploadTaskLists)
            // 移除未分片对象的上传进度
            // recoverFile.forEach(x => {
            //   const index = this.uploadTaskLists.findIndex(y => {
            //     return x.Key === y.taskName
            //   })
            //   if (index !== -1) {
            //     this.uploadTaskLists[index].execSize = 0
            //   }
            // })
            // console.log(recoverFile, '=====ERROR', successFileList, fileList)
            this.timerFail = setInterval(() => {
              if (!this.connectingFlag) {
                this.doCheckNetWork().then(() => {
                  clearInterval(this.timerFail)
                  this.netWorkFail = false
                  setTimeout(() => {
                    onProgree(recoverFile)
                  }, 500)
                })
              }
              // doCheckNetWork
            }, 10000)

            // 待重试文件
          } else {
            // this.releaseDisable()
            // this.loadingBg.close()
            // console.log(this.finList, '===OVER===')
            // console.log(result, 'result')
            // this.writeErrorLog(this.finList)
            if (this.currentRequests > 0) {
              this.currentRequests -= 1
            }
            // 刷新页面
            this.$bus.emit('refreshList')
          }
        } catch (error) {
          console.log('Error in onProgree:', error);
        }
      }
      onProgree(fileList)
      //
    },
    async handleMultUpload (fileArr, Bucket, taskKey) {
      const asyncTask = (file) => {
        const { Key, size } = file
        // console.log(file, '1233')
        // 大于5GB、分片10m、500、
        let chunkSize = ''
        if (size > 1024 * 1024 * 1024 * 10) {
          chunkSize = 1024 * 1024 * 10
        } else if (size > 1024 * 1024 * 1024 * 5) {
          chunkSize = 1024 * 1024 * 8
        } else {
          chunkSize = 1024 * 1024 * 5
        }
        // > 1000 ? 1024 * 1024 * 10 : this.uploadPartSize //5MB
        const chunks = Math.ceil(size / chunkSize)
        return new Promise((resolve, rejected) => {
          // 检测文件检测失败重传
          try {
            const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
            // this.readFileList = [{ 'accessKeyId': 'minioadmin', 'endpoint': 'http://10.0.2.153:9000', 'Bucket': 'test', 'Key': '/testBig/1223.exe', 'UploadId': 'N2IwOTE3MDctYzgxZi00NTFlLThjZGMtM2FiNGZkYjE0MjIzLjAyMTJiNjExLWRlMDItNDNiMi04OWIzLWUwMjA2NjA1NWRlNg' }]
            const s3Client = JSON.parse(localStorage.getItem('s3Client'))
            const {
              accessKeyId,
              endpoint
            } = s3Client
            const isExistReUploadPart = this.readFileList.findIndex(x => {
              return x.Key === Key && x.Bucket === Bucket && x.accessKeyId === accessKeyId && x.endpoint === endpoint
            })
            // console.log(this.readFileList, 'readFileList')
            // 存在文件的分片、调用listPart获取已上传的分片、并在下面的上传分片中跳过已有的分片
            // 一旦uploadPart开始进行中途断网则需要恢复
            // 所以断网续传2中、重试和重传
            // 重传下面得逻辑得调用listPart辅助记录已上传得文件并跳过进度
            // 且用于记录上传part的uploadId得同步新的uploadId
            // 多次中断会有问题、所以得记录已上传的partNumber、在新的上传失败时
            // 譬如、第一次上传1、2、3、4、5、5失败、则记录到4的size
            // 第二次1、2、3、5成功、4失败、则5不会同步
            // 所以断网对于大文件的记录得全部清空、从头开始？？
            if (isExistReUploadPart !== -1) {
              const {
                UploadId
              } = this.readFileList[isExistReUploadPart]
              // 存在切片、在有效期且开启续传
              const params = {
                Bucket,
                Key,
                UploadId
              }
              // console.log(this.readFileList, 'cover', params)
              const listPartRequest = this.$store.state._S3.listParts(params, async (err, data) => {
                if (!err) {
                  let multiplePart = []
                  const listPartFin = []
                  if (chunks !== data.Parts.length) {
                    // 1)删除已上传得part、进度会倒退
                    // 2)fileList记录上传part、并在每次listPart后去重part
                    // 同步已完成的part、
                    // const res = await this.$store.state._S3.createMultipartUpload({ Bucket, Key }).promise()
                    // const newUploadId = res.UploadId
                    // this.readFileList[isExistReUploadPart].UploadId = newUploadId
                    const hasUploadPart = data.Parts
                    let netBreak = false
                    for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                      if (netBreak || !this.abortController[taskKey]) break
                      const start = chunkCount * chunkSize
                      const end = Math.min(start + chunkSize, size)
                      const doneUploadSize = end - start
                      const body = file.slice(start, end)
                      const PartNumber = chunkCount + 1
                      const reqParams = {
                        PartNumber,
                        Body: body,
                        Bucket,
                        Key,
                        UploadId
                      }
                      const jumpPass = hasUploadPart.findIndex(x => x.PartNumber === PartNumber)
                      if (jumpPass !== -1) {
                        // const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                        // if (currentIdx > -1) {
                        //   this.uploadTaskLists[currentIdx].execSize += hasUploadPart[jumpPass]['Size']
                        // }
                        continue
                      }
                      // 计算上传量
                      const p = new Promise((res, rej) => {
                        let uploadSize = 0
                        const uploadPartRequest = this.$store.state._S3.uploadPart(reqParams
                          , (uploadPartErr, uploadPartData) => {
                            if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                            else {
                              // console.log(uploadPartData, '123')
                              res({ ...uploadPartData, doneUploadSize, PartNumber })
                            }
                          }).on('httpUploadProgress', (progress) => {
                            // 计算上传进度
                            const loaded = progress.loaded - uploadSize
                            uploadSize = progress.loaded
                            // this.putSize += loaded
                            const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                            if (currentIdx > -1) {
                              this.uploadTaskLists[currentIdx].execSize += loaded
                              // 当前是处理分片
                              // if (uploadSize === size && chunkCount === chunks - 1) {
                              //   // 上传结束
                              //   this.uploadTaskLists[currentIdx].execCount += 1
                              //   // 当前上传任务完成、需要判断是否已结束当前执行任务、即判断
                              // }
                            }
                          });
                        this.abortController[taskKey].push(uploadPartRequest)
                      })
                      multiplePart.push(p)
                      // 这里得特殊处理、并发或者最后一个可以满足、但依据顺序来、会丢失、所以不并发
                      if (multiplePart.length == 1 || chunkCount === chunks - 1) {
                        const partRes = await Promise.allSettled(multiplePart)
                        partRes.reduce((pre, cur) => {
                          if (cur.status === 'fulfilled') {
                          } else {
                            netBreak = cur.reason.code === 'NetworkingError' ||
                              cur.reason.code === 'TimeoutError'
                          }
                          return pre
                        }, 0)
                        listPartFin.push(...partRes)
                        multiplePart = []
                      }
                    }
                    // console.log(listPartFin, '=====剩下的分片=====')
                    const allParts = [...listPartFin, ...hasUploadPart]
                    const partOver = listPartFin.every(x => x.status === 'fulfilled') && allParts.length === chunks
                    // console.log(partOver, 'partOver', allParts)
                    // return
                    if (partOver) {
                      let Parts = allParts.map((x, i) => {
                        if (x.value) {
                          return {
                            PartNumber: x.value.PartNumber,
                            ETag: x.value.ETag
                          }
                        } else {
                          return {
                            PartNumber: x.PartNumber,
                            ETag: x.ETag
                          }
                        }
                      }).sort((a, b) => a.PartNumber - b.PartNumber)
                      let hasETag = Parts.every(x => x.ETag)
                      if (!hasETag) {
                        const listPartRequest = this.$store.state._S3.listParts({
                          Bucket,
                          Key,
                          UploadId
                        })
                        this.abortController[taskKey].push(listPartRequest)
                        const resListParts = await listPartRequest.promise()
                        Parts = resListParts.Parts.map(x => {
                          return {
                            PartNumber: x.PartNumber,
                            ETag: x.ETag
                          }
                        }).sort((a, b) => a.PartNumber - b.PartNumber)
                      }
                      const completeRequest = this.$store.state._S3.completeMultipartUpload({
                        Bucket,
                        Key,
                        UploadId,
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
                            return x.UploadId === this.readFileList[isExistReUploadPart].UploadId
                          })
                          const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                          if (currentIdx > -1) {
                            this.uploadTaskLists[currentIdx].execCount += 1
                          }
                          this.readFileList.splice(delIndex, 1)
                          resolve({ ...compErrData, Key })
                        }
                      })
                      this.abortController[taskKey].push(completeRequest)
                    } else {
                      const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                      const err = listPartFin.find(x => x.status === 'rejected')?.reason
                      rejected({
                        err: err,
                        file,
                        startTime,
                        endTime
                      })
                    }
                  } else {
                    // 上传成功、complete失败
                    const Parts = [...data.Parts]
                      .map(x => {
                        return {
                          PartNumber: x.PartNumber || x.value.PartNumber,
                          ETag: x.ETag || x.value.ETag
                        }
                      })
                      .sort((a, b) => a.PartNumber - b.PartNumber)
                    const completeRequest = this.$store.state._S3.completeMultipartUpload({
                      Bucket,
                      Key,
                      UploadId,
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
                          return x.UploadId === this.readFileList[isExistReUploadPart].UploadId
                        })
                        const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                        if (currentIdx > -1) {
                          this.uploadTaskLists[currentIdx].execCount += 1
                          this.uploadTaskLists[currentIdx].execSize = this.uploadTaskLists[currentIdx].totalSize
                        }
                        this.readFileList.splice(delIndex, 1)
                        resolve({ ...compErrData, Key })
                      }
                    })
                    this.abortController[taskKey].push(completeRequest)
                  }
                } else {
                  rejected({ err: err, ...params })
                  // toDO 待重试
                  // 删除记录
                }
              })
              this.abortController[taskKey].push(listPartRequest)
            } else {
              // 正常上传
              const activeRequest = this.$store.state._S3.createMultipartUpload({
                Bucket,
                Key
              }, async (createErr, createData) => {
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                if (createErr) {
                  // console.error('Error creating multipart upload:', createErr)
                  // this.putSize += fileSize
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
                  let netBreak = false
                  for (let chunkCount = 0; chunkCount < chunks; chunkCount++) {
                    // catch未进入、
                    if (netBreak || !this.abortController[taskKey]) break
                    const start = chunkCount * chunkSize
                    const end = Math.min(start + chunkSize, size)
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
                      let uploadSize = 0
                      const uploadPartRequest = this.$store.state._S3.uploadPart(reqParams
                        , (uploadPartErr, uploadPartData) => {
                          if (uploadPartErr) rej({ ...uploadPartErr, doneUploadSize })
                          else {
                            // console.log(uploadPartData, '123')
                            res({ ...uploadPartData, doneUploadSize })
                          }
                        }).on('httpUploadProgress', (progress) => {
                          // 计算上传进度
                          const loaded = progress.loaded - uploadSize
                          uploadSize = progress.loaded
                          // this.putSize += loaded
                          const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                          if (currentIdx > -1) {
                            this.uploadTaskLists[currentIdx].execSize += loaded
                            // 当前是处理分片
                            // if (uploadSize === size && chunkCount === chunks - 1) {
                            //   // 上传结束
                            //   this.uploadTaskLists[currentIdx].execCount += 1
                            //   // 当前上传任务完成、需要判断是否已结束当前执行任务、即判断
                            // }
                          }
                        });
                      this.abortController[taskKey].push(uploadPartRequest)
                    })
                    multiplePart.push(p)
                    if (multiplePart.length == 3 || chunkCount === chunks - 1) {
                      const partRes = await Promise.allSettled(multiplePart)
                      // console.log(partRes, '123')
                      partRes.reduce((pre, cur) => {
                        if (cur.status === 'fulfilled') {
                          // pre += cur.value.doneUploadSize
                        } else {
                          // console.log(cur, 'uploadPartERROR======')
                          netBreak = cur.reason.code === 'NetworkingError' ||
                            cur.reason.code === 'TimeoutError'
                        }
                        return pre
                      }, 0)
                      listPartFin.push(...partRes)
                      multiplePart = []
                    }
                  }
                  // uploadPart End

                  const partOver = listPartFin.every(x => x.status === 'fulfilled') && listPartFin.length === chunks
                  if (partOver) {
                    // listParts
                    // var params = {
                    //   Bucket,
                    //   Key,
                    //   UploadId: createData.UploadId
                    // }
                    // const Parts = listPartFin.map((x, i) => {
                    //   console.log(x, '12333')
                    //   return {
                    //     PartNumber: i + 1,
                    //     ETag: x.value.ETag
                    //   }
                    // })
                    // 判断是否有part
                    let Parts = listPartFin.map((x, i) => {
                      return {
                        PartNumber: i + 1,
                        ETag: x.value.ETag
                      }
                    })
                    console.log(Parts, 'Parts')
                    let hasETag = Parts.every(x => x.ETag)
                    if (!hasETag) {
                      const listPartRequest = this.$store.state._S3.listParts({
                        Bucket,
                        Key,
                        UploadId: createData.UploadId
                      })
                      this.abortController[taskKey].push(listPartRequest)
                      const resListParts = await listPartRequest.promise()
                      console.log(resListParts, 'resListParts')
                      Parts = resListParts.Parts.map(x => {
                        return {
                          PartNumber: x.PartNumber,
                          ETag: x.ETag
                        }
                      }).sort((a, b) => a.PartNumber - b.PartNumber)
                    }
                    // console.log(resListParts, '12PartsPartsParts=====3')
                    const completeRequest = this.$store.state._S3.completeMultipartUpload({
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
                        const currentIdx = this.uploadTaskLists.findIndex(x => x.uniqueKey === taskKey)
                        if (currentIdx > -1) {
                          this.uploadTaskLists[currentIdx].execCount += 1
                        }
                        resolve({ ...compErrData, Key })
                      }
                    })
                    this.abortController[taskKey].push(completeRequest)
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
              this.abortController[taskKey].push(activeRequest)
              //
            }
          } catch (error) {
            console.log(error, 'error')
          }
        })
        // 处理异常及时任务
      }
      let finalRes = null
      while (fileArr.length) {
        const file = fileArr.shift()
        finalRes = await asyncTask(file).catch(err => {
          return {
            hasError: true,
            err
          }
        })
      }
      return finalRes.hasError ? Promise.reject(finalRes) : Promise.resolve(finalRes)
    },
    // 错误分类和处理函数
    getErrorDescription (error) {
      const errorCode = error.code;
      const statusCode = error.statusCode;

      // 根据错误代码分类
      switch (errorCode) {
        case 'AccessDenied':
          return '访问被拒绝 - 检查权限配置';
        case 'NoSuchBucket':
          return '存储桶不存在';
        case 'NoSuchKey':
          return '对象不存在';
        case 'InvalidAccessKeyId':
          return '无效的访问密钥ID';
        case 'SignatureDoesNotMatch':
          return '签名不匹配 - 检查密钥配置';
        case 'RequestTimeout':
          return '请求超时 - 检查网络连接';
        case 'NetworkingError':
          return '网络错误 - 检查网络连接';
        case 'CredentialsError':
          return '凭证错误 - 检查访问密钥';
        case 'TokenRefreshRequired':
          return '需要刷新令牌';
        case 'ExpiredTokenException':
          return '令牌已过期';
        case 'InvalidToken':
          return '无效的令牌';
        case 'MalformedXML':
          return 'XML格式错误';
        case 'InvalidArgument':
          return '参数无效';
        case 'InvalidDigest':
          return '摘要无效';
        case 'EntityTooLarge':
          return '文件过大';
        case 'InvalidObjectState':
          return '对象状态无效';
        case 'OperationAborted':
          return '操作被中止';
        case 'SlowDown':
          return '请求过于频繁，请稍后重试';
        case 'ServiceUnavailable':
          return '服务不可用';
        case 'InternalError':
          return '内部服务器错误';
        default:
          return '未知错误';
      }
    },

    // 根据状态码获取错误描述
    getStatusCodeDescription (statusCode) {
      switch (statusCode) {
        case 400:
          return '请求错误 - 检查请求参数';
        case 401:
          return '未授权 - 检查认证信息';
        case 403:
          return '禁止访问 - 检查权限';
        case 404:
          return '资源不存在';
        case 408:
          return '请求超时';
        case 429:
          return '请求过于频繁';
        case 500:
          return '服务器内部错误';
        case 502:
          return '网关错误';
        case 503:
          return '服务不可用';
        case 504:
          return '网关超时';
        default:
          return 'HTTP错误';
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.customProgressContainer {
  max-height: 420px;
  overflow-y: auto;

  .customProgressC {
    margin: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e2e2;

    &.title {
      display: flex;
      justify-content: space-between;

      .el-icon-delete {
        cursor: pointer;
        color: #ff8746;
        margin-left: 5px;
      }

      span {
        color: #d3d6d8;
      }
    }

    .flexName {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: #ff8746;

      .tooltip-container {
        width: 90%;
      }
    }

    .el-icon-close {
      cursor: pointer;
    }

    .customProgress {
      display: flex;
      align-items: center;


      ::v-deep .el-progress {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        // .el-progress-bar {
        //   width: 90%;
        // }

        .el-progress__text {
          width: 52px !important;
        }
      }

      .tooltip-container {
        max-width: 150px;
        width: 120px;
        text-align: right;

        .text-box {
          vertical-align: super;
          text-align: right;
        }
      }

      // .txt {
      //   flex: 1;
      //   text-align: right;
      //   width: fit-content;
      //   text-align: right;
      //   white-space: pre;
      // }
    }
  }
}

.downLoadList {
  // position: absolute;
  // right: 54px;
  // top: 90px;
  // width: 25px;
  // height: 25px;
  position: relative;

  .upload {
    font-size: 25px;
    color: #1f6bb8;
    transition: all .5s;
    cursor: pointer;

    &+span {
      display: block;
      width: 8px;
      height: 8px;
    }
  }

  .circleStatus {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 20px;
    transition: all .2s;
    background: rgb(76, 203, 146);

    &.active {
      animation: activeLoadIco .5s linear 1;
    }
  }

}
</style>




        <download />
<template>
  <el-popover ref="downloadPopover" placement="left" width="400" trigger="click">
    <div class="customProgressContainer">
      <div class="customProgressC title">
        <span>下载任务名称</span>
        <div
          style="width: 105px;height: fit-content;display: flex;flex-wrap: wrap;justify-content: flex-end;height: 44px;">
          <span>已完成/总对象数</span>
          <el-tooltip placement="left" content="清空任务">
            <i @click="removeTask" class="el-icon-delete"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="customProgressC"
        v-for="({ pending, key, taskName, execSize, totalSize, execCount, totalCount }, index) in downLoadTaskLists"
        :key="key">
        <div class="flexName">
          <showToolTip :text="taskName" />
          <el-tooltip placement="left" content="移除任务">
            <i @click="removeTask(index)" class="el-icon-close"></i>
          </el-tooltip>
        </div>
        <div class="customProgress" v-loading="pending">
          <el-progress text-color="#d3d6d8" :percentage="renderLoadingTask(pending, execSize, totalSize)"
            :color="'#4ccb92'">
          </el-progress>
          <showToolTip use-slot :text="preciseDemi(execCount) + '/' + preciseDemi(totalCount)">
            <span slot="data" class="txt">{{ preciseDemi(execCount) + '/' + preciseDemi(totalCount) }}</span>
          </showToolTip>
        </div>
      </div>
    </div>
    <div slot="reference" @click="handleActive" class="downLoadList">
      <el-tooltip content="下载">
        <div>
          <svg class="icon download">
            <use xlink:href="#icon-download" />
          </svg>
          <span class=""></span>
        </div>
      </el-tooltip>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex';
import { createWriteStream } from 'streamsaver';
import * as fflate from "fflate";
import { createDownloadStream } from '@/utils/downStream'
// import { GetObjectCommand, S3Client, } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from 'axios';
export default {
  name: '',
  props: {},
  components: {},
  data () {
    return {
      visible: false,
      abortController: {},
      maxConcurrentRequests: 1, // 设置最大并发请求数
      currentRequests: 0,  // 当前进行的请求数
    };
  },
  computed: {
    ...mapGetters(['downLoadTaskLists', 'downLoadTaskQueue'])
  },
  watch: {
  },
  created () { },
  mounted () {
    this.$bus.on("download", () => {
      this.processQueue()
    });
    // const { accessKeyId = '', endpoint = '', secretAccessKey = '' } = JSON.parse(localStorage.getItem('s3Client')) || {}
    // this.$3Client = new S3Client({
    //   region: "EastChain-1",
    //   endpoint,
    //   credentials: {
    //     accessKeyId: accessKeyId,
    //     secretAccessKey: secretAccessKey
    //   }
    // })
  },
  methods: {
    // async generateSignedUrl (bucket, key, start, end) {
    //   const command = new GetObjectCommand({
    //     Bucket: bucket,
    //     Key: key,
    //     Range: `bytes=${start}-${end}`
    //   });
    //   return await getSignedUrl(this.$3Client, command, { expiresIn: 3600 });
    // },

    // 使用示例
    handleActive () {
      document.querySelector('.download + span') && document.querySelector('.download + span').classList.remove('circleStatus')
      // this.visible = !this.visible
    },
    renderLoadingTask (pending, execSize, totalSize) {
      if (pending) return 0
      return execSize === 0 ? totalSize === 0 ? 100 : 0 : parseFloat(((execSize / totalSize) * 100).toFixed(2))
    },
    async processQueue () {
      // if (this.isProcessingQueue || this.downLoadTaskQueue.length === 0) {
      //   return
      // }
      // this.isProcessingQueue = true
      if (this.downLoadTaskQueue.length === 0) return
      try {
        while (this.downLoadTaskQueue.length > 0) {
          // 等待当前请求数量低于最大并发数
          while (this.currentRequests >= this.maxConcurrentRequests) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          // 任务队列和展示队列、任务队列没有同步移除、所以执行前需要判断是否存在
          // 获取任务需要正确的截取数组
          // const task = this.downLoadTaskQueue.find(x => x.key === key)
          // console.log('gggg')
          if (!this.downLoadTaskQueue.length) return
          const task = this.downLoadTaskQueue[0]
          const key = task.uniqueKey
          // 检查任务是否被取消
          const taskIndex = this.downLoadTaskLists.findIndex(x => x.key === key)
          if (taskIndex === -1) {
            this.downLoadTaskQueue.shift()
            continue
          }
          try {
            if (task.type === 'd') {
              await this.processDirectoryTask(task, key)
            } else {
              await this.processFileTask(task, key)
            }
          } catch (error) {
            console.error(`Task failed: ${task.taskName}`, error)
            // 可以添加失败状态显示
          }
          //移除任务
          this.downLoadTaskQueue.shift()
        }
      } finally {
        // this.isProcessingQueue = false
      }
    },
    removeTask (index) {
      if (!isNaN(index)) {
        // console.log(index, '123')
        const item = this.downLoadTaskLists.splice(index, 1); // 移除任务
        const id = item[0]?.key
        // keys是目录才执行
        // 区分目录和单一文件需要将request请求 包装
        // console.log(this.abortController[id], this.abortController, id, index, item)
        // 任务列表是存在的、但abortController未添加、需全部清除
        if (this.abortController[id]) {
          const arr = Object.keys(this.abortController[id])
          // 目录打包下载需要遍历调用
          arr.forEach((x) => {
            this.abortController[id][x].abort()
            // this.abortController[id][x].removeAllListeners('httpDownloadProgress');
          })
          // console.log('iam gone')
          delete this.abortController[id]
          if (this.currentRequests > 0) {
            this.currentRequests -= 1
          }
        }
      } else {
        this.downLoadTaskLists.splice(0)
        this.currentRequests = 0
        Object.keys(this.abortController).forEach((x) => {
          // arr是数组索引
          Object.keys(this.abortController[x]).forEach(y => {
            if (this.abortController[x][y]) {
              this.abortController[x][y].abort()
              // this.abortController[x][y].removeAllListeners('httpDownloadProgress');
            }
          })
        })
        this.abortController = {}
      }
      if (!this.downLoadTaskLists.length) {
        this.$refs['downloadPopover'].doClose()
        // this.visible = false; // 如果没有任务，关闭打开的popover
      }
    },
    getRenderZipPath (path, dir, PreDir) {
      return PreDir ?
        path.substring(PreDir.length + dir.length)
        : path.substring(dir.length)
    },
    async loadAllFile (bucket, prefix, key) {
      let allObjects = [];
      let continuationToken = null;
      do {
        const beExeIndex = this.downLoadTaskLists.findIndex(x => x.key === key)
        // console.log('continue', key)
        if (beExeIndex === -1) {
          // console.log('iam gone')
          throw new Error('cancelTask')
        }
        const params = {
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
          Delimiter: '/'
        };
        const data = await this.$store.state._S3.listObjectsV2(params).promise();
        // 1. 处理空目录
        if (data.Contents) {
          allObjects = allObjects.concat(data.Contents.map(x => {
            if (x.Key.endsWith('/') && x.Size === 0) x.IsDirectory = true
            return x
          }))
        }
        // 2. 递归处理子目录
        if (data.CommonPrefixes) {
          const subDirPromises = data.CommonPrefixes.map(async subDir =>
            await this.loadAllFile(bucket, subDir.Prefix, key)
          );
          // 加载数据并发限制
          const subDirFiles = await Promise.all(subDirPromises);
          allObjects = allObjects.concat(subDirFiles.flat());
        }

        continuationToken = data.NextContinuationToken;
      } while (continuationToken);
      // console.log(allObjects, 'allObjects')
      return allObjects;
    },
    async processDirectoryTask (row, key) {
      this.currentRequests++
      const dirName = row.Prefix.slice(0, row.Prefix.length - 1)
      // const stream = (await createDownloadStream(`${dirName}.zip`)).getWriter();

      const fileStream = createWriteStream(`${dirName}.zip`);
      const stream = fileStream.getWriter();

      // 创建目录 使用nodeJS、其下的文件等、采用流式下载
      // const url = `http://localhost:3000/download/${stream}`
      // console.log(stream, dirName)
      // return
      // console.log('1233', dirName)
      const baseUrl = process.env.NODE_ENV === 'production'
        ? window.location.origin  // 生产环境使用当前域名
        : 'http://localhost:8081' // 开发环境使用本地服务器
      const { Bucket, PreDir, Prefix } = row
      const zip = new fflate.Zip((err, data, final) => {
        if (err) {
          console.error("Zip error:", err);
          stream.close();
          return;
        }
        if (final) {
          stream.write(data).then(() => {
            stream.close();
            // 更新最终完成状态
            const currentIdx = this.downLoadTaskLists.findIndex(x => x.key === key);
            if (currentIdx > -1) {
              this.downLoadTaskLists[currentIdx].execCount = this.downLoadTaskLists[currentIdx].totalCount;
              this.downLoadTaskLists[currentIdx].execSize = this.downLoadTaskLists[currentIdx].totalSize;
              // 任务完成，清理资源
              this.currentRequests--;
              delete this.abortController[key];
            }
          });
        } else if (data) {
          stream.write(data);
        }
      });

      try {
        const beExeIndex = this.downLoadTaskLists.findIndex(x => x.key === key)
        if (beExeIndex === -1) {
          return
        }
        const data = await this.loadAllFile(Bucket, PreDir ? PreDir + Prefix : Prefix, key)
        const totalSize = data.reduce((pre, cur) => pre + (Number(cur['Size']) || 0), 0);
        let len = data.length
        const matchIndex = this.downLoadTaskLists.findIndex(x => x.key === key)
        this.downLoadTaskLists[matchIndex].totalCount = len
        this.downLoadTaskLists[matchIndex].totalSize = totalSize
        this.downLoadTaskLists[matchIndex].pending = false
        this.downLoadTaskLists[matchIndex].execSize = 0
        this.downLoadTaskLists[matchIndex].execCount = 0

        if (!this.abortController[key]) {
          this.abortController[key] = []
        }

        // 流式下载打包
        for (let i = 0; i < len; i++) {
          const relativePath = this.getRenderZipPath(data[i].Key, row.Prefix, row.PreDir)
          if (data[i].IsDirectory) {
            // 创建空目录
            const zipStream = new fflate.ZipDeflate(relativePath, {
              level: 5,
            });
            zip.add(zipStream);
            // 打包结束
            zipStream.push(new Uint8Array(), true);
            const currentIdx = this.downLoadTaskLists.findIndex(x => x.key === key)
            this.downLoadTaskLists[currentIdx].execCount += 1
          } else {
            const fileName = data[i].Key
            const abort = new AbortController()
            data[i].download = 0
            this.abortController[key].push(abort)
            const chunkSize = 1024 ** 2 * 5;
            const totalChunks = Math.ceil(data[i]['Size'] / chunkSize);
            let downloadedSize = 0;

            const zipStream = new fflate.ZipDeflate(relativePath, {
              level: 5,
            });
            zip.add(zipStream);

            const signedUrlResponse = await axios.post(`${baseUrl}/generate-signed-url`, {
              bucket: Bucket,
              key: fileName
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (!signedUrlResponse.data || !signedUrlResponse.data.url) {
              throw new Error('Failed to get signed URL');
            }
            const { url } = signedUrlResponse.data;

            for (let j = 0; j < totalChunks; j++) {
              const start = j * chunkSize;
              const end = Math.min(start + chunkSize - 1, data[i]['Size'] - 1);

              try {
                if (!url || typeof url !== 'string') {
                  console.error('Invalid signed URL:', url);
                  throw new Error('Invalid signed URL format');
                }

                const response = await axios.post(`${baseUrl}/proxy-download`, {
                  url: url,
                  range: `bytes=${start}-${end}`
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  signal: abort.signal,
                  responseType: 'arraybuffer'
                });

                if (response.status !== 200) {
                  console.error('Proxy download failed:', {
                    status: response.status,
                    statusText: response.statusText
                  });
                  throw new Error(`Download failed for chunk ${j}: ${response.statusText}`);
                }

                const chunk = new Uint8Array(response.data);
                // 确保每个分片都被正确添加到zip流中
                await zipStream.push(chunk, j === totalChunks - 1);
                downloadedSize += chunk.byteLength;

                // 更新进度
                const currentIdx = this.downLoadTaskLists.findIndex(x => x.key === key);
                if (currentIdx > -1) {
                  // 更新已下载大小
                  this.downLoadTaskLists[currentIdx].execSize = Math.min(
                    this.downLoadTaskLists[currentIdx].execSize + chunk.byteLength,
                    this.downLoadTaskLists[currentIdx].totalSize
                  );

                  // 如果当前文件下载完成，增加完成计数
                  if (downloadedSize === data[i]['Size']) {
                    this.downLoadTaskLists[currentIdx].execCount += 1;
                  }
                }
              } catch (fetchError) {
                console.error(`Fetch error for ${fileName}:`, fetchError);
                throw new Error('Download failed');
              }
            }
            // 确保文件流被正确关闭
            // await zipStream.push(new Uint8Array(), true);
          }
        }
        // 完成所有文件的下载和打包
        zip.end();
      } catch (error) {
        console.error('Directory download error:', error);
        const index = this.downLoadTaskLists.findIndex(x => x.key === key)
        index !== -1 && this.removeTask(index)
        this.currentRequests--
      }
    },
    async processFileTask (row, key) {
      this.currentRequests++
      try {
        // ... 校对索引开始下载 ...
        const findExist = this.downLoadTaskLists.findIndex(x => x.key === key)
        if (findExist === -1) {
          // console.log('iam gone')
          return
        }
        const { taskName, Bucket } = row
        const totalSize = row['Size']
        this.downLoadTaskLists[findExist].totalCount = 1
        this.downLoadTaskLists[findExist].pending = false
        // 下载队列等待过程中任务会取消 需要判断是否需要继续执行
        if (!this.abortController[key]) {
          this.abortController[key] = []
        }
        const abort = new AbortController()
        // const link = document.createElement('a');
        // link.href = this.$store.state._S3.getSignedUrl('getObject', {
        //   Bucket: this.$route.params.id,
        //   Key: taskName,
        //   ResponseContentDisposition: `attachment; filename="${encodeURIComponent(taskName)}"`
        //   // ResponseContentDisposition: 'attachment; filename="your-filename.ext"', // 动态文件名示例
        //   // ResponseContentDisposition: `attachment; filename="${encodeURIComponent(row.Key)}"`,
        //   // ResponseContentType: 'application/octet-stream'
        // });
        // window.location.href = link.href;
        // const activeRequest = this.$store.state._S3
        //   .getObject({ Bucket: this.$route.params.id, Key: taskName })

        // .createReadStream()
        this.abortController[key].push(abort)
        // range 分片处理
        const chunkSize = 1024 ** 2 * 5;
        const totalChunks = Math.ceil(totalSize / chunkSize);
        let downloadedSize = 0;

        // const response = await fetch(this.$store.state._S3.getSignedUrl('getObject', {
        //   Bucket: this.$route.params.id,
        //   Key: taskName,
        //   Expires: 3600 * 5
        //   // ResponseContentDisposition: `attachment; filename="${encodeURIComponent(taskName)}"`
        //   // ResponseContentDisposition: 'attachment; filename="your-filename.ext"', // 动态文件名示例
        //   // ResponseContentDisposition: `attachment; filename="${encodeURIComponent(row.Key)}"`,
        //   // ResponseContentType: 'application/octet-stream'
        // }),
        //   { signal: abort.signal }
        // )
        // const activeRequest = null
        // // 需要找到匹配的项
        // // 大文件就分片流式下载
        // // 小文件流式下载
        // activeRequest.on('httpDownloadProgress', (progress) => {
        //   // 先判断是否请求中断
        //   if (!this.abortController[key]) {
        //     return
        //   }
        // const matchIndex = this.downLoadTaskLists.findIndex(x => x.key === key)
        // // console.log(this.downLoadTaskLists, matchIndex)
        // if (matchIndex > -1) {
        //   this.downLoadTaskLists[matchIndex].execSize = progress.loaded
        //   if (progress.loaded === totalSize) {
        //     this.downLoadTaskLists[matchIndex].execCount = 1
        //   }
        // }
        // });
        // const reader = response.body.getReader();
        // console.log(reader, 'reader', this.abortController);


        // 使用readableStream()替代serviceWorker

        // console.log(row.Key, '1233',)
        const baseUrl = process.env.NODE_ENV === 'production'
          ? window.location.origin  // 生产环境使用当前域名
          : 'http://localhost:8081' // 开发环境使用本地服务器

        // 获取预签名URL
        const signedUrlResponse = await axios.post(`${baseUrl}/generate-signed-url`, {
          bucket: Bucket,
          key: taskName
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!signedUrlResponse.data || !signedUrlResponse.data.url) {
          throw new Error('Failed to get signed URL');
        }
        const { url } = signedUrlResponse.data;
        const fileStream = createWriteStream(row.Key, {
          size: totalSize
        });
        const writer = fileStream.getWriter();

        try {
          // 分片下载
          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize - 1, totalSize - 1);

            try {
              // 使用代理服务器转发请求
              const response = await axios.post(`${baseUrl}/proxy-download`, {
                url: url,
                range: `bytes=${start}-${end}`
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                signal: abort.signal,
                responseType: 'arraybuffer'
              });

              if (response.status !== 200) {
                console.error('Proxy download failed:', {
                  status: response.status,
                  statusText: response.statusText
                });
                throw new Error(`Download failed for chunk ${i}: ${response.statusText}`);
              }

              // 直接使用response.data作为二进制数据
              const chunk = new Uint8Array(response.data);
              // await writer.seek(start);
              await writer.write(chunk);
              downloadedSize += chunk.byteLength;

              // 更新进度
              const currentIdx = this.downLoadTaskLists.findIndex(x => x.key === key);
              if (currentIdx > -1) {
                this.downLoadTaskLists[currentIdx].execSize = downloadedSize;
                if (downloadedSize === totalSize) {
                  this.downLoadTaskLists[currentIdx].execCount = 1;
                  this.currentRequests--;
                  delete this.abortController[key];
                }
              }
            } catch (error) {
              console.error(`Error downloading chunk ${i}:`, error);
              throw error;
            }
          }

          // 所有分片下载完成后关闭writer
          await writer.close();
        } catch (err) {
          // 发生错误时也要关闭writer
          try {
            await writer.close();
          } catch (closeError) {
            console.error('Error closing writer:', closeError);
          }

          // 浏览器手动 取消任务
          console.log(err, '123')
          const index = this.downLoadTaskLists.findIndex(x => x.key === key)
          index !== -1 && this.removeTask(index)
          this.currentRequests--
        }
      } catch (err) {
        // 浏览器手动 取消任务
        console.log(err, '123')
        const index = this.downLoadTaskLists.findIndex(x => x.key === key)
        // writable && writable?.abort()
        // reader && reader?.cancel();
        // 此处为浏览器手动清除或者按钮取消任务  index===-1
        index !== -1 && this.removeTask(index)
        this.currentRequests--
        // 浏览器取消下载任务
      }
      finally {
        // this.currentRequests--
        // delete this.abortController[key]
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.customProgressContainer {
  max-height: 420px;
  overflow-y: auto;

  .customProgressC {
    margin: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e2e2;

    &.title {
      display: flex;
      justify-content: space-between;

      .el-icon-delete {
        cursor: pointer;
        color: #ff8746;
        margin-left: 5px;
      }

      span {
        color: #d3d6d8;
      }
    }

    .flexName {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: #ff8746;

      .tooltip-container {
        width: 90%;
      }
    }

    .el-icon-close {
      cursor: pointer;
    }

    .customProgress {
      display: flex;
      align-items: center;


      ::v-deep .el-progress {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-progress__text {
          width: 52px !important;
        }
      }

      // .el-progress-bar {
      //   width: 90%;
      // }



      .tooltip-container {
        max-width: 150px;
        width: 120px;
        text-align: right;

        .text-box {
          vertical-align: super;
          text-align: right;
        }
      }

      // .txt {
      //   flex: 1;
      //   text-align: right;
      //   width: fit-content;
      //   text-align: right;
      //   white-space: pre;
      // }
    }
  }
}

.downLoadList {
  // position: absolute;
  // right: 54px;
  // top: 90px;
  // width: 25px;
  // height: 25px;
  position: relative;

  .download {
    font-size: 25px;
    color: #ff8746;
    transition: all .5s;
    cursor: pointer;

    &+span {
      display: block;
      width: 8px;
      height: 8px;
    }
  }

  .circleStatus {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 20px;
    transition: all .2s;
    background: rgb(76, 203, 146);

    &.active {
      animation: activeLoadIco .5s linear 1;
    }
  }

}
</style>



```
