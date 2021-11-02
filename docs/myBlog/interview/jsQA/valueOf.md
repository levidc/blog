---
title: 数据类型转换
date: 2019-1-3
categories:
 - 面试题

tags:
 - js原生
 - 面试题
---

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
        }
    })
    console.log(
        a === 1 && a === 2 && a === 3
    );
```
