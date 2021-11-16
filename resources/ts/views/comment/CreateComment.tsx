import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useForm } from "react-hook-form";
import { TextField, Button, Input, Chip, Autocomplete} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import axios from "axios";
import { useHistory, useParams } from "react-router";
import { User } from "../../interface/User";

interface DynamicProps {
  postId: string
}

interface CommentData {
  content: string
}

const CreateComment = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const history = useHistory();
  const {postId}: DynamicProps = useParams();
  
  const create = async (commentData: CommentData) => {
    setLoading(true)
    clearErrors('submit')
    await axios.get('/sanctum/csrf-cookie')
    const comment = await axios.post('/api/comments', {
      'user_id': (auth?.user as User).id,
      'post_id': postId,
      'content': commentData.content,
    }).catch((error) => {
      console.log(error.response);
      setError('submit', {
        type: 'manual',
        message: '送信エラーがありました。'
      })
      setLoading(false)
    })

    console.log(comment);
    if(comment?.status == 201) {
      history.push(`/posts/id/${postId}`);
    }
  }
  return (
    <div className="p-4">
      <h1>コメント作成</h1>
      <form id="commentForm" onSubmit={handleSubmit(create)}>
        <div className="py-4">
          <TextField 
            multiline
            rows="5"
            fullWidth
            variant="outlined" 
            label="コメント" 
            {...register('content', {
              required: '入力してください',
              maxLength: {
                value: 160,
                message: '160字以内で入力してください'
              }
            })}
          />
          {errors.content && <span className="block text-red-400">{errors.content.message}</span>}
        </div>
        <div className="text-right">
          <LoadingButton 
            type="submit"
            loading={loading}
            variant="contained"
          >
            送信
          </LoadingButton>
          {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
        </div>
      </form>
    </div>
  )
}

export default CreateComment