import React,{useState,useEffect} from 'react'
import {marked} from 'marked'
import '../static/css/AddArticle.css'
import {Row,Col,Input,Select,Button,DatePicker,message} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'

const {Option} = Select
const {TextArea} = Input

function AddArticle(props) {
  
  const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle,setArticleTitle] = useState('')   //文章标题
  const [Contentmd , setContentmd] = useState('')  //markdown的编辑内容
  const [Contenthtml, setContenthtml] = useState('预览内容') //html内容
  const [introducemd,setIntroducemd] = useState()            //简介的markdown内容
  const [introducehtml,setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate,setShowDate] = useState()   //发布日期
  const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType,setSelectType] = useState('请选择类型') //选择的文章类别

  useEffect(()=>{
    getTypeInfo()

    //修改时才用 获得文章ID
    // react中获取动态参数的形式 props.match.params.xxx
    let tmpId = props.match.params.id
    // 如果有temId 才继续下面
    if(tmpId){
      // 一定要有这一句 这一句得到的articleId会被用来判断是修改还是添加
      // ！！！！
      setArticleId(tmpId)
      getArticleById(tmpId)
    } 
  },[])

  // 配置marked
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
 })


 // 编写文章内容并转为html
 const changeContent = (e)=>{
   setContentmd(e.target.value)
   // 把获得的值转为html
   let html = marked(e.target.value)
   setContenthtml(html)
 }

  // 编写文章简介并转为html
  const changeIntroduce = (e)=>{
    setIntroducemd(e.target.value)
    // 把获得的值转为html
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }

  //中台和后台开始结合
  // 从中台获得文章类别信息  此方法需要一进入页面就使用 useEffect
  const getTypeInfo = ()=>{
    axios({
      method:'get',
      url:servicePath.getTypeInfo,
      withCredentials: true
    }).then(
      res => {
        if(res.data.data === '没有登录') {
          // 如果没有登录 就把存储信息都删掉
          localStorage.removeItem('openId')
          props.history.push('/') 
        } else {
          // 登录成功了  就可以设置值了
          setTypeInfo(res.data.data)
        }
      }
    )
  }

  // 解决点击文章类别 选择选项 默认值不改变的情况 ，原因是默认值一直没有改变过
  const selectTypeHandler = (value) =>{
    setSelectType(value)
  }

  // 在保存文章的时候执行的方法 判断信息其不齐全
  const saveArticle = ()=>{


    if(selectedType === '请选择类型'){
        message.error('文章类别不能为空')
        return false
    }else if(!articleTitle){
        message.error('文章名称不能为空')
        return false
    }else if(!Contentmd){
        message.error('文章内容不能为空')
        return false 
    }else if(!introducemd){
        message.error('简介不能为空')
        return false
    }else if(!showDate){
        message.error('发布日期不能为空')
        return false
    }

    // 给数据库提供新添加的文章信息
    let dataProps={}   //传递到接口的参数
    dataProps.type_id = selectedType 
    dataProps.title = articleTitle
    dataProps.article_content = Contentmd
    dataProps.introduce =introducemd
    let datetext= showDate.replace('-','/') //把字符串转换成时间戳
    dataProps.addTime =(new Date(datetext).getTime())/1000

    // 判断现在是增加 还是 修改
    // 如果是0 就是增加，如果不等于0 就是修改
    if(articleId === 0){
      console.log('articleId=:'+ articleId)
      dataProps.view_count =Math.ceil(Math.random()*100)+1000
      axios({
          method:'post',
          url:servicePath.addArticle,
          data:dataProps,
          withCredentials: true
      }).then(
          res=>{
            // 将插入数据库中的得到的id赋值给articleId 那么下一次就能判断出是修改 而不是添加了
              setArticleId(res.data.insertId)
              if(res.data.isSuccess){
                  message.success('文章保存成功')
              }else{
                  message.error('文章保存失败');
              }

          }
      )
    } else{
      // 修改文章
      dataProps.id = articleId 
      axios({
          method:'post',
          url:servicePath.updateArticle,
          data:dataProps,
          withCredentials: true
      }).then(
          res=>{
          if(res.data.isSuccess){
              message.success('文章修改成功')
          }else{
              message.error('修改失败');
          }
          }
      )
    }
  }
  
  // 修改时，根据点击的列表的id 得到数据库中的对应文章信息
  const getArticleById = (id)=>{
    axios(servicePath.getArticleById+id,{ 
        withCredentials: true,
    }).then(
        res=>{
            //let articleInfo= res.data.data[0]
            setArticleTitle(res.data.data[0].title)

            setContentmd(res.data.data[0].article_content)
            let html=marked(res.data.data[0].article_content)
            setContenthtml(html)

            setIntroducemd(res.data.data[0].introduce)
            let tmpInt = marked(res.data.data[0].introduce)
            setIntroducehtml(tmpInt)

            setShowDate(res.data.data[0].addTime)
            setSelectType(res.data.data[0].typeId)
  
        }
    )
  }

  return (
    <div>
      <Row gutter={5}>
         <Col span={18}>
            {/* 第一栏部分 */}
            <Row gutter={10}>
                <Col span={20}>
                 <Input
                     placeholder="博客标题"
                     size ='large'
                    //  文章的标题也要随着value改变
                     onChange={e=>{setArticleTitle(e.target.value)}}
                     value={articleTitle}
                  />
                </Col>
                <Col span={4}>
                    &nbsp;
                    <Select defaultValue={selectedType} size='large' onChange={selectTypeHandler} value={selectedType}>
                      {/* // 循环 */}
                      {
                        typeInfo.map((item)=>{
                            return <Option key={item.Id} value={item.Id} >{item.typeName}</Option>
                        })
                      }
                   </Select>
                </Col>
            </Row>
            <br/>
            {/* 第二栏部分 */}
            <Row gutter = {10}>
                <Col span ={12}>
                   <TextArea
                     className ="markdown-content"
                     rows={35}
                     placeholder="文章内容"
                     value={Contentmd}
                     onChange={changeContent}
                   />
                </Col>
                <Col span={12}>
                   <div className = "show-html"
                     dangerouslySetInnerHTML={{__html:Contenthtml}}
                   ></div>
                </Col>
            </Row>
         </Col>

         {/* 右侧部分 */}
         <Col span={6}>
            <Row>
              <Col span={24}>
                <Button size = 'large'>暂存文章</Button>&nbsp;&nbsp;
                <Button type ="primary" size = 'large' onClick={saveArticle}>发布文章</Button>
              </Col>
            </Row>
            <br/>
            <Row>
                <Col span={24}>
                  <TextArea 
                   rows={4}
                   placeholder="文章简介"
                   value={introducemd}
                   onChange={changeIntroduce}
                  />
                  <br></br>
                  <br></br>
                  <div className = 'introduce-html'
                   dangerouslySetInnerHTML={{__html:introducehtml}}
                  ></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={12}>
                  <div className="data-select">
                      <DatePicker
                        // 跟类别选择时出现的情况相同  作用也是改变默认值
                        onChange = {(date,dateString)=>{setShowDate(dateString)}}
                        placeholder="发布日期"
                        size="large"
                      />
                  </div>
                </Col>            
            </Row>

         </Col>
      </Row>
    </div>
  )
}

export default AddArticle