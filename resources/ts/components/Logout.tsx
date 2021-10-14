import React from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import Button from './Button'

const Logout = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = () => {
    axios.post('/api/logout', {})
    .then((res) => {
      console.log(res)
    }).catch(error => {
      console.log(error)
      setError('submit', {
        type: 'manual',
        message: 'ログアウトに失敗しました。'
      })
    })
  }
  return (
    <>
      <h1>ログアウト</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button>送信</Button>
        {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
      </form>
    </>
  )
}

export default Logout