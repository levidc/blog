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

### 多选框执行两次

```js
<el-table row-key="getRowKey"></el-table>
<el-table-column type="selection" width="55" reserve-selection></el-table-column>
getRowKey(row)=>{return row.id}
多选框列添加reserve-selection 保存上次结果，
getRowKey添加row的key值
```
