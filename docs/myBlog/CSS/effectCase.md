---
title: css特效
date: 2022-01-30
categories:
  - 前端
tags:
  - css
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/52.jpg)

<!-- more -->

[更多特效见](https://aspx.sc.chinaz.com/query.aspx?keyword=css3&issale=&classID=0&navindex=0&page=3)

[渐变按钮](https://wow.techbrood.com/static/20161230/31937.html)

## 渐变色按钮

```html
<button class="light-btn">button</button>
```

```css
.light-btn {
  text-decoration: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 400%;
  width: 400px;
  height: 100px;
  line-height: 100px;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  border-radius: 50px;
  z-index: 1;
}

.light-btn:hover::before,
.light-btn:hover {
  animation: sun 8s infinite;
}

.light-btn::before {
  content: "";
  position: absolute;
  left: -5px;
  right: -5px;
  top: -5px;
  bottom: -5px;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 400%;
  border-radius: 50px;
  filter: blur(10px);
  z-index: -1;
}

@keyframes sun {
  100% {
    background-position: -400% 0;
  }
}
```
