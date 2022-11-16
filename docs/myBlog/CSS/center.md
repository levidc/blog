---
title: 元素居中
date: 2020-04-01
categories:
 - 前端

tags:
 - css
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/23.jpg)

<!-- more -->
```css
      Ⅰ /* 需要知道元素的宽高  */
      position:absolute left:50%;
      top:50%;
      margin-left:-自身宽度的一半 ；margin-top：-自身高度的一半 
      transform: translateX(-50%) translateY(-50%);

      Ⅱ /* 不需要知道元素的宽高  */
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      
      注意：left和right的值不能超过其相对元素width减去它自身width的一半,
      否则绝对定位元素会优先取left值进行定位(前提是文档流是从左向右),
      但是top和bottom的值却没有这个限制。 

      Ⅲ /* 不需要知道元素的宽高 */
      设置父元素的display：flex;
      justify-content:center;
      align-items:center;
```
