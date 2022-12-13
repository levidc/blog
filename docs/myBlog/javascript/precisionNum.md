---
title: 数据保留千分位
date: 2017-12-28
categories:
 - 前端

tags:
 - js 
 - js技巧
---
![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/9.jpg)

<!-- more -->
```js
  function precision(num){
    let arr =num.toString().split('.')
    let int = arr[0],decimal=arr[1]
    let handleInt =(num)=>{
      return num.split('').reverse().reduceRight((pre,cur,i)=>{
        return pre+(i%3?cur:`${cur},`)
      },'').replace(/^,|,$/g,'')
    }
    let handleDemi =(num)=>{
      return num.split('').reverse().reduce((pre,cur,i)=>{
        return pre+((i+1)%3?cur:`${cur},`)
      },'.').replace(/^,|,$/g,'')
    }
    return arr.length>1?handleInt(int)+handleDemi(decimal):handleInt(int)
  }
```

正则
```js
const reg = /\B(?=(\d{3})+(?!\d))/g
value => value.replace(reg, ',')

```