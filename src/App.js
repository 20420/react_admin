// 当作路由的作用
import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Login from './Pages/Login.js'
import Index from './Pages/Index.js'


function App(){
  return (
    <Router>
       <Route path='/' exact component={Login}/>
       <Route path='/index' component={Index}/> 
    </Router>
  )
}

export default App