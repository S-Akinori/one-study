import axios from "axios";
import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {saveAs} from "file-saver";
import {CircularProgress, Collapse, Button} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from "../../components/AuthContext";
import UserLabel from "../../components/UserLabel";
import CreatePostLink from "../../components/CreatePostLink";
import {User} from "../../interface/User"
import CommentForm from "../../components/CommentForm";

interface DynamicProps {
  id: string
}

interface Post {
  id: number
  user_id: number
  title: string
  content: string
  fileURL: string
  downloadedTotal: number
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}

interface Comment {
  id: number,
  user_id: number,
  post_id: number,
  content: string,
  created_at: string
  updated_at: string
}

interface PostData {
  post: Post
  user: User
  comments: Comment[]
}

const ShowPost = () => {
  const [postdata, setPostdata] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false);
  const [shown, setShown] = useState(false);
  const {id}: DynamicProps = useParams()
  const auth = useAuth();
  
  const download = async () => {
    setDownloading(true);
    if(postdata) {
      const data = await fetch(postdata?.post.fileURL);
      const blob = await data.blob();
      saveAs(blob, postdata.post.title);

      const downloadedFiles = ((auth?.user as User).downloadedFiles) ? (auth?.user as User).downloadedFiles : [];
      const existIdInArray = (downloadedFiles.length > 0) ? downloadedFiles.includes(parseInt(id)) : false

      if(!existIdInArray) {
        downloadedFiles.push(parseInt(id));
      }
      axios.get('/sanctum/csrf-cookie').then(() => {
        axios.put(`/api/posts/${id}`, {
          'downloadedTotal': postdata.post.downloadedTotal + 1,
        });
        if(!existIdInArray) {
          axios.put(`/api/users/${(auth?.user as User).id}`, {
            'downloadedFiles': downloadedFiles
          });
        }
      });
    }
    setDownloading(false);
  }

  const toggleCollapse = () => {
    setShown(!shown);
  }

  const setNewComment = (comment: Comment) => {
    if(postdata) {
      const newPostData : PostData = {
        post: postdata.post,
        user: postdata.user,
        comments: postdata.comments
      }
      newPostData.comments.push(comment);
      setPostdata(newPostData);
    }
  }

  useEffect(() => {
    axios.get(`/api/posts/${id}`).then((res) => {
      setPostdata(res.data);
      setLoading(false)
    }).catch((error) => {
      console.log(error.response)
      setLoading(false)
    })
  }, [])
  
  return (
    <div className="p-4 relative">
      {loading && <CircularProgress />}
      {!loading && !postdata && <p>エラーが起こりました。</p>}
      {!loading && postdata && 
      <div className="p-post">
        <div className="p-post__header">
          <h1 className="p-post__header__title py-4 text-xl font-bold">{postdata.post.title}</h1>
          <div className="p-post__header__img">
            <img src={postdata.post.fileURL} alt="" onContextMenu={(e) => {e.preventDefault(); return false}} />
          </div>
          <div className="py-4">
            <LoadingButton loading={downloading} variant="contained" onClick={download} disabled={(auth?.user == 'unverified' || auth?.user == 'unauthorized') ? true : false }>ダウンロード</LoadingButton>
            <span><DownloadIcon />{postdata.post.downloadedTotal}</span>
            {(auth?.user == 'unverified' || auth?.user == 'unauthorized') && <p className="c-error">ダウンロードするにはログインが必要です</p>}
          </div>
        </div>
        <div className="p-post__body py-4">
          {postdata.post.content}
        </div>
        <div className="p-post__footer py-4">
          <ul className="p-post__footer__tags flex">
            {postdata.post.tags && postdata.post.tags.map((tag, index) => (
              <li key={index} className="px-2 py-1 mx-2 bg-gray-200 rounded-full">{tag}</li>
            ))}
          </ul>
          <div className="p-post__footer__user py-4">
            <UserLabel user={postdata.user} />
          </div>
          <div className="p-post__footer__comments py-4">
            <h2 className="py-4 text-xl font-bold">コメント</h2>
            {(auth?.user !== 'unverified' && auth?.user !== 'unauthorized') && (
              <>
                <Button variant="text" onClick={toggleCollapse}>コメントする</Button>
                <Collapse in={shown}>
                  <CommentForm userId={(auth?.user as User).id} postId={id} returnToParent={setNewComment} />
                </Collapse>
              </>
            )}
            {postdata.comments.length > 0 && postdata.comments.map((comment, index) => (
              <div key={comment.id} className="py-4 border-b-2">
                <UserLabel id={comment.user_id} avatarSize="sm" />
                <p className="">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      }
      <CreatePostLink />
    </div>
  )
}

export default ShowPost