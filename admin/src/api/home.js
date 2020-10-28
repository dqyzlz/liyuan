import request from '@/utils/request'

export function ssShuju() {
  return request({
    url: 'api/sensor/getRealTime',
    method: 'get',
    // baseURL: 'http://192.168.0.244:8000/' // 直接通过覆盖的方式
    baseURL: 'http://3314f22z34.qicp.vip:30451/'

  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
