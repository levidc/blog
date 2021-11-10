---
title: instanceOf实现
date: 2020-10-15
categories:
 - 前端
 - 面试
tags:
 - js 
 - 面试
 - 原型
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/13.jpg)

<!-- more -->
```js
      /**
       * @description: es5方法获取实例原型，直到找到null
       * @param {*} pro,实例相当于instanceOf 的left-handle ，classFn原型
       * @return {*} boolean
       */    
      function ins(pro, classFn) {
          let proto = Object.getPrototypeOf(pro)
          while (true) {
              if (proto === null) return false
              if (proto === classFn.prototype) return true
              proto = Object.getPrototypeOf(proto)
          }
      }
      
```
