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

## 获取 jQ 对象

```js
$('标签名|#id名|.class名')等等
```

::: tip
可以选择器组合使用,或者后代选择器
如$('#id.class') || $('#id .class')
:::

## jQ 对象转为 dom 对象

```js
let jq = $('#jq') //jq对象

let dom = jq.get(0) || jq[0] //dom对象
```

## 获取兄弟节点等

```js
$('#test1').parent() // 父节点

$('#test1').parents() // 全部父节点

$('#test1').parents('.mui-content')

$('#test').children() // 全部子节点

$('#test').children('#test1')

$('#test').contents() // 返回#test里面的所有内容，包括节点和文本

$('#test').contents('#test1')

$('#test1').prev() // 上一个兄弟节点

$('#test1').prevAll() // 之前所有兄弟节点

$('#test1').next() // 下一个兄弟节点

$('#test1').nextAll() // 之后所有兄弟节点

$('#test1').siblings() // 所有兄弟节点

$('#test1').siblings('#test2') //指定标签名

$('#test').find('#test1')
```

## dom 元素创建

```js
$('<p></p>')动态创建dom再通过appendTo($('xxx'))添加到对应dom上

或者$('body').html('<p>123</p>')渲染dom结构

```

## jQ 对象插入元素

```js
a.append(b)   a添加元素b到其子元素最后

a.appendTo(b) b添加a到其子元素最后

a.before(b)   a与其兄弟元素之间(参考自身前一个兄弟元素)添加b

a.after(b)    a与其兄弟元素之间(参考自身后一个兄弟元素)添加b
```

```js
a.prepend(b)      a将b元素插入到自身子元素的第一位

a.prependTo(b)    b将a元素插入到自身子元素的第一位

a.insertBefore(b) b与其兄弟元素之间(参考自身前一个兄弟元素)添加a

a.insertAfter(b)  b与其兄弟元素之间(参考自身后一个兄弟元素)添加a
```

## jQ 元素筛选

```js
较容易的根据返回的集合序号index选中对应的jQ对象
如:$('body').find('div').eq(number)number必传，从0开始计算，亦可传负值，倒数来计算
注:js数组的splice、slice等也可传负值
```

## jQ 删除对象

```js
  $('选择器').empty()清空匹配jQ对象下所有元素节点

  $('选择器').remove('选择器')首先匹配remove方法前的jQ对象，后面清掉同时满足二者选择器的元素，不传，直接清除所有




```
