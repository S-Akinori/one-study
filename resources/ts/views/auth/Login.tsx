import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import {useAuth} from '../../components/AuthContext'
import { useHistory } from "react-router";
import TwitterIcon from '@mui/icons-material/Twitter';

interface LoginData {
  email: string,
  password: string,
}

const Login = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const auth = useAuth()
  const history = useHistory()
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: LoginData) => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      auth?.signin(data).then((res) => {
        history.push('/posts')
      }).catch(() => {
        setError('submit', {
          type: 'manual',
          message: 'メールアドレスまたはパスワードが異なります。'
        })
        setLoading(false)
      })
    })
  }

  const socialLogin = (e: React.MouseEvent<HTMLElement>) => {
    setLoading(true)
    clearErrors()
    const provider = (e.target as HTMLButtonElement).value
    console.log(provider)
    if(provider == 'facebook' || provider == 'twitter') {
      axios.get(`/api/login/${provider}`).then((res) => {
        console.log(res);
        window.location.href = res.data.redirect_url;
      })
    } else {
      setLoading(false)
      setError('provider', {
        type: 'manual',
        message: 'エラーが発生しました。再度ログインしてください'
      })
    }
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-center text-xl font-bold pb-4">ログイン</h1>
      <p className="text-center"><Link to="/register" className="text-sm c-link">アカウントを持っていない方はこちら</Link></p>
      <form className="py-4" onSubmit={e => {clearErrors(); handleSubmit(onSubmit)(e)}}>
        <div className="py-4">
          <TextField 
            fullWidth
            variant="outlined" 
            label="メールアドレス" 
            {...register('email', {
              required: '入力してください'
            })} 
          />
          {errors.email && <span className="block text-red-400">{errors.email.message}</span>}
        </div>
        <div className="py-4">
          <TextField 
            fullWidth
            id="password"
            type="password" 
            variant="outlined" 
            label="パスワード" 
            {...register('password', {
              required: '入力してください'
            })} 
          />
          {errors.password && <span className="block text-red-400">{errors.password.message}</span>}
        </div>
        <div className="text-center">
          <div>
            <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Login</LoadingButton>
          </div>
          {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
        </div>
      </form>
      <div className="py-4 text-center">
        <Link to="/forgot-password" className="c-link">パスワードを忘れた方はコチラ</Link>
      </div>
      <div className="text-center py-4">
        <LoadingButton loading={loading} onClick={socialLogin} variant="contained" value="twitter"><TwitterIcon/> Twitterでログイン</LoadingButton>
        {errors.provider && <span className="block text-red-400">{errors.provider.message}</span>}
      </div>
    </div>
  )
}

export default Login