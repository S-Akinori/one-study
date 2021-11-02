import React from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Button from '../../components/Button'
import {useAuth} from '../../components/AuthContext'
import { useHistory } from "react-router";

interface LoginData {
  email: string,
  password: string,
}

const Login = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const auth = useAuth()
  const history = useHistory()
  const onSubmit = (data: LoginData) => {
    auth?.signin(data).then(() => {
      history.push('/')
    })
  }

  const socialLogin = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const provider = (e.target as HTMLButtonElement).value
    console.log(provider)
    if(provider == 'facebook' || provider == 'twitter') {
      axios.get(`/api/login/${provider}`).then((res) => {
        console.log(res);
        window.location.href = res.data.redirect_url;
      })
    }
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-center text-xl font-bold">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className="text-right">
          <Button>送信</Button>
          {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
        </div>
      </form>
      <button onClick={(e) => socialLogin(e)} value="facebook">facebook</button>
      <button onClick={(e) => socialLogin(e)} value="twitter">twitter</button>
    </div>
  )
}

export default Login