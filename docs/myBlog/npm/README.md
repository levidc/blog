---
title: npm包汇总
date: 2021-12-02
categories:
  - 前端

tags:
  - vue
  - npm

sticky: 2
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/44.jpg)

<!-- more -->

## mockjs

```js
npm install mockjs
```

```js
建立mock文件夹，建立index.js
import Mock from 'mockjs'
import loginAPI from './login'
export default Mock
main.js引入Mock
import './mock'


// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// 方法 请求url，请求方式，请求返回数据
Mock.mock( rurl, rtype, template|function(){} )

Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
请求url设置为正则，可以拦截get携带参数的请求

返回数据若用function处理，function(data)
如
{url: '/test/mock', type: 'POST', body: '{"p1":"123","p2":"456"}'}
请求参数为JSON格式字符串，再进一步处理
```

```js
模拟数据相关方法;
```

## js-cookie

```js
快捷处理cookie
引入使用，封装方法暴露
import Cookie from "js-cookie";
export function xxx() {
  return Cookies.remove(TokenKey);
}
api;
| 字符 |    描述    | 案例 |
| ---- | :--------: | ---- |
| get  |获取cookie    | Cookies.get(TokenKey);  |
| set| 设置cookie | Cookies.set(TokenKey);  |
| remove| 删除cookie | Cookies.remove(TokenKey);  |

设定expire有效期
Cookie.set('key','value',{ expires: 7 })
值为天数||Date对象

new Date(new Date().getTime() + 15 * 60 * 1000);
数字1=1天=24h=24*60min，半天:{expires:0.5},1h = 1/24,30min = 1/(24*60)*30 = 1/48

如果value为对象或者数组，自动存储为json格式，相当于 JSON.stringify()
获取可以使用getJSON()处理 相当于 JSON.parse()

cookie存储最大4M

```
