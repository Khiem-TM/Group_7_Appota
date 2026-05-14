import client from "./client";

export async function getMe() {
  const { data } = await client.get("/users/me");
  return data;
}

export async function getMyProfile() {
  const { data } = await client.get("/users/me/profile");
  return data;
}

export async function updateMe(payload) {
  const { data } = await client.patch("/users/me", payload);
  return data;
}

export async function uploadProfileMedia(kind, file) {
  const formData = new FormData();
  formData.append("kind", kind);
  formData.append("file", file);
  const { data } = await client.post("/users/me/media", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await client.post("/users/me/change-password", {
    current_password: currentPassword,
    new_password: newPassword
  });
  return data;
}

export async function getUserProfile(userId) {
  const { data } = await client.get(`/users/${userId}/profile`);
  return data;
}

export async function searchUsers(query, limit = 10) {
  const { data } = await client.get("/users/search", {
    params: { q: query, limit }
  });
  return data;
}
