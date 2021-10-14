import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import Top from './components/Top'
import User from './components/User'
 
const App = () => {
    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Layout>
                <Route path="/" exact component={Top} />
                <Route path="/user" component={User} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} /> 
              </Layout>
            </Switch>
          </div>
        </BrowserRouter>
    )
}
 
ReactDOM.render(
    <App />,
    document.getElementById('app')
)