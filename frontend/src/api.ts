import type { AuthResponse, JwtPayload, Post } from "./types";

interface ApiOptions extends Omit<RequestInit, "headers"> {
  token?: string;
  headers?: Record<string, string>;
}

const parseJson = async <T>(response: Response): Promise<T | Record<string, never>> => {
  try {
    return (await response.json()) as T;
  } catch {
    return {};
  }
};

export const apiRequest = async <T>(path: string, { token, ...options }: ApiOptions = {}): Promise<T> => {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = (await parseJson<T & { message?: string }>(response)) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const parseJwt = (token: string): JwtPayload => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(window.atob(payload)) as JwtPayload;
  } catch {
    return {};
  }
};

export const getPosts = () => apiRequest<Post[]>("/api/posts");

export const registerUser = (payload: { name: string; email: string; password: string }) =>
  apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: { email: string; password: string }) =>
  apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createPostRequest = (payload: { title: string; content: string }, token: string) =>
  apiRequest<Post>("/api/posts", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const likePostRequest = (postId: string, token: string) =>
  apiRequest<{ likesCount: number; liked: boolean }>(`/api/posts/${postId}/like`, {
    method: "POST",
    token,
  });

export const deletePostRequest = (postId: string, token: string) =>
  apiRequest<{ message: string }>(`/api/posts/${postId}`, {
    method: "DELETE",
    token,
  });
