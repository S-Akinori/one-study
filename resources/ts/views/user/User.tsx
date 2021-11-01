import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import { useHistory, useParams } from "react-router-dom";
import {User} from "../../interface/User"
import {Post} from "../../interface/Post"
import {PostData} from "../../interface/PostData";
import {Button} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

interface DynamicProps {
  id: string
}

const User = () => {
  const auth = useAuth()
  const history = useHistory()
  const [user, setUser] = useState<User | null>(null);
  const [myposts, setMyposts] = useState<PostData[] | null>(null);
  const [downloadedPosts, setDownloadedPosts] = useState<PostData[] | null>(null);
  const [isFollower, setIsFollwer] = useState(false);
  const {id}: DynamicProps = useParams();
  useEffect(() => {
    if(id) {
      axios.get(`/api/users/${id}`).then((res) => {
        setUser(res.data);
        axios.get(`/api/posts?user_id=${id}`).then(res => {
          console.log('mypots: ', res.data);
          setMyposts(res.data);
        })
        const downloadedIds = (res.data as User).downloadedFiles ? (res.data as User).downloadedFiles.join(',') : null;
        axios.get(`/api/posts?ids=${downloadedIds}`).then((res) => {
          setDownloadedPosts(res.data);
        })

        axios.get(`/api/followings/${(auth?.user as User).id}/followers/${id}`).then((res) => {
          if(res.data.length > 0) {
            setIsFollwer(true);
          } else {
            setIsFollwer(false);
          }
        })
      })
    } else {
      setUser(auth?.user as User);
      axios.get(`/api/posts?user_id=${(auth?.user as User).id}`).then(res => {
        setMyposts(res.data);
      })
      const downloadedIds = (auth?.user as User).downloadedFiles ? (auth?.user as User).downloadedFiles.join(',') : null;
      axios.get(`/api/posts?ids=${downloadedIds}`).then((res) => {
        setDownloadedPosts(res.data);
      })
    }
  }, [])
  const follow = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post(`/api/follow/${id}`).then((res) => {
        if(res.data.status === 'created') {
          setIsFollwer(true);
        } else if(res.data.status === 'deleted') {
          setIsFollwer(false);
        }
      });
    })
  }
  return (
    <>
      {user &&
      <div className="p-user">
        <div className="p-user__cover relative bg-green-300 h-40 flex justify-center items-end">
          <div className="p-user__avatar relative top-8 w-16 h-16">
            <img src={user.photoURL} alt={user.name} className="avatar" />
          </div>
        </div>
        <div className="p-user__info text-center relative py-8">
          {user.id === (auth?.user as User).id &&
          <Link to="/user/settings">
            <Button variant="outlined" className="rounded-full absolute top-2 right-2">設定</Button>
          </Link>
          }
          {user.id !== (auth?.user as User).id &&
            <Button variant={isFollower ? "contained" : "outlined"} onClick={follow} className="rounded-full absolute top-2 right-2">
              {isFollower && (<>フォロー中 <CheckIcon /></>) }
              {!isFollower && (<>フォロー</>)}
            </Button>
          }
          <p>{user.name}</p>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          <div className="py-4 flex justify-center items-center">
            <div className="p-4 border-r-2">
              <Link to={`/user/${user.id}/following`}>フォロー</Link><br />
              {user.followings}
            </div>
            <div className="p-4 border-r-2">
              <Link to={`/user/${user.id}/follower`}>フォロワー</Link><br />
              {user.followers}
            </div>
            <div className="p-4">
              投稿数<br />
              {user.postTotal}
            </div>
          </div>
        </div>
        <div className="p-user__posts px-4">
          <div>
            <h2 className="text-xl font-bold">投稿</h2>
            {myposts && 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myposts.map((mypost, index) => (
              <div key={mypost.post.id} className="c-card bg-white shadow rounded">
                <div className="c-card__header">
                  <Link to={`posts/id/${mypost.post.id}`}>
                    <img src={mypost.post.fileURL} alt={mypost.post.title} onContextMenu={(e) => {e.preventDefault(); return false}}/>
                  </Link>
                </div>
                <div className="c-card__body">
                  <Link to={`posts/id/${mypost.post.id}`}>
                    <h2 className="text-2xl font-bold">{mypost.post.title}</h2>
                  </Link>
                </div>
              </div>
              ))}
            </div>
            }
          </div>
          <div className="py-4">
            <h2 className="text-xl font-bold">保存した投稿</h2>
            {downloadedPosts && 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloadedPosts.map((downloadedPost, index) => (
              <div key={downloadedPost.post.id} className="c-card bg-white shadow rounded">
                <div className="c-card__header">
                  <Link to={`posts/id/${downloadedPost.post.id}`}>
                    <img src={downloadedPost.post.fileURL} alt={downloadedPost.post.title} onContextMenu={(e) => {e.preventDefault(); return false}}/>
                  </Link>
                </div>
                <div className="c-card__body">
                  <Link to={`posts/id/${downloadedPost.post.id}`}>
                    <h2 className="text-2xl font-bold">{downloadedPost.post.title}</h2>
                  </Link>
                </div>
              </div>
              ))}
            </div>
            }
          </div>
        </div>
      </div>
      }
    </>
  );
}

export default User;