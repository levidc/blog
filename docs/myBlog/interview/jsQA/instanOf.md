---
title: 面试题
date: 2020-10-15
categories:
 - 前端
 - 面试
tags:
 - js
 - 面试
 - 原型
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/13.jpg)

<!-- more -->


## instanceOf实现
```js
      /**
       * @description: es5方法获取实例原型，直到找到null
       * @param {*} pro,实例相当于instanceOf 的left-handle ，classFn原型
       * @return {*} boolean
       */
      function ins(pro, classFn) {
          let proto = Object.getPrototypeOf(pro)
          while (true) {
              if (proto === null) return false
              if (proto === classFn.prototype) return true
              proto = Object.getPrototypeOf(proto)
          }
      }

```
## parseInt回调函数处理
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


## 数据类型转换
```js
如何使得等式成立
let a = {}
a == 1 && a == 2 && a == 3
```

```js
    object数据类型 == 比较时候， 调用valueOf或者toString方法
    let a = {
        value: '1',
        valueOf() { //toString
            return this.value++
        }
    }

    let a = [1, 2, 3]
    a.valueOf = a.shift
```

```js
如何使得等式成立
let a = {}
a === 1 && a === 2 && a === 3
```

```js
let value = 1
Object.defineProperty(window, 'a', {
	get() {
		return value++
	},
})
console.log(a === 1 && a === 2 && a === 3)
```

