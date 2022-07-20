---
title: 【vue】了解
date: 2017-12-28
categories:
  - 前端

tags:
  - vue
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/26.jpg)

<!-- more -->

## vue 实例

```js
    控制台选中当前元素,$0.__vue__
    或者{...document.quertSelector('').__vue__}
```
## push跳转新页面
```js
  const push = this.$router.resolve({
      name: 'xxxxx'
  })
  window.open(push.href, '_blank')
```

## routerlink添加禁用
```js
<router-link 
  :is="isDisabled ? 'span' : 'router-link'"
  to="/link"
>
```