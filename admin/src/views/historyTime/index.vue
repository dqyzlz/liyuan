<template>
  <div class="chart-container">
    <div class="block" style="margin-left:400px;padding-top:40px;">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="getTime"
      />
    </div>
    <el-button type="primary" style="position:absolute;left:820px;top:40px;" @click="selHis('click')">
      查询
    </el-button>
    <!-- <chart height="700px" width="100%" :chart-data="chartData" /> -->
    <div id="chart" style="width:100%;height:700px;margin-top:40px;" />
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import resize from './mixins/resize'
import urls from '@/utils/api'
import { showLoading, hideLoading } from './loading'

export default {
  name: 'MixChart',
  mixins: [resize],
  data() {
    return {
      chart: null,
      chartData: {
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        listTime: []
      },
      startTime: null,
      endTime: null,
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          const seven = 31 * 24 * 60 * 60 * 1000
          const sevenDays = _now - seven
          return time.getTime() > _now || time.getTime() < sevenDays
          // 大于当前的禁止，小于31天前的禁止
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
            console.log(start)
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
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
    const now = new Date(new Date(new Date().toLocaleDateString()))
    const last = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    this.value2 = [new Date(last.getFullYear(), last.getMonth(), last.getDate()), new Date(now.getFullYear(), now.getMonth(), now.getDate())]
    this.startTime = last.getTime()
    this.endTime = now.getTime()
    // this.selHis('click')
    this.logouttimer = setInterval(this.logout, 3600000)
  },
  beforeDestroy() {
    if (this.logouttimer) { // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.logouttimer) // 关闭
    }
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getTime(data) {
      this.startTime = new Date(data[0]).getTime()
      this.endTime = new Date(data[1]).getTime()
      console.log(this.startTime, this.endTime)
    },
    selHis(idx) {
      if (idx === 'click') {
        this.chart.clear()
        this.chartData.list1 = []
        this.chartData.list2 = []
        this.chartData.list3 = []
        this.chartData.list4 = []
        this.chartData.listTime = []
        showLoading()
        idx = 0
      }
      const that = this
      axios.get(urls.url + '/sensor/getHistoryTime', {
        params: {
          page: idx,
          startTime: that.startTime,
          endTime: that.endTime
        }
      })
        .then(function(response) {
          console.log(response)
          if (idx === 0) {
            hideLoading()
          }
          if (response.status === 200) {
            if (response.data.one.length !== 0) {
              that.getToData(response.data, idx)
              // that.selHis(idx + 1)
            } else {
              return
            }
          }
        })
    },
    getToData(data, idx) {
      const that = this
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      const listTime = []
      for (let i = 0; i < data.one.length; i++) {
        arr1.push(data.one[i].instant)
        arr2.push(data.one[i].cumulative)
        // arr3.push(data.tow[i].instant)
        // arr4.push(data.tow[i].cumulative)
        const time = new Date(data.one[i].createTime)
        // const times = time.getFullYear() + '/' + time.getMonth() + 1 + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
        const times = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
        listTime.push(times)
      }
      for (let i = 0; i < data.tow.length; i++) {
        arr3.push(data.tow[i].instant)
        arr4.push(data.tow[i].cumulative)
      }
      this.chartData.list1 = this.chartData.list1.concat(arr1)
      this.chartData.list2 = this.chartData.list2.concat(arr2)
      this.chartData.list3 = this.chartData.list3.concat(arr3)
      this.chartData.list4 = this.chartData.list4.concat(arr4)
      this.chartData.listTime = this.chartData.listTime.concat(listTime)
      console.log(this.chartData)
      if (idx !== 0) {
        this.chart.appendData({
          seriesIndex: 0,
          data: this.chartData
        })
      }

      setTimeout(function() {
        that.selHis(idx + 1)
      }, 10)
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('chart'))
      this.setOptions(this.chartData)
    },
    setOptions({ list1, list2, list3, list4, listTime } = {}) {
      this.chart.setOption({
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
          data: ['1#标况瞬时流量', '1#标况累积流量', '2#标况瞬时流量', '2#标况累积流量'],
          selected: { '1#标况瞬时流量': true, '1#标况累积流量': false, '2#标况瞬时流量': true, '2#标况累积流量': false }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 300
          },
          data: listTime
        }],
        yAxis: [{
          type: 'value'
        }],
        dataZoom: [{
          show: true,
          realtime: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 0,
          end: 40,
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
            data: list1
          },
          {
            name: '1#标况累积流量',
            type: 'line',
            data: list2
          },
          {
            name: '2#标况瞬时流量',
            type: 'line',
            data: list3
          },
          {
            name: '2#标况累积流量',
            type: 'line',
            data: list4
          }
        ]
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
