import axios from "axios";
import React from "react";

interface Tags {
  id: number,
  name: string,
  post_ids: number[]
  count: number
  created_at: string
  updated_at: string
}

let tags: Tags[] = [];
axios.get('/api/tags').then((res) => {
  tags = res.data
})

export default tags;