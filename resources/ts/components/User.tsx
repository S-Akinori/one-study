import React from "react";
import axios from "axios";

const User = () => {
  axios.get('/api/user', ).then(res => {
    console.log(res)
  }).catch(error => {
    console.log(error)
  })
  return <h1>Userページ</h1>;
}

export default User;