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

## XML2JSON
```js
function XMLToJSON = (XMLData = '') {
  let ind = 0
  const obj = {}
  const XMLParse = (obj = {}) => {
    let value = ''
    let tag = ''
    // 遍历xml字符串
    while (ind < XMLData.length) {
      // 正在遍历标签内的值，记录标签名
      if (XMLData[ind] === '<' || (tag && XMLData[ind] !== '>')) {
        if (XMLData[ind] === '<') ind++
        tag += XMLData[ind]
      } else if (XMLData[ind] === '>') {
        // 获取到完整的标签名
        // 通过rowNum属性来判断是否为数组，有rowNum属性的即为数组
        const rowNum = tag.split(' ')[1] || ''
        tag = tag.split(' ')[0]
        if (tag[0] !== '/') {
          ind++
          // 同一层级当前标签为出现过且不包含rowNum属性，将其处理为对象
          if (obj[tag] === undefined && !rowNum.includes('rowNum')) {
            obj[tag] = {}
            const val = XMLParse(obj[tag], [tag])
            if (val) obj[tag] = val
            if (JSON.stringify(obj[tag]) === '{}') {
              obj[tag] = ''
            }
          } else {
            // 同一层级下拥有多个同名标签或包含rowNum属性，将其处理为数组
            if (obj[tag] === undefined) obj[tag] = [{}]
            else if (Array.isArray(obj[tag])) obj[tag].push({})
            else obj[tag] = [obj[tag], {}]
            const objInd = obj[tag].length - 1
            // 递归处理标签内的嵌套标签或提取值
            const val = XMLParse(obj[tag][objInd])
            // 有标签值的直接赋值，如：<a>111</a> -> {a:111}
            if (val) obj[tag][objInd] = val
            // 无子节点的赋空值
            if (JSON.stringify(obj[tag][objInd]) === '{}') {
              obj[tag][objInd] = ''
            }
          }
        } else {
          // 闭合标签，结束递归返回获取到的值
          return value
        }
        tag = ''
        value = ''
      } else {
        value += XMLData[ind]
      }
      ind++
    }
  }
  XMLParse(obj)
  return obj['?xml']
}
```


## JSON2XML

```js
function json2xml = (o, tab) = {
  var toXml = function (v, name, ind) {
    var xml = ''
    if (v instanceof Array) {
      for (var i = 0, n = v.length; i < n; i++) { xml += ind + toXml(v[i], name, ind + '\t') + '\n' }
    } else if (typeof (v) == 'object') {
      var hasChild = false
      xml += ind + '<' + name
      for (var m in v) {
        if (m.charAt(0) == '@') { xml += ' ' + m.substr(1) + '="' + v[m].toString() + '"' } else { hasChild = true }
      }
      xml += hasChild ? '>' : '/>'
      if (hasChild) {
        for (var m in v) {
          if (m == '#text') { xml += v[m] } else if (m == '#cdata') { xml += '<![CDATA[' + v[m] + ']]>' } else if (m.charAt(0) != '@') { xml += toXml(v[m], m, ind + '\t') }
        }
        xml += (xml.charAt(xml.length - 1) == '\n' ? ind : '') + '</' + name + '>'
      }
    } else {
      xml += ind + '<' + name + '>' + v.toString() + '</' + name + '>'
    }
    return xml
  }; var xml = ''
  for (var m in o) { xml += toXml(o[m], m, '') }
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, '')
}

```


## 判断arr包含关系
```js
function includeArray (all, target) {
  if (!Array.isArray(all) || !Array.isArray(target)) return
  if (target && !target.length) return false
  return target.every(item => {
    return all.includes(item)
  })
}
```

## 返回相同arr元素
```js
filterSame (all, target) {
  if (!Array.isArray(all) || !Array.isArray(target)) return
  return all.filter(item => {
    return target.some(i => {
      return item == i
    })
  })
}
```

## 返回不同arr元素
```js
filterDiff (all, target) {
  if (!Array.isArray(all) || !Array.isArray(target)) return
  return all.filter(item => {
    return target.every(i => {
      return item !== i
    })
  })
}
```

## 复制文本

```js
function(str){
  if (navigator.clipboard && navigator.clipboard.writeText&&window.isSecureContext) {
    this.$msg({
      type: 'success',
      text: '复制成功'
    })
    return navigator.clipboard.writeText(str)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = str
    document.body.append(textarea)
    textarea.select()
    this.$msg({
      type: 'success',
      text: '复制成功'
    })
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej()
      textarea.remove()
    })
  }
}
```
