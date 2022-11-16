---
title: 常用工具类函数
date: 2022-01-25
categories:
  - js

tags:
  - js
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/48.jpg)

<!-- more -->

## 数组返回指定个数的元素

```js
function getArrayItems(arr, num) {
  var temp_array = new Array();
  for (var index in arr) {
    temp_array.push(arr[index]);
  }
  var return_array = new Array();
  for (var i = 0; i < num; i++) {
    if (temp_array.length > 0) {
      var arrIndex = Math.floor(Math.random() * temp_array.length);
      return_array[i] = temp_array[arrIndex];
      temp_array.splice(arrIndex, 1);
    } else {
      break;
    }
  }
  return return_array;
}
```

## 返回指定个数的随机数

```js
function getImageRandomPosition(count,range) {
  const temp = [];
  do {
    var n = Math.floor(Math.random() * range);
    for (var i = 0; i < temp.length; i++) {
      if (n == temp[i]) {
        break;
      }
    }
    if (i == temp.length) {
      temp.push(n);
    }
  } while (temp.length != count);
  return temp;
}
```

## 处理形如true的字符串等
```js
function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}
```