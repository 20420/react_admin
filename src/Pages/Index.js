// 后台首页的UI框架
// antd里面有个现成的Layout布局
import React,{useState}  from 'react'
import { Layout, Menu, Breadcrumb,message} from "antd"
import Icon,{PieChartOutlined,DesktopOutlined,UserAddOutlined,FileAddOutlined} from "@ant-design/icons"
import '../static/css/Index.css'
import 'antd/dist/antd.min.css'
import {Route} from 'react-router-dom'
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'
import axios from 'axios'
import servicePath from '../config/apiUrl'
 
// 解构
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

function Index(props){

  // 用于展示菜单是合上的还是打开的
  const [collapsed,setCollapsed] = useState(false)
  // 点击事件 
  const onCollapse = collapsed =>{
    setCollapsed(collapsed)
  }

  const toIndex = ()=>{
    props.history.push('/index/')
  }

  // 根据传入的key值进行跳转
  const handleClickArticle = e=>{
    console.log(e.key)
    if(e.key==='AddArticle'){
      console.log('tiaotiao')
      props.history.push('/index/add/')
    }else{
      props.history.push('/index/list/')
    }

  }

  // 退出登录的方法
  const handleExit =() =>{
    // 移除本地存储的时间戳
    localStorage.removeItem('openId')

    axios({
      method:'get',
      url:servicePath.outLogin,
      withCredentials:true
    }).then(
      res=>{
        if(res.data.data==='退出成功')
        {
          message.success('已退出')
          setTimeout(()=>{
            props.history.push('/')
          },1000)
        }
      }
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧 */}
      <Sider  collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        {/* defaultSelectedKeys初始选中的菜单项  theme主题颜色  mode菜单类型 */}
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" onClick = {toIndex}>
            <Icon component={PieChartOutlined} />
            <span>工作台</span>
          </Menu.Item>
 
           {/* 二层菜单 */}
          <SubMenu
            key="sub1"
            onClick = {handleClickArticle}
            title={
              <span>
                <Icon component={UserAddOutlined} />
                <span>文章管理</span>
              </span>
            }
          >
            <Menu.Item key="AddArticle">添加文章</Menu.Item>
            <Menu.Item key="ArticleList">文章列表</Menu.Item>
          </SubMenu>


          <Menu.Item key="5">
            <Icon component={FileAddOutlined} />
            <span>留言管理</span>
          </Menu.Item>

          <Menu.Item key="6" onClick={handleExit}>
              <Icon component={FileAddOutlined} />
              <span>退出登录</span>
            </Menu.Item>
        </Menu>
      </Sider>

       {/* 右侧 */}
      <Layout>
        {/* 内容部分 */}
        <Content style={{ margin: '0 16px' }}>
          {/* // 面包屑导航 */}
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* 之后都是动态的 */}
            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
            <Breadcrumb.Item>工作台</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <div>
               {/* 占位 */}
                  <Route path="/index/" exact  component={AddArticle} />
                  <Route path="/index/add/"  exact   component={AddArticle} />
                  <Route path="/index/add/:id"  exact   component={AddArticle} />
                  <Route path="/index/list/" exact component={ArticleList} />  
            </div>

          </div>
        </Content>
        {/* 底部 */}
        <Footer style={{ textAlign: 'center' }}>西兰花的博客</Footer>
      </Layout>

    </Layout>
  )
}
export default Index