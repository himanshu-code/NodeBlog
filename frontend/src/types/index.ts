export type AuthMode = "login" | "register";

export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface PostAuthor {
  _id?: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: PostAuthor;
  likes: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
}
