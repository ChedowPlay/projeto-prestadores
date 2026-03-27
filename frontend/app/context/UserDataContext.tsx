"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { ProviderData } from "../Pages/loggedArea/actions";
import { getProvider } from "../Pages/loggedArea/actions";

interface AuthUserContextType {
  user: ProviderData | null;
  token: string | null; // Novo campo para o token
  isAuthenticated: boolean;
  isLoading: boolean;
  loginContext: (token: string, userData: ProviderData) => void;
  logout: () => Promise<void>;
  getToken: () => string | null; // Novo método para acessar o token
  register: (
    formData: FormData
  ) => Promise<{ success: boolean; errors?: Record<string, string[]> }>;
  verifyOtp: (
    email: string, 
    otp: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: ProviderData;
    token?: string;
  }>;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

export const AuthUserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: ProviderData | null;
}) => {
  const [user, setUser] = useState<ProviderData | null>(initialUser || null);
  const [token, setToken] = useState<string | null>(null); // Estado para o token
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.API_URL;

  // Verifica autenticação ao carregar (ex: refresh da página)
  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Tenta pegar do sessionStorage primeiro
      const storedToken = sessionStorage.getItem('auth_token');
      
      // 2. Se não tiver, tenta pegar do cookie (para compatibilidade)
      const cookieToken = !storedToken 
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1]
        : null;

      const activeToken = storedToken || cookieToken;
      
      if (activeToken) {
        try {
          const userData = await getProvider(activeToken);
          setUser(userData);
          setToken(activeToken);
          
          // Atualiza o cookie se veio do sessionStorage
          if (storedToken && !cookieToken) {
            document.cookie = `auth_token=${storedToken}; path=/; max-age=${60 * 60 * 3}`;
          }
        } catch (error) {
          console.error("Falha ao carregar usuário:", error);
          await logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginContext = (newToken: string, userData: ProviderData) => {
    setUser(userData);
    setToken(newToken);
    // Armazena em múltiplos lugares para resiliência
    document.cookie = `auth_token=${newToken}; path=/; max-age=${60 * 60 * 3}`; // 3 horas
    sessionStorage.setItem('auth_token', newToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    // Limpa todos os armazenamentos
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    sessionStorage.removeItem('auth_token');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  // Novo método para acessar o token facilmente
  const getToken = () => {
    return token || sessionStorage.getItem('auth_token');
  };

  const register = async (formData: FormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errors: errorData.errors };
      }

      return { success: true };
    } catch (error) {
      return { success: false, errors: { general: ["Erro no cadastro" + error ] } };
    }
  };

  const verifyOtp = async (email: string, otp: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/check-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        loginContext(data.token, data.user);
        return { 
          success: true,
          user: data.user,
          token: data.token
        };
      } else {
        return { 
          success: false, 
          error: data.error || 'Código inválido' 
        };
      }
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      return { 
        success: false, 
        error: 'Erro de conexão' 
      };
    }
  };

  return (
    <AuthUserContext.Provider
      value={{
        user,
        token, // Expoe o token no contexto
        isAuthenticated: !!user,
        isLoading,
        loginContext,
        logout,
        getToken, // Disponibiliza o método
        register,
        verifyOtp,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }
  return context;
};
