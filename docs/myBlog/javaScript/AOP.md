---
title: AOP切片编程
date: 2019-01-03
categories:
 - 编程思想

tags:
 - js 
 - 编程思想
---

```js
  Function.prototype.before = function (callback) {
    let self = this
    return function (...args) {
      callback.call(self, ...args)
      return self.call(self, ...args)
    }
  }
  Function.prototype.after = function (callback) {
    let self = this
    return function (...args) {
      self.call(self, ...args)
      callback.call(self, ...args)
    }
  }
  let fn = function test() {
    console.log('pending');
  } 
  fn.before(() => {
    console.log('before');
  })
  .after(() => {
    console.log('after');
  })()


```
