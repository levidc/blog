---
title: case
date: 2023-07-17
categories:
  - 前端

tags:
  - echarts
---

![](https://cdn.jsdelivr.net/gh/levidc/blogImg/img/46.jpg)

<!-- more -->

### 拓扑图

### option

```js
  data() {
    return {
      nodes: [
        {
          x: 500,
          y: 1000,
          nodeName: 'mySQL-app1',
          id: 'pod1',
          svgPath: podPath,
          symbolSize: 50
        },
        {
          x: 500,
          y: 770,
          nodeName: 'mySQL',
          svgPath: volumePath,
          symbolSize: 40
        },
        {
          x: -300,
          y: 500,
          nodeName: 'node84',
          svgPath: nodePath,
          symbolSize: 40
        },

        {
          x: 100,
          y: 500,
          nodeName: 'node85',
          svgPath: nodePath,
          symbolSize: 40
        },

        {
          x: 500,
          y: 500,
          nodeName: 'node86',
          svgPath: nodePath,
          symbolSize: 40
        },

        {
          x: 900,
          y: 500,
          nodeName: 'node87',
          svgPath: nodePath,
          symbolSize: 40
        },

        {
          x: -400,
          y: 200,
          nodeName: 'archive1',
          svgPath: archivePath,

          symbolSize: 40

        },
        {
          x: -200,
          y: 200,
          nodeName: 'archive2',
          svgPath: archivePath,

          symbolSize: 40

        },
        {
          x: 0,
          y: 200,
          nodeName: 'archive3',
          svgPath:
            archivePath,

          symbolSize: 40

        },
        {
          x: 200,
          y: 200,
          nodeName: 'archive4',
          svgPath:
            archivePath,

          symbolSize: 40

        },
        {
          x: 400,
          y: 200,
          nodeName: 'archive5',
          svgPath:
            archivePath,

          symbolSize: 40

        },
        {
          x: 600,
          y: 200,
          nodeName: 'archive6',
          svgPath:
            archivePath,

          symbolSize: 40

        },
        {
          x: 800,
          y: 200,
          nodeName: 'archive7',
          svgPath:
            archivePath,

          symbolSize: 40

        },
        {
          x: 1000,
          y: 200,
          nodeName: 'archive8',
          svgPath:
          archivePath,

          symbolSize: 40

        }
      ],
      charts: {
        nodes: [],
        linesData: [
          {
            coords: [[500, 1000], [500, 800]]
          },
          // node
          {
            coords: [[500, 800], [100, 800], [100, 530]]
          },
          {
            coords: [[500, 700], [500, 530]]
          },
          {
            coords: [[500, 800], [900, 800], [900, 530]]
          },
          // archive
          { coords: [[-300, 430], [-400, 230]] },
          { coords: [[-300, 430], [-200, 230]] },
          { coords: [[100, 430], [0, 230]] },
          { coords: [[100, 430], [200, 230]] },
          { coords: [[500, 430], [400, 230]] },
          { coords: [[500, 430], [600, 230]] },
          { coords: [[900, 430], [800, 230]] },
          { coords: [[900, 430], [1000, 230]] }

        ]
      },
      option: {
        backgroundColor: '#19272e',
        xAxis: {
          min: -400,
          max: 1000,
          show: false,
          type: 'value'
        },
        yAxis: {
          min: 0,
          max: 1000,
          show: false,
          type: 'value'
        },
        // tooltip: {
        //   trigger: 'item',
        //   // formatter: '{a} <br/>{b}: {c} ({d}%)'
        //   formatter(params) {
        //     const nodeName = params.data.nodeName
        //     if (nodeName.indexOf('pod') !== -1) {
        //       return nodeName
        //     } else if (nodeName.indexOf('volume') !== -1) {
        //       return nodeName
        //     } else if (nodeName.indexOf('node') !== -1) {
        //       return nodeName
        //     } else if (nodeName.indexOf('archive') !== -1) {
        //       return nodeName
        //     }
        //   },
        //   rich: {
        //     danger: {
        //       color: '#51CEC6',
        //       fontSize: 20
        //     },
        //     normal: {
        //       color: 'lawngreen',
        //       fontSize: 20
        //     },
        //     low: {
        //       color: 'gold',
        //       fontSize: 20
        //     },
        //     medium: {
        //       color: 'lightblue',
        //       fontSize: 20
        //     }
        //   }
        // },
        series: [
          {
            type: 'graph',
            coordinateSystem: 'cartesian2d',
            label: {
              show: true,
              position: 'bottom',
              color: '#d3d6d8',
              fontSize: 14,
              formatter: function(item) {
                return item.data.nodeName
                // const nodeName = item.data.nodeName
                // if (nodeName.indexOf('kafka-app') !== -1) {
                //   return `{normal|${nodeName}}`
                // } else if (nodeName.indexOf('kafka') !== -1) {
                //   return `{danger|${nodeName}}`
                // } else if (nodeName.indexOf('node') !== -1) {
                //   return `{low|${nodeName}}`
                // } else if (nodeName.indexOf('archive') !== -1) {
                //   return `{medium|${nodeName}}`
                // }
              }
              // 节点名颜色
              // rich: {
              //   danger: {
              //     color: '#51CEC6',
              //     fontSize: 20
              //   },
              //   normal: {
              //     color: 'lawngreen',
              //     fontSize: 20
              //   },
              //   low: {
              //     color: '#3a71a8',
              //     fontSize: 20
              //   },
              //   medium: {
              //     color: 'lightblue',
              //     fontSize: 20
              //   }
              // }
            },
            data: [],
            itemStyle: {
              color: function name(params) {
                const colorlist = ['lawngreen', '#51CEC6', 'gray', 'royalblue', '#ff8746', 'lightblue']
                console.log(params)
                const index = params.dataIndex
                if (index === 0) {
                  return colorlist[0]
                } else if (index === 1) {
                  return colorlist[1]
                } else if (index === 2) {
                  return colorlist[2]
                } else if (index > 2 && index < 5) {
                  return colorlist[3]
                } else if (index === 5) {
                  return colorlist[4]
                } else if (index > 5) {
                  console.log(params)
                  return colorlist[5]
                }
              }
            }
          },
          {
            type: 'lines',
            polyline: true,
            coordinateSystem: 'cartesian2d',
            lineStyle: {
              // type: 'dashed',
              type: [10, 5],
              dashOffset: 5,
              width: 2,
              color: '#e6e6e6',
              // color: '#e6e6e6',
              curveness: 0.3
            },
            effect: {
              show: true,
              trailLength: 0.1,
              symbol: 'arrow',
              color: 'orange',
              symbolSize: 8
            },
            data: []
          }
        ]
      }
    }
  },

```

### 渲染赋值

```js
for (var j = 0; j < this.nodes.length; j++) {
  const { x, y, nodeName, svgPath, symbolSize, id } = this.nodes[j];
  var node = {
    id,
    nodeName,
    value: [x, y],
    symbolSize: symbolSize || 30,
    symbol: "path://" + svgPath,
  };
  this.charts.nodes.push(node);
}
this.option.series[0].data = this.charts.nodes;
this.option.series[1].data = this.charts.linesData;
this.$nextTick(() => {
  this.volumeChart = this.$echarts.init(document.getElementById("volume"));
  this.volumeChart.setOption(this.option);
});
```


### tooltip展示echart图表
```js
设置tooltip
triggerOn： 'click' || 'null'
版本支持 echart>=5
再监听 chart mouseover事件 手动触发tooltip的显示
		dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.dataIndex
              })

		dispatchAction({
      type: 'hideTip'
    })




<div>
  <Echarts height="400px" :options="customToolTip()" />
</div>

renderTooltipChart (data, color) {
  const chart = document.getElementById('pieT') && this.$echarts.init(document.getElementById('pieT'))
  const option = {
    // color: [color, '#ebebeb'],
    color: [color, '#ebebeb'],
    title: {
      text: data + '%',
      left: '30',
      top: 'center',
      // top: 'center',
      textStyle: {
        fontSize: 13,
        color: '#d3d6d8'
      }
    },
    series: [
      {
        label: { show: true },
        name: '进度',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: true,
        center: ['30%', '50%'],
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        data: [{ value: data / 100 * 100 }, { value: 100 - data }]
      }
    ]
  }
  chart && chart.setOption(option)
},
    customToolTip () {
      return {
        title: {
          text: 'customToolTip'
        },
        textStyle: {
          color: '#d3d6d8',
          fontSize: '14px',
          fontWeight: 400
        },
        tooltip: {
          trigger: 'item',
          // trigger: 'axis',
          // position: function (pt) {
          //   return [pt[0], '10%']
          // },
          triggerOn: 'none', // 设置none 来主动触发移入时显示
          borderColor: 'transparent',
          backgroundColor: 'rgb(60,76,84,.6)',
          formatter: (type) => {
            const data = type.data.value
            const color = data > 90 ? '#EB6452' : Number(data) >= 80 ? '#f6bd16' : '#5B8FF9'
            const dom = `
              <div id="pieT" style="width:150px;height:80px;positive:relative;">
              </div>
              <div style="width:75px;position:absolute;top:50%;transform:translateY(-50%);right:0;display:flex;flex-direction:column;color:#d3d6d8;align-items:flex-end">
                  <div style="width:100%;display:flex;justify-content:flex-end;align-items:center;"><p style="display:inline-block;width:13px;height:13px;background:${color}"></p>
                    <span style="margin-left:5px;">桶用量</span>
                  </div>
                  <span>${data} GB</span>
               </div>

            `
            setTimeout(() => {
              this.renderTooltipChart(data, color)
            })
            return dom
          }
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: '#6a7985'
          //   }
          // }
        },
        xAxis: { data: this.buckeInfo.statisticsTime },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'line',
            name: 'customToolTip',
            smooth: true,
            data: [
              {
                value: 81,
                percent: 10
              },
              {
                value: 82,
                percent: 20
              },
              {
                value: 33,
                percent: 30
              },
              {
                value: 64,
                percent: 40
              },
              {
                value: 95,
                percent: 50
              },

              {
                value: 16,
                percent: 60
              },
              {
                value: 37,
                percent: 60
              },
              {
                value: 18,
                percent: 90
              }

            ]
          }
        ]
      }
    },
```



### 水位图
```js


```
