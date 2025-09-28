import { User } from "../types/userProfile";

export async function loginApi(params: { email: string; password: string }) {
  // Placeholder: replace with real HTTP call
  const user: User = {
    id: "1",
    name: "Demo User",
    email: params.email,
    role: "RENTER",
  };
  return { token: "mock-token", user };
}

export async function registerApi(params: { name: string; email: string; password: string }) {
  // Placeholder
  const user: User = {
    id: "2",
    name: params.name,
    email: params.email,
    role: "RENTER",
  };
  return { token: "mock-token", user };
}

export async function refreshTokenApi(token: string) {
  // Placeholder
  return { token };
}


