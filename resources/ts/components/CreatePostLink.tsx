import React from "react";
import { Link } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';

const CreatePostLink = () => {
  return (
    <Link to="/posts/create" className="block fixed right-4 bottom-4 rounded-full p-4 bg-indigo-200 text-white"><CreateIcon /></Link>
  )
}

export default CreatePostLink