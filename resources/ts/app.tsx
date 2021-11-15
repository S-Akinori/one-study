import axios from 'axios'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Layout from './components/Layout'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import Top from './views/Top'
import User from './views/user/User'
import IndexPost from './views/post/IndexPost'
import CreatePost from './views/post/CreatePost'
import ShowPost from './views/post/ShowPost'
import Setting from './views/user/Settings'
import ProvideAuth, { PrivateRoute, PublicRoute } from './components/AuthContext'
import SendVerificationMail from './views/auth/SendVerificationMail'
import Settings from './views/user/Settings'
import Following from './views/user/Following'
import Follower from './views/user/Followers'
import Callback from './views/auth/Callback'
import Privacy from './views/Privacy'
import ForgotPassword from './views/auth/ForgotPassword'
import ResetPassword from './views/auth/ResetPassword'
 
const App = () => {
    // const [isAuth, setIsAuth] = useState(false)
    // axios.get('/api/user').then(() => {
    //   console.log('Authorized')
    //   setIsAuth(true)
    // }).catch(() => {
    //   console.log('Unauthorized')
    //   setIsAuth(false)
    // })
    return (
      <ProvideAuth>
        <BrowserRouter>
          <div>
            <Switch>
              <Layout>
                <Route path="/" exact component={Top} />
                <Route path="/privacy" exact component={Privacy} />
                <Route path="/send-verification-mail" exact><SendVerificationMail /></Route>
                <Route path="/reset-password/:token" exact><ResetPassword /></Route>
                <Route path="/forgot-password" exact><ForgotPassword /></Route>
                <PublicRoute path="/register" exact><Register /></PublicRoute>
                <PublicRoute path="/login" exact><Login /></PublicRoute>
                <Route path="/posts" exact component={IndexPost} />
                <PrivateRoute path="/posts/create" exact><CreatePost /></PrivateRoute>
                <Route path="/posts/id/:id" exact component={ShowPost} />
                <PrivateRoute path="/user" exact><User /></PrivateRoute>
                <PrivateRoute path="/users/:id" exact><User /></PrivateRoute>
                <PrivateRoute path="/user/settings" exact><Settings /></PrivateRoute>
                <Route path="/user/:id/following" component={Following} />
                <Route path="/user/:id/follower" component={Follower} />
                <Route path="/login/:provider/callback" component={Callback} />
              </Layout>
            </Switch>
          </div>
        </BrowserRouter>
      </ProvideAuth>
    )
}
 
ReactDOM.render(
    <App />,
    document.getElementById('app')
)