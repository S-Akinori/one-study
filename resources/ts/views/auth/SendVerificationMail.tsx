import axios from "axios";
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router";
import {Button} from "@mui/material"
import {useAuth} from '../../components/AuthContext'

interface LocationState {
  isSent: boolean
}

const SendVerificationMail = () => {
  const location = useLocation()
  const history = useHistory()
  const auth = useAuth()
  const isSent = (location.state as LocationState).isSent
  console.log(isSent)
  
  if(auth?.user === 'unverified' && !isSent) {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post('/api/email/verification-notification', {}).then(() => {
        console.log('Email sent')
      }).catch((error) => {
        console.log(error.response)
      })
    })
  }

  const [message, setMessage] = useState('')
  const resendEmail = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post('/api/email/verification-notification', {}).then(() => {
        setMessage('メールを再送信しました')
      }).catch((error) => {
        console.log(error.response)
        setMessage('メールの送信に失敗しました')
      })
    })
  }

  const logout = () => {
    auth?.signout().then(() => {
      history.push('/')
    })
  }

  return (
    <div className="p-4">
      <p>認証メールを送信しました。登録を完了するにはメールの認証ボタンをクリックしてください。</p>
      <p>メールが届いていない場合は以下のボタンをクリックして改めてメールを受け取ってください</p>
      <div className="py-4">
        <Button variant="contained" onClick={() => resendEmail()}>メールを受け取る</Button>
        {message && <span>{message}</span>}
      </div>
      <div className="py-4">
        <Button variant="contained" color="warning" onClick={logout}>ログアウト</Button>
      </div>
    </div>
  )
}

export default SendVerificationMail