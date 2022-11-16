---
title: element-ui常用组件及问题
date: 2022-05-16
categories:
  - 前端

tags:
  -vue2
  - element-ui
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/45.jpg)

<!-- more -->

## 按需引入

```js
------------index.js---------
import { Select, Option } from "element-ui";
const element = {
  install: function (Vue) {
    Vue.use(Select);
    Vue.use(Option);
    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$notify = Notification;
  },
};
export default element;

-------main.js--------------
import xxx from "./index.js";
Vue.use(xxx);
Vue.use方法会触发install函数，函数参数传递Vue
封装的全局组件也可以如同使用
```

## el-table

<el-table></el-table>
| 属性 | 描述 |
| ---- | :--------: |
| :data=data | []数据绑定数组， |
| @selection-change="handleSelectionChange" | 多选框状态改变时触发回调函数 |
| border| 添加边框|
| :header-cell-style="{backgroundColor:'#DBECFF',color:'#000'}"|添加表头的 style|
|sortable|列添加排序功能|
|show-overflow-tooltip|添加单行显示超出省略号|
|prop,label|指定列的名称和显示数据的值|
|template slot-scope="scope"> |通常自定义结构用插槽|
|slice((currentPage-1)*pageSize,currentPage*pageSize)|表格分页效果指定 pagesize 和当前页数 currentPage|

### el-talbe 问题

```js
  <template>
  <div class="data-table">
    <el-table
      :ref="innerRef"
      v-loading="loading"
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :row-key="getRowKey"
      :header-cell-style="{backgroundColor:'#37464e',color:'#6d7f86',fontSize:'14px'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selection" type="selection" width="55" reserve-selection :selectable="selectInit" />
      <el-table-column v-if="showNo" label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <!-- 有分页时，序号显示 -->
          <span v-if="pageObj">{{ (currentPage - 1)*pageSize + scope.$index + 1 }}</span>
          <!-- 无分页时，序号显示 -->
          <span v-else>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="(col, index) in columns">
        <!-- 操作列/自定义列 -->
        <slot v-if="col.slot" :name="col.slot" />
        <!-- 普通列 -->
        <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :width="col.width" :sortable="col.sortable" :min-width="col.minWidth" :formatter="col.formatter" :show-overflow-tooltip="col.showOverflowTooltip?false:true" align="center" />
      </template>
    </el-table>
    <!-- 是否调用分页 -->
    <el-pagination v-if="pageObj" background layout="total,sizes, prev, pager, next, jumper" :page-sizes="[1,3,5,10]" :page-size="pageObj.size" :total="tableData.length" :current-page="pageObj.currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
export default {
  name: 'DataTable',
  props: {
    showNo: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: true
    },
    innerRef: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    pageObj: {
      type: Object,
      default: () => {}
    },
    handleSelectionChange: {
      type: Function,
      default: () => {}
    },
    getRowKey: {
      type: Function,
      default: (row) => row.id
    },
    selectInit: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.$emit('clearSelection')
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('clearSelection')
    }
  }
}


// 组件使用
<DataTable
  ref="myRef"
  :inner-ref="innerRef"
  :table-data="tableData"
  :loading="loading"
  :page-obj="pageObj"
  :handle-selection-change="handleSelectionChange"
  :columns="tableColumns"
  :get-row-key="row=>row.volumeId"
  :selection="false"
>
...
...
data(){
  return {
    tableColumns: [
        { slot: 'xxx' },
        { label: 'xxx', prop: 'xxx',
          formatter(row,column){
            //to do
          }
        },
  }
}

```

### 多选框清除

```js
    clearSelection() {
      this.$refs['myRef'].$refs[this.innerRef].clearSelection()
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
```

### 多选框执行两次

```js
<el-table row-key="getRowKey"></el-table>
<el-table-column type="selection" width="55" reserve-selection></el-table-column>
getRowKey(row)=>{return row.id}

传递getRowey方法: get-row-key="row=>row.id"

多选框列添加reserve-selection 保存上次结果，
getRowKey添加row的key值
```

## select联动框校验问题
```js
<template>
  <div>
    <el-form ref="otherForm" :model="otherForm" label-width="100px">
      <el-form-item
        v-for="(other, index) in otherForm.other"
        :key="index"
        :label="'类型' + index"
        :prop="'other.' + index + '.type'"
      >
        <el-select v-model="other.type" placeholder="请选择" @click.native="judgeDisabled(index)" @change="changeType(index, other.type)">
          <el-option
            v-for="item in typeList"
            :key="item.Id"
            :label="item.label"
            :value="item.Id"
            :disabled="item.disabled"
          />
        </el-select>
        <el-button @click.prevent="removeType(other)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addType">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      otherForm: {
        other: [
          {
            type: ''
          }
        ]
      },
      typeList: [
        {
          Id: 1,
          label: 'no1'
        },
        {
          Id: 2,
          label: 'no2'
        },
        {
          Id: 3,
          label: 'no3'
        },
        {
          Id: 4,
          label: 'no4'
        },
        {
          Id: 5,
          label: 'no5'
        },
        {
          Id: 6,
          label: 'no6'
        }
      ]
    }
  },
  methods: {
    // 删除
    removeType (item) {
      var index = this.otherForm.other.indexOf(item)
      if (index !== -1) {
        this.otherForm.other.splice(index, 1)
      }
      this.typeList.forEach(v => {
        if (v.Id === item.type && v.disabled) {
          v.disabled = false
        }
      })
    },
    // 新增
    addType () {
      if (this.otherForm.other.length < this.typeList.length) {
        this.otherForm.other.push({
          type: '',
          key: Date.now()
        })
      }
    },
    judgeDisabled (index) {
      this.typeList.push('1')
      this.typeList.pop()
      console.log(this.typeList)
      // 点击项目的index 但是每个项目的option都是相同的
      // 每次打开option的时候，添加禁用,需要获得已有的option从而两头判断
      const option = this.otherForm.other.map(item => item.type)
      // 根据当前的index 判断前后的key 重新绘制其作用范围
      const pre = option[index - 1]
      const next = option[index + 1]
      const preK = pre - 1
      const nextk = next - 1
      // 特殊校验 3、4 同类选一
      console.log(preK, 'indexK', nextk, 'indexk2')
      this.typeList.forEach((item, i) => {
        // 无后项直接根据前一项判断
        if (nextk == -1) {
          if (i <= preK) {
            this.typeList[i].disabled = true
            // console.log(item, i)
            // this.$nextTick(() => {
            //   item.disabled = true
            // })
          } else {
            this.typeList[i].disabled = false
          }
          // 有后项 nextk>-1
        } else {
          // 有前项
          if (preK > -1) {
            if (i >= nextk || i <= preK) {
              this.typeList[i].disabled = true
            } else {
              this.typeList[i].disabled = false
            }
            // 无前项
          } else {
            if (i >= nextk) {
              this.typeList[i].disabled = true
            } else {
              this.typeList[i].disabled = false
            }
          }
        }
      })
      for (let i = 0; i < this.otherForm.other.length; i++) {
        if (this.otherForm.other[i].type == 3 && i !== index) {
          this.typeList[3].disabled = true
        } else if (this.otherForm.other[i].type == 4 && i !== index) {
          this.typeList[2].disabled = true
        }
      }
    },
    changeType (index, Id) {
      console.log('changeType')
      this.typeList.forEach(v => {
        v.disabled = false
        for (var i = 0; i < this.otherForm.other.length; i++) {
          if (this.otherForm.other[i].type === v.Id) {
            console.log(this.otherForm.other[i].type, v, 'vvv')
            v.disabled = true
          }
        }
      })
    }
  }
}
</script>















======================================




<template>
  <div class="bucket-detail">
    <div class="bucket-detail-inner">
      <div class="bucket-panel">
        <div id="lifeCycle-info-field" class="param-box">
          <div class="param-hd">
            <h3 id="lifeCycle">生命周期规则</h3>
          </div>
          <div class="bucket-18-input-tips mt-10">
            注：可以配置规则用于定期沉降文件、删除文件和未上传完成的文件碎片。<br>
            <span style="margin-left: 2em">
              由于低频和归档存储类型的对象规格限制，沉降后的对象有最小规格限制，您的存储用量可能增加。
            </span>
          </div>
          <el-row class="operateMenu clearfix">
            <div class="left">
              <el-button
                type="info"
                :disabled="operateDisable"
                @click="visibleFlagInfo = true"
              >详情</el-button>
              <el-button type="info" :disabled="operateDisable" @click="modifyLiftcycle">编辑</el-button>
              <el-button
                type="danger"
                :disabled="operateDisable"
              >删除</el-button>
              <el-button
                type="success"
                @click="visibleFlagModify = true"
              >创建生命周期规则</el-button>
            </div>
            <div class="right">
              <el-button
                type="primary"
                @click="getBucketLifecycle"
              >刷新</el-button>
            </div>
          </el-row>
          <el-input
            v-model="searchName"
            class="searchIpt"
            clearable
            placeholder="按名称搜索生命周期规则"
          />
          <div class="param-bd">
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :data="tableSlicePage"
              border
              tooltip-effect="dark"
              style="width: 100%"
              :row-key="(row) => row.ID"
              highlight-current-row
              @current-change="handleRowChange"
            >
              <el-table-column label="" width="50" center>
                <template slot-scope="scope">
                  <el-radio
                    v-model="radio"
                    class="radio"
                    :label="scope.$index"
                    @change.native="getCurrentRow(scope)"
                  >&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <!-- <el-table-column type="selection" width="55" reserve-selection /> -->
              <el-table-column prop="ID" label="生命周期规则名称" sortable />
              <el-table-column prop="area" label="应用范围" sortable />
              <el-table-column prop="content" label="规则内容" sortable />
              <el-table-column prop="Status" label="状态" sortable>
                <template slot-scope="scope">
                  <span
                    :class="scope.row.Status === 'Enabled' ? 'green' : 'red'"
                  >
                    {{
                      scope.row.Status === "Enabled" ? "启用" : "未启用"
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="启用/禁用">
                <template slot-scope="scope">
                  <el-dropdown @command="handleStatus">
                    <el-button>
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        command="enable"
                        :class="
                          scope.row.Status === 'Enabled' ? 'forbidBtn' : ''
                        "
                      >启用规则</el-dropdown-item>
                      <el-dropdown-item
                        command="disable"
                        :class="
                          scope.row.Status === 'Enabled' ? '' : 'forbidBtn'
                        "
                      >停用规则</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[2, 10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="创建生命周期规则"
      width="850px"
      :visible.sync="visibleFlagModify"
      class="dialog"
      @open="clearForm()"
    >
      <!-- 生命周期配置规则 -->
      <h1 class="titleh1">生命周期配置规则</h1>
      <el-form ref="createForm" :model="createForm" :rules="rules">
        <el-form-item label="生命周期规则名称" prop="name">
          <el-input v-model="createForm.name" placeholder="输入规则名称" />
        </el-form-item>
        <el-form-item label="选择规则范围" class="ruleRange">
          <el-radio
            v-model="createForm.range"
            label="1"
          >使用一个或多个筛选条件限制此规则的范围
          </el-radio>
          <el-radio
            v-model="createForm.range"
            label="2"
          >应用到存储桶中的所有对象
          </el-radio>
        </el-form-item>
        <el-row v-if="createForm.range === '1'">
          <p class="normalText">筛选条件类型</p>
          <p class="tipText">
            您可以按前缀、对象标签、对象大小或者适合您的使用案例的任何组合来筛选对象。
          </p>
          <p class="normalText obstacleTop">前缀</p>
          <p class="tipText">
            添加筛选条件，以便将此规则的范围限制为单个前缀。
          </p>
          <el-form-item prop="prefixIpt">
            <el-input v-model="createForm.prefixIpt" placeholder="输入前缀" />
          </el-form-item>
          <p style="font-size: 16px">对象标签</p>
          <p class="tipText">您可以将此规则的范围限制为下面添加的键/值对。</p>
          <div v-if="createForm.tag.length > 0">
            <p class="objectLabelTitle">
              <span>键</span>
              <span>值-可选</span>
            </p>
            <div
              v-for="(item, i) in createForm.tag"
              :key="item.id"
              class="objectLabelTitle"
              style="width: 670px"
            >
              <el-form-item :prop="`tag.${i}.key`" :rules="rules.key">
                <el-input v-model="item.key" placeholder="键" />
              </el-form-item>
              <el-form-item prop="">
                <el-input
                  v-model="item.value"
                  placeholder="值"
                  class="obstacleRight"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
                  @click="createForm.tag.splice(i, 1)"
                >删除</el-button>
              </el-form-item>
            </div>
          </div>
          <el-button
            style="margin: 20px 0"
            type="primary"
            @click="addLabel"
          >添加标签</el-button>
          <p v-if="showPrefixRule && clickSubmit" class="errorTip">
            限制规则范围时，您必须指定一个前缀或另一个筛选条件。
          </p>
          <p class="normalText">对象大小</p>
          <p class="tipText">
            您可以根据对象的大小来限制此规则应用到对象的范围。例如，您可以筛选掉由于按对象收费而导致转换到
            Glacier Flexible Retrieval (以前称为
            Glacier)可能不具有成本效益的对象。
          </p>
          <el-checkbox-group v-model="objectSize" class="obstacleTop">
            <el-checkbox label="min">指定最小对象大小</el-checkbox>
            <div v-if="objectSize.includes('min')" class="obstacleTop">
              <p style="font-size: 16px">最小对象大小</p>
              <p class="tipText">筛选条件将允许大于输入值的对象。</p>
              <el-form-item prop="minSizeIpt">
                <el-input
                  v-model="createForm.minSizeIpt"
                  placeholder="输入值"
                  class="obstacleRight"
                  style="width: 320px"
                />
                <el-select
                  v-model="minSizeSelect"
                  placeholder="请选择"
                  clearable
                  @change="validateIpt('createForm')"
                >
                  <el-option
                    v-for="item in sizeSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left: 20px">{{ minSizeIptBytes }}</span>
                <!-- <p>该整数值必须大于 {{(createForm.minSizeIpt||1)+minSizeSelect}}</p> -->
              </el-form-item>
            </div>
            <el-checkbox label="max">指定最大对象大小</el-checkbox>
            <div v-if="objectSize.includes('max')" class="obstacleTop">
              <p style="font-size: 16px">最大对象大小</p>
              <p class="tipText">筛选条件将允许小于输入值的对象。</p>
              <el-form-item prop="maxSizeIpt">
                <el-input
                  v-model="createForm.maxSizeIpt"
                  placeholder="输入值"
                  class="obstacleRight"
                  style="width: 320px"
                />
                <el-select
                  v-model="maxSizeSelect"
                  placeholder="请选择"
                  clearable
                  @change="validateIpt('createForm')"
                >
                  <el-option
                    v-for="item in sizeSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left: 20px">{{ maxSizeIptBytes }}</span>
                <p>
                  <i class="el-icon-warning-outline" />
                  该整数值必须大于
                  {{ (createForm.minSizeIpt || 1) + minSizeSelect }}
                </p>
              </el-form-item>
            </div>
          </el-checkbox-group>
          <!-- 生命周期配置规则 -->
        </el-row>
        <h1 class="titleh1">生命周期规则操作</h1>
        <el-checkbox-group v-model="ruleOperate" class="obstacleTop">
          <el-checkbox label="r1">在存储类之间移动对象的当前版本</el-checkbox>
          <el-checkbox label="r2">在存储类之间移动对象的非当前版本</el-checkbox>
          <el-checkbox label="r3">将对象的当前版本设为过期</el-checkbox>
          <el-checkbox label="r4">永久删除对象的非当前版本</el-checkbox>
          <el-checkbox
            label="r5"
            :disabled="disableDelExpiredRule"
          >删除过期的对象删除标记或未完成的分段上传
          </el-checkbox>
        </el-checkbox-group>
        <div style="font-size: 12px; margin: -18px 0 20px 25px; color: #687078">
          按对象标签或对象大小进行筛选时，不支持这些操作。
        </div>

        <!-- 在存储类之间移动对象的当前版本 -->
        <div v-if="ruleOperate.includes('r1')" class="obstacleTop">
          <h1 class="titleh1">在存储类之间移动对象的当前版本</h1>
          <div v-if="createForm.Transition.length > 0">
            <p class="objectLabelTitle" style="width:590px">
              <span>选择存储类转换</span>
              <span style="margin-left:200px">创建对象以来的天数</span>
            </p>
            <div
              v-for="(item, i) in createForm.Transition"
              :key="item.key"
              class="objectLabelTitle"
              style="width: 100%;"
            >
              <el-form-item style="margin-right:50px" :prop="`Transition.${i}.key`" :rules="rules.validateMinObjSizeLimit">
                <el-select
                  v-model="item.key"
                  :popper-append-to-body="false"
                  clearable
                  class="ruleSelect"
                  style="width:350px;"
                  @change="showTransitionRule('currentVer')"
                  @click.native="judgeDisabled(i,'currentVer')"
                >
                  <el-option
                    v-for="type in storageTransition"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                    :disabled="type.disabled"
                  >
                    <span>{{ type.label }}</span>
                    <span>{{ type.tip }}</span>
                    <span>{{ type.day }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :prop="`Transition.${i}.value`" :rules="rules.objTransferDay">
                <el-input
                  v-model="item.value"
                  placeholder="天数"
                  class="obstacleRight"
                />
              </el-form-item>
              <el-form-item style="margin-top:30px">
                <el-button
                  type="danger"
                  @click="delTransition(i,'currentVer')"
                >删除</el-button>
              </el-form-item>
            </div>
            <el-button :disabled="disableAddTransform" @click="addTransitionType('currentVer')">添加转换</el-button>
          </div>
        </div>

        <!-- 在存储类之间移动对象的非当前版本 -->
        <div v-if="ruleOperate.includes('r2')" class="obstacleTop">
          <h1 class="titleh1">在存储类之间移动对象的非当前版本</h1>
          <div v-if="createForm.TransitionNC.length > 0">
            <p class="objectLabelTitle" style="width:700px">
              <span>选择存储类转换</span>
              <span style="margin-left:80px">对象变为非当前对象以来的天数</span>
              <span>要保留的较新版本的数量 – 可选</span>
            </p>
            <div
              v-for="(item, i) in createForm.TransitionNC"
              :key="item.key"
              class="objectLabelTitle"
              style="width: 800px"
            >
              <el-form-item :prop="`TransitionNC.${i}.key`" :rules="rules.validateMinObjSizeNCLimit">
                <el-select
                  v-model="item.key"
                  :popper-append-to-body="false"
                  clearable
                  class="ruleSelect"
                  @change="showTransitionRule('notCurrentVer')"
                  @click.native="judgeDisabled(i,'notCurrentVer')"
                >
                  <el-option
                    v-for="type in storageTransition"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                    :disabled="type.disabled"
                  >
                    <span>{{ type.label }}</span>
                    <span>{{ type.tip }}</span>
                    <span>{{ type.day }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :prop="`TransitionNC.${i}.value`" :rules="rules.objTransferDayNC">
                <el-input
                  v-model="item.value"
                  placeholder="天数"
                  class="obstacleRight"
                />
              </el-form-item>
              <el-form-item :prop="`TransitionNC.${i}.ver`" :rules="rules.objTransferVerNC">
                <el-input
                  v-model="item.ver"
                  placeholder="版本数"
                  class="obstacleRight"
                />
                <p style="width:250px;line-height:16px;color:rgb(104, 112, 120);font-size:12px">最高可以是 100 版本。 所有其他非当前版本都将被移动。</p>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
                  @click="delTransition(i,'notCurrentVer')"
                >删除</el-button>
              </el-form-item>
            </div>
            <el-button :disabled="disableAddTransformNC" @click="addTransitionType('notCurrentVer')">添加转换</el-button>
          </div>
        </div>

        <!-- r2 end -->

        <div v-if="ruleOperate.includes('r3')" class="obstacleTop">
          <h1 class="titleh1">将对象的当前版本设为过期</h1>
          <el-form-item label="创建对象以来的天数" prop="Expiration">
            <el-input
              v-model="createForm.Expiration"
              style="width: 520px"
              placeholder="输入天数"
            />
          </el-form-item>
        </div>
        <!-- 永久删除对象 -->
        <div v-if="ruleOperate.includes('r4')" class="obstacleTop">
          <h1 class="titleh1">永久删除对象的非当前版本</h1>
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item
                label="对象变为非当前对象以来的天数"
                prop="noncurrentDays"
              >
                <el-input
                  v-model="createForm.noncurrentDays"
                  placeholder="输入天数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="要保留的较新版本的数量 – 可选"
                prop="NewerNoncurrentVersions"
              >
                <el-input
                  v-model="createForm.NewerNoncurrentVersions"
                  placeholder="版本数"
                />
                <p class="tipText">
                  最高可以是 100 版本。 所有其他非当前版本都将被移动。
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 删除过期的对象 -->
        <div v-if="ruleOperate.includes('r5')" class="obstacleTop">
          <h1 class="titleh1">删除过期的对象删除标记或未完成的分段上传</h1>
          <p class="normalText">过期的对象删除标记</p>
          <p class="tipText">
            此操作将删除过期的对象删除标记，并可能提高性能。如果在删除某个启用了版本控制的对象后，该对象所有的非当前版本过期，则将删除过期的对象删除标记。选中“将对象的当前版本设为过期”时，此操作不可用。
          </p>
          <el-checkbox
            v-model="createForm.AbortIncompleteMultipartUpload.deleteExpired"
            class="obstacleTop"
            :disabled="ruleOperate.includes('r3')"
          >删除过期的对象删除标记</el-checkbox>
          <p v-if="ruleOperate.includes('r3')" style="margin: -15px 0 20px 0">
            <i
              class="el-icon-warning-outline"
            >如果启用将当前的对象版本设为过期，则无法启用删除过期的对象删除标记。</i>
          </p>
          <p class="normalText">未完成的分段上传</p>
          <p class="tipText">
            此操作将停止所有未完成的分段上传并删除与分段上传相关的分段。了解更多
          </p>
          <el-checkbox
            v-model="createForm.AbortIncompleteMultipartUpload.deleteUncompleted"
            class="obstacleTop"
          >删除未完成的分段上传</el-checkbox>
          <div v-if="createForm.AbortIncompleteMultipartUpload.deleteUncompleted">
            <el-form-item label="天数" prop="AbortIncompleteMultipartUpload.deleteUncompletedDay" :rules="rules.deleteUncompleted">
              <el-input
                v-model="createForm.AbortIncompleteMultipartUpload.deleteUncompletedDay"
                style="width: 520px"
              />
              <p class="tipText">该整数值必须大于0。</p>
            </el-form-item>
          </div>
        </div>
        <!-- 审查转换和过期操作 创建修改 -->
        <h1 class="titleh1">审查转换和过期操作</h1>
        <div class="configList">
          <div class="currentVersion">
            <h3 class="title">当前版本操作</h3>
            第 0 天
            <p>
              <span v-if="!selectConfig.Expiration">没有定义任何操作。</span>
              <span v-else>已上传对象</span>
            </p>
            <!-- 将对象的当前版本设为过期 -->

            <div v-if="ruleOperate.includes('r1')">
              <div v-for="(item,i) in createForm.Transition" :key="item.key">
                <p class="fa fa-arrow-down" />
                <p>第{{ item.value }}天</p>
                <p><span>对象移动到&nbsp;&nbsp;{{ RuleMap[item.key] }}</span></p>
              </div>
            </div>
            <div v-if="ruleOperate.includes('r3')">
              <p class="fa fa-arrow-down" />
              <p>第{{ createForm.Expiration }}天</p>
              <p><span>对象过期时间</span></p>
            </div>
          </div>
          <div class="notCurrentVersion">
            <h3 class="title">非当前版本操作</h3>
            第 0 天
            <p><span>对象变为非当前对象</span></p>
            <!-- 永久删除对象的非当前版本 option4-->

            <div v-if="ruleOperate.includes('r2')">
              <div v-for="(item,i) in createForm.TransitionNC" :key="item.key">
                <p class="fa fa-arrow-down" />
                <p>第{{ item.value }}天</p>
                <p><span>保留 {{ item.ver }} 个最新的非当前版本</span></p>
                <p><span>所有其他非当前版本都将移动到&nbsp;&nbsp;{{ RuleMap[item.key] }}</span></p>
              </div>
            </div>

            <div v-if="ruleOperate.includes('r4')">
              <p class="fa fa-arrow-down" />
              <p>第{{ createForm.noncurrentDays || "-" }}天</p>
              <p>
                <span>保留{{
                  createForm.NewerNoncurrentVersions
                }}个最新的非当前版本</span>
              </p>
              <p><span>所有其他非当前版本都将被永久删除</span></p>
            </div>
          </div>
          <span class="border" />
        </div>
        <p v-if="validRuleOption" style="color: #f56c6c">
          <i class="el-icon-circle-close" />
          需要为规则定义至少一个转换或过期操作。
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleFlagModify = false">{{
          $trans("button.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitCreate">创建规则</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      title="生命周期配置规则"
      :visible.sync="visibleFlagInfo"
      class="infoDialog"
      width="1200px"
    >
      <h3 class="titleh1">生命周期配置规则</h3>
      <div class="configList">
        <p>
          生命周期规则名称 <span>{{ selectConfig.ID }}</span>
        </p>
        <p>
          前缀 <span>{{ selectConfig.Filter.And.Prefix || "-" }}</span>
          <span class="border bL" />
          <span class="border bR" />
        </p>
        <p>
          最小对象大小<span>{{
            byteConvert(selectConfig.Filter.And.ObjectSizeGreaterThan) || "-"
          }}</span>
        </p>
        <p>
          状态
          <span
            :style="{
              color: selectConfig.Status === 'Enabled' ? 'green' : 'red',
            }"
          >{{ selectConfig.Status === "Enabled" ? "已启用" : "未启用" }}</span>
        </p>
        <p>
          对象标签<span style="word-break: break-word">{{
            concatKVarray
          }}</span>
        </p>
        <p>
          最大对象大小<span>{{
            byteConvert(selectConfig.Filter.And.ObjectSizeLessThan) || "-"
          }}</span>
        </p>
        <p>
          范围<span>{{ selectRange }}</span>
        </p>
      </div>
      <h3 class="titleh1">审查转换和过期操作</h3>
      <div class="configList" style="margin-right: 250px">
        <div class="currentVersion">
          <h3 class="title">当前版本操作</h3>
          第 0 天
          <p>
            <span v-if="!selectConfig.Expiration">没有定义任何操作。</span>
            <span v-else>已上传对象</span>
          </p>
          <div v-if="selectConfig.Expiration">
            <p class="fa fa-arrow-down" />
            <p>
              第{{
                (selectConfig.Expiration && selectConfig.Expiration.Days) ||
                  "-"
              }}天
            </p>
            <p><span>对象过期时间</span></p>
          </div>
        </div>
        <div class="notCurrentVersion">
          <h3 class="title">非当前版本操作</h3>
          第 0 天
          <p><span>对象变为非当前对象</span></p>
          <p class="fa fa-arrow-down" />
          <p>
            第{{
              selectConfig.NoncurrentVersionExpiration.NoncurrentDays || "-"
            }}天
          </p>
          <p>
            <span>保留{{
              selectConfig.NoncurrentVersionExpiration
                .NewerNoncurrentVersions
            }}个最新的非当前版本</span>
          </p>
          <p><span>所有其他非当前版本都将被永久删除</span></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BucketLifeCycle',
  data () {
    // const RuleKeyMap = {
    //   1: 'STANDARD_IA',
    //   2: 'INTELLIGENT_TIERING',
    //   3: 'ONEZONE_IA',
    //   4: 'GLACIER_IR',
    //   5: 'GLACIER',
    //   6: 'DEEP_ARCHIVE'
    // }
    // 数字 输出关系表对应的value
    //   var t = res.map(item => {
    //   return {
    //     value: item.value,
    //     id: RuleMap[item.id]
    //   }
    // })
    // 校验当前版本转换对象的天数
    const validateObjTransferDay = (rule, data, callback) => {
      const index = rule.field.match(/\d/)[0]
      // 判断非纯数字及空值
      data = isNaN(Number(data)) ? -1 : data === '' ? -1 : Number(data)
      const trans = this.createForm.Transition
      const currentkey = trans[index].key // 当前编辑天数的存储类型
      const preKey = index > 0 ? Number(trans[index - 1].key) : 0 // 当前类型
      const preData = index > 0 ? Number(trans[index - 1].value) : '' // 当前类型对应的值

      //  需要判断前一项的key 判断其类型 再动态比较其大小
      // console.log(data, preKey, preData)
      if (currentkey == 1) {
        // 遵循一个规则大于30
        if (data < 30) {
          return callback('至少需要 30 天才能转换到 标准 – IA。')
        }
      }

      // 智能分层
      if (currentkey == 2) {
        if (preKey == 1 && data - preData < 30) {
          return callback('智能分层 的整数值必须至少比 标准 – IA 的值大 30。')
        } else if (!preKey) {
          if (data < 0) {
            return callback('必须提供有效的整数值。')
          } else {
            return callback()
          }
        }
      }
      // 单区  case 1
      if (currentkey == 3) {
        if (preKey == 2 && data - preData < 30) {
          return callback('单区 – IA 的整数值必须至少比 智能分层 的值大 30。')
        } else if (preKey == 1 && data - preData < 30) {
          // case 2
          return callback('单区 – IA 的整数值必须至少比 标准 – IA 的值大 30。')
        } else if (!preKey) {
          // case 3
          if (data > 30) {
            return callback()
          } else {
            return callback('至少需要 30 天才能转换到 单区 – IA。')
          }
        }
      }

      // GIR

      if (currentkey == 4) {
        if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Instant Retrieval 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Instant Retrieval 的整数值必须至少比 标准 – IA 的值大 30'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }

      // GFR
      if (currentkey == 5) {
        if (preKey == 4 && data - preData < 90) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 Glacier Instant Retrieval 的值大 90。'
          )
        } else if (preKey == 3 && data - preData < 30) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 单区 – IA 的值大 30。'
          )
        } else if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 标准 – IA 的值大 30。'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }

      // GDA
      if (currentkey == 6) {
        if (preKey == 5 && data - preData < 90) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 Glacier Flexible Retrieval (以前称为 Glacier) 的值大 90。'
          )
        } else if (preKey == 4 && data - preData < 90) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 Glacier Instant Retrieval 的值大 90。'
          )
        } else if (preKey == 3 && data - preData < 30) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 单区 – IA 的值大 30。'
          )
        } else if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 标准 – IA 的值大 30。'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }
      callback()
      // end
    }

    // 校验非当前版本转换对象的天数
    const validateObjTransferDayNC = (rule, data, callback) => {
      const index = rule.field.match(/\d/)[0]
      data = isNaN(Number(data)) ? -1 : data === '' ? -1 : Number(data)
      const trans = this.createForm.TransitionNC
      const currentkey = trans[index].key // 当前编辑天数的存储类型
      const preKey = index > 0 ? Number(trans[index - 1].key) : 0 // 当前类型
      const preData = index > 0 ? Number(trans[index - 1].value) : '' // 当前类型对应的值

      //  需要判断前一项的key 判断其类型 再动态比较其大小
      // console.log(data, preKey, preData)
      if (currentkey == 1) {
        // 遵循一个规则大于30
        if (data < 30) {
          return callback('至少需要 30 天才能转换到 标准 – IA。')
        }
      }

      // 智能分层
      if (currentkey == 2) {
        if (preKey == 1 && data - preData < 30) {
          return callback('智能分层 的整数值必须至少比 标准 – IA 的值大 30。')
        } else if (!preKey) {
          if (data < 0) {
            return callback('必须提供有效的整数值。')
          } else {
            return callback()
          }
        }
      }
      // 单区  case 1
      if (currentkey == 3) {
        if (preKey == 2 && data - preData < 30) {
          return callback('单区 – IA 的整数值必须至少比 智能分层 的值大 30。')
        } else if (preKey == 1 && data - preData < 30) {
          // case 2
          return callback('单区 – IA 的整数值必须至少比 标准 – IA 的值大 30。')
        } else if (!preKey) {
          // case 3
          if (data > 30) {
            return callback()
          } else {
            return callback('至少需要 30 天才能转换到 单区 – IA。')
          }
        }
      }

      // GIR

      if (currentkey == 4) {
        if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Instant Retrieval 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Instant Retrieval 的整数值必须至少比 标准 – IA 的值大 30'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }

      // GFR
      if (currentkey == 5) {
        if (preKey == 4 && data - preData < 90) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 Glacier Instant Retrieval 的值大 90。'
          )
        } else if (preKey == 3 && data - preData < 30) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 单区 – IA 的值大 30。'
          )
        } else if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Flexible Retrieval (以前称为 Glacier) 的整数值必须至少比 标准 – IA 的值大 30。'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }

      // GDA
      if (currentkey == 6) {
        if (preKey == 5 && data - preData < 90) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 Glacier Flexible Retrieval (以前称为 Glacier) 的值大 90。'
          )
        } else if (preKey == 4 && data - preData < 90) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 Glacier Instant Retrieval 的值大 90。'
          )
        } else if (preKey == 3 && data - preData < 30) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 单区 – IA 的值大 30。'
          )
        } else if (preKey == 2 && data < preData) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 智能分层 的值大 0。'
          )
        } else if (preKey == 1 && data - preData < 30) {
          return callback(
            'Glacier Deep Archive 的整数值必须至少比 标准 – IA 的值大 30。'
          )
        } else if (!preKey) {
          if (data >= 0) {
            return callback()
          } else {
            return callback('必须提供有效的整数值。')
          }
        }
      }
      callback()
      // end
    }

    // 校验非当前版本版本数
    const validateNCVerDay = (rule, data, callback) => {
      const index = rule.field.match(/\d/)[0]
      const arr = this.createForm.TransitionNC
      // 每项都可选、基于上一项的合法的值进行比较、递归去找前一项的ver
      function preValidVer (i) {
        const preIndex = i > 0 ? i - 1 : 0
        const pre = arr[preIndex].ver
        if (pre === '' && i !== 0) {
          return preValidVer(preIndex)
        } else {
          return pre
        }
      }
      let preVer
      if (index == 0) {
        preVer = 0
      } else {
        preVer = preValidVer(index)
      }
      const transData = isNaN(Number(data)) ? -1 : Number(data)
      // 当前data为空，则无需校验
      if (transData == -1) {
        return callback('输入正整数')
      }
      if (transData > 100) {
        return callback('最高可以是 100 版本。')
      }
      // 0 校验
      if (data !== '' && transData < preVer) {
        return callback(`该整数值必须大于或等于${preVer} 。`)
      }
      callback()
      // 当前的版本数 规则大于等于前一项
    }
    // 校验对象最小大小
    const validateMinIpt = (rule, data, callback) => {
      const reg = /^[\d]*$/
      if (!reg.test(data)) {
        return callback('请输入正整数')
      } else {
        this.$refs['createForm'].clearValidate('minSizeIpt')
        this.$refs['createForm'].clearValidate('maxSizeIpt')
        if (!this.createForm.maxSizeIpt || !data) return
        if (
          this.covertByte(data, this.minSizeSelect) -
            this.covertByte(this.createForm.maxSizeIpt, this.maxSizeSelect) >
            0 &&
          this.objectSize.includes('max')
        ) {
          return callback(new Error('最小对象大小必须小于最大对象大小。'))
        } else {
          callback()
        }
      }
    }
    // 校验对象最大大小
    const validateMaxIpt = (rule, data, callback) => {
      const reg = /^[\d]*$/
      if (!reg.test(data) || Number(data) === 0) {
        return callback('请输入正整数')
      } else {
        this.$refs['createForm'].validateField('minSizeIpt')
        if (!this.createForm.minSizeIpt || !data) return
        if (
          this.covertByte(this.createForm.minSizeIpt, this.minSizeSelect) -
            this.covertByte(data, this.maxSizeSelect) >=
            0 &&
          this.objectSize.includes('min')
        ) {
          return callback(new Error('最大对象大小必须大于最小对象大小。'))
        } else {
          callback()
        }
      }
    }
    const validateNewerNoncurrentVersions = (rule, data, callback) => {
      // 如若选择非版本对象转换，则需要再校验大于最高项的版本数
      const len = this.createForm.TransitionNC.length
      const lastVer = len
        ? this.createForm.TransitionNC.map(item => item.ver).sort(
          (a, b) => b - a
        )[0]
        : 0
      data = isNaN(Number(data)) ? -1 : Number(data)
      if (data > 100) {
        return callback('必须小于或等于100')
      } else if (data < lastVer) {
        return callback(`该整数值必须大于或等于${lastVer}`)
      } else {
        callback()
      }
    }
    // 校验永久删除对象的非当前版本
    const validateNCDay = (rule, data, callback) => {
      const len = this.createForm.TransitionNC.length
      const lastDay = len
        ? Number(this.createForm.TransitionNC[len - 1].value)
        : 0
      data = isNaN(Number(data)) ? -1 : Number(data)
      if (data <= lastDay) {
        return callback(`该整数值必须大于${lastDay}`)
      } else {
        callback()
      }
    }
    const checkPositiveNumber = (rule, data, callback) => {
      data = isNaN(Number(data)) ? 0 : Number(data)
      if (!data || data < 0) {
        return callback('请填入正整数')
      } else {
        return callback()
      }
    }

    // 将对象的当前版本设为过期
    const checkValueTransition = (rule, data, callback) => {
      const len = this.createForm.Transition.length
      const lastValue = len
        ? Number(this.createForm.Transition[len - 1].value)
        : 0
      data = isNaN(Number(data)) ? -1 : Number(data)
      if (data <= lastValue) {
        return callback(`该整数值必须大于 ${lastValue}`)
      } else {
        callback()
      }
    }
    // validateMinObjSizeSelectLimit
    const validateMinObjSizeSelectLimit = (rule, data, callback) => {
      const name = this.RuleMap[data]
      if (this.minSizeTransLimit && data < 5) {
        return callback(
          `已定义的对象大小筛选条件小于转换到 ${name}的对象的最小大小。请更改对象大小筛选条件或使用其他存储类。`
        )
      } else {
        callback()
      }
    }

    const validateMinObjSizeSelectNCLimit = (rule, data, callback) => {
      const name = this.RuleMap[data]
      if (this.minSizeTransLimit && data < 5) {
        return callback(
          `已定义的对象大小筛选条件小于转换到 ${name}的对象的最小大小。请更改对象大小筛选条件或使用其他存储类。`
        )
      } else {
        callback()
      }
    }
    return {
      RuleMap: {
        1: '标准 – IA',
        2: '智能分层',
        3: '单区 – IA',
        4: 'Glacier Instant Retrieval',
        5: '对象移动到 Glacier Flexible Retrieval (以前称为 Glacier)',
        6: 'Glacier Deep Archive'
      },
      showPrefixRule: false,
      clickSubmit: false,
      loading: true,
      tableData: [],
      searchName: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      OPERATETYPE: '',
      multipleSelection: [],
      disableBtn: false,
      radio: '',
      currentRow: null,
      visibleFlagModify: true,
      visibleFlagInfo: false,
      createForm: {
        name: '',
        prefixIpt: '',
        range: '1',
        tag: [],
        minSizeIpt: '',
        maxSizeIpt: '',
        NewerNoncurrentVersions: '', // 要保留的较新版本的数量
        Transition: [], // 在存储类之间转移对象的当前版本
        TransitionNC: [], // 在存储类之间转移对象的当前版本
        NoncurrentVersionTransition: [], // 在存储类之间移动对象的非当前版本
        Expiration: '', // 将对象的当前版本设为过期 -- 创建对象以来的天数
        NoncurrentVersionExpiration: {
          NoncurrentDays: '', // 对象变为非当前对象以来的天数
          NewerNoncurrentVersions: ''
        },
        AbortIncompleteMultipartUpload: {
          deleteExpired: false,
          deleteUncompleted: false,
          deleteUncompletedDay: ''
        }
      },
      objectSize: [],
      sizeSelect: [
        { label: '字节', value: 'byte' },
        { label: 'KB', value: 'KB' },
        { label: 'MB', value: 'MB' },
        { label: 'GB', value: 'GB' }
      ],
      minSizeSelect: 'KB',
      maxSizeSelect: 'KB',
      // 规则操作
      ruleOperate: [],
      storageTransition: [
        {
          label: '标准-IA',
          value: 1,
          tip: '支持毫秒级访问的不经常访问的数据(每月一次)',
          day: '30 天 天最短存储时间'
        },
        {
          label: '智能分层',
          value: 2,
          tip: '访问模式发生变化或未知的数据',
          day: '无最短存储持续时间'
        },
        {
          label: '单区-IA',
          value: 3,
          tip:
            '存储在支持毫秒级访问的单个可用区中的可重新创建且不经常访问的数据(每月一次)',
          day: '30 天 天最短存储时间'
        },
        {
          label: 'Glacier Instant Retrieval',
          value: 4,
          tip: '支持几毫秒级即时检索、长期保存且每季度访问一次的归档数据',
          day: '90 天 天最短存储时间'
        },
        {
          label: 'Glacier Flexible Retrieval',
          value: 5,
          tip: '检索时间为几分钟到几小时、长期保存且每年访问一次的归档数据',
          day: '90 天 天最短存储时间'
        },
        {
          label: 'Glacier Deep Archive',
          value: 6,
          tip: '检索时间为几个小时、长期保存且每年访问少于一次的归档数据',
          day: '180 天 天最短存储时间'
        }
      ],
      selectConfig: {
        Filter: { And: { Tags: [] }},
        ID: '',
        Status: '',
        NoncurrentVersionExpiration: {},
        NoncurrentVersionTransitions: []
      },

      rules: {
        name: [
          {
            required: true,
            message: '生命周期规则名称为必填项',
            trigger: 'change'
          },
          { max: 255, message: '最多255字符', trigger: 'change' }
        ],
        prefixIpt: [
          {
            required: true,
            message: '限制规则范围时，您必须指定一个前缀或另一个筛选条件。',
            trigger: 'change'
          }
        ],
        key: [
          { required: true, message: '键名必填', trigger: ['blur', 'change'] }
        ],
        minSizeIpt: [
          {
            validator: validateMinIpt,
            trigger: 'change'
          }
        ],
        maxSizeIpt: [
          {
            validator: validateMaxIpt,
            trigger: 'change'
          }
        ],
        NewerNoncurrentVersions: [
          {
            validator: validateNewerNoncurrentVersions,
            trigger: ['blur', 'change']
          }
        ],
        noncurrentDays: [
          {
            required: true,
            message: '所选操作需要设置过期时间。请输入值或取消选择该操作。',
            trigger: ['blur', 'change']
          },
          {
            validator: validateNCDay,
            trigeer: ['blur', 'change']
          }
        ],
        Expiration: [
          {
            required: true,
            message: '所选操作需要设置过期时间。请输入值或取消选择该操作。',
            trigger: ['blur', 'change']
          },
          {
            validator: checkPositiveNumber,
            trigger: ['blur', 'change']
          },
          {
            validator: checkValueTransition,
            trigger: ['blur', 'change']
          }
        ],
        objTransferDay: [
          { validator: validateObjTransferDay, trigger: ['blur', 'change'] }
        ],
        objTransferDayNC: [
          { validator: validateObjTransferDayNC, trigger: ['blur', 'change'] }
        ],
        objTransferVerNC: [
          { validator: validateNCVerDay, trigger: ['blur', 'change'] }
        ],
        deleteUncompleted: [
          {
            required: true,
            message: '请填入正整数',
            trigger: ['change', 'blur']
          },
          {
            validator: checkPositiveNumber,
            trigger: ['change', 'blur']
          }
        ],
        validateMinObjSizeLimit: [
          {
            validator: validateMinObjSizeSelectLimit,
            trigger: ['change', 'blur']
          }
        ],
        validateMinObjSizeNCLimit: [
          {
            validator: validateMinObjSizeSelectNCLimit,
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    tableSlicePage () {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    operateDisable () {
      return typeof this.radio !== 'number'
    },
    concatKVarray () {
      var str = ''
      if (
        this.selectConfig.Filter.And.Tags &&
        this.selectConfig.Filter.And.Tags.length
      ) {
        var arr =
          this.selectConfig.Filter.And.Tags && this.selectConfig.Filter.And.Tags
        for (const i of arr) {
          str += ' ' + i.Key + ': ' + i.Value + ', '
        }
      }
      return str || '-'
    },
    selectRange () {
      return Object.keys(this.selectConfig.Filter.And).length
        ? '已筛选'
        : '整个存储桶'
    },
    maxSizeIptBytes () {
      return (
        this.precisionNum(
          this.covertByte(this.createForm.maxSizeIpt, this.maxSizeSelect)
        ) + 'bytes'
      )
    },
    minSizeIptBytes () {
      return (
        this.precisionNum(
          this.covertByte(this.createForm.minSizeIpt, this.minSizeSelect)
        ) + 'bytes'
      )
    },
    minSizeTransLimit () {
      if (
        (this.createForm.minSizeIpt !== '' &&
          this.createForm.minSizeIpt >= 0 &&
          this.covertByte(this.createForm.minSizeIpt, this.minSizeSelect) <
            131072) ||
        (this.createForm.maxSizeIpt &&
          this.covertByte(this.createForm.maxSizeIpt, this.maxSizeSelect) <=
            131072)
      ) {
        return true
      } else {
        return false
      }
    },
    // 添加转换 禁用
    disableAddTransform () {
      const len = this.createForm.Transition.length
      return (
        len == 5 ||
        this.createForm.Transition[len - 1].key == 6 ||
        this.minSizeTransLimit
      )
    },
    // disableAddTransformNC
    disableAddTransformNC () {
      const len = this.createForm.TransitionNC.length
      return (
        len == 5 ||
        this.createForm.TransitionNC[len - 1].key == 6 ||
        this.minSizeTransLimit
      )
    },
    // 对象标签或对象大小进行筛选时 禁用删除过期rule rule5
    disableDelExpiredRule () {
      const objectLabel = this.createForm.tag.length
      const objectSize =
        (this.objectSize.includes('min') && this.createForm.minSizeIpt) ||
        (this.objectSize.includes('max') && this.createForm.maxSizeIpt)
      const flag = !!(objectLabel || objectSize)
      if (flag) {
        // 清空已勾选的删除过期配置和显示的配置内容
        this.clearDelItem()
        return true
      } else {
        return false
      }
    },
    // 规则定义至少一个转换或过期操作
    validRuleOption () {
      // 勾选r5 必须选择其中一个
      const r5check1 = this.createForm.AbortIncompleteMultipartUpload
        .deleteExpired
      const r5check2 = this.createForm.AbortIncompleteMultipartUpload
        .deleteUncompleted
      if (
        this.ruleOperate.length == 1 &&
        this.ruleOperate[0] === 'r5' &&
        !r5check1 &&
        !r5check2
      ) {
        return true
      } else {
        return !this.ruleOperate.length && this.clickSubmit
      }
    }
  },
  watch: {
    visibleFlagModify (val) {
      if (!val) {
        // clear
        this.$refs['createForm'].resetFields()
      }
    },
    multipleSelection (val) {
      this.disableBtn = !!this.multipleSelection.length
    },
    searchName (val) {
      this.tableData = [...this.copyData]
      this.tableData = this.tableData.filter(item => {
        return item.ID.toLowerCase().indexOf(val.toLowerCase()) !== -1
      })
      this.total = this.tableData.length
    },
    // 筛选条件提示
    clickSubmit (val) {
      if (
        val &&
        !this.createForm.prefixIpt &&
        !this.createForm.tag.length &&
        this.createForm.range == '1'
      ) {
        this.showPrefixRule = true
      } else {
        this.showPrefixRule = false
      }
    },
    // 根据输入前缀 显示标签校验
    'createForm.prefixIpt' (val) {
      if (val) {
        this.showPrefixRule = false
      } else if (!this.createForm.tag.length) {
        this.showPrefixRule = true
      }
    },
    'createForm.tag' (val) {
      if (val.length) {
        this.$refs['createForm'].clearValidate('prefixIpt')
        this.showPrefixRule = false
        this.rules.prefixIpt.splice(0, 1)
      } else if (!this.createForm.prefixIpt) {
        this.showPrefixRule = true
        this.rules.prefixIpt.push({
          required: true,
          message: '限制规则范围时，您必须指定一个前缀或另一个筛选条件。',
          trigger: 'change'
        })
        this.$refs['createForm'].validateField('prefixIpt')
      }
    },
    // 切换选择对象大小 触发/清除校验
    objectSize (val, old) {
      if (val && val.length === 1) {
        this.$refs['createForm'].clearValidate('minSizeIpt')
        this.$refs['createForm'].clearValidate('maxSizeIpt')
        if (val[0] === 'min') {
          this.createForm.maxSizeIpt = ''
          console.log('clearmax')
        } else if (val[0] === 'max') {
          this.createForm.minSizeIpt = ''
        }
      } else if (val && val.length === 2) {
        this.$refs['createForm'].validateField('minSizeIpt')
        this.$refs['createForm'].validateField('maxSizeIpt')
      } else if (!val.length) {
        this.createForm.minSizeIpt = ''
        this.createForm.maxSizeIpt = ''
      }
    },
    // 切换添加r1、r2初始化 第一项规则
    // 切换r1、r2需要将对应的arr清空，不影响r3、r4的校验
    ruleOperate (val, old) {
      if (!old.includes('r1') && val.includes('r1')) {
        if (!this.minSizeTransLimit) {
          this.createForm.Transition = [
            // { key: '标准-IA', value: '' }
            {
              key: 1,
              value: ''
            }
          ]
        } else {
          this.createForm.Transition = [
            {
              key: 5,
              value: ''
            }
          ]
        }
      } else if (!val.includes('r1') && old.includes('r1')) {
        this.createForm.Transition = []
      } else if (!old.includes('r2') && val.includes('r2')) {
        if (!this.minSizeTransLimit) {
          this.createForm.TransitionNC = [{ key: 1, value: '', ver: '' }]
        } else {
          this.createForm.TransitionNC = [
            {
              key: 5,
              value: ''
            }
          ]
        }
      } else if (!val.includes('r2') && old.includes('r2')) {
        this.createForm.TransitionNC = []
      }
    },
    'createForm.Transition' (val, old) {
      if (val.length == 0) {
        const index = this.ruleOperate.findIndex(item => item == 'r1')
        if (index !== -1) {
          this.ruleOperate.splice(index, 1)
          this.createForm.Transition = []
        }
      }
    },
    'createForm.TransitionNC' (val, old) {
      if (val.length == 0) {
        const index = this.ruleOperate.findIndex(item => item == 'r2')
        if (index !== -1) {
          this.ruleOperate.splice(index, 1)
          this.createForm.TransitionNC = []
        }
      }
    }
  },
  mounted () {
    this.getBucketLifecycle()
  },
  methods: {
    // handleSelectionChange(val) {
    //   console.log(val)
    //   this.multipleSelection = val
    // },
    // clearSelection() {
    //   this.$refs['multipleTable'].clearSelection()
    //   this.multipleSelection = []
    // },
    //

    modifyLiftcycle () {
      console.log('opertatType')
    },

    // 删除一项版本|非版本规则操作
    delTransition (i, type) {
      switch (type) {
        case 'currentVer':
          this.createForm.Transition.splice(i, 1)
          setTimeout(() => {
            // 删除后索引对应问题 校验报错 延迟校验
            this.validateIpt('createForm')
          })
          break
        case 'notCurrentVer':
          this.createForm.TransitionNC.splice(i, 1)
          setTimeout(() => {
            // 删除后索引对应问题 校验报错 延迟校验
            this.validateIpt('createForm')
          })
          break
      }
      // 删除后需要重新判断option的禁用
    },

    // 对象转换option的禁用
    judgeDisabled (index, type) {
      // 打开时获取到上次的结果输入框已经禁用，但视图没效果
      this.$forceUpdate()
      let isCurrent
      if (type === 'currentVer') {
        isCurrent = 'Transition'
      } else {
        isCurrent = 'TransitionNC'
      }
      // 点击项目的index 但是每个项目的option都是相同的
      // 每次打开option的时候，添加禁用,需要获得已有的option从而两头判断
      const option = this.createForm[isCurrent].map(item => item.key)
      // 根据当前的optionKey 判断前后的option的index 重新绘制其作用范围
      const pre = option[index - 1]
      const next = option[index + 1]
      const preK = pre - 1 // 1-6 对应的option index值-1
      const nextk = next - 1
      // 特殊校验 3、4 同类选一
      // 特殊校验 如果对象大小 最小或最大对象大小的值 有小于128kb则 添加option禁用
      // 禁用范围 从标准-IA 到 GIR
      if (this.minSizeTransLimit) {
        console.log('option', '禁用')
        for (let i = 0; i < this.storageTransition.length; i++) {
          if (i < 4) {
            this.storageTransition[i].disabled = true
          } else {
            // 无第六项选择 当前释放禁用
            // option 5、6
            if (nextk >= 5) {
              this.storageTransition[i].disabled = true
            } else if (preK <= 4) {
              this.storageTransition[i].disabled = true
            } else {
              this.storageTransition[i].disabled = false
            }
          }
        }
      } else {
        // 不考虑对象大小，根据已选范围禁用
        this.storageTransition.forEach((item, i) => {
          // 无后项直接根据前一项判断
          if (nextk == -1) {
            if (i <= preK) {
              this.storageTransition[i].disabled = true
            } else {
              this.storageTransition[i].disabled = false
            }
            // 有后项 nextk>-1
          } else {
            // 有前项
            if (preK > -1) {
              if (i >= nextk || i <= preK) {
                this.storageTransition[i].disabled = true
              } else {
                this.storageTransition[i].disabled = false
              }
              // 无前项
            } else {
              if (i >= nextk) {
                this.storageTransition[i].disabled = true
              } else {
                this.storageTransition[i].disabled = false
              }
            }
          }
        })
        // 单区 和 GIR 规则同时只生效一个，且只能由选中一个规则的select切换选中另外一个
        for (let i = 0; i < this.createForm[isCurrent].length; i++) {
          if (this.createForm[isCurrent][i].key == 3 && i !== index) {
            this.storageTransition[3].disabled = true
          } else if (this.createForm[isCurrent][i].key == 4 && i !== index) {
            this.storageTransition[2].disabled = true
          }
        }
      }
    },
    showTransitionRule (type) {
      if (type === 'currentVer') {
        type = 'Transition'
      } else if (type === 'notCurrentVer') {
        type = 'TransitionNC'
      }
      for (let i = 0; i < this.storageTransition.length; i++) {
        // 初始化禁用,特殊情况过滤,最后面的，不能选前面的，特殊情况待列出
        this.storageTransition[i].disabled = false
        const len = this.createForm[type].length
        for (let j = 0; j < len; j++) {
          // 已选option 禁用
          if (this.createForm[type][j].key == this.storageTransition[i].value) {
            this.storageTransition[i].disabled = true
            // console.log(i, '禁用当前的i', j, '当前的j')
          }
        }
      }
      this.validateIpt('createForm')
    },
    // 添加转换规则，需要获取之前已有 剩余排除
    addTransitionType (type) {
      let arr
      let addItem
      if (type === 'currentVer') {
        arr = this.createForm.Transition.map(item => Number(item.key))
        addItem = {
          key: '',
          value: ''
        }
      } else if (type === 'notCurrentVer') {
        arr = this.createForm.TransitionNC.map(item => Number(item.key))
        addItem = {
          key: '',
          value: '',
          ver: ''
        }
      }
      const len = arr.length
      // STANDARD_IA  1
      // ONEZONE_IA 2
      // INTELLIGENT_TIERING  3
      // GLACIER_IR  4
      // GLACIER  5
      // DEEP_ARCHIVE  6
      for (let i = 0; i < len; i++) {
        if (arr[i] == 1 && len == 1) {
          addItem.key = 2
        } else if (arr[i] == 2 && len == 2) {
          addItem.key = 3
          // 有标准
        } else if (arr[i] == 2 && len == 1) {
          // 无标准
          addItem.key = 3
        } else if (arr[i] == 3 && len == 3) {
          // 正常3个 第四个跳过GIR
          addItem.key = 5
        } else if (arr[i] == 3 && len == 2) {
          addItem.key = 5
        } else if (arr[i] == 3 && len == 1) {
          addItem.key = 5
        } else if (arr[i] == 4 && len == 3) {
          addItem.key = 5
        } else if (arr[i] == 4 && len == 2) {
          addItem.key = 5
        } else if (arr[i] == 4 && len == 1) {
          addItem.key = 5
        } else if (arr[i] == 5 && len == 4) {
          addItem.key = 6
        } else if (arr[i] == 5 && len == 3) {
          addItem.key = 6
        } else if (arr[i] == 5 && len == 2) {
          addItem.key = 6
        } else if (arr[i] == 5 && len == 1) {
          addItem.key = 6
        }
      }
      switch (type) {
        case 'currentVer':
          this.createForm.Transition.push(addItem)
          break
        case 'notCurrentVer':
          this.createForm.TransitionNC.push(addItem)
          break
      }
    },

    // 删除规则 重置
    clearDelItem () {
      const index = this.ruleOperate.findIndex(item => {
        return item === 'r5'
      })
      if (index != -1) {
        this.createForm.AbortIncompleteMultipartUpload.deleteExpired = false
        this.createForm.AbortIncompleteMultipartUpload.deleteUncompleted = false
        this.createForm.AbortIncompleteMultipartUpload.deleteUncompletedDay = ''
        this.ruleOperate.splice(index, 1)
      }
    },
    validateIpt (form) {
      this.$refs[form].validate()
    },
    covertByte (num, range) {
      switch (range) {
        case 'byte':
          return num
        case 'KB':
          return num * 1024
        case 'MB':
          return num * 1024 ** 2
        case 'GB':
          return num * 1024 ** 3
      }
    },
    getBucketLifecycle () {
      this.loading = true
      // this.$store.state._S3.getBucketLifecycle({
      //   Bucket: this.$route.params.id
      // },(err,data)=>{
      //   if(err){
      //     console.error(err)
      //   }else{
      //     this.tableData = data.Rules
      //     this.copyData = [...this.tableData]
      //     this.total = data.Rules.length
      //     console.log(data,'lifeCycle');
      //     this.loading = false
      //   }
      // })
      this.$store.state._S3.getBucketLifecycleConfiguration(
        {
          Bucket: this.$route.params.id
        },
        (err, data) => {
          if (err) {
            console.error(err)
          } else {
            this.tableData = data.Rules
            this.copyData = [...this.tableData]
            this.total = data.Rules.length
            console.log(data, 'lifeCycle')
            this.loading = false
          }
        }
      )
    },
    clearForm () {
      this.createForm.name = ''
      this.createForm.range = '1'
      this.createForm.prefixIpt = ''
      this.createForm.tag = []
      this.createForm.minSizeIpt = ''
      this.createForm.maxSizeIpt = ''
      this.objectSize = []
      this.minSizeSelect = 'KB'
      this.maxSizeSelect = 'KB'
      this.clickSubmit = false
      setTimeout(() => {
        this.$refs['createForm'].clearValidate()
      })
    },
    submitCreate () {
      this.clickSubmit = true
      const hasSelectOneRule = this.validRuleOption
      this.$refs['createForm'].validate(valid => {
        if (hasSelectOneRule) return
        else if (valid) {
          // axios url
          // ruleMap =>
          console.log(valid, 'first valid')
          console.log('correct form', this.createForm)
        } else {
          console.error('error submit')
        }
      })
      // if (!hasSelectOneRule) {
      //   if (this.createForm.Transition && this.createForm.Transition.length) {
      //     Promise.all(
      //       this.createForm.Transition.map((item, i) => {
      //         return new Promise(resolve => {
      //           this.$refs['createForm'].validateField(
      //             `Transition.${i}.value`,
      //             valid => {
      //               resolve(valid)
      //             }
      //           )
      //         })
      //       })
      //     ).then(res => {
      //       console.log(res, '输出res')
      //     })
      //   }
      // }
    },
    // 绑定随机key值防止对应index错乱 影响校验问题
    addLabel () {
      this.createForm.tag.push({
        key: '',
        value: '',
        id: Math.random()
          .toString(36)
          .substring(2)
      })
    },
    handleRowChange (val) {
      if (!val) return
      const data = this.tableSlicePage
      const order = data.findIndex(item => item.ID === val.ID)
      if (order > -1) {
        this.radio = order
      }
      if (val.Filter.And) {
        this.selectConfig = val
      } else {
        var key = Object.keys(val.Filter)[0]
        var value = val.Filter[key]

        if (!key) {
          this.selectConfig = Object.assign(val, { Filter: { And: {}}})
        } else {
          var obj = {}
          obj[key] = value
          this.selectConfig = Object.assign(val, { Filter: { And: obj }})
        }
      }
      console.log(this.radio, 'ooo', val)
    },
    getCurrentRow (row) {
      console.log(row, 'daa')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.radio = ''
      this.$refs['multipleTable'].setCurrentRow()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.radio = ''
      this.$refs['multipleTable'].setCurrentRow()
    },
    handleStatus (str) {
      if (str === 'disable') {
        this.$confirm(
          '此操作将禁用生命周期规则，可能会删除现有对象或停止自动转换到不同的存储层，这将影响您的成本。',
          '是否禁用生命周期规则？',
          {
            confirmButtonText: '禁用',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      } else {
        this.$confirm(
          '此操作将启用生命周期规则，可能会删除现有对象或开始自动转换到不同的存储层，这将影响您的成本。',
          '是否启用生命周期规则？',
          {
            confirmButtonText: '启用',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .searchIpt {
    width: 350px;
    margin: 10px 0;
  }
  ::v-deep .dialog {
    top: -10%;
    .el-dialog__title {
      font-size: 20px;
    }
    .el-form-item {
      .el-form-item__label {
        float: none;
        margin-left: 0;
      }
    }
    .tipText {
      font-size: 12px;
      color: #687078;
    }
    .objectLabelTitle {
      margin: 10px 0;
      width: 340px;
      display: flex;
      justify-content: space-between;
    }
    .el-checkbox-group.obstacleTop {
      display: flex;
      flex-direction: column;
    }
    .obstacleRight {
      margin-right: 40px;
    }
    .obstacleTop {
      margin: 20px 0;
    }
    .obstacleVertical {
      margin-top: 20px;
    }
    .normalText {
      font-size: 16px;
    }
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-checkbox__label {
      color: #16191f;
    }
    .configList {
      position: relative;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-right: 50px;
      margin-bottom: 20px;
      .border {
        height: 100%;
        left: 55%;
      }
      .fa-arrow-down {
        margin: 30px 0;
      }
      h3 {
        font-size: 16px;
        margin: 20px 0;
      }
      p {
        margin: 20px 0;
        span {
          color: #16191f;
        }
      }
      .currentVersion {
        width: 320px;
        margin-right: 50px;
      }
      .notCurrentVersion {
        width: 320px;
        p {
          word-break: break-word;
        }
      }
    }
  }
  .titleh1 {
    font-size: 18px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  .border {
    height: 175px;
    position: absolute;
    border-color: #eaeded;
    border-width: 1px;
    border-style: solid;
    border-left: none;
  }
  ::v-deep .ruleRange {
    .el-form-item__content {
      display: flex;
      flex-direction: column;
      label {
        margin-bottom: 10px;
      }
    }
  }
  .errorTip {
    margin: -20px 0 10px 0;
    color: #f56c6c;
    font-size: 12px;
  }

  .infoDialog {
    .configList {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;
      .fa-arrow-down {
        margin: 30px 0;
      }
      .title {
        font-size: 20px;
        margin: 20px 0;
      }
      .notCurrentVersion {
        position: relative;
        border-left: 1px solid #eaeded;
        padding-left: 40px;
      }
      p {
        width: 320px;
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        box-sizing: border-box;
        &:nth-of-type(3n-1) {
          position: relative;
        }
        span {
          color: #16191f;
        }

        .bL {
          left: -35px;
        }
        .bR {
          right: -35px;
        }
      }
    }
  }
  .ruleSelect {
    li {
      height: 65px;
    }
    // .el-select-dropdown__item.selected {
    //   border: 1px solid #ccc;
    // }
    span {
      // color: #16191f;
      // font-weight: 0 !important;
      &:nth-of-type(n + 2) {
        display: block;
        margin: -15px 0;
        font-size: 12px;
        // color: #687078;
      }
    }
  }
</style>
```



## 表格复选框翻页或其他情形保留上次结果
```js
el-table-column type="selection" 添加属性 reverse-selection
el-table 添加属性 :row-key="function(row){return row[key]}"

// 复选框数据回显 
@selection-change="function(val)"
绑定data如multipleSelection[],赋值为val
this.$refs['table'].clearSelection()
this.$refs['table'].toggleRowSelection() 如遇弹窗需要$nextTick执行
视图不刷新 强制视图刷新方法

```


## form表单validate校验实现跳转定位到错误
```js
  jumpToError () {
      this.$nextTick(() => {
        const isError = document.getElementsByClassName('is-error')
        // console.log(isError[0].getBoundingClientRect().top)
        document.querySelector('.bucket-detail .el-dialog__wrapper').scrollTo({
          behavior: 'smooth',
          top:
            isError[0].getBoundingClientRect().top +
            this.$refs['formData'].$el.scrollTop -
            60
        })
      }, 500)
    },
```



## el-dropDown
```js
<el-dropdown @command="handleStatus">
 <el-dropdown-item
  command="string"
  :command="changeStatus('string',scope.row)">
 </el-dropdown-item>
</el-dropdown>

methods:{
  // 处理handleStatus接受到的参数,
  // 处理前只有string,处理后变成{
    row:scope.row,
    command:string
  }
  changeStatus (string, row) {
    return {
      row,
      command: string
    }
  },
}

```