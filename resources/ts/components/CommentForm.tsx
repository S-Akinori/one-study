import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import axios from "axios";
import { useHistory } from "react-router";

interface Props {
  userId: string | number
  postId: string | number
  returnToParent: (comment: Comment) => void
}

interface Comment {
  id: number,
  user_id: number,
  post_id: number,
  content: string,
  created_at: string
  updated_at: string
}

interface CommentData {
  content: string
}

const CommentForm = ({userId, postId, returnToParent}: Props) => {
  const { register, handleSubmit, setError, reset, clearErrors, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const history = useHistory();
  
  const create = async (commentData: CommentData) => {
    setLoading(true)
    clearErrors('submit')
    await axios.get('/sanctum/csrf-cookie')
    const comment = await axios.post('/api/comments', {
      'user_id': userId,
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

    if(comment?.status == 201) {
      reset({
        'content': ''
      })
      setLoading(false)
      returnToParent(comment.data);
    }
  }

  return (
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
  )
}

export default CommentForm