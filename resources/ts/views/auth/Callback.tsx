import axios from "axios";
import React from "react";
import { useLocation } from "react-router";

const Callback = () => {
  const token = useLocation().search;
  axios.get(`/api/login/twitter/callback${token}`).then((res) => {
    console.log(res.data);
    
  })

  return (
    <p>認証中...</p>
  )
}

export default Callback