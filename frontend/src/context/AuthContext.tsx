import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { FC, ReactNode } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  uploadAvatar: (file: File) => Promise<string>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify user on mount or token change
  const refreshUser = useCallback(async (): Promise<User | null> => {
    const currentToken = authService.getToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      const profile = await userService.getMe();
      setUser(profile);
      setToken(currentToken);
      return profile;
    } catch (err) {
      console.warn('[AuthContext] Session expired or invalid:', err);
      authService.logout();
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload): Promise<User> => {
    const response = await authService.login(payload);
    setToken(response.token);
    // Fetch full profile with career statistics
    const fullProfile = await userService.getMe();
    setUser(fullProfile);
    return fullProfile;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const response = await authService.register(payload);
    setToken(response.token);
    const fullProfile = await userService.getMe();
    setUser(fullProfile);
    return fullProfile;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (
    payload: UpdateProfilePayload
  ): Promise<User> => {
    await userService.updateProfile(payload);
    const updated = await userService.getMe();
    setUser(updated);
    return updated;
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const res = await userService.uploadAvatar(file);
    if (user) {
      setUser({ ...user, avatarUrl: res.avatarUrl });
    }
    return res.avatarUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
