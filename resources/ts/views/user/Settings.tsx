import React, { useState } from "react";
import { useHistory } from "react-router";
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Modal, Backdrop, Fade, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthContext";
import UpdateProfileForm from "../../components/UpdateProfileForm";
import UpdatePasswordForm from "../../components/UpdatePasswordForm";
import UpdateEmailForm from "../../components/UpdateEmailForm";
import {User} from "../../interface/User"
import axios from "axios";
import { Box } from "@mui/system";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('保存');
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const {register, handleSubmit, setError, clearErrors, formState: {errors}} = useForm();
  const auth = useAuth();
  const history = useHistory();

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
          プロフィール
        </AccordionSummary>
        <AccordionDetails>
          <UpdateProfileForm />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="updateEmail"
          id="updateEmail"
        >
          メールアドレス変更
        </AccordionSummary>
        <AccordionDetails>
          <UpdateEmailForm />
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