---
title: closure闭包
date: 2020-10-15
categories:
 - 前端
 - 面试
tags:
 - js 
 - 面试
 - 闭包
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/4.jpg)

<!-- more -->
::: danger
    特殊情景
:::
```js
    Function创建的函数不会形成闭包
    var x = 10;
    function createFunction1() {
        var x = 20;
        return new Function('return x;'); // 这里的 x 指向最上面全局作用域内的 x
    }

    function createFunction2() {
        var x = 20;
        function f() {
            return x; // 这里的 x 指向上方本地作用域内的 x
        }
        return f;
    }

    var f1 = createFunction1();
    console.log(f1());          // 10
    var f2 = createFunction2();
    console.log(f2());          // 20
```
