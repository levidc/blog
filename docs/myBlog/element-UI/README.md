---
title: element-ui常用组件及问题
date: 2021-12-07
categories:
  - 前端

tags:
  - vue
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
