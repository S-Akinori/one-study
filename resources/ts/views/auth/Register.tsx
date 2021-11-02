import React from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Button from '../../components/Button'
import { useHistory } from "react-router-dom";
import {useAuth} from '../../components/AuthContext'

interface EmailAndPasswordData {
  email: string,
  password: string,
  password_confirmation: string
}

const Register = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const history = useHistory()
  const auth = useAuth()

  const onSubmit = (data: EmailAndPasswordData) => {
    auth?.register(data).then(() => {
        history.push({
          pathname: '/send-verification-mail',
          state: {isSent: true}
        })
      }).catch(error => {
      console.log(error)
      setError('submit', {
        type: 'manual',
        message: '登録に失敗しました。再度登録をしてください'
      })
    })
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
        <h1 className="text-center text-xl font-bold">登録</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="py-4">
            <TextField 
              fullWidth
              variant="outlined" 
              label="名前" 
              {...register('name', {
                required: '入力してください'
              })} 
            />
            {errors.name && <span className="block text-red-400">{errors.name.message}</span>}
          </div> */}
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
                required: '入力してください',
                minLength: {
                  value: 8,
                  message: '8文字以上で入力してください'
                }
              })} 
            />
            {errors.password && <span className="block text-red-400">{errors.password.message}</span>}
          </div>
          <div className="py-4">
            <TextField 
              fullWidth
              type="password" 
              variant="outlined" 
              label="パスワード確認" 
              {...register('password_confirmation', {
                required: '入力してください',
                validate: {
                  match: value => value === (document.getElementById('password') as HTMLInputElement).value || 'パスワードが一致しません'
                }
              })} 
            />
            {errors.password_confirmation && <span className="block text-red-400">{errors.password_confirmation.message}</span>}
          </div>
          <div className="text-right">
            <Button>送信</Button>
            {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
          </div>
        </form>
    </div>
  )
}

export default Register