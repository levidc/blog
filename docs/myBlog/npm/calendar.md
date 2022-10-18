---
title: calendar
date: 2022-10-18
categories:
  - 前端

tags:
  - vue3
  - npm

---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/59.jpg)

<!-- more -->

## 安装使用

```js
npm install --save @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/vue3 @fullcalendar/timegrid
npm install moment

import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
```

## 部分属性
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

## 数据处理
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
