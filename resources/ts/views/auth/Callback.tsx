import axios from "axios";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
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
    <div className="p-4">
      <p>認証中...<CircularProgress/></p>
    </div>
  )
}

export default Callback