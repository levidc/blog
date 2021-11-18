---
title: jQuery
date: 2021-11-20
categories:
  - 前端
tags:
  - jQuery
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/35.jpg)

<!-- more -->

## jQUery

## dom 创建

```js
$('<p></p>')动态创建dom再通过appendTo($('xxx'))添加到对应dom上
或者$('body').html('<p>123</p>')渲染dom结构

```

## append、appendTo、Before、after

```js
a.append(b)   a添加元素b到其子元素最后
a.appendTo(b) b添加a到其子元素最后
a.before(b)   a与其兄弟元素之间(参考自身前一个兄弟元素)添加b
a.after(b)    a与其兄弟元素之间(参考自身后一个兄弟元素)添加b
```

## prepend、prependTo、insertedBefore、insertAfter

```js
a.prepend(b)      a将b元素插入到自身子元素的第一位
a.prependTo(b)    b将a元素插入到自身子元素的第一位
a.insertBefore(b) b与其兄弟元素之间(参考自身前一个兄弟元素)添加a
a.insertAfter(b)  b与其兄弟元素之间(参考自身后一个兄弟元素)添加a
```
