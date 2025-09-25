import { loginApi, registerApi, refreshTokenApi } from "../../shared/services/authApi";
import { useAuthStore } from "../../shared/hooks/state/authStore";

export async function login(email: string, password: string) {
  const { token, user } = await loginApi({ email, password });
  useAuthStore.getState().login({ token, user });
}

export async function register(name: string, email: string, password: string) {
  const { token, user } = await registerApi({ name, email, password });
  useAuthStore.getState().login({ token, user });
}

export async function refreshToken() {
  const state = useAuthStore.getState();
  if (!state.token) return;
  const res = await refreshTokenApi(state.token);
  useAuthStore.setState({ token: res.token });
}


