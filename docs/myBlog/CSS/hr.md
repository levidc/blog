---
title: hr标签的美化
date: 2021-11-25
categories:
  - 前端
tags:
  - css
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/35.jpg)

<!-- more -->

```html
<hr class="hr-solid-content" data-content="分隔线" />
<hr class="hr-solid-content" data-content="文字自适应，背景透明" />
```

```css
.hr-solid-content {
	color: #a2a9b6;
	border: 0;
	font-size: 12px;
	padding: 1em 0;
	position: relative;
}
.hr-solid-content::before {
	content: attr(data-content);
	position: absolute;
	padding: 0 1ch;
	line-height: 1px;
	border: solid #d0d0d5;
	border-width: 0 99vw;
	width: fit-content;
	/* for IE浏览器 */
	white-space: nowrap;
	left: 50%;
	transform: translateX(-50%);
}
```

![效果图](/assets/studyImg/hr.jpg)

![其他效果参考](https://www.haorooms.com/post/css_hr_line)
