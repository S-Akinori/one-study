import React, { useState } from "react";
import { useHistory } from "react-router";
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthContext";
import {User} from "../../interface/User"
import axios from "axios";
import {red} from "@mui/material/colors"

interface ProfileData {
  name: string,
  username: string,
  avatar: FileList
}

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit, setError, clearErrors, formState: {errors}} = useForm();
  const auth = useAuth();
  const history = useHistory();

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

  const saveProfile = (profileData: ProfileData) => {
    clearErrors('submit');
    setLoading(true)
    const isValidImage = (profileData.avatar.length > 0) ? validateImageFile(profileData.avatar[0]) : true;
    if(!isValidImage) {
      setLoading(false);
    } else {
      const formData = new FormData((document.getElementById('profileForm') as HTMLFormElement))
      auth?.saveProfile(formData).then(() => {
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
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

  const logout = () => {
    auth?.signout().then(() => {
      history.push('/')
    })
  }

  return (
    <div className="p-4">
      <h1>設定</h1>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="profile"
          id="profile"
        >
          ユーザー設定
        </AccordionSummary>
        <AccordionDetails>
          <form id="profileForm" onSubmit={handleSubmit(saveProfile)}>
            <div>
              <div className="c-input-group--flex flex py-4">
                <span className="flex-shrink-0">名前</span>
                <div className="pl-4">
                  <TextField
                    {...register('name', {
                      required: '入力してください',
                      maxLength: {
                        value: 40,
                        message: '40文字以内で入力してください'
                      }
                    })}
                    defaultValue={(auth?.user as User).name}
                    variant="standard"
                  />
                  {errors.name && <span className="c-error">{errors.name.message}</span>}
                </div>
              </div>
              <div className="c-input-group--flex flex py-4">
                <span className="flex-shrink-0">ユーザー名</span>
                <div className="pl-4">
                  <TextField
                    {...register('username', {
                      required: '入力してください',
                      pattern: {
                        value: /^[0-9a-zA-Z\\-\\_]+$/,
                        message: '英数字で入力してください'
                      }
                    })}
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
              保存
            </LoadingButton>
            {errors.submit && <span className="c-error">{errors.submit.message}</span>}
          </form>
        </AccordionDetails>
      </Accordion>
      <div className="py-4">
        <Button variant="contained" onClick={logout} color="warning">ログアウト</Button>
      </div>
    </div>
  )
}

export default Settings;