---
title: 正则表达式
date: 2021-11-18
categories:
  - 编程

tags:
  - 正则表达式
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/34.jpg)

<!-- more -->

```js
var str = '广东省深圳市龙华新区金龙路逸秀新村华富锦大厦'
var p = /^(.+省)(.+市)(.+区)(.+路)(.*)$/
str.replace(p, '$1 $2 $3 $4 $5')
```
