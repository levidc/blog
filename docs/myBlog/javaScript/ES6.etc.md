---
title: ES6等
date: 2021-11-1
categories:
 - 前端

tags:
 - js原生
 - ES6
---

## Map和Set数据结构

### Map和数组相互转化
```js
  //map和数组
  let arr = [[1,{id:1}],[2,{id:2}],[3,{id:3}]]
  let m = new Map(arr)
  console.log(m);
  console.log([...m]);//获取键值对集合
  console.log([...m.values()]);//获取value集合
```

### map和对象相互转换,对象键为字符串
```js
 let arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
  let m = new Map()
  arr.forEach(item => {
    m.set(item.id, item)
  })
  for (let [k, v] of m) {
    console.log(k, v);
  }
```
### Set和数组相互转化
```js
  let s = new Set([1, 2, 3, '3', null, undefined, NaN, NaN])
  console.log(s); //[1, 2, 3, '3', null, undefined, NaN]
  console.log(Array.from(s));
  数组去重最简化Array.from(new Set(arr))

  补充:序列生成器
  Array.from箭头函数特殊处理 x初始化为undefined
  let res= Array.from({length:26},(x,v)=>{
    return 'A'.charCodeAt(0)+v
  }).map(x=>String.fromCharCode(x))
  // res ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```
## Promise
