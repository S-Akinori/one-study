export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  photoURL: string
  two_factor_recovery_codes: string | null
  two_factor_secret: string | null
  followings: number
  followers: number
  postTotal: number
  created_at: string
  updated_at: string | null
  downloadedFiles: number[]
}