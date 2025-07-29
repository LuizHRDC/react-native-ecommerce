import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../services/authApi";
import { UserService, StoredUser } from "../services/UserService";

type AuthContextType = {
  user: StoredUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        const storedToken = await AsyncStorage.getItem("@token");

        if (storedUser && storedToken) {
          authApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch {
        // Falha silenciosa ao carregar dados armazenados
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.post("/login", { email, password });
      const { accessToken, user } = response.data;

      setUser(user);
      setToken(accessToken);

      authApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      await AsyncStorage.setItem("@token", accessToken);
    } catch (error: any) {
      alert("E-mail ou senha inválidos");
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    delete authApi.defaults.headers.common["Authorization"];
    await AsyncStorage.multiRemove(["@user", "@token"]);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return false;
    }

    try {
      await authApi.post("/register", {
        email,
        password,
        name,
      });

      return true;
    } catch (error: any) {
      const apiError = error?.response?.data;
      let message = "Erro ao registrar. Tente novamente.";

      if (typeof apiError === "string") {
        if (apiError.toLowerCase().includes("password")) {
          message = "A senha é muito curta. Mínimo de 6 caracteres.";
        } else if (apiError.toLowerCase().includes("email")) {
          message = "Este e-mail já está em uso.";
        } else {
          message = `Erro ao registrar: ${apiError}`;
        }
      } else if (typeof apiError === "object" && apiError !== null) {
        const translated = Object.entries(apiError).map(([field, msg]) => {
          if (field === "password") {
            return "• A senha é muito curta. Mínimo de 6 caracteres.";
          } else if (field === "email") {
            return "• Este e-mail já está em uso.";
          } else {
            return `• ${field}: ${msg}`;
          }
        });

        message = `Erro ao registrar:\n${translated.join("\n")}`;
      }

      alert(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signOut, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
