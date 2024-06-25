---
title: 【vue】了解
date: 2017-12-28
categories:
  - 前端

tags:
  - vue2
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

## keep-alive
```js
<keep-alive> 组件用于缓存和重用组件，以提高应用性能。<keep-alive> 可以包含要缓存的组件，可以使用 include 属性来指定要缓存的组件名称。

<keep-alive include="cacheView">
  <router-view></router-view>
</keep-alive>

cacheView可以是字符串"routeA,routeB" 或者数组 ['routerA','routeB']、或者正则表达式等等
exclude则同include相反、不缓存列表

还可以通过meta 设置route来设置缓存如下


<keep-alive>
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>

注意点 include中的路由name是根据注册到route中的每个component的name
```

## activated与deactived
```js
keep-alive中的组件会执行这两种钩子函数
首次进入created=>mounted=>activated
leave=>deactivated
```
