import axios from "axios";
import React, {useState} from "react";
import { TextField} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";

interface PasswordData {
  current_password: string,
  new_password: string,
  new_password_confirmation: string
}

const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('保存');
  const {register, handleSubmit, setError, clearErrors, reset, formState: {errors}} = useForm();

  const updatePassword = async (passwordData: PasswordData) => {
    setLoading(true);
    clearErrors();
    await axios.get('/sanctum/csrf-cookie');
    const password = await axios.post('/api/user/password', {
      'current_password' : passwordData.current_password,
      'password' : passwordData.new_password,
      'password_confirmation' : passwordData.new_password_confirmation,
    },
    {headers: {'X-HTTP-Method-Override': 'PUT'}}
    ).catch((error) => {
      setLoading(false);
      setError('current_password', {
        type: 'incorrect',
        message: 'パスワードが異なります。'
      })
    });

    if(password?.status == 200) {
      setLoading(false);
      setButtonText('保存しました');
      reset({
        'current_password': '',
        'new_password': '',
        'new_password_confirmation': '',
      })
      setTimeout(() => {
        setButtonText('保存')
      }, 2000)
    }

  }

  return (
    <form key="updatePassword" id="updatePassword" onSubmit={handleSubmit(updatePassword)}>
      <div>
        <div className="py-4">
          <div className="w-full">
            <TextField
              {...register('current_password', {
                required: '入力してください',
                maxLength: {
                  value: 40,
                  message: '40文字以内で入力してください'
                }
              })}
              type="password"
              fullWidth
              variant="outlined"
              label="現在のパスワード"
            />
            {errors.current_password && <span className="c-error">{errors.current_password.message}</span>}
          </div>
        </div>
        <div className="py-4">
          <div className="w-full">
            <TextField
            id="new_password"
              {...register('new_password', {
                required: '入力してください',
                minLength: {
                  value: 8,
                  message: '8文字以上で入力してください'
                }
              })}
              type="password"
              fullWidth
              variant="outlined"
              label="新しいパスワード"
            />
            {errors.new_password && <span className="c-error">{errors.new_password.message}</span>}
          </div>
        </div>
        <div className="py-4">
          <div className="w-full">
            <TextField
              {...register('new_password_confirmation', {
                required: '入力してください',
                validate: {
                  match: value => value === (document.getElementById('new_password') as HTMLInputElement).value || 'パスワードが一致しません'
                }
              })}
              type="password"
              fullWidth
              variant="outlined"
              label="パスワード確認"
            />
            {errors.new_password_confirmation && <span className="c-error">{errors.new_password_confirmation.message}</span>}
          </div>
        </div>
      </div>
      <LoadingButton
        type="submit"
        loading={loading}
        variant="contained"
      >
        {buttonText}
      </LoadingButton>
      {errors.submit && <span className="c-error">{errors.submit.message}</span>}
    </form>
  )
}

export default UpdatePasswordForm