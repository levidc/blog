---
title: echarts基础
date: 2021-11-29
categories:
  - 前端
tags:
  - js
  - echarts
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/37.jpg)

<!-- more -->

## echarts 基本介绍

```js
Echarts-介绍
常见的数据可视化库：
1 D3.js 目前 Web 端评价最高的 Javascript 可视化工具库(入手难)
2 ECharts.js 百度出品的一个开源 Javascript 数据可视化库
3 Highcharts.js 国外的前端数据可视化库，非商用免费，被许多国外大公司所使用
4 AntV 蚂蚁金服全新一代数据可视化解决方案 等等
5 Highcharts 和 Echarts 就像是 Office 和 WPS 的关系
```

:::tip
ECharts，一个使用 JavaScript 实现的开源可视化库，可以流畅的运行在 PC 和移动设备上，
兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari 等），
底层依赖矢量图形库 ZRender，提供直观，交互丰富，可高度个性化定制的数据可视化图表。
:::

## vue 中使用

```js
全局注入
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
--------------------------------------------------------------------------
按需引入
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	DatasetComponentOption,
	TransformComponent,
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	BarChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
])

// 接下来的使用就跟之前一样，初始化图表，设置配置项
var myChart = echarts.init(document.getElementById('main'))
myChart.setOption({
	// ...
})
```

## 初始化容器

```js
1 指定容器宽度和高度
<div id="main" style="width: 600px;height:400px;"></div>
<script type="text/javascript">
  var myChart = echarts.init(document.getElementById('main'));
</script>
//需要注意的是，使用这种方法在调用 echarts.init 时需保证容器已经有宽度和高度了。

2 指定图表的宽高
//如果图表容器不存在宽度和高度，或者，你希望图表宽度和高度不等于容器大小，也可以在初始化的时候指定大小。
<div id="main"></div>
<script type="text/javascript">
  var myChart = echarts.init(document.getElementById('main'), null, {
    width: 600,
    height: 400
  });
</script>

3 相应容器大小变化
window.onresize = function(){
  chart.resize()
}

4 容器节点销毁
echartsInstance.dispose() 销毁实例
```

## 坐标轴

```js
xAxis:{
  type://坐标轴类型
  boundaryGap: //
  axisTick: { //刻度尺
    alignWithLabel: true, //刻度对齐
    lineStyle: {
      color: 'red',
      width: 5,
      tpye: 'solid',
    },
  },
}
```

## 加载动画

```js
chart.showLoading;
(异步请求done) => {
	chart.hideLoading();
  chart.showLoading.setOption(...)
}
```
