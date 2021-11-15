import axios from "axios";
import React, {useState} from "react";
import { TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/AuthContext";
import {User} from "../interface/User"

interface ProfileData {
  name: string,
  username: string,
  avatar: FileList
}

const UpdateProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('保存');
  const {register, handleSubmit, setError, clearErrors, reset, formState: {errors}} = useForm();
  const auth = useAuth();

  const setPreviewPhoto = (e: React.ChangeEvent) => {
    const image: File = ((e.target as HTMLInputElement).files as FileList)[0]
    const isValidImage = validateImageFile(image)
    if(isValidImage) {
      const fileReader = new FileReader()
      fileReader.onload = (function() {
        const imgEl = document.querySelector<HTMLImageElement>('#preview')
        if(imgEl) {
          imgEl.src = fileReader.result as string
        }
      })
      fileReader.readAsDataURL(image)
    }
  }

  const updateProfile = async (profileData: ProfileData) => {
    clearErrors('submit');
    setLoading(true)
    const isValidImage = (profileData.avatar.length > 0) ? validateImageFile(profileData.avatar[0]) : true;
    if(!isValidImage) {
      setLoading(false);
    } else {
      const formData = new FormData((document.getElementById('profileForm') as HTMLFormElement))
      await axios.get('/sanctum/csrf-cookie');
      const updatedUser = await auth?.saveProfile(formData).catch(() => {
        setLoading(false);
        setError('submit', {
          type: 'submit',
          message: '送信に失敗しました'
        })
      })
      console.log(updatedUser);
      if(updatedUser?.status == 200) {
        setLoading(false);
        setButtonText('保存しました');
        setTimeout(() => {
          setButtonText('保存')
        }, 2000)
      }
    }
  }

  const validateImageFile = (image: File) => {
    if(image.type !== 'image/png' && image.type !== 'image/jpg' && image.type !== 'image/jpeg'&& image.type !== 'image/gif') {
      setError('avatar', {
        type: "manual",
        message: '画像ファイルを選択してください'
      })
      return false
    }
    else if(image.size > 2000000) {
      setError('avatar', {
        type: "manual",
        message: '2MBまでです'
    })
      return false
    }
    return true
  }

  return (
    <form key="profileForm" id="profileForm" onSubmit={handleSubmit(updateProfile)}>
      <div>
        <div className="c-input-group--flex flex py-4">
          <span className="flex-shrink-0">名前</span>
          <div className="pl-4 w-full">
            <TextField
              {...register('name', {
                required: '入力してください',
                maxLength: {
                  value: 255,
                  message: '255文字以内で入力してください'
                }
              })}
              fullWidth
              defaultValue={(auth?.user as User).name}
              variant="standard"
            />
            {errors.name && <span className="c-error">{errors.name.message}</span>}
          </div>
        </div>
        <div className="c-input-group--flex flex py-4">
          <span className="flex-shrink-0">ユーザー名</span>
          <div className="pl-4 w-full">
            <TextField
              {...register('username', {
                required: '入力してください',
                maxLength: {
                  value: 255,
                  message: '255文字以内で入力してください'
                },
                pattern: {
                  value: /^[0-9a-zA-Z\\-\\_]+$/,
                  message: '英数字で入力してください'
                }
              })}
              fullWidth
              defaultValue={(auth?.user as User).username}
              variant="standard"
            />
            {errors.username && <span className="c-error">{errors.username.message}</span>}
          </div>
        </div>
        <div className="c-input-group--flex flex py-4">
          <div className="flex-shrink-0">
            <span className="flex-shrink-0">プロフィール画像</span>
            <img id="preview" src={(auth?.user as User).photoURL} className="avatar" />
          </div>
          <div className="pl-4">
            <label htmlFor="avatar">
              <input 
                className="hidden"
                type="file" 
                id="avatar" 
                accept="image/*"
                {...register('avatar')}
                onChange={(e) => setPreviewPhoto(e)}
              />
              <Button variant="contained" component="span">Upload</Button>
            </label>
            {errors.avatar && <span className="c-error">{errors.avatar.message}</span>}
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

export default UpdateProfileForm