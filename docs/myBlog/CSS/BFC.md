---
title: 【BFC】
date: 2019-05-03
categories:
 - 前端
tags:
 - css
---


## 123

:::info
    Block Formatting Context
    块级格式上下文：BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。
    只有块级元素会参与到BFC，只会在其内部定义如何渲染，不会影响到外部区域
:::
```js
    一：解决的问题
    高度塌陷:父子元素，子元素设置浮动，导致父元素的高度丢失，父元素兄弟元素往其位置填补
    垂直外边距的合并：兄弟元素margin-top和margin-bottom的合并，正值取最大,同负值取绝对值的最大值，正负相加处理
	margin-top：父子元素，子元素margin-top作用于父元素上
    二：产生条件
	1：float值不为none
	2：position值为absolute、fixed
	3：display的值是inline-block、table-cell、table-caption、inline-flex、flex
	4：overflow的值不是visible
```
## 解决浮动问题
```js
    .clearfix::after{
        content: ".";/*生成一个元素内容为"."*/
        clear: both;/*清除浮动*/
        display: block;/*让元素为块级元素*/
        height: 0;/*用以下两种方式让元素不渲染*/
        visibility: hidden;
        overflow：hidden;
    }
    兼容ie
    .clearfix { zoom:1} 兼容ie
```
