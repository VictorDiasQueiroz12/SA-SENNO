import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext(null);

const TOKEN_KEY = "little-ville:token";
const USER_KEY = "little-ville:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a aplicacao, tenta restaurar a sessao a partir do
  // localStorage e confirma com o backend via GET /auth/me (garante que
  // o token ainda e valido e que os dados do usuario estao atualizados).
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(credentials) {
    const { user: loggedUser, token } = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(payload) {
    const { user: newUser, token } = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }

  // Logout stateless: apenas remove o token localmente (decisao documentada
  // desde o Bloco 6 - sem blacklist/refresh token no MVP).
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
