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

## 数组合并

```js
    原数组添加元素可以同push
    添加其他数组元素concat或者[...]但都返回新数组
    巧用 Array.prototype.push.apply(a1,a2)
    可以在原数组上添加数组
    多个数组使用call(a1,...a2,...a3)
```

## 数组去重

```js
target.filter((item) => {
  return all.every((item1) => {
		return item.key !== all.key
	})
})
//返回不相等的key、value


target.filter((item) => {
  return all.some((item1) => {
    return item.key == item1.key
})
//返回相等的key、value
```

## 二维数组最大值

```js
[[a], [b]].map(Function.prototype.apply.bind(Math.max, null));
相当于[([a], [b])].map(function (item) {
  Math.max.apply(null, item);
});
apply.bind将Math.max指向了apply，null作为apply第一个参数，后面map遍历 接受item的数组，返回每组最大值，
最后返回新数组，取决于二维数组的个数
```

## 导出table
```js
  let n = [
      { key: 'id', title: 'id' },
      { key: 'name', title: 'name' },
      { key: 'user.age', title: 'age' }
    ],
    m = [
      { id: 1, name: 2, user: { age: 18 } },
      { id: 2, name: 3, user: { age: 20 } }
    ]
const exportExcel = function p(n = [] as any, m = [] as any, r = '') {
  let l = [] as any
  m.forEach((e: any, c: any) => {
    let x = {}
    n.forEach(({ key: a }) => {
      x[a] = a.split('.').reduce((h: { [x: string]: any }, i: string | number) => {
        try {
          return h[i]
        } catch {
          return
        }
      }, e)
    }),
      l.push(x)
  })
  // l 解析column对应key的value
  // l => {key:value} column: key l 所有的td、依次按顺序排列d
  let t = '<tr>'
  for (let e = 0; e < n.length; e++) t += `<td>${n[e].title + '	'}</td>`
  ;(t += '</tr>'), (t += '<tr>')
  // tilte
  for (let e = 0; e < l.length; e++) {
    // l[e] {key:'value'}
    // 科学技术法 数字
    // style="mso-number-format:'@'"
    for (let c in l[e])
      t += `<td  style="mso-number-format:'@'">${(l[e][c] ? l[e][c] : '') + '	'}</td>`
    t += '</tr>'
  }
  console.log(t, '12333')
  var s,
    d = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>${r}</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table>${t}</table></body></html>`,
    o = document.createElement('a')
  ;(o.href =
    'data:application/vnd.ms-excel;base64,' +
    ((s = d), window.btoa(unescape(encodeURIComponent(s))))),
    (o.download = r ? r + '.xls' : '数据.xls'),
    document.body.appendChild(o),
    (o.innerHTML = '点击下载'),
    o.click(),
    document.body.removeChild(o)
}

```

## 复制文本
```js
    copyCode (str) {
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
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
    },
```
