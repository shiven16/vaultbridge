import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import apiClient from "../utils/apiClient";

export interface AccountInfo {
  email: string;
  name: string;
}

export interface AuthState {
  sourceAccount: AccountInfo | null;
  destinationAccount: AccountInfo | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<void>;
  logout: () => void;
  isFullyConnected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sourceAccount, setSourceAccountState] = useState<AccountInfo | null>(null);
  const [destinationAccount, setDestinationAccountState] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      
      if (data.sourceConnected) {
        setSourceAccountState({ email: data.sourceEmail, name: data.user.name });
      } else {
        setSourceAccountState(null);
      }
      
      if (data.destConnected) {
        setDestinationAccountState({ email: data.destEmail, name: '' });
      } else {
        setDestinationAccountState(null);
      }
    } catch {
      setSourceAccountState(null);
      setDestinationAccountState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(() => {
    setSourceAccountState(null);
    setDestinationAccountState(null);
    // Ideally this hits a backend /auth/logout to destroy the cookie, 
    // or just clears state until a 401 kicks in.
    window.location.href = '/login';
  }, []);

  const isFullyConnected = sourceAccount !== null && destinationAccount !== null;

  return (
    <AuthContext.Provider
      value={{
        sourceAccount,
        destinationAccount,
        isLoading,
        refreshAuth,
        logout,
        isFullyConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
