// 因为有用户名和密码的改变所以用到了useState
import React,{ useState } from 'react'
import 'antd/dist/antd.min.css'

import {Card,Input,Button,Spin,message} from 'antd'
import Icon,{KeyOutlined,UserAddOutlined} from "@ant-design/icons"
import '../static/css/Login.css'

import servicePath from '../config/apiUrl'
import axios from 'axios'

function Login(props){
   // 用户名
   const [ userName,setUserName] = useState('')
   // 密码
   const [ password,setPassword] = useState('')
   // 是否加载
   const [ isLoading,setIsLoading] = useState(false)
   
   const checkLogin = ()=>{
     // 点击按钮 出现loading界面
     setIsLoading(true)
     // 判断有没有信息
     if( ! userName ) {
        message.error('用户名不能为空')
        // （定时器表示0.5s之后，loading界面才会消失，才可以重新输入值）
        setTimeout(()=>{
          setIsLoading(false)
        },500)
        return false
      }else if(!password){
        message.error('密码不能为空')
        setTimeout(()=>{
          setIsLoading(false)
        },500)
        return false
      }

      // 给中台传递参数：用户名 和密码
      let dataProps = {
        'userName': userName,
        'password': password, 
      }

      axios({
        method:'post',
        url:servicePath.checkLogin,
        data:dataProps,
        // 用来共享sessioin 前端和后端共享session
        withCredentials: true
      }).then(
        res =>{
          setIsLoading(false)
          if(res.data.data === '登录成功'){
            // 把openId保存到本地 openid是通过session传递过来的
            localStorage.setItem('openId',res.data.openId)
            // 编程导航跳转
            props.history.push('/index')         
          }else{
              message.error('用户名密码错误')
          }
        }
      )
   }


  return(
    <div className = "login-div">
      {/* 加载中组件 */}
      <Spin tip='Loading....' spinning={isLoading}>
         {/* 卡片组件 */}
         <Card title = 'xlh blog System' bordered ={true} style={{width:400}}>
             {/* 此Input也是antd的一个组件 */}
           <Input
              id={userName}
              size = 'large'
              placeholder="Enter your userName"
              // 带有前缀图标的input
              prefix = {<Icon component={UserAddOutlined} style={{color:'rgba(0,0,0,0.25)'}}></Icon>}
              // 只要输入值发生改变 那么userName的值也要发生改变
              onChange={(e) =>{setUserName(e.target.value)}}
           />
            <br/><br/>
            <Input.Password
                id={password}
                size="large"
                placeholder="Enter your password"
                prefix={<Icon component={KeyOutlined} style={{color:'rgba(0,0,0,.25)'}} />}
                onChange={(e)=>{setPassword(e.target.value)}}
            />     
            <br/><br/>
            <Button type="primary" size="large" block onClick={checkLogin} > Login in </Button>
         </Card>
      </Spin>
    </div>
  )
}

export default Login