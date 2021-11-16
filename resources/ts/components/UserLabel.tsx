import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number
  name: string
  username: string
  photoURL: string
  followings: number
  followers: number
  postTotal: number
}
interface Props {
  user?: User | null
  id?: number | null
  hasLink?: boolean
  avatarSize? : 'sm' | 'md' | 'lg' | 'xl'
}

const UserLabel = ({user = null, id = null, hasLink = true, avatarSize = 'md'}: Props) => {
  const [userData, setUserData] = useState(user);
  const avatarClass = `c-avatar c-avatar--${avatarSize}`
  useEffect(() => {
    if(!userData && id) {
      axios.get(`/api/users/${id}`).then((res) => {
        setUserData(res.data)
      })
    }
  }, []);
  return (
    <>
      {userData && hasLink && 
        <div className="flex items-center">
          <Link to={`/users/${userData?.id}`}>
            <img src={userData.photoURL} alt={userData.name} className={avatarClass} />
          </Link>
          <Link to={`/users/${userData?.id}`}>
            <div className="pl-2">{userData.name}</div>
          </Link>
        </div>
      }
      {userData && !hasLink && 
        <div className="flex items-center">
          <div className="w-8 h-8">
            <img src={userData.photoURL} alt={userData.name} className={avatarClass} />
          </div>
          <div className="pl-2">{userData.name}</div>
        </div>
      }
    </>
  )
}

export default UserLabel;