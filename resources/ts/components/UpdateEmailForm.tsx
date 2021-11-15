import axios from "axios";
import React, {useState} from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/AuthContext";

interface EmailData {
  current_email: string,
  new_email: string,
}

const UpdateEmailForm = () => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('保存');
  const {register, handleSubmit, setError, clearErrors, reset, formState: {errors}} = useForm();  
  const auth = useAuth();


  const updateEmail = async (emailData: EmailData) => {
    clearErrors('submit');
    setLoading(true)
    const formData = new FormData()
    formData.append('email', emailData.new_email);
    await axios.get('/sanctum/csrf-cookie');
    const updatedUser = await auth?.saveProfile(formData).catch(() => {
      setLoading(false);
      setError('submit', {
        type: 'submit',
        message: '送信に失敗しました'
      })
    })

    if(updatedUser?.status == 200) {
      setLoading(false);
      setButtonText('保存しました');
      reset({
        'new_email': ''
      })
      setTimeout(() => {
        setButtonText('保存')
      }, 2000)
    }
  }

  return (
    <form key="updateEmail" id="updateEmail" onSubmit={handleSubmit(updateEmail)}>
      <div>
        {/* <div className="c-input-group--flex flex py-4">
          <span className="flex-shrink-0">現在のメールアドレス</span>
          <div className="pl-4 w-full">
            <TextField
              {...register('current_email', {
                required: '入力してください',
                maxLength: {
                  value: 40,
                  message: '40文字以内で入力してください'
                }
              })}
              fullWidth
              defaultValue={(auth?.user as User).email}
              variant="standard"
              disabled
            />
            {errors.current_email && <span className="c-error">{errors.current_email.message}</span>}
          </div>
        </div> */}
        <div className="py-4">
          <div className="w-full">
            <TextField
              {...register('new_email', {
                required: '入力してください',
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: '有効なメールアドレスを入力してください'
                }
              })}
              fullWidth
              variant="outlined"
              label="新しいメールアドレス"
            />
            {errors.new_email && <span className="c-error">{errors.new_email.message}</span>}
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

export default UpdateEmailForm