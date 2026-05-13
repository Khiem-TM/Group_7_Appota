import client from "./client";

export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function register(email, username, password, role = "HOST") {
  const { data } = await client.post("/auth/register", { email, username, password, role });
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refresh_token");
  try {
    if (refreshToken) {
      await client.post("/auth/logout", { refresh_token: refreshToken });
    }
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}
