import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import axios from "axios";

interface EmailData {
  email: string
}

const ForgotPassword = () => {
  const {register, handleSubmit, setError, clearErrors, formState: {errors}} = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const forgotPassword = async (emailData: EmailData) => {
    clearErrors();
    setLoading(true)
    await axios.get('/sanctum/scrf-cookie');
    const res = await axios.post('/api/forgot-password', {
      'email': emailData.email
    }).catch((error) => {
      console.log(error.response);
      setError('email', {
        type: 'incorrect',
        message: '登録したメールアドレスをご入力してください'
      })
      setLoading(false)
    })

    if(res?.status == 200) {
      setMessage('パスワード再設定用のメールを送信しました。');
    }
  }
  return (
    <div className="p-4">
      <h1>パスワード再設定リクエスト</h1>
      <form id="forgotPassword" className="pb-4" onSubmit={handleSubmit(forgotPassword)}>
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
              fullWidth
              variant="outlined"
              label="メールアドレス"
            />
            {errors.email && <span className="c-error">{errors.email.message}</span>}
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

export default ForgotPassword