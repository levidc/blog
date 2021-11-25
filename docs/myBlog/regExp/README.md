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

## 常用正则案例

## 省市区

```js
var str = '广东省深圳市龙华新区金龙路逸秀新村华富锦大厦'
var p = /^(.+省)(.+市)(.+区)(.+路)(.*)$/
str.replace(p, '$1 $2 $3 $4 $5')
```

## textarea 换行

```js
    textarea.vaue.replace(/\n/g,';') => 字符串带';'
    split(';').filter(item=>item) 输出文本对应的数组格式的数据
```

## 驼峰命名

```js
function camelize(attr) {
	return attr.replace(/\-(\w)/g, function (all, letter) {
		console.log(letter)
		return letter.toUpperCase()
	})
}
```

## 截取 img 下 src

```js
str.match(/src="(\S*)"/)[1]
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
