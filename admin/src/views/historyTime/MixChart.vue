<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.setOptions(this.chartData)
    },
    setOptions({ list1, list2, list3, list4, listTime } = {}) {
      this.chart.setOption({
        // backgroundColor: '#344b58',
        title: {
          text: '历史监控'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['1#标况瞬时流量', '1#标况累积流量', '2#标况瞬时流量', '2#标况累积流量']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: [
            '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00', '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00', '2009/6/12 20:00', '2009/6/12 21:00', '2009/6/12 22:00', '2009/6/12 23:00'
          ]
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '1#标况瞬时流量',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'red',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: list1
          }
          // {
          //   name: '1#标况累积流量',
          //   type: 'line',
          //   stack: 'total',
          //   symbolSize: 10,
          //   symbol: 'circle',
          //   itemStyle: {
          //     normal: {
          //       color: 'rgba(252,230,48,1)',
          //       barBorderRadius: 0,
          //       label: {
          //         show: true,
          //         position: 'top',
          //         formatter(p) {
          //           return p.value > 0 ? p.value : ''
          //         }
          //       }
          //     }
          //   },
          //   data: list2
          // },
          // {
          //   name: '2#标况瞬时流量',
          //   type: 'line',
          //   stack: 'total',
          //   symbolSize: 10,
          //   symbol: 'circle',
          //   itemStyle: {
          //     normal: {
          //       color: 'pink',
          //       barBorderRadius: 0,
          //       label: {
          //         show: true,
          //         position: 'top',
          //         formatter(p) {
          //           return p.value > 0 ? p.value : ''
          //         }
          //       }
          //     }
          //   },
          //   data: list3
          // },
          // {
          //   name: '2#标况累积流量',
          //   type: 'line',
          //   stack: 'total',
          //   symbolSize: 10,
          //   symbol: 'circle',
          //   itemStyle: {
          //     normal: {
          //       color: 'blue',
          //       barBorderRadius: 0,
          //       label: {
          //         show: true,
          //         position: 'top',
          //         formatter(p) {
          //           return p.value > 0 ? p.value : ''
          //         }
          //       }
          //     }
          //   },
          //   data: list4
          // }
        ]
      })
    }
  }
}
</script>
