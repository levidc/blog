---
title: call&Apply&Bind的手写
date: 2017-12-28
categories:
 - 前端
 - 面试
tags:
 - 原生
 - js 
 - 面试
 - 技巧
 - prototype原型
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/3.jpg)

<!-- more -->
```js
    call
    Function.prototype.callM = function(context = window, ...params) {
        let self = this //调用函数
        let fn = Symbol('fn') //设定唯一值方便删除
            //基本数据类型会包装，但后续再去掉方法会无效
            !(/^(object|function)$/i).test(typeof context) ? context = Object(context) : null
        context[fn] = self
        let res = context[fn](...params)
        delete context[fn]
        return res
    }
```

```js
    apply
    Function.prototype.applyM = function(context, params) {
        context === null ? context = window : null
        let self = this //调用函数
        let fn = Symbol('fn') //设定唯一值方便删除
            //基本数据类型会包装，但后续再去掉方法会无效
            !(/^(object|function)$/i).test(typeof context) ? context = Object(context) : null
        context[fn] = self
        let res = context[fn](...params)
        delete context[fn]
        return res
    }
```

```js
    bind
    Function.prototype.bindM = function(context, ...arg) {
        let self = this
        return function() {
            return self.apply(context, [...arg, ...arguments])
        }
    }
```
