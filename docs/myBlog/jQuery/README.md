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

## 基本选择器

```js
$('标签名|#id名|.class名'|*)等等
```

## 层级选择器

```js
并集选择  $("标签1,标签2,标签3,")
后代选择  $("标签1 标签2 标签3")
子元素选择 $("标签1 >标签2") 选择标签1子元素中满足标签2
兄弟选择  $("标签1 + 标签2") 选择标签1同级的所有标签2
同级选择  $("标签1 ~标签2") 选择与标签1同级的标签2

```

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

## jQ 元素筛选过滤

```js
较容易的根据返回的集合序号index选中对应的jQ对象
如:$('body').find('div').eq(number)number必传，从0开始计算，亦可传负值，倒数来计算
注:js数组的splice、slice等也可传负值
$('标签').first()   返回满足条件的第一个    等同于 $('选择器:first')
$('标签').last()    返回满足条件的最后一个  等同于 $('选择器:last')

$('标签:eq(number)')返回满足条件的第n个
$('标签:odd|even')  返回满足条件的基数|偶数  注:索引从0开始
$("标签[attribute='value']")  返回满足标签和具有属性值的
$("标签[attribute^='value']")  返回满足标签和具有属性值开头
$("标签[attribute$='value']")  返回满足标签和具有属性值结尾的
$("标签[attribute*='value']")  返回满足标签和包含value
$("标签:nth-of-type(number)")  同CSS3 nth-of-type，支持odd、even、表达式
```

## jQ 删除对象

```js
  $('选择器').empty()清空匹配jQ对象下所有元素节点

  $('选择器').remove('选择器')首先匹配remove方法前的jQ对象，后面清掉同时满足二者选择器的元素，不传，直接清除所有


```

## show/hide

```js
$('xx').show()
$('xx').hide()
可传递参数，speed: 毫秒或者slow，normal，fast
          easing: 切换效果，swing，linear
          fn:执行完的回调函数,
```

## animate

```js
$('').animate(params, [speed], [easing][fn])

例如
$('.son').animate(
	{
		left: '1000px',
		top: '100px',
	},
	2000,
	'linear',
	function () {
		alert('下班啦')
	}
)
```

## hasClass/addClass/removeClass/toggleClass

```js
hasClass(class1 class2...)      返回布尔值校验是否有指定的className
toggleClass(class1 class2...)   实现className的添加去除，可以添加多个，轮播图和其他点击切换状态常用
removeClass(class1 class2...)   去除指定的className，无参数全部清除
addClass(class1 class2 ...)     增加className

```

## text/value/html/prop/attr/css

```js
text(param)   有参数，设置匹配元素内部文本内容,无参数返回匹配元素的所有文本内容

val(param)    常用于input框返回value值，checkbox和radio需要通过.prop('check')设置或获取相应的checked值

html(params)  有参数、设置该dom中的dom结构，
            //注：若有子元素且设置了html结构、子元素的内容也要重新设置，不然有html结构，无内容
              无参数，返回该内部html结构的字符串

prop(key,value) 设置checkbox或者radio的勾选状态
获取 $("input[type='radio']").prop("checked") => true|false

设置 $("input[type='checkbox']").prop({checked:true})
                                                .prop("checked",false)


attr(key)    获取标签自带元素的对应属性的属性值,设置disable相关的ie兼容性不好使,使用prop('disabled')
            如html标签内联style，外部style获取不到
    如获取img的src 属性img $('#img').attr('src')
    设置img的src等属性  $("#img").attr("src",'img.png')
                                            .attr({src:'1.png',alt:'233'})
                                            .attr('class')  //获取class类名

css(key)        返回匹配元素的样式属性
    获取多个css传递数组.css(['position','display'])
设置同attr   .css('key','value')
                        .css({key:'value',key:'value'})
```

## offset/position/scrollTop/scrollLeft/width/height

```js
offset() 返回元素相当当前视口的横纵方向,left、top的偏移量 {top:xxxx,left:xxx} 无px单位

position()  返回元素相当自身父元素的横纵方向,left、top的偏移量{top:xxxx,left:xxx} 无px单位

scrollTop() 获取匹配元素相对滚动条顶部的偏移。
            例如获取页面滚动条的位置或者 回到顶部设置0即可
            即js中window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop

```

:::danger
仅支持可见元素 ：offset、position、

支持可见和不可见元素：scrollTop、
:::

## this

```js指向
jQuery事件回调函数中的this指向dom对象，通过$()包装this 操作jQ对象
```
