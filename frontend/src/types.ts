export interface UserSummary {
  _id: string;
  email: string;
  name?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author?: UserSummary;
  likes: string[];
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  id?: string;
  iat?: number;
  exp?: number;
}

export interface AuthFormPayload {
  name?: string;
  email: string;
  password: string;
}

export interface PostPayload {
  title: string;
  content: string;
}
