---
title: 数据类型检测
date: 2021-09-10
categories:
 - 前端

tags:
 - js原生
 - 面试题
---


```js
    js数据类型分为基本数据类型&&复杂数据类型
    重点来了
    如何检验数据类型
```

## tpyeof 检验基本数据类型
```js
    typeof 13           //number     
    typeof '13'         //string
    typeof 13n          //bigint
    typeof true         //boolean
    typeof Symbol(13)   //symbol
    typeof null         //object
    typeof NaN          //number
    typeof undefined    //undefined
    typeof {}           //object
    typeof []           //object
    typeof function(){} //function
    可见，无法区分对象，null设计初期漏洞、undefined特殊情况，function是区别对待
```

## instanceOf&&constructor
```js
    实例和构造函数的判断，可以，但缺点也很明显，constructor容易修改，instancOf还是无法区分Object类型
```


## 实现instanceOf