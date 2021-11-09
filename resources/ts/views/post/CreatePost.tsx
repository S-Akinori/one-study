import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useForm } from "react-hook-form";
import { TextField, Button, Input, Chip, Autocomplete} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import axios from "axios";
import { useHistory } from "react-router";

interface postData {
  title: string,
  content: string,
  file: FileList,
  tags?: string[]
  category: string
}
interface Tags {
  value: string,
  ids: number[]
}

const CreatePost = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const [tagValue, setTagValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('英語')
  const auth = useAuth()
  const history = useHistory();
  const user = auth?.user;
  
  const tags: Array<Tags> = [
    {value: 'テスト1', ids: [1]},
    {value: 'テスト2', ids: [1, 2]},
    {value: 'テスト3', ids: [1, 2, 3]},
  ]
  const categories = ['数学', '物理', '化学', '英語']

  const create = (postData: postData) => {
    setLoading(true)
    clearErrors('submit')
    const formData = new FormData((document.getElementById('file') as HTMLFormElement))
    formData.set('tags', tagValue)
    formData.set('category', categoryValue)
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post('/api/posts', formData, {headers: { 'content-type': 'multipart/form-data' }}).then((res) => {
        console.log(res.data)
        history.push('/posts')
      }).catch((error) => {
        console.log(error.response)
        setError('submit', {
          type: 'manual',
          message: '送信エラーがありました。'
        })
        setLoading(false)
      })
    })
  }

  const setPreviewPhoto = (e: React.ChangeEvent) => {
    const image: File = ((e.target as HTMLInputElement).files as FileList)[0]
    if(image.type === 'image/png' || image.type === 'image/jpg' || image.type === 'image/jpeg'|| image.type === 'image/gif') {
      const fileReader = new FileReader()
      fileReader.onload = (function() {
        const imgEl = document.querySelector<HTMLImageElement>('#preview')
        if(imgEl) {
          imgEl.src = fileReader.result as string
          imgEl.classList.remove('hidden')
        }
      })
      fileReader.readAsDataURL(image)
    } else {
      setError('file', {
        type: "manual",
        message: '画像ファイルを選択してください'
      })
    }
  }
  const onChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    if(value.length > 3) {
      setError('tags', {
        type: 'manual',
        message: '最大で3つです'
      })
    } else {
      clearErrors("tags")
    }
    setTagValue(value.join(','))
  }
  return (
    <div className="p-4">
      <h1>あなたの1ページをシェアしましょう</h1>
      <form id="file" onSubmit={handleSubmit(create)}>
        <div className="py-4">
          <TextField 
            fullWidth
            variant="outlined" 
            label="タイトル" 
            {...register('title', {
              required: '入力してください',
              maxLength: {
                value: 50,
                message: '50字までです'
              }              
            })}
          />
          {errors.title && <span className="block text-red-400">{errors.title.message}</span>}
        </div>
        <div className="py-4">
          <TextField 
            fullWidth
            type="content" 
            variant="outlined" 
            label="説明, 要約, メモなど" 
            {...register('content', {
              required: '入力してください'
            })}
          />
          {errors.content && <span className="block text-red-400">{errors.content.message}</span>}
        </div>
        <div className="py-4">
          <label htmlFor="file">
            <input 
              type="file" 
              id="file" 
              accept="image/*" 
              {...register('file', {
                required: 'アップされていません',
                validate: {
                  size: value => value[0] != null || value[0].size < 2000000 || '容量が大きすぎます(2MBまで)。',
                  type: value => value[0] != null || value[0].type === 'image/png' || value[0].type === 'image/jpeg' || value[0].type === 'image/jpg' || value[0].type === 'image/gif' || '画像ファイル(PNG, JPEG, GIF)を選択してください',
                }
              })}
              onChange={(e) => setPreviewPhoto(e)}
            />
            {/* <Button variant="contained" component="span">アップロード</Button> */}
          </label>
          {errors.file && <span className="block text-red-400">{errors.file.message}</span>}
          <div className="p-4">
            <img id="preview" src="" className="hidden" />
          </div>
        </div>
        <div className="py-4">
            <Autocomplete 
              multiple
              options={tags.map((option) => option.value)}
              freeSolo
              onChange={onChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  return false
                }
              }}
              renderTags={(value: string[], getTagProps) => 
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({index})} />
                ))
              }
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  variant="filled" 
                  label="タグ"
                  {...register('tags')}
                />
              )}
            />
            {errors.tags && <span className="block mt-2 text-xs text-red-600">{errors.tags.message}</span>}
        </div>
        <div className="py-4">
          <Autocomplete
            disablePortal
            fullWidth
            options={categories}
            inputValue={categoryValue}
            onInputChange={(event, newInputValue) => {
              setCategoryValue(newInputValue)
            }}
            blurOnSelect="touch"
            renderInput={(params) => <TextField {...params} label="カテゴリー" />}
          />
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

export default CreatePost