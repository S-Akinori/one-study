import React, { useState } from "react";
import { useHistory } from "react-router";
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Modal, Backdrop, Fade, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthContext";
import UpdatePasswordForm from "../../components/UpdatePasswordForm";
import {User} from "../../interface/User"
import axios from "axios";
import {red} from "@mui/material/colors"
import { Box } from "@mui/system";

interface ProfileData {
  name: string,
  username: string,
  avatar: FileList
}
interface EmailData {
  current_email : string
  new_email : string
}
interface PasswordData {
  current_password: string,
  new_password: string,
  new_password_confirmation: string
}

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('保存');
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
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
        setButtonText('保存しました')
        setTimeout(() => {
          setButtonText('保存')
        }, 300)
      }).catch(() => {
        setLoading(false);
      });
    }
  }

  const saveEmail = (emailData: EmailData) => {
    clearErrors('submit');
    setLoading(true)
    const formData = new FormData();
    formData.append('email', emailData.new_email)
    auth?.saveProfile(formData).then(() => {
      setLoading(false);
      setButtonText('保存しました')
        setTimeout(() => {
          setButtonText('保存')
        }, 300)
    }).catch(() => {
      setLoading(false);
    });
  }

  const updatePassword = async (passwordData: PasswordData) => {
    setLoading(true);
    console.log(passwordData);
    await axios.get('/sanctum/csrf-cookie');
    const isPasswordConfirmed = await axios.post('/api/user/confirm-password', passwordData.current_password);
    console.log(isPasswordConfirmed);
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

  const handleDeleteAccountOpen = () => setIsDeleteAccountOpen(true);
  const handleDeleteAccountClose = () => setIsDeleteAccountOpen(false);

  const logout = () => {
    auth?.signout().then(() => {
      history.push('/')
    })
  }

  const deleteAccount = () => {
    setLoading(true)
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post(`/api/users/${(auth?.user as User).id}`, 
        {},
        {headers: {'X-HTTP-Method-Override': 'DELETE' }}
      ).then((res) => {
        console.log(res.data);
        window.location.href = '/';
      }).catch((error) => {
        console.log(error.response);
        setLoading(false)
      })
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
          <form key="profileForm" id="profileForm" onSubmit={handleSubmit(saveProfile)}>
            <div>
              <div className="c-input-group--flex flex py-4">
                <span className="flex-shrink-0">名前</span>
                <div className="pl-4 w-full">
                  <TextField
                    {...register('name', {
                      required: '入力してください',
                      maxLength: {
                        value: 40,
                        message: '40文字以内で入力してください'
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="updateEmail"
          id="updateEmail"
        >
          メールアドレス
        </AccordionSummary>
        <AccordionDetails>
          <form key="updateEmail" id="updateEmail" onSubmit={handleSubmit(saveEmail)}>
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
              <div className="c-input-group--flex flex py-4">
                <span className="flex-shrink-0">新しいメールアドレス</span>
                <div className="pl-4 w-full">
                  <TextField
                    {...register('new_email', {
                      required: '入力してください',
                      pattern: {
                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: '有効なメールアドレスを入力してください'
                      }
                    })}
                    fullWidth
                    variant="standard"
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="updatePassword"
          id="updatePassword"
        >
          パスワード変更
        </AccordionSummary>
        <AccordionDetails>
          <UpdatePasswordForm />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="deleteAccount"
          id="deleteAccount"
        >
          アカウント削除
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <p>アカウントを削除すると、投稿など全てのデータが削除されます。アカウント削除後にデータを戻すことはできません。</p>
            <Button variant="contained" color="warning" onClick={handleDeleteAccountOpen}>削除する</Button>
            <Modal 
              aria-labelledby="delete-account-modal-title"
              aria-describedby="delete-account-modal-description"
              open={isDeleteAccountOpen}
              onClose={handleDeleteAccountClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={isDeleteAccountOpen}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-4">
                  <Typography id="delete-account-modal-title" variant="h6" component="h3">本当に削除しますか？</Typography>
                  <Typography id="delete-account-modal-description">投稿などすべてのデータが削除されます。アカウント削除後にデータを戻すことはできません。</Typography>
                  <div className="py-4 flex justify-between">
                    <Button variant="contained" color="primary" onClick={handleDeleteAccountClose}>戻る</Button>
                    <LoadingButton variant="contained" loading={loading} color="error" onClick={deleteAccount}>削除する</LoadingButton>
                  </div>
                </Box>
              </Fade>
            </Modal>
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="py-4">
        <Button variant="contained" onClick={logout} color="warning">ログアウト</Button>
      </div>
    </div>
  )
}

export default Settings;