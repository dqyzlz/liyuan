<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.subtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="评估额度">
        <template slot-scope="scope">
          <span>{{ scope.row.questions.money }}万元</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="答题情况">
        <template slot-scope="scope">
          <span v-for="n in scope.row.questions.msg" :key="n.index" style="margin-right:30px;">{{ n.question }}{{ n.answer }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getMsg" />
  </div>
</template>

<script>
import axios from 'axios'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Shouye',
  components: { Pagination },
  data() {
    return {
      token: '',
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    console.log(this.token)
    if (this.token === '') {
      this.getToken()
    } else {
      this.getMsg()
    }
  },
  beforeDestroy() {

  },
  methods: {
    getToken() {
      const that = this
      that.listLoading = true
      axios.get('https://api.weixin.qq.com/cgi-bin/token?appid=wx1ca584900445e859&secret=db873b294dbcfc0f0174e2fe2d9e5bba&grant_type=client_credential')
        .then(function(response) {
          console.log(response)
          if (response.status === 200) {//eslint-disable-line
            that.token = response.data.access_token
            that.getMsg()
          }
        })
    },
    getMsg() {
      console.log('第几页', this.listQuery.page)
      const that = this
      that.listLoading = true
      axios.post('https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=' + that.token + '&env=liyuan-8xm4h&name=getAssess', {
        params: {
          pageIndex: that.listQuery.page,
          pageSize: that.listQuery.limit
        }})
        .then(function(response) {
          if (response.status === 200) {//eslint-disable-line
            const listJson = JSON.parse(response.data.resp_data)
            that.listLoading = false
            console.log(listJson)
            that.list = listJson.data
            that.total = listJson.total
          }
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
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
