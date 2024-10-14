---
title: npm包汇总
date: 2021-12-02
categories:
  - 前端

tags:
  - vue2
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
## vuei18n


## calendar

### 安装使用

```js
npm install --save @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/vue3 @fullcalendar/timegrid
npm install moment

import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
```

### 部分属性
```html
<FullCalendar ref="fullCalendar" :options="calendarOptions" />
```
```js
  const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'dayGridMonth', // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
  firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推,
  locale: 'zh-cn', // 切换语言，当前为中文
  eventColor: '#3BB2E3', // 全部日历日程背景色
  themeSystem: 'bootstrap', // 主题色(本地测试未能生效)
  initialDate: moment().format('YYYY-MM-DD'), // 自定义设置背景颜色时一定要初始化日期时间
  timeGridEventMinHeight: '20', // 设置事件的最小高度
  // height: ,
  aspectRatio: 1.65, // 设置日历单元格宽度与高度的比例。
  displayEventTime: false, // 是否显示时间
  allDaySlot: false, // 周，日视图时，all-day 不显示
  eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
  headerToolbar: {
    // 日历头部按钮位置
    left: '',
    center: 'prevYear,prev title next,nextYear',
    right: 'today'
    // right: 'today dayGridMonth,timeGridWeek,timeGridDay'
  },
  // 替代默认点击btn 切换时间事件、自定义传递时间 获取工作计划
  customButtons: {
    prev: {
      click: preClick
    },
    next: {
      click: nextClick
    },
    prevYear: {
      click: prevYearClick
    },
    nextYear: {
      click: nextYearClick
    }
  },
  buttonText: {
    today: '今天'
    // month: '月'
    // week: '周',
    // day: '日'
  },
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false // 设置时间为24小时
  },
  eventLimitNum: {
    // 事件显示数量限制(本地测试未能生效)
    dayGrid: {
      eventLimit: 5
    },
    timeGrid: {
      eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
    }
  },
  // 事件
  dateClick: handleDateClick,
  eventClick: handleEventClick, // 点击日历日程事件
  // eventDblClick: handleEventDblClick, // 双击日历日程事件 (这部分是在源码中添加的)
  // eventClickDelete: this.dat, // 点击删除标签事件 (这部分是在源码中添加的)
  // eventDrop: this.eventDrop, // 拖动日历日程事件
  // eventResize: this.eventResize, // 修改日历日程大小事件
  // select: handleDateSelect, // 选中日历格事件
  eventDidMount: eventDidMount, // 安装提示事件
  // loading: this.loadingEvent, // 视图数据加载中、加载完成触发（用于配合显示/隐藏加载指示器。）
  // selectAllow: this.selectAllow, //编程控制用户可以选择的地方，返回true则表示可选择，false表示不可选择
  eventMouseEnter: eventMouseEnter, // 鼠标滑过
  allowContextMenu: true,
  editable: false, // 是否可以进行（拖动、缩放）修改
  eventStartEditable: true, // Event日程开始时间可以改变，默认true，如果是false其实就是指日程块不能随意拖动，只能上下拉伸改变他的endTime
  eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认true，如果是false则表示开始结束时间范围不能拉伸，只能拖拽
  selectable: true, // 是否可以选中日历格
  selectMirror: true,
  selectMinDistance: 0, // 选中日历格的最小距离
  dayMaxEvents: true,
  weekends: true, // 显示周末
  navLinks: true, // 天链接
  selectHelper: false,
  slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
  // events: [
  //   {
  //     title: 'test',
  //     start: '2022-10-01',
  //     end: '2022-10-01'
  //   }
  // ]
  sventSource: event.value
  // events: event.value
})
```

### 数据处理
```js
event {
  title:'计划title字段',
  start:'开始时间',
  end:'结束时间',
  color:'背景色',
  classNames:['']
  数据源时间格式需要进行转换如(YYYY-MM-DD HH:mm:ss 或者 YYYY-MM-DD)
  故请求接口数据时候时间戳等借助  moment(time).format('YYYY-MM-DD HH:mm:ss')

  数据展示 获取数据 异步后 调用api展示
  calendarApi.addEventSource(event.value)
  此时 修改数据后 再次刷新视图
  需要清空原数据再调用api
  calendarApi.removeAllEventSources(event.value)
  calendarApi.addEventSource(event.value)

  =================================
  const fullCalendar = ref()
  calendarApi = fullCalendar.value.getApi()

}

```

## draggable


## vuedraggable

```js
yarn add vuedraggable
npm i -S vuedraggable
```

| 属性名称            |                                                             说明                                                             |
| ------------------- | :--------------------------------------------------------------------------------------------------------------------------: | ------------------------- |
| group               |                                           :group= "name"，相同的组之间可以相互拖拽                                           |
| sort                |                    :sort= "true",是否开启内部排序,如果设置为 false,它所在组无法排序，在其他组可以拖动排序                    |
| delay               |                                             :delay= "0", 鼠标按下后多久可以拖拽                                              |
| touchStartThreshold |                                                 鼠标移动多少 px 才能拖动元素                                                 |
| disabled            |                                              :disabled= "true",是否启用拖拽组件                                              |
| animation           |                      拖动时的动画效果，还是很酷的,数字类型。如设置 animation=1000 表示 1 秒过渡动画效果                      |
| handle              |                              :handle=".mover" 只有当鼠标移动到 css 为 mover 类的元素上才能拖动                               |
| filter              |                                    :filter=".unmover" 设置了 unmover 样式的元素不允许拖动                                    |
| draggable           |                                          :draggable=".item" 那些元素是可以被拖动的                                           |
| ghostClass          | :ghostClass="ghostClass" 设置拖动元素的占位符类名,你的自定义样式可能需要加!important 才能生效，并把 forceFallback 属性设置成 | true                      |
| chosenClass         |  :ghostClass="hostClass" 被选中目标的样式，你的自定义样式可能需要加!important 才能生效，并把 forceFallback 属性设置成 true   |
| dragClass           |    :dragClass="dragClass"拖动元素的样式，你的自定义样式可能需要加!important 才能生效，并把 forceFallback 属性设置成 true     |
| dataIdAttr          |                                                    dataIdAttr: 'data-id'                                                     |
| forceFallback       | 默认 false，忽略 HTML5 的拖拽行为，因为 h5 里有个属性也是可以拖动，你要自定义 ghostClass chosenClass dragClass 样式时，建议  | forceFallback 设置为 true |
| fallbackClass       |                                              默认 false，克隆的 DOM 元素的类名                                               |
| allbackOnBody       |                                          默认 false，克隆的元素添加到文档的 body 中                                          |
| fallbackTolerance   |                                                    拖拽之前应该移动的 px                                                     |
| scroll              |                                               默认 true,有滚动区域是否允许拖拽                                               |
| scrollFn            |                                                         滚动回调函数                                                         |
| scrollSensitivity   |                                                距离滚动区域多远时，滚动滚动条                                                |
| scrollSpeed         |                                                           滚动速度                                                           |

```js
group 相同组名之间可以相互拖拽 gruop="name"
delay 鼠标按下后等待n秒才允许拖动，此属性可以一定程度上防止误触操作 如 delay="1000"
disabled 通过disabled属性实现开启或禁用vue.draggable的拖拽效果。:disabled="disabled"
scroll	默认为true,容器有滚动条时是否允许拖动到被隐藏的区域
animation 通过animation属性设置vue.draggable过渡效果，这样拖动时过渡位置就不会显的太生硬。
handle	指定可拖动元素的样式名称 如handle=".className" 拖拽指定类名的容器可拖动元素

filter	禁止拖动元素的样式名称 类似handle 指定容器的类名，如 filter="ban"  class="ban"
结合onMove使用 如例使得拖拽到第一行的元素失效，再禁止第一行拖拽
onMove(e) {
  e  relatedContext 对应拖拽到的相应位置对象
  draggedContext 对应当前拖拽元素的对象
  if (e.relatedContext.element.id == 1) return false;  设置id为1的元素不能被其他元素拖拽移动
  return true // return false阻止拖拽

e对象结构
draggedContext: 被拖拽的元素
      index: 被拖拽的元素的序号
      element: 被拖拽的元素对应的对象
      futureIndex: 预期位置、目标位置
relatedContext: 将停靠的对象
      index: 目标停靠对象的序号
      element: 目标的元素对应的对象
      list:  目标数组
      component: 将停靠的vue组件对象
},
chosenClass 指定拖拽容器的类名，区分该拖拽元素与其他元素
ghostClass  与chosenClass相对应，拖拽时该元素的占位容器样式
```

### 克隆拖拽

```js
:options="{group:{name:'name',pull:'clone'},sort:true}"
pull 设置为clone使得当前可以克隆，设置为''空，则不会克隆。
sort 设置为true会拖拽，为false则禁止拖拽
```

### v-model 和 list 注入数据源

```js
list会随拖拽而数据变化，v-model绑定的value不会变化
注意，它们不能同时出现，只能二选一。
```

### group 中某一个拖空后无法再拖入的 bug

```js
transition-group 设置行内display:block 和 height:auto;
```

### 案例

```html
<template>
  <div>
    <div class="body_top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="always">
            <div style="background-color: #fff">
              <el-form :inline="true">
                <el-form-item label="模块标识：" prop="molds">
                  <el-input
                    v-model="top_form.molds"
                    controls-position="right"
                    placeholder="请输入模块标识"
                    class="ele-fluid ele-text-left"
                  />
                </el-form-item>
                <el-form-item label="模块名称：" prop="name">
                  <el-input
                    v-model="top_form.name"
                    controls-position="right"
                    placeholder="请输入模块名称"
                    class="ele-fluid ele-text-left"
                  />
                </el-form-item>
                <el-form-item label="状态码：" prop="state">
                  <el-input
                    v-model="top_form.state"
                    controls-position="right"
                    placeholder="请输入状态码"
                    class="ele-fluid ele-text-left"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button @click="showEdit=false">取消</el-button>
                  <el-button type="primary" @click="formSave">保存</el-button>
                  <el-button type="primary" @click="consoleComp(1)"
                    >查看组件1</el-button
                  >
                  <el-button type="primary" @click="consoleComp(2)"
                    >查看组件2</el-button
                  >
                  <el-button type="primary" @click="consoleComp(3)"
                    >查看选中组件</el-button
                  >
                </el-form-item>
              </el-form>
            </div></el-card
          >
        </el-col>
      </el-row>
    </div>
    <div class="ele-body">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-card shadow="never">
            <div class="col">
              <el-row>
                <div class="base_title">基础字段</div>
                <el-divider></el-divider>
                <draggable
                  v-model="arr1"
                  @unchoose="addTo"
                  @end="end1"
                  :options="{ group: { name: 'tt', pull: 'clone' },sort: false,}"
                  animation="300"
                  style="width: 100%; min-height: 330px"
                  class="component"
                  :move="onMove"
                >
                  <!-- <transition-group> -->
                  <div v-for="item in arr1" :key="item.id">
                    <div class="base_style">
                      <span class="el-icon-circle-check icon"></span>
                      {{ item.name }}
                    </div>
                  </div>
                  <!-- </transition-group> -->
                </draggable>
              </el-row>
              <el-row>
                <div class="base_title remark_margin">特殊字段</div>
                <el-divider></el-divider>
                <draggable
                  v-model="arr2"
                  @unchoose="addTo2"
                  @end="end1"
                  :options="{ group: { name: 'tt', pull: 'clone' }, sort: false,}"
                  animation="300"
                  style="width: 100%; min-height: 330px"
                  class="component"
                  :move="onMove"
                >
                  <!-- <transition-group> -->
                  <div v-for="item in arr2" :key="item.id">
                    <div class="base_style">
                      <span class="el-icon-circle-check icon"></span>
                      {{ item.name }}
                    </div>
                  </div>
                  <!-- </transition-group> -->
                </draggable>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never">
            <div class="col">
              <draggable
                v-model="arr3"
                :options="{ group: { name: 'tt', pull: '' }, sort: true,}"
                animation="300"
                :move="onMove"
                style="width: 100%; min-height: 330px"
              >
                <!-- <transition-group> -->
                <div v-for="(item, index) in arr3" :key="index">
                  <div
                    v-if="item.type == 'text'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i
                      ></el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'textarea'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border static_textarea">
                        <span class="static_bias">//</span>
                      </div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i
                      ></el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'select'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border static_textarea">
                        <span class="el-icon-arrow-down static_select"></span>
                      </div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'number'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'radio'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="circle_wrap">
                      {{ item.name }}
                      <span class="static_circle"></span>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'checkbox'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="circle_wrap">
                      {{ item.name }}
                      <span class="static_react"></span>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'datetime'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      <span> {{ item.name }} </span>
                      <div class="static_border static_textarea">
                        <span class="el-icon-time static_time"></span>
                      </div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'daterange'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border static_textarea">
                        <span class="el-icon-date static_time"></span>
                      </div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'place'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'image'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="image_wrap">
                      {{ item.name }}
                      <span
                        style="font-size: 40px; line-height: 60px"
                        class="el-icon-picture"
                      ></span>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'file'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="file_wrap">
                      {{ item.name }}
                      <div class="static_file">点击上传</div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'tel'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'button'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="file_wrap">
                      {{ item.name }}
                      <div class="static_file"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'signature'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'content'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border"></div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'city'"
                    class="base_margin"
                    @click="showMenu(item)"
                  >
                    <div class="static_wrap">
                      {{ item.name }}
                      <div class="static_border static_textarea">
                        <span class="el-icon-arrow-down static_select"></span>
                      </div>
                    </div>
                    <div>
                      <el-button type="text" @click="deleteDomain(index)"
                        ><i class="el-icon-delete"></i>
                      </el-button>
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'example'"
                    class="base_margin"
                    style="visibility:hidden;"
                  >
                    <div class="static_wrap">
                      <span style="color: red">{{ item.name }}</span>
                      <div class="static_border"></div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <!-- </transition-group> -->
              </draggable>
            </div></el-card
          ></el-col
        >
        <el-col :span="7"
          ><el-card shadow="never">
            <div class="col">
              <div
                style="
                  text-align: center;
                  margin-bottom: 10px;
                  font-weight: bold;
                  color: rgb(2, 167, 240);
                "
              >
                字段属性
              </div>
              <el-divider></el-divider>
              <div v-if="isShow">
                <el-form
                  :model="controlForm"
                  ref="controlForm"
                  label-width="100px;"
                >
                  <div class="remark_margin">控件说明</div>
                  <div class="remark_margin">
                    此控件 {{ controlForm.remark }}
                  </div>
                  <div class="remark_margin">大小：</div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-around;
                      margin-bottom: 10px;
                    "
                  >
                    <div>
                      长
                      <el-input
                        class="base_input"
                        v-model="controlForm.height"
                      ></el-input>
                    </div>
                    <div>
                      宽
                      <el-input
                        class="base_input"
                        v-model="controlForm.width"
                      ></el-input>
                    </div>
                  </div>
                  <el-form-item label="标题："
                    ><el-input
                      v-model="controlForm.label"
                      style="width: calc(100% - 20px)"
                    ></el-input
                  ></el-form-item>
                  <el-form-item
                    ><el-checkbox-group v-model="controlForm.checkList">
                      <el-checkbox label="1">显示标题</el-checkbox>
                      <el-checkbox label="2"
                        >换行</el-checkbox
                      ></el-checkbox-group
                    ></el-form-item
                  >
                  <el-form-item label="提示文字："
                    ><el-input
                      v-model="controlForm.placeholder"
                      style="width: calc(100% - 20px)"
                    ></el-input
                  ></el-form-item>
                  <el-form-item label="默认值："
                    ><el-select v-model="controlForm.default">
                      <el-option label="自定义" :value="1" />
                      <el-option label="关联系统表" :value="2" /> </el-select
                  ></el-form-item>
                  <el-form-item label="选格式："
                    ><el-select v-model="controlForm.format">
                      <el-option label="文本" :value="1" />
                      <el-option label="手机号" :value="2" />
                      <el-option label="邮箱" :value="3" />
                      <el-option label="身份证号" :value="4" />
                      <el-option label="邮政编码" :value="5" /> </el-select
                  ></el-form-item>
                  <div style="margin-bottom: 20px">校验：</div>
                  <el-form-item>
                    <el-checkbox-group v-model="controlForm.checked">
                      <el-checkbox label="1">必填</el-checkbox
                      ><el-checkbox label="2">不允许重复</el-checkbox
                      ><el-checkbox label="3"
                        >脱敏</el-checkbox
                      ></el-checkbox-group
                    >
                  </el-form-item>
                  <div style="margin-bottom: 20px">字段权限：</div>
                  <el-form-item>
                    <el-checkbox-group v-model="controlForm.force">
                      <el-checkbox label="3">指定人员可见</el-checkbox>
                      <el-checkbox label="1">可见</el-checkbox
                      ><el-checkbox label="2">可编辑</el-checkbox
                      ><el-checkbox label="4">指定人员可编辑</el-checkbox
                      ><el-checkbox label="5">导入</el-checkbox
                      ><el-checkbox label="6"
                        >导出</el-checkbox
                      ></el-checkbox-group
                    >
                  </el-form-item>
                </el-form>
                <div
                  slot="footer"
                  style="display: flex; justify-content: center"
                >
                  <el-button icon="el-icon-close">重置</el-button>
                  <el-button type="primary" @click="fieldSave">保存</el-button>
                </div>
              </div>
            </div></el-card
          ></el-col
        >
      </el-row>
    </div>
  </div>
</template>
```

```js
//导入draggable组件
import draggable from "vuedraggable";
export default {
  //注册draggable组件
  name: "oa_template_add",
  components: {
    draggable,
  },
  data() {
    return {
      //基本字段
      arr1: [
        { id: 1, icon: "", name: "单行文本框", type: "text" },
        { id: 2, icon: "", name: "多行文本框", type: "textarea" },
        { id: 3, icon: "", name: "下拉列表框", type: "select" },
        { id: 4, icon: "", name: "数字文本框", type: "number" },
        { id: 5, icon: "", name: "单选按钮组", type: "radio" },
        { id: 6, icon: "", name: "复选框组", type: "checkbox" },
        { id: 7, icon: "", name: "日期时间框", type: "datetime" },
        { id: 8, icon: "", name: "日期区间", type: "daterange" },
      ],
      //特殊字段
      arr2: [
        { id: 9, icon: "", name: "地址框", type: "place" },
        { id: 10, icon: "", name: "图片", type: "image" },
        { id: 12, icon: "", name: "附件", type: "file" },
        { id: 13, icon: "", name: "手机号", type: "tel" },
        { id: 14, icon: "", name: "按钮", type: "button" },
        { id: 16, icon: "", name: "手写签名", type: "signature" },
        { id: 15, icon: "", name: "内容联动", type: "content" },
        { id: 17, icon: "", name: "城市级联", type: "city" },
      ],
      // arr3: [{ id: 100, icon: "", name: "示例框", type: "example" }],
      arr3: [],

      controlForm: {
        width: "",
        height: "",
        label: "",
        checkList: [],
        checked: [],
        force: [],
        placeholder: "",
        default: "",
        format: "",
        type: "",
        remark: "",
        id: "",
      },
      //顶部表单
      top_form: {
        name: "",
        molds: "",
        state: "",
        field: [],
      },
      formArr: [],
      isShow: false, //字段属性是否显示
    };
  },
  methods: {
    consoleComp(value) {
      switch (value) {
        case 1:
          console.log(this.arr1);
          break;
        case 2:
          console.log(this.arr2);
          break;
        case 3:
          console.log(this.arr3);
          break;
      }
    },
    addTo2(e) {
      this.arr3.push(this.arr2[e.oldIndex]);
    },
    addTo(e) {
      this.arr3.push(this.arr1[e.oldIndex]);
    },
    //左侧拖动结束时的事件
    end1(e) {
      this.arr3.splice(this.arr3.length - 1, 1);
      let arr5 = [];
      //对数组进行重新赋值，使其id等于下标
      this.arr3.forEach((d, index) => {
        arr5.push({
          id: index,
          name: d.name,
          type: d.type,
        });
      });
      this.arr3 = arr5;
      // console.log(this.arr3);
    },
    //内部拖拽时触发的方法
    onMove(e) {
      console.log(e);
      if (e.to.className == "component") {
        return false;
      }
      //e.draggedContext.index为拖拽前的下标，e.draggedContext.futureIndex为拖拽后的下标
      // console.log(e);
      // console.log(e.draggedContext.index, e.draggedContext.futureIndex);
    },
    //删除按钮
    deleteDomain(index) {
      this.arr3.splice(index, 1);
    },
    //字段表单的显示与隐藏
    showMenu(e) {
      this.isShow = true;
      // console.log(e);
      this.controlForm.remark = e.name;
      this.controlForm.id = e.id;
      this.controlForm.type = e.type;
    },
    //提交字段表单
    fieldSave() {
      this.formArr.push(this.controlForm);
      // console.log(this.controlForm);
      // let newArr = this.top_form.field;
      // newArr.push(this.controlForm);
      // if (newArr.length == 0) {
      //   newArr.push(this.controlForm);
      // } else {
      //   for (var i = 0; i < newArr.length; i++) {
      //     if (newArr[i].id == this.controlForm.id) {
      //       newArr[i] = this.controlForm;
      //       this.$message.warning("警告");
      //     } else {
      //       newArr.push(this.controlForm);
      //       this.$message.success("添加");
      //     }
      //   }
      // }
      // console.log(this.top_form);
    },
    //提交form表单
    formSave() {
      this.top_form.field = this.formArr;
      console.log(this.top_form);
    },
  },
};
```

```css
.col {
  background-color: #fff;
  height: 750px;
  overflow: scroll;
}
.base_title {
  font-size: 18px;
  width: 80px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #000;
  font-weight: bold;
  margin-bottom: 10px;
}
.base_style {
  width: 135px;
  height: 35px;
  border: 1px solid #999;
  line-height: 35px;
  text-align: center;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  text-align: left;
  cursor: pointer;
}
.icon {
  color: rgb(86, 169, 251);
  margin-right: 5px;
  margin-left: 10px;
}
.base_input {
  width: 160px;
}
.base_margin {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: rgba(235, 248, 251, 1);
  height: 80px;
  line-height: 60px;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.remark_margin {
  margin-top: 10px;
  margin-bottom: 10px;
}
.body_top {
  padding: 15px 15px 0 15px;
}
/* 中间静态框css样式 */
.static_wrap {
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.static_border {
  width: 200px;
  height: 36px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #c0c4cc;
  cursor: pointer;
}
.static_textarea {
  position: relative;
}
.static_bias {
  position: absolute;
  right: 2px;
  top: 0;
  font-size: 12px;
}
.static_select {
  position: absolute;
  right: 5px;
  top: 10px;
}
.circle_wrap {
  width: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.static_circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #c0c4cc;
  cursor: pointer;
}
.static_react {
  width: 10px;
  height: 10px;
  border: 1px solid #c0c4cc;
  cursor: pointer;
}
.static_time {
  position: absolute;
  left: 10px;
  top: 10px;
}
.image_wrap {
  width: 135px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.file_wrap {
  width: 180px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.static_file {
  width: 80px;
  height: 40px;
  background-color: rgb(86, 169, 251);
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
}
```

```js
问题
Q:拖拽的组件，点击添加到所需的区域，拖拽也可添加
A:@unchoose 鼠标松开事件，单机鼠标松开，添加到末尾，拖拽自身添加到相应区域，拖拽后再次添加一次，因为触发前边的松开事件。

Q:拖拽的组件与其他拖拽的组件之间 可以拖动产生影响，规定，组件之间不能拖动。
A:设定完option:{clone:false 之后} 单个组件内自身无法拖拽，但同类型的组件间扔有影响，
需要在@onMove(e) {
  console.log(e);
  拖拽时判断是否拖拽到容器是组件，是组件(提前给组件添加统一的类名)就取缔该次拖拽
  if(e.to.className=='component'){
  return false
}

Q:选取的样式，自己定义
A:chosenClass
```







### 案例2
```js
  <draggable v-model="draggableInstance" :group="groupA" animation="300" drag-class="dragClass" ghost-class="ghostClass" chosen-class="chosenClass" :force-fallback="true" @end="end">
    <transition-group :style="style">
      <div v-for="(item,index) in draggableInstance" :key="item.instanceId" class="item">
        <el-tooltip placement="top" style="width:100%" :content="&quot;主机ip:&quot; + item.host + &quot;,&quot; + &quot;端口:&quot; + item.port">
          <div>
            <span>
              {{ item.instanceName }}
            </span>
            <i class="fa el-icon-plus" @click="addTo(index)" />
          </div>
        </el-tooltip>
      </div>
    </transition-group>
  </draggable>

  <draggable v-model="draggableGroup" group="instance" animation="100" drag-class="dragClass" ghost-class="ghostClass" chosen-class="chosenClass" :force-fallback="true">
    <transition-group :style="style">
      <div v-for="(item,index) in draggableGroup" :key="item.instanceId" class="item">
        <div>
          <p>
            {{ item.instanceName }}
          </p>
          <p>
            {{ '主机:' + item.host }}
          </p>
          <p>
            {{ '端口:' + item.port }}
          </p>
        </div>
        <i class="fa fa-trash-o" @click="deleteD(index)" />
      </div>
    </transition-group>
  </draggable>

  // 结构渲染、
  style绑定 data
  style:'min-height:120px;display: flex;flex-wrap:wrap;justify-content:space-between',

    copyDraggableInstance（备份数据）
    deleteD (i) {
    var temp = this.draggableGroup.splice(i, 1)
    this.draggableInstance.push(...temp)
    },
    addTo (index) {
      this.draggableGroup.push(this.draggableInstance[index])
      this.draggableInstance.splice([index], 1)
    },
    resetD () {
      this.draggableGroup.splice(0)
      this.draggableInstance = JSON.parse(JSON.stringify(this.copyDraggableInstance))
    },

    .ghostClass {
      border-radius: 20px;
      background-color: #fff !important;
    }

    .chosenClass {
      background-color: #25363e !important;
      opacity: 1 !important;
    }

    .dragClass {
      overflow: hidden;
      background-color: #25363e !important;
      opacity: 1 !important;
      box-shadow: none !important;
      outline: none !important;
      background-image: none !important;
    }
```



### drag 使用v-dialogDrag
```js
import Vue from 'vue';
// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
	bind(el, binding, vnode, oldVnode) {
		const dialogHeaderEl = el.querySelector('.el-dialog__header');
		const dragDom = el.querySelector('.el-dialog');
		//dialogHeaderEl.style.cursor = 'move';
		dialogHeaderEl.style.cssText += ';cursor:move;'
		dragDom.style.cssText += ';top:0px;'

		// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
		const sty = (function() {
				if (window.document.currentStyle) {
						return (dom, attr) => dom.currentStyle[attr];
				} else{
						return (dom, attr) => getComputedStyle(dom, false)[attr];
				}
		})()

		dialogHeaderEl.onmousedown = function(e){
			// 鼠标按下，计算当前元素距离可视区的距离
			const disX = e.clientX - this.offsetLeft;
			const disY = e.clientY - this.offsetTop;

			const screenWidth = document.body.clientWidth; // body当前宽度
			const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

			const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
			const dragDomheight = dragDom.offsetHeight; // 对话框高度

			const minDragDomLeft = dragDom.offsetLeft;
			const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

			const minDragDomTop = dragDom.offsetTop;
			const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;


			// 获取到的值带px 正则匹配替换
			let styL = sty(dragDom, 'left');
			let styT = sty(dragDom, 'top');

			// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
			if(styL.includes('%')) {
				styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
				styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
			}else {
				styL = +styL.replace(/\px/g, '');
				styT = +styT.replace(/\px/g, '');
			};

			document.onmousemove = function (e) {
				// 通过事件委托，计算移动的距离
				let left = e.clientX - disX;
				let top = e.clientY - disY;
				// 边界处理
				if (-(left) > minDragDomLeft) {
						left = -(minDragDomLeft);
				} else if (left > maxDragDomLeft) {
						left = maxDragDomLeft;
				}

				if (-(top) > minDragDomTop) {
						top = -(minDragDomTop);
				} else if (top > maxDragDomTop) {
						top = maxDragDomTop;
				}

				// 移动当前元素
				dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
			};

			document.onmouseup = function (e) {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
	}
})
```


### pdf导出屏幕截图
```js
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import canvg from 'canvg'




    down () {
      setTimeout(() => {
        const pdf = new jsPDF()
        pdf.setProperties({
          title: 'HTML to PDF',
          subject: 'Generated PDF file using jsPDF library',
          author: 'Your Name',
          keywords: 'html, pdf, javascript',
          creator: 'Your Name'
        })
        const convertToImage = (container, options = {}) => {
          // 滚动到顶部 实现全图截图
          // document.body.scrollTop = document.documentElement.scrollTop = 0

          // 替换svg
          //Svgdom数组
          // 获取到所有的SVG 得到一个数组
          // 遍历这个数组
          var svgElements = document.body.querySelectorAll('svg');


          /**
           * @func
           * @Description
           * bug
           * 1截图文字偏上、定位问题 elementUi字体、
           * 2svg转换问题，解决方案替换为canvas、svg使用use、赞不行、替代svg用i或者svg路径、得手动指定颜色？
           * @Author: your name
           * @param {}
           * @return {}
           */

          let svgNodesToRemove = [];
          // 获取到所有的SVG 得到一个数组
          //以下是对svg的处理
          svgElements.forEach(function (node) {
            //获取svg的父节点
            var parentNode = node.parentNode;
            //获取svg的html代码
            var svg = node.outerHTML.trim();
            //创建一个<canvas>，用于放置转换后的元素
            var canvas = document.createElement('canvas');
            //将svg元素转换为canvas元素
            console.log(node, '1233', svg)
            canvg(canvas, svg);
            //设置新canvas元素的位置
            if (node.style.position) {
              canvas.style.position += node.style.position;
              canvas.style.left += node.style.left;
              canvas.style.top += node.style.top;
            }

            //删除svg元素
            parentNode.removeChild(node);
            //增加canvas元素
            parentNode.appendChild(canvas);
          });

          // 替换svg End  svg 渲染使用<use>标签导致失效
          document.querySelector('.contentMain').scrollTop = 0

          // window放大缩小比例  0.25~5 最小25%~最大5倍的放大比例
          const scale = window.devicePixelRatio

          // 传入节点原始宽高
          const _width = container.scrollWidth
          const _height = container.scrollHeight

          // 页面产生滚动条 需要选择裁切、
          let { width, height } = options
          width = width || _width
          height = height || _height

          // html2canvas配置项
          const ops = {
            scale,
            width,
            height,
            useCORS: false, // 设置跨域
            allowTaint: false,
            windoWidth: width,
            windowHeight: height,
            ...options
          }

          return html2canvas(container, ops).then(canvas => {
            const link = document.createElement('a'); // 创建一个超链接对象实例
            const event = new MouseEvent('click'); // 创建一个鼠标事件的实例
            link.download = 'Button.png'; // 设置要下载的图片的名称
            link.href = canvas.toDataURL('image/png'); // 将图片的URL设置到超链接的href中
            link.dispatchEvent(event); // 触发超链接的点击事件

            // document.querySelectorAll("canvas").forEach(item => {
            //   item.remove()
            // })
            return
            // 返回图片的二进制数据
            console.log(canvas, '12333')
            var contentWidth = canvas.width
            var contentHeight = canvas.height
            // 一页pdf显示html页面生成的canvas高度;
            var pageHeight = (contentWidth / 595.28) * 841.89
            // 未生成pdf的html页面高度
            var leftHeight = contentHeight
            // 页面偏移
            var position = 0
            // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var imgWidth = 595.28
            var imgHeight = (595.28 / contentWidth) * contentHeight
            var pageData = canvas.toDataURL('image/png')
            var pdf = new jsPDF('', 'pt', 'a4')
            // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            // 当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
              // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
              pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
              // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
            } else {
              // 分页
              while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                // 避免添加空白页
                if (leftHeight > 0) {
                  pdf.addPage()
                }
              }
            }
            console.log(imgHeight, 'imgHeight', contentWidth, contentHeight, pageHeight)
            // 保存文件名
            pdf.save('5')
          })
        }
        convertToImage(document.querySelector('body'))
      }, 50);
    },


```
