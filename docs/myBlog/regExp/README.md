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

## 特殊正则替换

```js
var str = '广东省深圳市龙华新区金龙路逸秀新村华富锦大厦'
var p = /^(.+省)(.+市)(.+区)(.+路)(.*)$/
str.replace(p, '$1 $2 $3 $4 $5')
```

## console.log 打印

```js
console.log(
	'%c vue-aplayer %c v'.concat('2.0.0-beta.5', ' ').concat('dd10c50', ' %c'),
	'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
	'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff',
	'background: transparent'
)
```
