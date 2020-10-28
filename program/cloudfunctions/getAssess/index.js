// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var dbName = 'assess'//集合名称
  var pageIndex = event.params.pageIndex ? event.params.pageIndex : 1;//当前第几页，默认为第一页
  var pageSize = event.params.pageSize ? event.params.pageSize : 10;//每页获取多少条记录 默认10
  const countResult = await db.collection(dbName).count()//获取集合的总记录数
  var total =countResult.total//得到总记录数
  const totalPage = Math.ceil(total/10)//计算需要多少页
  var hasMore;//提示前端是否还有数据
  if(pageIndex > totalPage || pageIndex == totalPage){
    hasMore = false
  }else{
    hasMore = true
  }
//最后查询数据返回
  return db.collection(dbName).skip((pageIndex - 1) * pageSize).limit(pageSize).orderBy('subtime', 'desc').get().then(res => {
    res.hasMore = hasMore
    res.total = total
    res.pageIndex = pageIndex
    return res
  });
}