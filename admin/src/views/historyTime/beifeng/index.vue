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
    <el-button type="primary" style="position:absolute;left:820px;top:40px;" @click="selHis">
      查询
    </el-button>
    <chart height="700px" width="100%" :chart-data="chartData" />
  </div>
</template>

<script>
import Chart from './MixChart'
import axios from 'axios'
import { showLoading, hideLoading } from './loading'

export default {
  name: 'MixChart',
  components: { Chart },
  data() {
    return {
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
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
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
  mounted() {
    const now = new Date(new Date(new Date().toLocaleDateString()))
    const last = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    this.value2 = [new Date(last.getFullYear(), last.getMonth(), last.getDate()), new Date(now.getFullYear(), now.getMonth(), now.getDate())]
    this.startTime = now.getTime()
    this.endTime = now.getTime()
    // this.selHis()
  },
  methods: {
    getTime(data) {
      console.log(data)
      this.startTime = new Date(data[0]).getTime()
      this.endTime = new Date(data[1]).getTime()
      console.log(this.startTime, this.endTime)
    },
    selHis() {
      const that = this
      showLoading()
      axios.get('http://192.168.0.244:8000/api/sensor/getHistoryTime', {
        params: {
          startTime: that.startTime,
          endTime: that.endTime
        }
      })
        .then(function(response) {
          hideLoading()
          console.log(response)
          if (response.status === 200) {
            that.getToData(response.data)
          }
        })
    },
    getToData(data) {
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      const listTime = []
      for (let i = 0; i < data.one.length; i++) {
        arr1.push(data.one[i].instant)
        arr2.push(data.one[i].cumulative)
        arr3.push(data.tow[i].instant)
        arr4.push(data.tow[i].cumulative)
        listTime.push(data.tow[i].createTime)
      }
      this.chartData.list1 = arr1
      this.chartData.list2 = arr2
      this.chartData.list3 = arr3
      this.chartData.list4 = arr4
      this.chartData.listTime = listTime
      console.log(this.chartData)
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
