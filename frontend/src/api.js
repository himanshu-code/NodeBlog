const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (_error) {
    return {};
  }
};

export const apiRequest = async (path, { token, ...options } = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(window.atob(payload));
  } catch (_error) {
    return {};
  }
};
