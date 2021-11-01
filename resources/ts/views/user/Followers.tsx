import axios from "axios";
import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom'
import { useAuth } from "../../components/AuthContext";
import UserLabel from "../../components/UserLabel";
import {User} from '../../interface/User'

interface DynamicProps {
  id: string
}

const Follower = () => {
  const [followers, setFollowers] = useState<User[] | null>(null)
  const {id}: DynamicProps = useParams();
  const auth = useAuth();

  useEffect(() => {
    if(id) {
      axios.get(`/api/followers/${id}`).then((res) => {
        console.log(res.data)
        setFollowers(res.data)
      })
    } else {
      axios.get(`/api/followers/${(auth?.user as User).id}`).then((res) => {
        setFollowers(res.data)
      })
    }
  }, [])
  return (
    <div className="p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {followers && followers.map((follower, index) => (
          <UserLabel user={follower} />
        ))}
      </div>
    </div>
  )
}

export default Follower