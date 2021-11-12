import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {CircularProgress, Card, CardHeader} from '@mui/material';
import {Link} from "react-router-dom";
import {Post} from "../../interface/Post";
import {User} from "../../interface/User";
import {Tag} from "../../interface/Tag"
import {PostData} from "../../interface/PostData";
import { Drawer, Button, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Chip, TextField, Autocomplete } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);
  const updateTarget = useCallback((e) => {
    if(e.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    }
  }, [])
  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${width}px)`)
    media.addEventListener('change', e => updateTarget(e))
    if(media.matches) {
      setTargetReached(true)
    }

    return () => media.removeEventListener('change', e => updateTarget(e))
  }, [])
  return targetReached
}

const IndexPost = () => {
  const isBreakPoint = useMediaQuery(768);
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [drawerState, setDrawerState] = useState(false);
  const [condition, setCondition] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<Tag[]>([])
  let timer: NodeJS.Timeout | null = null

  const categories = ['数学', '物理', '化学', '英語'];

  const toggleDrawer = (open: boolean) => {
    setDrawerState(open)
  }

  const handleConditionValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCondition(event.target.value)
    console.log(event.target.value)
  }

  const handleTagValues = (event: React.ChangeEvent<{}>, values: string[]) => {
    setCurrentTags(values)
  }

  const handleCategoryValue = (event: any, value: string) => {
    setCategory(value)
  }

  const handleKeywordValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(timer != null) clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      setKeyword(event.target.value);
    }, 1000)
  }

  //fetch posts
  useEffect(() => {
    const keywordQuery = keyword ? `keyword=${keyword}&` : ''
    const categoryQuery = category ? `category=${category}&` : ''
    const tagsQuery = (currentTags.length > 0) ? `tags=${currentTags.join(',')}&` : '';
    const conditionQuery = condition ? `${condition}=true` : '';

    if(tags.length == 0) {
      axios.get('/api/tags').then((res) => {
        setTags(res.data);
      })
    }

    if(condition) {
      axios.get(`/api/posts?${keywordQuery + categoryQuery + tagsQuery + conditionQuery}`).then((res) => {
        setPosts(res.data)
      })
    } else {
      axios.get(`/api/posts?${keywordQuery + categoryQuery + tagsQuery}`).then((res) => {
        setPosts(res.data)
      })
    }
  }, [condition, keyword, category, currentTags])

  return (
    <div className="p-4">
      {!posts && <CircularProgress />}
      {posts && 
      <div>
        <Drawer anchor='left' open={(isBreakPoint) ? true : drawerState} onClose={() => toggleDrawer(false)} variant={(isBreakPoint) ? 'persistent' : 'temporary'} classes={{paper: 'p-4 md:top-20 md:h-3/4 w-72 md:w-1/5'}}>
        <Button variant="contained" className="absolute top-2 right-2 z-50 md:hidden" onClick={() => toggleDrawer(false)}><CloseIcon /></Button>
          <FormControl component="fieldset">
            <div className="mb-4 md:hidden">
              <FormLabel>検索</FormLabel>
              <TextField 
                variant="filled"
                label="検索"
                className="w-full"
                onChange={handleKeywordValue}
              />
            </div>
            <FormLabel>条件</FormLabel>
            <RadioGroup aria-label="condition" name="condition" value={condition} onChange={handleConditionValue} >
              <FormControlLabel value="new" control={<Radio />} label="新しい順" />
              <FormControlLabel value="downloadedTotal" control={<Radio />} label="ダウンロード数" />
            </RadioGroup>
          </FormControl>
          <Autocomplete 
            multiple
            options={tags.map((option) => option.name)}
            freeSolo
            onChange={handleTagValues}
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
              />
            )}
          />
          <Autocomplete
            options={categories.map((option) => option)}
            onInputChange={handleCategoryValue}
            renderTags={(value: string[], getTagProps) => 
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({index})} />
              ))
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                variant="filled" 
                label="カテゴリー"
              />
            )}
          />
        </Drawer>
        <Button variant="contained" onClick={() => toggleDrawer(true)} className="md:hidden">検索</Button>
        <div className="md:w-4/5 md:pl-4 ml-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((postData, index) => (
          <div key={postData.post.id} className="c-card bg-white shadow rounded">
            <div className="c-card__header">
              <Link to={`posts/id/${postData.post.id}`}>
                <img src={postData.post.fileURL} alt="" onContextMenu={(e) => {e.preventDefault(); return false}}/>
              </Link>
            </div>
            <div className="c-card__body">
              <Link to={`posts/id/${postData.post.id}`}>
                <h2 className="text-2xl font-bold">{postData.post.title}</h2>
              </Link>
            </div>
            <div className="c-card__footer pt-2 mt-2 border-t">
              <div className="flex items-center">
                <Link to={`users/${postData.user.id}`}>
                  <img src={postData.user.photoURL} alt="" className="avatar" />
                </Link>
                <div className="pl-4 text-sm">
                  <Link to={`users/${postData.user.id}`}>
                    {postData.user.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
      }
    </div>
  )
}

export default IndexPost