---
title: parseInt回调函数处理
date: 2019-1-2
categories:
 - 面试题

tags:
 - 原生
 - 面试题
 - js 
 - 技巧
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/14.jpg)

<!-- more -->
```js
    ["1", "2", "3"].map(parseInt)
    parseInt方法接受map传递的回调函数callback(item, index, array)
```

```js
    相当于
        [parseInt("1", 0), parseInt("2", 1), parseInt("3", 2)]
```

```js
    1 按十进制转换输出1
    1 不在2~36 之间， 输出NaN
    字符串” 3“ 里面没有合法的二进制数， 输出NaN
    所以最后结果是[1, NaN, NaN]
    转为十进制
```
