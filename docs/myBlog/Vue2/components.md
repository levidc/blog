---
title: vue组件化
date: 2022-04-29
categories:
  - 前端

tags:
  - vue2
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/56.jpg)

<!-- more -->


```js
使用require 提供的函数 context加载 某一个目录下所有的 ,vue后缀的文件
然后context函数会返回一个导入函数importFn
它有一个属性keys() 获取所有的文件路径
通过文件路径数组， 通过遍历数组，在使用importFn根据路径导入组件对象
遍历的同时进行全局注册即可

// 获取文件路径函数
const importFn = require.context('path', false, /\.vue$/)
export default {
  install(app) {
  // 遍历文件路径数组
    importFn.keys().forEach((path) => {
      // 导入组件
      const component = importFn(path).default
      // 注册组件
      app.component(component.name, component)
    })
   }
  }
```