import client from "./client";

export async function getMe() {
  const { data } = await client.get("/users/me");
  return data;
}

export async function updateMe(payload) {
  const { data } = await client.patch("/users/me", payload);
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
