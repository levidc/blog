---
title: v3
date: 2022-08-05
categories:
  - 前端

tags:
  - vue3
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/51.jpg)

<!-- more -->

## ref

```js
创建一个响应式的数据、一般用于基本数据如 Boolean|String
js中操作 xxx.value
template中使用 xxx
如
const flag = ref(false)
```

## reactive
```js
作用: 定义多个数据的响应式
const proxy = reactive(obj): 接收一个普通对象然后返回该普通对象的响应式代理器对象
响应式转换是“深层的”：会影响对象内部所有嵌套的属性
内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据都是响应式的

```



## setUp

## slot
