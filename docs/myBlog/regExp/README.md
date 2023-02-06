---
title: 正则表达式
date: 2021-11-18
categories:
  - 编程

tags:
  - 正则表达式
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/34.jpg)

<!-- more -->

## 普通字符

| 字符                |                    描述                     |                                     实例 |
| ------------------- | :-----------------------------------------: | ---------------------------------------: |
| [ABC]               |            匹配[...]中的所有字符            |  /[abcd]/ 匹配所有含 abcd 这四个字符的项 |
| [A-Z]、[a-z]、[0-9] |             匹配大写或小写字母              | 匹配所有大写小写字母及数字 /[A-Za-z0-9]/ |
| \s                  |     匹配所有空白符如:\r,\n,\t,\v,\f...      |                     /\s/.test(' ')=>true |
| \S                  |  匹配所有非空字符,等价于 [^ \f\n\r\t\v]。   |                   /\S/.test('\r')=>false |
| \w                  | 匹配字母、数字、下划线。等价于 [A-Za-z0-9_] |             /\w/.test('123abc\_') =>true |
| \d                  |            匹配数字,等价于 [0-9]            |                  /\d/.test('abc')=>false |
| [^12]               |          匹配 1 或者 2 开头的数字           |                 /[^12]./.test('21')=>true |

## 特殊字符

| 字符 |                                                 描述                                                  |
| ---- | :---------------------------------------------------------------------------------------------------: |
| ^    |                      匹配输入字符串的开始位置。当该符号在方括号表达式中使用时，                       |
|      |                 表示不接受该方括号表达式中的字符集合，要匹配 ^ 字符本身，请使用 \\^。                 |
| $    |                       匹配输入字符串的结尾位置。要匹配 $ 字符本身，请使用 \\$。                       |
| \*   |                匹配前面的子表达式零次或多次。相当于{0,}。要匹配 \* 字符，请使用 \\\*。                |
| +    |                 匹配前面的子表达式一次或多次。相当于{1,}。要匹配 + 字符，请使用 \\+。                 |
| ?    |    匹配前面的子表达式零次或 1 次。相当于{0,1}。或指明一个非贪婪限定符。要匹配 ? 字符，请使用 \\?。    |
| .    |                      匹配除换行符 \n 之外的任何单字符。要匹配 . ，请使用 \\. 。                       |
| \    |               \ 将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。                |
| ()   | ( ) 标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 \\( 和 \\)。 |
| \|   |                          指明两项之间的一个选择。要匹配 \| ，请使用 \\ \| 。                          |

## 特殊

| 字符 |    描述    | 案例 |
| ---- | :--------: | ---- |
| .\*  |  贪婪匹配  | 123  |
| .\*? | 非贪婪匹配 | 444  |

```js
(?:pattern)
非获取匹配，匹配pattern但不获取匹配结果，不进行存储供以后使用。这在使用或字符“(|)”来组合一个模式的各个部分是很有用。例如“industr(?:y|ies)”就是一个比“industry|industries”更简略的表达式。
(?=pattern)
非获取匹配，正向肯定预查，在任何匹配pattern的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如，“Windows(?=95|98|NT|2000)”能匹配“Windows2000”中的“Windows”，但不能匹配“Windows3.1”中的“Windows”。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
(?!pattern)
非获取匹配，正向否定预查，在任何不匹配pattern的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如“Windows(?!95|98|NT|2000)”能匹配“Windows3.1”中的“Windows”，但不能匹配“Windows2000”中的“Windows”。
(?<=pattern)
非获取匹配，反向肯定预查，与正向肯定预查类似，只是方向相反。例如，“(?<=95|98|NT|2000)Windows”能匹配“2000Windows”中的“Windows”，但不能匹配“3.1Windows”中的“Windows”。
(?<!pattern)
非获取匹配，反向否定预查，与正向否定预查类似，只是方向相反。例如“(?<!95|98|NT|2000)Windows”能匹配“3.1Windows”中的“Windows”，但不能匹配“2000Windows”中的“Windows”。这个地方不正确，有问题
```

## 常用正则案例

### 省市区

```js
var str = '广东省深圳市龙华新区金龙路逸秀新村华富锦大厦'
var p = /^(.+省)(.+市)(.+区)(.+路)(.*)$/
str.replace(p, '$1 $2 $3 $4 $5')
考虑到其他可能性，最好也就省市区、下面详细信息的关键字、路、村、区、苑、等等碰到再试试
==>'广东省 深圳市 龙华新区 金龙路 逸秀新村华富锦大厦'
```

### textarea 换行

```js
// textarea输入的enter键回车，可以被\n检验出来了，直接根据\n，回车获取数据
    textarea.vaue.replace(/\n/g,';') => 字符串带';'
    split(';').filter(item=>item) 输出文本对应的数组格式的数据
```

### 驼峰命名

```js
function camelize(attr) {
  return attr.replace(/\-(\w)/g, function (all, letter) {
    console.log(letter);
    return letter.toUpperCase();
  });
}
```

### 截取 img 下 src

```js
reg = /src=['|"](\S*)['|"]/
str = '<p><img src="https://cdn.jsdelivr.net/gh/levidc/blogImg/img/7.jpg" alt=""></p>\n'
str.match(reg)[1]
=> https://cdn.jsdelivr.net/gh/levidc/blogImg/img/7.jpg
```

### 取反匹配

```js
// 中文输入法不被input事件检测到，取之使用compositionstart、compositionend监听中文输入法
// https://www.ip138.com/ascii/中文ASCii码
var flag = true;
$("#txt").on("compositionstart", function () {
  flag = false;
});
$("#txt").on("compositionend", function () {
  flag = true;
});
$("#txt").on("input", function (e) {
  var _this = this;
  setTimeout(function () {
    // \u5357\u4eac\u5e02
    if (flag) {
      if (e.target.value.length == 1) {
        e.target.value = e.target.value.replace(/^((?!\u5357).)*/, "");
      } else if (e.target.value.length == 2) {
        e.target.value = e.target.value.replace(/^((?!(\u5357\u4eac)).)*/, "");
      } else if (e.target.value.length > 2) {
        e.target.value = e.target.value
          .substr(0, 3)
          .replace(/^((?!(\u5357\u4eac\u5e02)).)*/, "");
      }
    }
  }, 0);
});
```

### 获取文件后缀、即文件类型
```js
/\.([0-9a-z]+)(?:[\?#]|$)/i
```


### console.log 打印

```js
console.log(
  "%c vue-aplayer %c v".concat("2.0.0-beta.5", " ").concat("dd10c50", " %c"),
  "background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff",
  "background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff",
  "background: transparent"
);
```

### 高强度密码（中英文数字特殊字符）
```js
/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{2,5}/
```
