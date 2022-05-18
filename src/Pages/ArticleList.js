// 列表页
import React,{useState,useEffect} from 'react'
import {List,Row,Col,Modal,message,Button} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
import '../static/css/ArticleList.css'

const {confirm} = Modal

function ArticleList(props) {
   
  const [list,setList] = useState([])

  useEffect(()=>{
    getList()
  },[])

  // 得到文章列表
  const getList = ()=>{
    axios({
        method:'get',
        url: servicePath.getArticleList,
        withCredentials: true,
    }).then(
       res=>{
        setList(res.data.list)  
        }
    )
  }

  
  // 修改文章的方法
  const updateArticle = (id)=>{
    // 跳转到添加页面即可
    props.history.push('/index/add/'+id)
  
  }
  
  // 删除文章的方法
  const delArticle = (id) =>{
     // 确定要删除文章吗
     confirm({
      title: '确定要删除这篇博客文章吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
          axios(servicePath.delArticle+id,{ withCredentials: true}).then(
              res=>{ 
                  message.success('文章删除成功')
                  // 重新获得列表
                  getList()
                  }
          )
      },
      onCancel() {
          message.success('没有任何改变')
      },
    });
  }

  return (
    <div>
        <List
        // 列表头部
          header={
              <Row className="list-div">
                  <Col span={8}>
                      <b>标题</b>
                  </Col>
                  <Col span={4}>
                      <b>类别</b>
                  </Col>
                  <Col span={4}>
                      <b>发布时间</b>
                  </Col>
                  <Col span={4}>
                      <b>浏览量</b>
                  </Col>
                  <Col span={4}>
                      <b>操作</b>
                  </Col>
              </Row>
          }
          // 是否显示边框
          bordered
          dataSource={list}
          // 自定义渲染列表项
          renderItem={item => (
              <List.Item>
                  <Row className="list-div">
                      <Col span={8}>
                          {item.title}
                      </Col>
                      <Col span={4}>
                        {item.typeName}
                      </Col>
                      <Col span={4}>
                          {item.addTime}
                      </Col>
                      <Col span={4}>
                        {item.view_count}
                      </Col>

                      <Col span={4}>
                        <Button type="primary" onClick={()=>{updateArticle(item.id)}}>修改</Button>&nbsp;

                        <Button onClick={()=>{delArticle(item.id)}}>删除 </Button>
                      </Col>
                  </Row>

              </List.Item>
          )}
          />
    </div>
  )

}

export default ArticleList