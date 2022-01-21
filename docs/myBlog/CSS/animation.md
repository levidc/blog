---
title: CSS动画
date: 2022-01-18
categories:
  - 前端
tags:
  - css
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/47.jpg)

<!-- more -->

## transform

### rotate

```js
rotate:旋转，默认旋转中心在元素中心点，可设置transform-origin 方位或者px单位来决定旋转中心
transform:rotate(30deg) 顺时针方向旋转30°
可指定围绕x、y、z轴旋转，rotateX||rotateY||rotateZ
```

### translate

```js
translate:位移,水平、竖直方向移动，
trasnlateX、trasnlateY、trasnlateZ
```

### scale

```js
scale: 缩放;
```

### skew

```js
skew 函数定义了一个元素在二维平面上的倾斜转换;
```

## transition

```js

CSS transitions 提供了一种在更改CSS属性时控制动画速度的方法。 其可以让属性变化成为一个持续一段时间的过程，而不是立即生效的。比如，将一个元素的颜色从白色改为黑色，通常这个改变是立即生效的，使用 CSS transitions 后该元素的颜色将逐渐从白色变为黑色，按照一定的曲线速率变化。这个过程可以自定义。

通常将两个状态之间的过渡称为隐式过渡（implicit transitions），因为开始与结束之间的状态由浏览器决定。


一些CSS属性可以是动画的，也就是说，当它的值改变时，或者当 CSS动画或 CSS转换使用时，它可以以平滑的方式改变。
可动画属性的列表是：






transition单独设置属性值
  transition-property: background-color, color;
  transition-duration: 1s;
  transition-timing-function: ease-out;
可统一设置，transition: property(all), time(1s), timimg-function(linear)
```

| 实例                               |                实例                | 实例                                |
| ---------------------------------- | :--------------------------------: | ----------------------------------- | ------------------- |
| -moz-outline-radius                |   -moz-outline-radius-bottomleft   | -moz-outline-radius-bottomright     |
| -moz-outline-radius-topleft        |    -moz-outline-radius-topright    | -ms-grid-columns (en-US)            |
| -ms-grid-rows (en-US)              |         -webkit-line-clamp         | -webkit-text-fill-color (en-US)     |
| -webkit-text-stroke                | -webkit-text-stroke-color (en-US)  | accent-color (en-US)                |
| all                                |          backdrop-filter           | background                          |
| background-color                   |        background-position         | background-size                     |
| block-size                         |               border               | border-block-end                    |
| border-block-end-color (en-US)     |   border-block-end-width (en-US)   | border-block-start (en-US)          |
| border-block-start-color (en-US)   |  border-block-start-width (en-US)  | border-bottom                       |
| border-bottom-color                |     border-bottom-left-radius      | border-bottom-right-radius          |
| border-bottom-width                |            border-color            | border-end-end-radius (en-US)       |
| border-end-start-radius (en-US)    |        border-image-outset         | border-image-slice                  |
| border-image-width                 |     border-inline-end (en-US)      | border-inline-end-color (en-US)     |
| border-inline-end-width (en-US)    |    border-inline-start (en-US)     | border-inline-start-color (en-US)   |
| border-inline-start-width (en-US)  |            border-left             | border-left-color                   |
| border-left-width                  |           border-radius            | border-right                        |
| border-right-color                 |         border-right-width         | border-start-end-radius (en-US)     |
| border-start-start-radius (en-US)  |             border-top             | border-top-color                    |
| border-top-left-radius             |      border-top-right-radius       | border-top-width                    |
| border-width                       |               bottom               | box-shadow                          |
| caret-color                        |                clip                | clip-path                           |
| color                              |            column-count            | column-gap                          |
| column-rule                        |         column-rule-color          | column-rule-width                   |
| column-width (en-US)               |              columns               | filter                              |
| flex                               |             flex-basis             | flex-grow                           | flex-shrink         |
| font                               |             font-size              | font-size-adjust                    |
| font-stretch                       |      font-variation-settings       | font-weight                         |
| gap                                |      grid-column-gap (en-US)       | grid-gap (en-US)                    |
| grid-row-gap (en-US)               |       grid-template-columns        | grid-template-rows                  |
| height                             |            inline-size             | input-security                      |
| inset (en-US)                      |        inset-block (en-US)         | inset-block-end (en-US)             |
| inset-block-start (en-US)          |        inset-inline (en-US)        | inset-inline-end (en-US)            |
| inset-inline-start (en-US)         |                left                | letter-spacing                      |
| line-clamp                         |            line-height             | margin                              |
| margin-block-end (en-US)           |         margin-block-start         | margin-bottom                       |
| margin-inline-end (en-US)          |    margin-inline-start (en-US)     | margin-left                         |
| margin-right                       |             margin-top             | mask                                |
| mask-border                        |       mask-position (en-US)        | mask-size (en-US)                   |
| max-block-size (en-US)             |             max-height             | max-inline-size (en-US)             |
| max-lines                          |             max-width              | min-block-size (en-US)              |
| min-height                         |      min-inline-size (en-US)       | min-width                           | object-position     |
| offset                             |       offset-anchor (en-US)        | offset-distance (en-US)             | offset-path (en-US) |
| offset-position (en-US)            |       offset-rotate (en-US)        | opacity                             |
| order                              |              outline               | outline-color                       |
| outline-offset                     |           outline-width            | padding                             |
| padding-block-end (en-US)          |    padding-block-start (en-US)     | padding-bottom                      |
| padding-inline-end (en-US)         |        padding-inline-start        | padding-left                        |
| padding-right                      |            padding-top             | perspective                         |
| perspective-origin                 |               right                | rotate                              |
| row-gap                            |               scale                | scroll-margin                       |
| scroll-margin-block (en-US)        |  scroll-margin-block-end (en-US)   | scroll-margin-block-start (en-US)   |
| scroll-margin-bottom (en-US)       |    scroll-margin-inline (en-US)    | scroll-margin-inline-end (en-US)    |
| scroll-margin-inline-start (en-US) |     scroll-margin-left (en-US)     | scroll-margin-right (en-US)         |
| scroll-margin-top                  |       scroll-padding (en-US)       | scroll-padding-block (en-US)        |
| scroll-padding-block-end (en-US)   | scroll-padding-block-start (en-US) | scroll-padding-bottom (en-US)       |
| scroll-padding-inline (en-US)      | scroll-padding-inline-end (en-US)  | scroll-padding-inline-start (en-US) |
| scroll-padding-left (en-US)        |    scroll-padding-right (en-US)    | scroll-padding-top (en-US)          |
| scroll-snap-coordinate             |      scroll-snap-destination       | scrollbar-color                     |
| shape-image-threshold              |            shape-margin            | shape-outside                       |
| tab-size                           |          text-decoration           | text-decoration-color               |
| text-decoration-thickness          |       text-emphasis (en-US)        | text-emphasis-color (en-US)         |
| text-indent                        |            text-shadow             | text-underline-offset (en-US)       |
| top                                |             transform              | transform-origin                    |
| translate                          |           vertical-align           | visibility                          | width               |
| word-spacing                       |              z-index               | zoom (en-US)                        |
