import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom'
import { useAuth } from "../../components/AuthContext";
import UserLabel from "../../components/UserLabel";
import {User} from '../../interface/User'

interface DynamicProps {
  id: string
}

const Following = () => {
  const [followings, setFollowings] = useState<User[] | null>(null)
  const {id}: DynamicProps = useParams();
  const auth = useAuth();

  useEffect(() => {
    if(id) {
      axios.get(`/api/followings/${id}`).then((res) => {
        console.log(res.data)
        setFollowings(res.data)
      })
    } else {
      axios.get(`/api/followings/${(auth?.user as User).id}`).then((res) => {
        setFollowings(res.data)
      })
    }
  }, [])
  return (
    <div className="p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {followings && followings.map((following, index) => (
          <UserLabel user={following} />
        ))}
      </div>
    </div>
  )
}

export default Following