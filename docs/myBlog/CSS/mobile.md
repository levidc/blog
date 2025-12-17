---
title: 移动端及大屏可视化
date: 2025-12-16
categories:
 - 前端
tags:
 - css
 - 移动端
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/24.jpg)

<!-- more -->
```css
    如何让1rem=10px 但浏览器最小显示单位为12px 默认1rem=16px 设置 {
        font-size: '67.5%'1/1.6
    }
```

```js
    1. rem是什么 ?
        rem(font size of the root element) 是指相对于根元素的字体大小的单位
    2. 为什么web app要使用rem？
    实现强大的屏幕适配布局(淘宝, 腾讯, 网易等网站都是rem布局适配) rem能等比例适配所有屏幕, 根据变化html的字体大小来控制rem的大小
    vw： viewpoint width， 视窗宽度， 1 vw等于视窗宽度的1 % 。
    vh： viewpoint height， 视窗高度， 1 vh等于视窗高度的1 % 。
    vmin： vw和vh中较小的那个。
    vmax： vw和vh中较大的那个。
    vw, vh, vmin, vmax：
    IE9 + 局部支持，
    chrome / firefox / safari / opera支持，
    iOS safari 8 + 支持，
    Android browser4 .4 + 支持，
    chrome for android39支持,

    公式：
    html,body {
        font - size: (100 px / 屏幕宽度的1 % ) vw
    }
    解释： 通过用100除以当前屏幕宽度的1 %
    计算出100px占当前屏幕的多少vw
    常用设计稿宽度640/750
    即100/6.4 | 100/7.5
    15.625vw | 13.333333333333vw
```

## 大屏可视化
<template>
  <div>
    <div class="loading">
      <div class="loadbox">
        <img src="./images/loading.gif" /> 页面加载中...
      </div>
    </div>
    <div class="canvas" style="opacity: .2">
      <canvas ref="particlesCanvas" id="particlesCanvas" style="display:block; width:100%; height:100%;"></canvas>
    </div>
    <div class="head">
      <h1 class="title-shadow">FAST数据迁移</h1>
      <div class="weather">
        <span id="showTime"></span>
      </div>
    </div>
    <div class="mainbox">
      <ul class="clearfix">
        <li>
          <div class="boxall">
            <div class="alltitle migrate">
              中国天眼联合研究中心·贵州师范大学分中心
            </div>
            <div class="sycm">
              <ul class="clearfix">
                <li>
                  <div style="display: flex; align-items: center;justify-content: center;">
                    <h2 ref="srcSize" class="size">
                      {{ totalOverview.src.size }}
                    </h2>
                    <span class="unit" style="margin-left: 10px;">
                      {{ totalOverview.src.unit }}
                    </span>
                  </div>
                  <span class="labelTitle">容量</span>
                </li>
                <li>
                  <h2 ref="srcCount">{{ totalOverview.src.count }}</h2> <span class="labelTitle">对象数量</span>
                </li>
              </ul>
            </div>
            <div class="alltitle">
              文件目录
            </div>
            <div class="table">
              <el-table :data="AllData" style="width: 100%" :max-height="700" v-loading="loadingTable">
                <el-table-column prop="fileName" label="文件名">
                  <template slot-scope="scope">
                    <showToolTip v-if="scope.row.type == 'f'" :text="scope.row.Key" use-slot>
                      <a slot="data" class="blue">
                        <i class="fa fa-file-o" aria-hidden="true" />
                        {{ scope.row.Key }}
                      </a>
                    </showToolTip>
                    <showToolTip v-if="scope.row.type == 'd'" :text="scope.row.Prefix" use-slot>
                      <router-link slot="data" class="blue" to="#">
                        <i class="fa fa-folder-open-o" aria-hidden="true" />
                        {{ scope.row.Prefix }}
                      </router-link>
                    </showToolTip>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="200px">
                  <template slot-scope="scope">
                    {{ scope.row.type == 'f' ? '对象' : '目录' }}
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination :page-sizes="[5, 10, 20, 50]" layout="sizes, prev, pager, next" :total="total"
                :page-size.sync="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
            <div class="boxfoot"></div>
          </div>
        </li>
        <li>
          <div class="boxall">
            <div class="alltitle migrate">
              华中科技大学天文系
            </div>
            <div class="sycm">
              <ul class="clearfix">
                <li>
                  <div style="display: flex; align-items: center;justify-content: center;">
                    <h2 ref="targetSize" class="size">
                      {{ totalOverview.target.size }}
                    </h2>
                    <span class="unit" style="margin-left: 10px;">{{ totalOverview.target.unit }}</span>
                  </div>
                  <span class="labelTitle">容量</span>
                </li>
                <li>
                  <h2 ref="targetCount">{{ totalOverview.target.count }}</h2> <span class="labelTitle">对象数量</span>
                </li>
              </ul>
            </div>
            <div class="alltitle">
              文件目录
            </div>
            <ul class="tabnav">
              <li style=" height: auto;">
                <div class="gdhead">
                  <span>文件名</span>
                  <span>类型</span>
                </div>
                <div class="scrollDiv">
                  <div class="scroll-wrapper">
                    <ul class="smjl" v-if="totalOverview.target.count > 0">
                      <li v-for="(item, index) in displayData" :key="'a-' + index">
                        <span>
                          <showToolTip v-if="item.type == 'f'" :text="item.Key" use-slot>
                            <a slot="data" class="blue">
                              <i class="fa fa-file-o"></i>
                              {{ item.Key }}
                            </a>
                          </showToolTip>
                          <showToolTip v-if="item.type == 'd'" :text="item.Prefix" use-slot>
                            <router-link slot="data" class="blue" to="#">
                              <i class="fa fa-folder-open-o"></i>
                              {{ item.Prefix }}
                            </router-link>
                          </showToolTip>
                        </span>
                        <span>
                          {{ item.type == 'f' ? '对象' : '目录' }}
                        </span>
                      </li>
                    </ul>
                    <ul class="smjl" v-if="totalOverview.target.count > 0">
                      <li v-for="(item, index) in displayData" :key="'b-' + index">
                        <span>
                          <showToolTip v-if="item.type == 'f'" :text="item.Key" use-slot>
                            <a slot="data" class="blue">
                              <i class="fa fa-file-o"></i>
                              {{ item.Key }}
                            </a>
                          </showToolTip>
                          <showToolTip v-if="item.type == 'd'" :text="item.Prefix" use-slot>
                            <router-link slot="data" class="blue" to="#">
                              <i class="fa fa-folder-open-o"></i>
                              {{ item.Prefix }}
                            </router-link>
                          </showToolTip>
                        </span>
                        <span>
                          {{ item.type == 'f' ? '对象' : '目录' }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <div class="boxfoot"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="back"></div>
  </div>
</template>
<script>
import $ from 'jquery'
import { CountUp } from 'countup.js';
import axios from 'axios'
// 动态加载依赖
export default {
  name: 'BackUp',
  props: {},
  components: {},
  data () {
    return {
      loadingTable: false,
      intervalTargetInfo: null,
      refreshTokenInterval: null,
      srcToken: {},
      targetToken: {},
      total: 0,
      pageSize: 5,
      currentPage: 1,
      tableData: [
      ],
      rules: {
        src: [{ required: true, message: '请输入源', trigger: 'blur' }],
        target: [{ required: true, message: '请输入目标', trigger: 'blur' }],
        dataSize: [{ required: true, message: '请输入数据大小', trigger: 'blur' }],
        bandWidth: [{ required: true, message: '请输入带宽', trigger: 'blur' }],
        confirmNet: [{ required: true, message: '请选择确认网络', trigger: 'change' }]
      },
      form: {
        src: '',
        target: '',
        dataSize: '',
        bandWidth: '',
        confirmNet: null
      },
      particles: null,
      // 数据总览数字
      totalOverview: {
        src: {
          size: '',
          unit: '',
          count: 0,
          countSize: 0
        },
        target: {
          size: '',
          unit: '',
          count: 0,
          countSize: 0,
          showCount: 0,
          showCountSize: 0
        }
      },
      // 存储CountUp实例
      countUpInstancesSrc: [],
      countUpInstancesTarget: [],
      // 用于smjl列表展示的数据
      displayData: [],
      // 用于定时调用的定时器
      fetchInterval: null,
      // 累计的数据总量存储
      dataIndex: 1,
      // 存储各指标的上一次值，用于动画起始值
      previousValues: {
        src: {
          size: 0,
          count: 0
        },
        target: {
          size: 0,
          count: 0
        }
      }
    };
  },
  computed: {
    AllData () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  watch: {
    // 监听tableData变化，自动更新total值以确保分页正确
    tableData: {
      handler (newVal) {
        this.total = newVal.length;
      },
      deep: true,
      immediate: true
    },
    displayData () {
      this.$nextTick(() => {
        this.updateScrollSpeed()
      })
    }
  },
  created () { },
  mounted () {
    // 先尝试加载配置文件，然后再初始化页面
    this.loadConfigFile().then(() => {
      this.initPage();
    });
  },
  beforeDestroy () {
    // 清理定时器
    if (this.intervalTargetInfo) {
      clearTimeout(this.intervalTargetInfo);
    }
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    // 清除数据获取定时器
    this.stopPeriodicFetch();
    // 清理粒子动画
    this.cleanupParticles();
    // 清理数字动画实例
    this.cleanupNumberAnimations('src');
    this.cleanupNumberAnimations('target');
  },
  methods: {
    updateScrollSpeed () {
      const list = this.$el.querySelector('.smjl');
      if (!list) return;

      const height = list.offsetHeight; // 单份列表高度
      const speed = 30; // 每秒滚动 30px（你可以调整）

      const duration = height / speed; // 动画总时长（秒）

      this.$el.querySelector('.scroll-wrapper')
        .style.setProperty('--scroll-duration', duration + 's');
    },
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.currentPage = 1
    },
    getRefreshToken (target) {
      this.refreshTokenInterval = setInterval(async () => {
        await Promise.all(
          [...target.map(x => this.getCode(x, 'target'))]
        )
        // toDo 刷新token
      }, 1000 * 60 * 9)
    },
    initData () {
      return new Promise(async (resolve) => {
        try {
          // 从外部配置文件加载API配置
          // this.loadMockData();
          // this.startPeriodicFetch();
          // return resolve();
          const apiConfig = window.API_CONFIG
          // 如果配置文件未加载，尝试动态加载
          if (!window.API_CONFIG) {
            await this.loadConfigFile();
          }
          // console.log(apiConfig, '========');
          // 使用配置的参数调用API获取数据汇总

          const { source, target } = apiConfig

          await Promise.allSettled(
            [...source.map(x => this.getCode(x, 'src'))]
          )
          await Promise.allSettled(
            [...target.map(x => this.getCode(x, 'target'))]
          )
          this.getRefreshToken(target)

          // 获取数据汇总及文件列表
          await Promise.allSettled(
            [...source.map(x => this.getBucketSummary(x, 'src'))]
          )
          await Promise.allSettled(
            [...target.map(x => this.getBucketSummary(x, 'target'))]
          )

          // 获取文件列表
          this.loadingTable = true;
          await Promise.allSettled(
            [...source.map(x => this.getListObject(x, 'src'))]
          )
          this.loadingTable = false;
          await Promise.allSettled(
            [...target.map(x => this.getListObject(x, 'target'))]
          )

          // 计算总数
          const [size, unit] = this.byteConvertImpl(this.totalOverview.src.countSize);
          this.totalOverview.src.size = size;
          this.totalOverview.src.unit = unit;


          const [targetSize, targetUnit] = this.byteConvertImpl(this.totalOverview.target.countSize);

          // 重置累加计算的值
          this.totalOverview.target.size = targetSize;
          this.totalOverview.target.unit = targetUnit;

          this.updateCountUpInstances('src');
          this.updateCountUpInstances('target');
          this.startRefreshTarget(target)


          resolve()
          return
        } catch (error) {
          console.error('初始化数据失败:', error);
          this.loadMockData();
          resolve();
        }
      })
    },

    // 动态加载配置文件
    async loadConfigFile () {
      return new Promise((resolve) => {
        try {
          // 检查配置文件是否已加载
          if (window.API_CONFIG) {
            resolve(window.API_CONFIG);
            return;
          }
          resolve(window.API_CONFIG);
        } catch (error) {
          console.error('加载配置文件失败:', error);
          resolve(null);
        }
      });
    },


    async getCode (config, type) {
      const url = `${config.baseUrl}/dos/login`;
      const response = await axios.post(url, {
        userName: "superAdmin",
        password: "superAdmin123!"
      })
      // params: {
      //   bucketName: config.defaultBucketName
      // }
      if (type === 'src') {
        this.srcToken[config.baseUrl] = response.data.data.accessToken
      } else {
        this.targetToken[config.baseUrl] = response.data.data.accessToken
      }
      // console.log(response, '123')
    },

    async refreshToken (config, type) {
      const url = `${config.baseUrl}/dos/refreshToken`;
      const response = await axios.post(url, {
        refreshToken: this.srcToken[config.baseUrl]
      })
      if (type === 'src') {
        this.srcToken[config.baseUrl] = response.data.data.accessToken
      } else {
        this.targetToken[config.baseUrl] = response.data.data.accessToken
      }
    },


    // 调用API获取文件汇总信息
    async getBucketSummary (apiConfig, type) {
      const token = type === 'src' ? this.srcToken[apiConfig.baseUrl] : this.targetToken[apiConfig.baseUrl]
      try {
        const url = `${apiConfig.baseUrl}/dos/listFsBucketUseSize`;
        const response = await axios.get(url, {
          params: {
            bucketName: apiConfig.bucketName
          },
          headers: {
            'Authentication': token
          }
        })
        const data = response.data.data
        if (data && data.length > 0) {
          const { size, count } = data[0]
          if (type === 'src') {
            this.totalOverview.src.countSize += Number(size)
            this.totalOverview.src.count += Number(count)
          } else {
            this.totalOverview.target.showCountSize += (Number(size) * 4)
            this.totalOverview.target.showCount += (Number(count) * 4)
          }
        }
        // login
        // console.log(data, 'response')
        return response
      } catch (error) {
        console.error('获取文件汇总信息失败:', error);
        return null;
      }
    },
    getListObject (apiConfig, type) {
      const token = type === 'src' ? this.srcToken[apiConfig.baseUrl] : this.targetToken[apiConfig.baseUrl]
      const port = apiConfig.baseUrl + '/dos'
      var S3 = new AWS.S3({
        accessKeyId: 'test',
        secretAccessKey: 'test',
        endpoint: port,
        region: 'EastChain-1',
        s3ForcePathStyle: true
      })
      AWS.events.on('send', (req) => {
        req.request.httpRequest.headers['Authentication'] = token
        req.request.httpRequest.headers['request-target'] = 'gateway'
      })
      const params = {
        Bucket: apiConfig.bucketName,
        Prefix: '',
        Delimiter: '/',
      }
      S3.listObjectsV2(params, (err, data) => {
        if (err) {
          console.error('获取目录列表失败:', err);
          return;
        } else {
          // 处理目录列表
          if (type === 'src') {
            for (let i = 0; i < data.Contents.length; i++) {
              if (data.Contents[i].Size === 0 && data.Contents[i].Key.endsWith('/')) continue;
              data.Contents[i].type = 'f'
              this.tableData.push(data.Contents[i])
            }
            for (let i = 0; i < (Math.min(5, data.CommonPrefixes.length)); i++) {
              data.CommonPrefixes[i].type = 'd'
              this.tableData.push(data.CommonPrefixes[i])
              // 对每个目录执行第二次listObject请求，获取目录下的文件
              const subDirParams = {
                Bucket: apiConfig.bucketName,
                Prefix: data.CommonPrefixes[i].Prefix,
                Delimiter: '/'
              }
              S3.listObjectsV2(subDirParams, (subErr, subData) => {
                if (subErr) {
                  console.error('获取子目录文件列表失败:', subErr);
                  return;
                }
                // 处理子目录下的文件
                for (let j = 0; j < subData.Contents.length; j++) {
                  // 跳过目录标记文件
                  if (subData.Contents[j].Size === 0 && subData.Contents[j].Key.endsWith('/')) continue;
                  subData.Contents[j].type = 'f'
                  this.tableData.push(subData.Contents[j])
                }
                for (let j = 0; j < subData.CommonPrefixes.length; j++) {
                  subData.CommonPrefixes[j].type = 'd'
                  this.tableData.push(subData.CommonPrefixes[j])
                }
              })
            }
          } else {
            let Prefix = ''
            for (let i = 0; i < data.Contents.length; i++) {
              if (Prefix && data.Contents[i].Key === Prefix && data.Contents[i].Size == 0 && data.Contents[i].Key[data.Contents[i].Key.length - 1] === '/') continue
              data.Contents[i].type = 'f'
              this.displayData.push(data.Contents[i])
            }
            for (let i = 0; i < (Math.min(5, data.CommonPrefixes.length)); i++) {
              data.CommonPrefixes[i].type = 'd'
              // 路径都取相当于根目录的一级路径prefix
              this.displayData.push(data.CommonPrefixes[i])
              // 对每个目录执行第二次listObject请求，获取目录下的文件
              const subDirParams = {
                Bucket: apiConfig.bucketName,
                Prefix: data.CommonPrefixes[i].Prefix,
                Delimiter: '/'
              }
              S3.listObjectsV2(subDirParams, (subErr, subData) => {
                if (subErr) {
                  console.error('获取子目录文件列表失败:', subErr);
                  return;
                }

                // 处理子目录下的文件
                for (let j = 0; j < subData.Contents.length; j++) {
                  // 跳过目录标记文件
                  if (subData.Contents[j].Size === 0 && subData.Contents[j].Key.endsWith('/')) continue;
                  subData.Contents[j].type = 'f'
                  this.displayData.push(subData.Contents[j])
                }
                for (let j = 0; j < subData.CommonPrefixes.length; j++) {
                  subData.CommonPrefixes[j].type = 'd'
                  this.displayData.push(subData.CommonPrefixes[j])
                }
                this.displayData = [...this.displayData].slice(-15);
              })
            }
            // console.log(this.displayData, '================')
          }
        }
      })
    },

    startRefreshTarget (target) {
      // 定义递归函数
      const refreshData = async () => {
        try {
          // 每次调用前重置计数，确保从头开始计算当前实际值
          this.totalOverview.target.showCountSize = 0;
          this.totalOverview.target.showCount = 0;
          await Promise.all(
            [...target.map(x => this.getBucketSummary(x, 'target'))]
          )
          await Promise.all(
            [...target.map(x => this.getListObject(x, 'target'))]
          )

          this.totalOverview.target.countSize = Math.max(this.totalOverview.target.showCountSize, this.totalOverview.target.countSize)

          if (this.totalOverview.target.countSize >= this.totalOverview.src.countSize) {
            this.totalOverview.target.countSize = this.totalOverview.src.countSize
          }

          this.totalOverview.target.count = Math.max(this.totalOverview.target.showCount, this.totalOverview.target.count)

          if (this.totalOverview.target.count >= this.totalOverview.src.count) {
            this.totalOverview.target.count = this.totalOverview.src.count
          }

          const [targetSize, targetUnit] = this.byteConvertImpl(this.totalOverview.target.countSize);
          this.totalOverview.target.size = targetSize;
          this.totalOverview.target.unit = targetUnit;
          // 更新数字动画
          this.updateCountUpInstances('target');
          // toDO刷新文件列表
        } catch (error) {
          console.error('Refresh target data error:', error);
        } finally {
          // 所有异步操作完成后，设置下一次定时器
          this.intervalTargetInfo = setTimeout(refreshData, 1000 * 10);
        }
      };
      // 启动第一次执行
      refreshData();
    },
    // 加载模拟数据
    loadMockData () {
      let size = 0;
      this.tableData = [];
      for (let i = 0; i < 100; i++) {
        const fileSize = (i + 1) * 100;
        size += fileSize;
        this.tableData.push({
          Prefix: `文件${i + 1}`,
          size: this.byteConvert(fileSize),
          dir: `目录${i + 1}`,
          type: 'd',
        });
      }
      this.total = this.tableData.length;
      const [num, unit] = this.byteConvertImpl(size);
      this.totalOverview.src.size = num;
      this.totalOverview.src.unit = unit;
      this.totalOverview.src.count = this.tableData.length;

      // 初始化数字动画
      this.updateCountUpInstances('src');
    },
    // 模拟接口调用获取文件列表数据
    async fetchFileList () {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 生成模拟数据（每次生成3-5条新数据）
      const newData = [];
      const newDataCount = Math.ceil(Math.random() * 3) + 2; // 3-5条新数据

      let newSizeSum = 0; // 本次新增数据的总大小
      for (let i = 0; i < newDataCount; i++) {
        const sizeInKB = Math.ceil(Math.random() * 100000000000) + (1024 ** 2) * 500;
        newSizeSum += sizeInKB;

        newData.push({
          Prefix: `文件${this.dataIndex}.txt`,
          size: this.byteConvert(sizeInKB),
          time: new Date().toLocaleString(),
          type: 'd',
        });

        this.dataIndex++;
      }

      this.totalOverview.target.countSize += newSizeSum
      const [num, unit] = this.byteConvertImpl(this.totalOverview.target.countSize)
      this.totalOverview.target.size = num
      this.totalOverview.target.unit = unit
      // console.log(this.totalOverview.target.size, newData.length, this.totalOverview.target.count)
      this.totalOverview.target.count += newData.length

      // 将新数据添加到displayData中（保持最新的15条数据）
      this.displayData = [...newData, ...this.displayData].slice(0, 15);
      this.updateCountUpInstances('target');
    },

    // 启动定时获取数据
    async startPeriodicFetch () {
      // 清除已有的定时器（如果存在）
      if (this.fetchInterval) {
        clearInterval(this.fetchInterval);
      }

      // 立即执行一次
      await this.fetchFileList();
      // 确保DOM更新后再初始化滚动效果

      // 设置定时器，每5秒获取一次新数据
      this.fetchInterval = setInterval(() => {
        this.fetchFileList();
      }, 5000);
    },

    // 停止定时获取数据
    stopPeriodicFetch () {
      if (this.fetchInterval) {
        clearInterval(this.fetchInterval);
        this.fetchInterval = null;
      }
    },
    // 更新数字动画显示
    updateCountUpInstances (type) {
      // 清理现有的数字动画实例
      this.cleanupNumberAnimations(type);
      try {
        if (type === 'src') {
          // 容量数据动画
          if (this.$refs.srcSize) {
            // 配置选项，使用上一次的值作为起始值
            const sizeOptions = {
              startVal: this.previousValues.src.size, // 从上次的值开始
              duration: 1,
              useEasing: true,
              separator: ',',
              decimal: '.',
              prefix: '',
              suffix: ''
            };
            const srcSizeInstance = new CountUp(this.$refs.srcSize, this.totalOverview.src.size, sizeOptions);
            srcSizeInstance.start();
            this.countUpInstancesSrc.push(srcSizeInstance);
            // 更新上一次的值
            this.previousValues.src.size = this.totalOverview.src.size;
          }

          // 对象数数据动画
          if (this.$refs.srcCount) {
            const countOptions = {
              startVal: this.previousValues.src.count, // 从上次的值开始
              duration: 1,
              useEasing: true,
              separator: ',',
              decimal: '.',
              prefix: '',
              suffix: ''
            };
            const srcCountInstance = new CountUp(this.$refs.srcCount, this.totalOverview.src.count, countOptions);
            srcCountInstance.start();
            this.countUpInstancesSrc.push(srcCountInstance);
            // 更新上一次的值
            this.previousValues.src.count = this.totalOverview.src.count;
          }

        } else if (type === 'target') {
          // 容量数据动画
          if (this.$refs.targetSize) {
            const sizeOptions = {
              startVal: this.previousValues.target.size, // 从上次的值开始
              duration: 0,
              useEasing: true,
              separator: ',',
              decimal: '.',
              prefix: '',
              suffix: ''
            };
            const targetSizeInstance = new CountUp(this.$refs.targetSize, this.totalOverview.target.size, sizeOptions);
            targetSizeInstance.start();
            this.countUpInstancesTarget.push(targetSizeInstance);
            // 更新上一次的值
            this.previousValues.target.size = this.totalOverview.target.size;
          }

          // 对象数数据动画
          if (this.$refs.targetCount) {
            const countOptions = {
              startVal: this.previousValues.target.count, // 从上次的值开始
              duration: 1,
              useEasing: true,
              separator: ',',
              decimal: '.',
              prefix: '',
              suffix: ''
            };
            const targetCountInstance = new CountUp(this.$refs.targetCount, this.totalOverview.target.count, countOptions);
            targetCountInstance.start();
            this.countUpInstancesTarget.push(targetCountInstance);
            // 更新上一次的值
            this.previousValues.target.count = this.totalOverview.target.count;
          }
        }
      } catch (error) {
        console.error('更新数字动画失败:', error);
        // 失败时降级为直接更新文本
      }
    },
    cleanupParticles () {
      if (this.particles && this.particles.destroy) {
        this.particles.destroy();
      }
      // 移除窗口大小变化监听器 - 使用具名函数以便正确移除
      const resizeHandler = () => {
        if (this.$refs.particlesCanvas) {
          const rect = this.$refs.particlesCanvas.getBoundingClientRect();
          this.$refs.particlesCanvas.width = rect.width * window.devicePixelRatio;
          this.$refs.particlesCanvas.height = rect.height * window.devicePixelRatio;
        }
      };
      window.removeEventListener('resize', resizeHandler);
    },

    async initPage () {
      this.initWindowResize();

      this.initParticlesAnimation();

      this.updateScrollSpeed();

      await this.initData()
      $(window).on('load', () => {
        $('.loading').fadeOut();
      });
      if (document.readyState === 'complete') {
        $('.loading').fadeOut();
      }
    },
    cleanupNumberAnimations (type) {
      if (type === 'src') {
        this.countUpInstancesSrc.forEach(instance => {
          if (instance && instance.reset) {
            instance.reset();
          }
        });
        this.countUpInstances = [];
      } else if (type === 'target') {
        this.countUpInstancesTarget.forEach(instance => {
          if (instance && instance.reset) {
            instance.reset();
          }
        });
        this.countUpInstances = [];
      }
    },
    initWindowResize () {
      // 节流函数
      const throttle = (func, delay) => {
        let lastCall = 0;
        return function () {
          const now = new Date().getTime();
          if (now - lastCall < delay) {
            return;
          }
          lastCall = now;
          return func.apply(this, arguments);
        };
      };

      // 创建节流的resize处理函数
      const handleResize = throttle(() => {
        const whei = $(window).width();
        const wheiHeight = $(window).height();

        // 优化的响应式字体大小计算
        let fontSize;
        if (whei < 768) {
          fontSize = whei / 18; // 小屏幕字体相对大一些
        } else if (whei > 1440) {
          fontSize = whei / 22; // 大屏幕字体相对小一些
        } else {
          fontSize = whei / 20; // 中等屏幕保持原有比例
        }
        $("html").css({ fontSize: fontSize });

        // 确保主内容区域适配窗口高度
        const $mainbox = $('.mainbox');
        const headerHeight = $('.head').outerHeight() || 105; // 头部高度，默认1.05rem
        const mainboxHeight = wheiHeight - headerHeight;

        // 设置主内容区域的高度
        $mainbox.css({
          minHeight: mainboxHeight + 'px',
          height: 'auto'
        });

        // 优化内容区域的滚动设置
        const $contentLi = $mainbox.find('> ul > li');
        const contentPadding = 20; // 内容内边距

        $contentLi.css({
          minHeight: (mainboxHeight - contentPadding) + 'px',
          maxHeight: 'none', // 移除最大高度限制，允许内容自然扩展
          overflowY: 'auto', // 仅在内容超出时显示滚动条
          overflowX: 'hidden'
        });

        // 确保canvas背景也能适配窗口高度
        const $canvas = $('.canvas');
        $canvas.css({
          height: wheiHeight + 'px'
        });
      });
      // 初始调用
      handleResize();
      // 绑定窗口调整事件，使用节流以提高性能
      let resizeTimer;
      $(window).resize(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
      });
    },
    initParticlesAnimation () {
      if (!this.$refs.particlesCanvas) return;
      const canvas = this.$refs.particlesCanvas;
      const ctx = canvas.getContext('2d');

      // 设置canvas尺寸
      const setCanvasSize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;

        // 缩放上下文以匹配设备像素比
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // 调整绘制尺寸
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
      };

      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);

      // 粒子动画配置和实现
      const num = 200;
      const w = canvas.width;
      const h = canvas.height;
      const max = 100;
      const _x = 0;
      const _y = 0;
      const _z = 150;

      const dtr = (d) => {
        return d * Math.PI / 180;
      };

      const rnd = () => {
        return Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
      };

      const dist = (p1, p2, p3) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
      };

      const cam = {
        obj: { x: _x, y: _y, z: _z },
        dest: { x: 0, y: 0, z: 1 },
        dist: { x: 0, y: 0, z: 200 },
        ang: { cplane: 0, splane: 0, ctheta: 0, stheta: 0 },
        zoom: 1,
        disp: { x: w / 2, y: h / 2, z: 0 },
        upd: function () {
          cam.dist.x = cam.dest.x - cam.obj.x;
          cam.dist.y = cam.dest.y - cam.obj.y;
          cam.dist.z = cam.dest.z - cam.obj.z;
          cam.ang.cplane = -cam.dist.z / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
          cam.ang.splane = cam.dist.x / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
          cam.ang.ctheta = Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z) /
            Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
          cam.ang.stheta = -cam.dist.y /
            Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
        }
      };

      const trans = {
        parts: {
          sz: function (p, sz) {
            return { x: p.x * sz.x, y: p.y * sz.y, z: p.z * sz.z };
          },
          rot: {
            x: function (p, rot) {
              return {
                x: p.x,
                y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
                z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x))
              };
            },
            y: function (p, rot) {
              return {
                x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
                y: p.y,
                z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y))
              };
            },
            z: function (p, rot) {
              return {
                x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
                y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
                z: p.z
              };
            }
          },
          pos: function (p, pos) {
            return { x: p.x + pos.x, y: p.y + pos.y, z: p.z + pos.z };
          }
        },
        pov: {
          plane: function (p) {
            return {
              x: p.x * cam.ang.cplane + p.z * cam.ang.splane,
              y: p.y,
              z: p.x * -cam.ang.splane + p.z * cam.ang.cplane
            };
          },
          theta: function (p) {
            return {
              x: p.x,
              y: p.y * cam.ang.ctheta - p.z * cam.ang.stheta,
              z: p.y * cam.ang.stheta + p.z * cam.ang.ctheta
            };
          },
          set: function (p) {
            return { x: p.x - cam.obj.x, y: p.y - cam.obj.y, z: p.z - cam.obj.z };
          }
        },
        persp: function (p) {
          return {
            x: p.x * cam.dist.z / p.z * cam.zoom,
            y: p.y * cam.dist.z / p.z * cam.zoom,
            z: p.z * cam.zoom,
            p: cam.dist.z / p.z
          };
        },
        disp: function (p, disp) {
          return { x: p.x + disp.x, y: -p.y + disp.y, z: p.z + disp.z, p: p.p };
        },
        steps: function (_obj_, sz, rot, pos, disp) {
          let _args = trans.parts.sz(_obj_, sz);
          _args = trans.parts.rot.x(_args, rot);
          _args = trans.parts.rot.y(_args, rot);
          _args = trans.parts.rot.z(_args, rot);
          _args = trans.parts.pos(_args, pos);
          _args = trans.pov.plane(_args);
          _args = trans.pov.theta(_args);
          _args = trans.pov.set(_args);
          _args = trans.persp(_args);
          _args = trans.disp(_args, disp);
          return _args;
        }
      };

      class ThreeD {
        constructor(param) {
          this.transIn = {};
          this.transOut = {};
          this.transIn.vtx = param.vtx;
          this.transIn.sz = param.sz;
          this.transIn.rot = param.rot;
          this.transIn.pos = param.pos;
        }

        vupd () {
          this.transOut = trans.steps(
            this.transIn.vtx,
            this.transIn.sz,
            this.transIn.rot,
            this.transIn.pos,
            cam.disp
          );
        }
      }

      class Build {
        constructor() {
          this.vel = 0.04;
          this.lim = 360;
          this.diff = 200;
          this.initPos = 100;
          this.toX = _x;
          this.toY = _y;
          this.canvas = canvas;
          this.$ = ctx;
          this.$.globalCompositeOperation = 'source-over';
          this.varr = [];
          this.dist = [];
          this.calc = [];

          for (let i = 0; i < num; i++) {
            this.add();
          }

          this.rotObj = { x: 0, y: 0, z: 0 };
          this.objSz = { x: w / 5, y: h / 5, z: w / 5 };

          // 保存实例引用，用于清理
          this.animationFrameId = null;
        }

        add () {
          this.varr.push(new ThreeD({
            vtx: { x: rnd(), y: rnd(), z: rnd() },
            sz: { x: 0, y: 0, z: 0 },
            rot: { x: 20, y: -20, z: 0 },
            pos: {
              x: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
              y: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
              z: this.diff * Math.sin(360 * Math.random() * Math.PI / 180)
            }
          }));

          this.calc.push({
            x: 360 * Math.random(),
            y: 360 * Math.random(),
            z: 360 * Math.random()
          });
        }

        upd () {
          cam.obj.x += (this.toX - cam.obj.x) * 0.05;
          cam.obj.y += (this.toY - cam.obj.y) * 0.05;
        }

        draw () {
          this.$.clearRect(0, 0, this.canvas.width, this.canvas.height);
          cam.upd();
          this.rotObj.x += 0.1;
          this.rotObj.y += 0.1;
          this.rotObj.z += 0.1;

          for (let i = 0; i < this.varr.length; i++) {
            for (let val in this.calc[i]) {
              if (this.calc[i].hasOwnProperty(val)) {
                this.calc[i][val] += this.vel;
                if (this.calc[i][val] > this.lim) this.calc[i][val] = 0;
              }
            }

            this.varr[i].transIn.pos = {
              x: this.diff * Math.cos(this.calc[i].x * Math.PI / 180),
              y: this.diff * Math.sin(this.calc[i].y * Math.PI / 180),
              z: this.diff * Math.sin(this.calc[i].z * Math.PI / 180)
            };

            this.varr[i].transIn.rot = this.rotObj;
            this.varr[i].transIn.sz = this.objSz;
            this.varr[i].vupd();

            if (this.varr[i].transOut.p < 0) continue;

            const g = this.$.createRadialGradient(
              this.varr[i].transOut.x,
              this.varr[i].transOut.y,
              this.varr[i].transOut.p,
              this.varr[i].transOut.x,
              this.varr[i].transOut.y,
              this.varr[i].transOut.p * 2
            );

            this.$.globalCompositeOperation = 'lighter';
            g.addColorStop(0, 'hsla(255, 255%, 255%, 1)');
            g.addColorStop(0.5, 'hsla(' + (i + 2) + ',85%, 40%,1)');
            g.addColorStop(1, 'hsla(' + (i) + ',85%, 40%,.5)');

            this.$.fillStyle = g;
            this.$.beginPath();
            this.$.arc(
              this.varr[i].transOut.x,
              this.varr[i].transOut.y,
              this.varr[i].transOut.p * 2,
              0,
              Math.PI * 2,
              false
            );

            this.$.fill();
            this.$.closePath();
          }
        }

        anim () {
          const animation = () => {
            this.upd();
            this.draw();
            this.animationFrameId = requestAnimationFrame(animation);
          };

          this.animationFrameId = requestAnimationFrame(animation);
        }

        run () {
          this.anim();

          // 鼠标移动事件
          this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.toX = (e.clientX - rect.left - this.canvas.width / 2) * -0.8;
            this.toY = (e.clientY - rect.top - this.canvas.height / 2) * 0.8;
          });

          // 鼠标点击事件
          this.canvas.addEventListener('mousedown', () => {
            for (let i = 0; i < 100; i++) {
              this.add();
            }
          });
        }

        destroy () {
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
          }
          this.varr = [];
          this.calc = [];
        }
      }
      this.particles = new Build();
      this.particles.run();
    },
  }
};
</script>
<style lang="scss" scoped>
@import './css/comon0.css';

// 确保字体可以正确加载
@font-face {
  font-family: 'electronicFont';
  src: url('./font/DS-DIGIT.TTF');
}

.sycm li .size+span {
  /* font-family: electronicFont; */
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 10px rgba(100, 180, 255, 0.5),
    0 0 15px rgba(70, 150, 255, 0.3);
  opacity: 1;
  font-size: clamp(0.4rem, 10vw, 0.5rem);
}


// 修复图片路径
.canvas {
  background-image: none; // 移除CSS中的相对路径图片引用
}

.head {
  background-image: url('./images/head_bg.png');
}

body {
  background-image: url('./images/bg.jpg');
}

.mainbox {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}


::v-deep .el-form {
  .bandWidthItem {
    label.el-form-item__label {
      line-height: clamp(32px, 6vh, 80px) !important;
      height: clamp(32px, 6vh, 80px) !important;
    }
  }

  .el-form-item {
    margin-bottom: clamp(10px, 2vw, 30px);
  }

  label.el-form-item__label {
    color: #05a6f6;
  }

  .el-form-item__label,
  .el-input__inner,
  .el-radio__label {
    font-size: clamp(0.14rem, 3vw, 0.16rem);
    height: clamp(32px, 6vh, 40px) !important;
    line-height: clamp(32px, 6vh, 40px) !important;
  }

  /* 修复输入框的特殊处理 */
  .el-input__inner {
    padding: 0 10px;
    box-sizing: border-box;
  }

  .subBtn {
    margin-top: clamp(10px, 2vw, 20px);
    width: clamp(120px, 50%, 280px);
    height: clamp(32px, 6vh, 40px);
    line-height: clamp(32px, 6vh, 40px);
    font-size: clamp(0.14rem, 3vw, 0.18rem);
    color: #fff;
    font-weight: bold;
    background-color: #0755AA;
    border: none;
    border-radius: .03125rem;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  /* 按钮悬停效果 */
  .subBtn:hover {
    background-color: #0862c2;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(7, 85, 170, 0.3);
  }

  /* 按钮点击效果 */
  .subBtn:active {
    // background-color: #06478c;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(7, 85, 170, 0.3);
    transition: all 0.1s ease;
  }

  padding: 30px;

  .el-input__inner,
  .el-textarea__inner {
    background: transparent;
    border: .01042rem solid #1479ad !important;
    color: #ffffff;
  }

  /* Placeholder颜色样式 */
  .el-input__inner::placeholder,
  .el-textarea__inner::placeholder {
    color: #fff !important;
  }

  /* 兼容不同浏览器 */
  .el-input__inner::-webkit-input-placeholder,
  .el-textarea__inner::-webkit-input-placeholder {
    color: #fff !important;
  }

  .el-input__inner:-moz-placeholder,
  .el-textarea__inner:-moz-placeholder {
    color: #fff !important;
    opacity: 1;
  }

  .el-input__inner::-moz-placeholder,
  .el-textarea__inner::-moz-placeholder {
    color: #fff !important;
    opacity: 1;
  }

  .el-input__inner:-ms-input-placeholder,
  .el-textarea__inner:-ms-input-placeholder {
    color: #fff !important;
  }

  .el-radio-group {

    .el-radio__input.is-checked+.el-radio__label {
      color: #0083ff !important;
    }

    .el-radio__inner {
      background: transparent;
      border: .01042rem solid #1479ad !important;

      &:after {
        background-color: #05a6f6 !important;
      }
    }
  }
}


::v-deep .el-pagination {
  .el-pager {
    li {
      &:hover {
        color: #05a6f6 !important;
      }

      &:active {
        color: #05a6f6 !important;
      }
    }
  }

  input {
    border-color: transparent !important;

    &:hover,
    &:active,
    &:focus {
      border-color: transparent !important;
    }
  }
}

::v-deep .el-table {
  th.el-table__cell>.cell {
    font-size: calc(.2rem + 0.1vw);
  }

  .el-table__header {
    tr {
      background: rgba(101, 132, 226, .1) !important;
    }
  }

  .el-table__body {
    .cell {
      font-size: calc(.1rem + 0.2vw);
    }
  }

  background: transparent !important;
  border: none !important;

  &__header-wrapper,
  &__body-wrapper,
  &__footer-wrapper {
    background: transparent !important;
  }

  tr {
    background: transparent !important;
  }

  th {
    background: transparent !important;
    border-color: transparent !important;
    color: inherit !important;
  }

  td {
    background: transparent !important;
    border-color: transparent !important;
    /* 这里保留td的内容颜色，不做透明处理 */
  }

  &__row {
    background: transparent !important;

    &:hover>td {
      background: rgba(255, 255, 255, 0.05) !important;
    }
  }

  &--enable-row-hover .el-table__body tr:hover>td {
    background: rgba(255, 255, 255, 0.05) !important;
  }
}

::v-deep .el-select-dropdown__item {
  background-color: red !important;
  color: #ffffff !important;
}

.title-shadow {
  color: #ffffff;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 10px rgba(100, 180, 255, 0.5),
    0 0 15px rgba(70, 150, 255, 0.3);
  background-clip: text;
  color: #fff;
  position: relative;
}

.labelTitle {
  font-size: .3rem;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 10px rgba(100, 180, 255, 0.5),
    0 0 15px rgba(70, 150, 255, 0.3);
}

.alltitle {
  font-weight: 600;
  font-family: 'Aldrich', sans-serif;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
    0 0 10px rgba(80, 150, 255, 0.5),
    0 0 15px rgba(50, 120, 240, 0.3);
  background: linear-gradient(to right, #93c5fd, #60a5fa, #93c5fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  &.migrate {
    background: linear-gradient(to right, #93c5fd, #60a5fa, #93c5fd);
    -webkit-background-clip: text;
    background-clip: text;
    font-size: clamp(0.2rem, 5vw, 0.4rem);
  }
}


.scrollDiv {
  height: 3rem;
  overflow: hidden;
  position: relative;
}

.scroll-wrapper {
  position: absolute;
  width: 100%;
  animation: scrollUp linear infinite;
  /* 这里的 duration 后面会根据列表高度动态设置 */
  animation-duration: var(--scroll-duration, 10s);
}

.smjl {
  margin: 0;
  padding: 0;
  list-style: none;
}

@keyframes scrollUp {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}
</style>


## 部署
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

## 移动端
```js
详情见 web.zip
```
##


