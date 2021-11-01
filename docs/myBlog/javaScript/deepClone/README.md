---
title: 【深拷贝】js
date: 2021-11-01
categories:
 - 前端

tags:
 - js 
 - 深拷贝
---

屌丝版
```js
  function deepClone(obj) {
    if (!typeof obj === 'object') return
    let res = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
      if(obj.hasOwnProperty(key)){
        if (obj[key]&&typeof obj[key]==='object') {
          res[obj[key]] = deepClone(obj[key])
        } else {
          res[key] = obj[key]
        }
      }
    }
    return res
  }


```


豪华版
```js
  function _type(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }
  function shallowClone(obj) {
    //处理null和undefined
    if (obj == null) return
    let ctrl = obj.constructor
    let type = _type(obj)
    //处理symbol类型和bigint类型
    if (/^(Symbol|bigint)$/.test(type)){
      return Object(obj)
    }
    //处理正则和日期
    if (/^(regexp|date)$/.test(type)){
      return new ctrl(obj)
    }
    //处理函数
    if (/^function$/.test(type)){
      return function () {
        return obj.call(this, ...arguments)
      }
    }
    //处理错误
    if (/^error$/.test(type)){
      return new ctrl(obj.message)
    }
    //处理剩余基本数据类型
    return obj
  }
  function deepClone(obj, cache = new Set()) {
    let type = _type(obj)
    if (obj == null) return obj
    let ctrl = obj.constructor
    if (!/^(array|object)$/.test(type)) return shallowClone(obj)
    //防止栈溢出
    if (cache.has(obj)) return obj
    cache.add(obj)
    let keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)]
    let res = new ctrl()
    for (let key of keys) {
      res[key] = deepClone(obj[key])
    }
    return res
  }
```