---
title: border属性
date: 2020-04-11
categories:
 - 前端
 - 面试
tags:
 - css
 - 面试题
---

```css
    /* css绘制一个三角形 */
    div{
        width: 0;
        height: 0;
        border-left:10px solid springgreen;
        border-top:10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
    }
    
```


```js
    border:none浏览器解析时不会渲染，不占用内存
    border：0 虽然看不见，但属性都设置了会占用内存
    border:width style color  简写必须要有style，宽度不写默认3-4px,颜色为文本的色彩
```