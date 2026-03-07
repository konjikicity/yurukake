import api from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
};

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>("/api/login", {
    email,
    password,
  });
  localStorage.setItem("token", data.token);
  return data;
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  const { data } = await api.post<{ token: string; user: User }>("/api/register", {
    name,
    email,
    password,
    password_confirmation,
  });
  localStorage.setItem("token", data.token);
  return data;
}

export async function logout() {
  await api.post("/api/logout");
  localStorage.removeItem("token");
}

export async function getUser() {
  const { data } = await api.get<User>("/api/user");
  return data;
}
