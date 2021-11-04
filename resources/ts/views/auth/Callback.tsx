import axios from "axios";
import React from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../components/AuthContext";

const Callback = () => {
  const token = useLocation().search;
  const auth = useAuth();
  const history = useHistory();
  auth?.signinWithProvider(token).then(() => {
    history.push('/posts');
  })

  return (
    <p>認証中...</p>
  )
}

export default Callback