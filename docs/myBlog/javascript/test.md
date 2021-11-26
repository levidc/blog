---
title: md代码渲染
date: 2019-05-03
categories:
 - 前端
tags:
 - js
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/11.jpg)

<!-- more -->

<p class="demo" :class="$style.example"></p>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ['slot-key'],
  mounted () {
    console.log(this)
    document.querySelector(`.${this.$style.example}`)
      .textContent = '这个块是被内联的脚本渲染的，样式也采用了内联样式。'
  }
}
</script>