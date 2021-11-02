import axios from "axios";
import React from "react";
import { useLocation } from "react-router";

const Callback = () => {
  const search = useLocation().search;
  console.log(search)
  axios.get('/api/login/twitter/callback').then((res) => {
    console.log(res.data);
  })

  return (
    <p>認証中...</p>
  )
}

export default Callback