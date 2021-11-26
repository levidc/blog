---
title: 数组方法妙用
date: 2019-1-2
categories:
  - 面试题

tags:
  - js原生
  - js数组方法
  - 技巧
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/2.jpg)

<!-- more -->

## 数组合并

```js
    原数组添加元素可以同push
    添加其他数组元素concat或者[...]但都返回新数组
    巧用Array.prototype.push.apply(a1,a2)
    可以在原数组上添加数组
    多个数组使用call(a1,...a2,...a3)
```

## 数组去重

```js
target.filter((item) => {
  return all.every((item1) => {
		return item.key !== all.key
	})
})
//返回不相等的key、value
target.filter((item) => {
  return all.some((item1) => {
    return item.key == item1.key
})
//返回相等的key、value
```
