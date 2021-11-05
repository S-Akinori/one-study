import axios from "axios";
import React, {useContext, createContext, useState, ReactNode, useEffect} from "react"
import {Route, Redirect, useHistory, useLocation} from "react-router-dom"

interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  photoURL: string
  two_factor_recovery_codes: string | null
  two_factor_secret: string | null
  followings: number
  followers: number
  postTotal: number
  created_at: string
  updated_at: string | null
  downloadedFiles: number[]
}

const fakeAuth = {
  isAuthenticated: true,
  signin(cb: any) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: any) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

interface authProps {
  user: User | 'unauthorized' | 'unverified';
  register: (registerData: RegisterData) => Promise<void>
  signin: (loginData: LoginData) => Promise<void>;
  signinWithProvider: (token: string) => Promise<void>;
  signout: () => Promise<void>;
  saveProfile: (formData: FormData) => Promise<void>;
}

const authContext = createContext<authProps | null>(null)

interface Props {
  children: ReactNode
}

const ProvideAuth = ({children}: Props) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}
export default ProvideAuth

export const useAuth = () => {
  return useContext(authContext)
}

interface LoginData {
  email: string,
  password: string,
}
interface RegisterData {
  email: string,
  password: string,
  password_confirmation: string,
}
interface ProfileData {
  name: string,
  username: string,
  avatar: FileList
}

const useProvideAuth = () => {
  const [user, setUser] = useState<User | 'unauthorized' |'unverified'>('unauthorized');

  const register = (registerData: RegisterData) => {
    return axios.post('/api/register', registerData).then((res) => {
      setUser('unverified')
    })
  }

  const signin = async (loginData: LoginData) => {
    try {
      const res = await axios.post('/api/login', loginData);
    } catch (error) {
      console.log('error: ', error)
      throw error;
    }

    return axios.get('/api/user').then((res) => {
      setUser(res.data)
    }).catch((error) => {
      if(error.response.status == 401) {
        setUser('unauthorized')
      } else if(error.response.status == 403) {
        setUser('unverified')
      }
    })
  }

  const signinWithProvider = (token: string) => {
    return axios.post(`/api/login/twitter/callback${token}`, {}).then(() => {
      axios.get('/api/user').then((res) => {
        setUser(res.data);
      })
    })
  }

  const signout = () => {
    return axios.post('/api/logout', {}).then(() => {
      setUser('unauthorized')
    })
  }

  const saveProfile = (formData: FormData) => {
    return axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post(`/api/users/${(user as User).id}`, 
        formData, 
        {headers: { 'content-type': 'multipart/form-data', 'X-HTTP-Method-Override': 'PUT' }}
      ).then((res) => {
        setUser(res.data)
        return res.data
      }).catch((error) => {
        return null
      })
    })
  }

  useEffect(() => {
    axios.get('/api/user').then((res) => {
      setUser(res.data)
    }).catch((error) => {
      if(error.response.status == 401) {
        setUser('unauthorized')
      } else if(error.response.status == 403) {
        setUser('unverified')
      }
    })
  }, [])

  return {
    user,
    register,
    signin,
    signinWithProvider,
    signout,
    saveProfile
  }
}

interface RouteProps {
  children: ReactNode,
  path: string,
  exact?: boolean
}

/**
 * Only authorized users are allowed to access
 * e.g.) user, settings 
 */
export const PrivateRoute = ({children, path, exact = false}: RouteProps) => {
  const auth = useAuth()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if(auth?.user === 'unauthorized') {
          return <Redirect to={{ pathname: "/login", state: { from: location }}}/>
        } else if (auth?.user === 'unverified') {
          return <Redirect to={{pathname: "/send-verification-mail", state: { from: location }}} />
        } else {
          return children
        }
      }}
    />
  )
}


/**
 * Only unauthorized(unlogged in) users are allowed to access
 * e.g) register, login page
 */
interface From {
  from: Location
}
export const PublicRoute = ({children, path, exact = false}: RouteProps) => {
  const auth = useAuth()
  const history = useHistory()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if(!auth?.user || auth?.user === 'unauthorized') {
          return children
        } else if (auth?.user === 'unverified') {
          return <Redirect to={{pathname: "/send-verification-mail", state: { from: location }}} />
        } else {
          return <Redirect to={{pathname: (history.location.state as From) ? (history.location.state as From).from.pathname : '/' , state: { from: location }}}/>
        }
      }}
    />
  )
}