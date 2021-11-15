import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import axios from "axios";

interface DynamicProps {
  token: string
}

interface ResetPasswordData {
  email: string
  password: string
  password_confirmation: string
}

const ResetPassword = () => {
  const {register, handleSubmit, setError, clearErrors, formState: {errors}} = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const {token}: DynamicProps = useParams()
  const history = useHistory()

  const resetPassword = async (resetPasswordData: ResetPasswordData) => {
    clearErrors();
    setLoading(true)
    await axios.get('/sanctum/scrf-cookie');
    const res = await axios.post('/api/reset-password', {
      'email': resetPasswordData.email,
      'password': resetPasswordData.password,
      'password_confirmation': resetPasswordData.password_confirmation,
      'token': token
    }).catch((error) => {
      console.log(error.response);
      setError('submit', {
        type: 'incorrect',
        message: '送信に失敗しました'
      })
      setLoading(false)
    })
    
    console.log(res);
    if(res?.status == 200) {
      setMessage('パスワードを再設定しました')
      setTimeout(() => {
        history.push('/login')
      }, 2000)
    }
  }
  return (
    <div className="p-4">
      <h1>パスワード再設定</h1>
      <form id="forgotPassword" className="py-4" onSubmit={handleSubmit(resetPassword)}>
        <div className="c-input-group--flex flex py-4">
          <div className="w-full">
            <TextField
              {...register('email', {
                required: '入力してください',
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: '有効なメールアドレスを入力してください'
                }
              })}
              label="メールアドレス"
              fullWidth
              variant="outlined"
            />
            {errors.email && <span className="c-error">{errors.email.message}</span>}
          </div>
        </div>
        <div className="c-input-group--flex flex py-4">
          <div className="w-full">
            <TextField
            id="password"
              {...register('password', {
                required: '入力してください',
                minLength: {
                  value: 8,
                  message: '8文字以上で入力してください'
                }
              })}
              label="新しいパスワード"
              type="password"
              fullWidth
              variant="outlined"
            />
            {errors.password && <span className="c-error">{errors.password.message}</span>}
          </div>
        </div>
        <div className="c-input-group--flex flex py-4">
          <div className="w-full">
            <TextField
              {...register('password_confirmation', {
                required: '入力してください',
                validate: {
                  match: value => value === (document.getElementById('password') as HTMLInputElement).value || 'パスワードが一致しません'
                }
              })}
              label="パスワード確認"
              type="password"
              fullWidth
              variant="outlined"
            />
            {errors.password_confirmation && <span className="c-error">{errors.password_confirmation.message}</span>}
          </div>
        </div>
        <LoadingButton
          type="submit"
          loading={loading}
          variant="contained"
        >
          送信
        </LoadingButton>
        {errors.submit && <span className="c-error">{errors.submit.message}</span>}
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default ResetPassword