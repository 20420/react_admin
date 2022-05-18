// let ipUrl = "http://localhost:7001/admin/"
let ipUrl = "http://127.0.0.1:7001/admin/"

let servicePath = {
  checkLogin: ipUrl + 'checkLogin',  //检查用户名和密码
  getTypeInfo: ipUrl + 'getTypeInfo',  //获得文章类别信息
  addArticle: ipUrl + 'addArticle',  // 添加文章
  updateArticle:ipUrl + 'updateArticle', // 更新文章
  getArticleList:ipUrl + 'getArticleList' ,  //  文章列表 
  delArticle:ipUrl + 'delArticle/' ,  //  删除文章  因为要传递ID所以要加个'/'
  getArticleById:ipUrl + 'getArticleById/' ,  //  根据ID获得文章详情
  outLogin:ipUrl + 'outLogin' ,  //  退出登录
}

export default  servicePath