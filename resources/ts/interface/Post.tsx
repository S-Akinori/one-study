export interface Post {
  id: number
  user_id: number
  title: string
  content: string
  fileURL: string
  downloadedTotal: number
  tags: string[] | null
  category: string | null
  created_at: string
  updated_at: string | null
}