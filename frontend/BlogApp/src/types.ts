export interface AuthResponse {
  token: string;
}

export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  likes: string[];
  createdAt: string;
}
