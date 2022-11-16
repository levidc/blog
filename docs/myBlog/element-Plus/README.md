---
title: element-plus常用组件及问题
date: 2022-08-09
categories:
  - 前端

tags:
  - vue3
  - element-plus
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/58.jpg)

<!-- more -->

## ElCascaderPanel
```js
组合dropdown使用
级联按钮
点击后关闭dropdown可结合打开dialog自动关闭dropdown
也可使用dropdown方法 handleClose()

// 清除数据回显
paneR.value.clearCheckedNodes()
pane.value = ''
// 清除面板结构数据回显
paneR.value.menuList.length = 1
paneR.value.menus.length = 1

```