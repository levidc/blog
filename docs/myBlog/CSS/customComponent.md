---
title: 自定义常用组件样式
date: 2022-01-27
categories:
  - 前端
tags:
  - css
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/50.jpg)

<!-- more -->

## 单选框

```html
<label for="123">
  <input type="radio" name="rr" id="123" /><span>123</span></label
>

<label for="456">
  <input type="radio" name="rr" id="456" /><span>456</span></label
>
```

```css
input[type="radio"] {
  opacity: 0;
}
input[type="radio"] + span:before {
  content: "";
  background: #f4f4f4;
  border-radius: 100%;
  display: inline-block;
  width: 18px;
  height: 18px;
  position: relative;
  top: 17px;
  vertical-align: top;
  cursor: pointer;
  text-align: center;
  -webkit-transition: all 250ms ease;
  transition: all 250ms ease;
  left: -6px;
}
input[type="radio"]:checked + span:before {
  background: #ff8746;
  box-shadow: inset 0 0 0 3px #f4f4f4;
}
input[type="radio"]:focus + span:before {
  outline: none;
  border-color: #ff8746;
}
input + span {
  height: 30px;
  font-size: 20px;
}
```

## 复选框

```html
<div class="checkB">
  <input type="checkbox" id="a1" />
  <label for="a1"></label>a
</div>
```

```css
.checkB label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #6c7a7f;
  background-color: #19272e;
  box-shadow: 0 0 0 2px #6c7a7f inset;
  box-sizing: border-box;
}
input[type="checkbox"]:checked + label {
  box-shadow: none;
  background-color: #6c7a7f;
}
input[type="checkbox"]:checked + label::before {
  content: "";
  box-sizing: border-box;
  border: 4px solid #ff8746;
  width: 8px;
  height: 17px;
  transform: rotate(45deg);
  display: inline-block;
  border-top: none;
  border-left: none;
  position: relative;
  top: 0px;
  left: 6px;
}
```

## input 填充背景色

```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #19272f inset !important;
  transition-delay: 99999s;
  transition: color 99999s ease-out, background-color 99999s ease-out;
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
  -webkit-text-fill-color: #807c7c;
}
```

## placeholder

```css
::-webkit-input-placeholder {
  text-align: center;
  -webkit-text-fill-color: #ff8746;
  color...
}
:-moz-placeholder {
  text-align: center;
  color...


:-ms-input-placeholder {
  text-align: center;
  color...

}

```

## 滚动条

```css
/* IE 浏览器 */
.scrollbar {
  /*三角箭头的颜色*/
  scrollbar-arrow-color: #fff;
  /*滚动条滑块按钮的颜色*/
  scrollbar-face-color: #0099dd;
  /*滚动条整体颜色*/
  scrollbar-highlight-color: #0099dd;
  /*滚动条阴影*/
  scrollbar-shadow-color: #0099dd;
  /*滚动条轨道颜色*/
  scrollbar-track-color: #0066ff;
  /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
  scrollbar-3dlight-color: #0099dd;
  /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
  scrollbar-darkshadow-color: #0099dd;
  /*滚动条基准颜色*/
  scrollbar-base-color: #0099dd;
}

/* chrome & safari 浏览器 */
/*滚动条整体部分,必须要设置*/
.scrollbar::-webkit-scrollbar {
  width: 10px;
}
/*滚动条的轨道*/
.scrollbar::-webkit-scrollbar-track {
  background-color: #ff8746;
}
/*滚动条的滑块按钮*/
.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #f00;
  box-shadow: inset 0 0 5px #f00;
}
/*滚动条的上下两端的按钮*/
/* .scrollbar::-webkit-scrollbar-button {
        height: 0;
      } */
```
