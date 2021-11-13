import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const [sent, setSent] = useState<boolean>(false)

  const [message, setMessage] = useState('')
  const resendEmail = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post('/api/email/verification-notification', {}).then(() => {
        setSent(true);
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

  useEffect(() => {
    setSent((location.state as LocationState).isSent)
  }, [])

  return (
    <div className="p-4">
      {sent && (
        <>
          <p>認証メールを送信しました。登録を完了するにはメールの認証ボタンをクリックしてください。</p>
          <p>メールが受け取れなかった場合、以下のボタンをクリックして改めてメールを受け取ってください</p>
        </>
      )}
      {!sent && (
        <p>以下のボタンをクリックして改めてメールを受け取ってください登録を完了するにはメールの認証ボタンをクリックしてください。</p>
      )}
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