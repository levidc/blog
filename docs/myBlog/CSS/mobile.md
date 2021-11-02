---
title: 移动端
date: 2020-04-01
categories:
 - 前端
tags:
 - css
 - 移动端
---

```css
    如何让1rem=10px 但浏览器最小显示单位为12px 默认1rem=16px 设置 {
        font-size: '67.5%'1/1.6
    }
```

```js
    1. rem是什么 ?
        rem(font size of the root element) 是指相对于根元素的字体大小的单位
    2. 为什么web app要使用rem？
    实现强大的屏幕适配布局(淘宝, 腾讯, 网易等网站都是rem布局适配) rem能等比例适配所有屏幕, 根据变化html的字体大小来控制rem的大小
    vw： viewpoint width， 视窗宽度， 1 vw等于视窗宽度的1 % 。
    vh： viewpoint height， 视窗高度， 1 vh等于视窗高度的1 % 。
    vmin： vw和vh中较小的那个。
    vmax： vw和vh中较大的那个。
    vw, vh, vmin, vmax： 
    IE9 + 局部支持， 
    chrome / firefox / safari / opera支持， 
    iOS safari 8 + 支持， 
    Android browser4 .4 + 支持，
    chrome for android39支持,

    公式：
    html,body {
        font - size: (100 px / 屏幕宽度的1 % ) vw
    }
    解释： 通过用100除以当前屏幕宽度的1 %
    计算出100px占当前屏幕的多少vw
    常用设计稿宽度640/750
    即100/6.4 | 100/7.5
    15.625vw | 13.333333333333vw
```
