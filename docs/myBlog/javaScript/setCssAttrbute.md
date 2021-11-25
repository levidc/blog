---
title: js 获取style及设置相关style
date: 2021-11-26
categories:
  - 前端
tags:
  - js
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/35.jpg)

<!-- more -->

## 内联 style

```js
    直接通过dom.style.'key' = 'value' 设置|获取
```

## 页面内 style 标签，或者引入 css

```js
无法通过上述方法获取

window.getComputedStyle(dom, null).getPropertyValue('attribute')
注：null旧版本之前是伪类
   该方法只可读，获取所有style相关的属性表和键值对，无法设置对应的value

设置css
dom.setAttribute('style','key:value;key:value;')
dom.style.attribute = 'property'

```

## ie 获取 style(currentStyle)

```js
原生方法
// IE 下语法：
// IE 下将 CSS 命名转换为驼峰表示法
// font-size --> fontSize
// 利用正则处理一下就可以了
function camelize(attr) {
    // /\-(\w)/g 正则内的 (\w) 是一个捕获，捕获的内容对应后面 function 的 letter
    // 意思是将 匹配到的 -x 结构的 x 转换为大写的 X (x 这里代表任意字母)
    return attr.replace(/\-(\w)/g, function(all, letter) {
        return letter.toUpperCase();
    });
}
参数需要驼峰命名例如'font-size' => 'fontSize'
// 使用 currentStyle.getAttribute 获取元素 element 的 style 属性样式
element.currentStyle.getAttribute(camelize(style));

```
