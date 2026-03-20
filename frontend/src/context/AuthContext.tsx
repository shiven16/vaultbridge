import { createContext, useState, useCallback, type ReactNode } from "react";
import { setSessionToken } from "../utils/apiClient";

export interface AccountInfo {
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  sourceAccount: AccountInfo | null;
  destinationAccount: AccountInfo | null;
  sessionToken: string | null;
}

export interface AuthContextType extends AuthState {
  setSourceAccount: (account: AccountInfo) => void;
  setDestinationAccount: (account: AccountInfo) => void;
  setSession: (token: string) => void;
  clearAuth: () => void;
  isFullyConnected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sourceAccount, setSourceAccountState] = useState<AccountInfo | null>(
    null,
  );
  const [destinationAccount, setDestinationAccountState] =
    useState<AccountInfo | null>(null);
  const [sessionToken, setSessionTokenState] = useState<string | null>(null);

  const setSource = useCallback((account: AccountInfo) => {
    setSourceAccountState(account);
    setSessionToken(account.token);
    setSessionTokenState(account.token);
  }, []);

  const setDestination = useCallback((account: AccountInfo) => {
    setDestinationAccountState(account);
  }, []);

  const setSession = useCallback((token: string) => {
    setSessionToken(token);
    setSessionTokenState(token);
  }, []);

  const clearAuth = useCallback(() => {
    setSourceAccountState(null);
    setDestinationAccountState(null);
    setSessionToken(null);
    setSessionTokenState(null);
  }, []);

  const isFullyConnected =
    sourceAccount !== null && destinationAccount !== null;

  return (
    <AuthContext.Provider
      value={{
        sourceAccount,
        destinationAccount,
        sessionToken,
        setSourceAccount: setSource,
        setDestinationAccount: setDestination,
        setSession,
        clearAuth,
        isFullyConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
