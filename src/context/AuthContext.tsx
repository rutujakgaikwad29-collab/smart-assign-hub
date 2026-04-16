import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthChanged, getUserRole, getUserProfile, logIn, logOut, signUp, type UserRole, type UserProfile } from "@/firebase/authService";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  signup: (email: string, password: string, role: UserRole, profileData: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserRole> => {
    const firebaseUser = await logIn(email, password);
    const userRole = await getUserRole(firebaseUser.uid);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setUser(firebaseUser);
    setRole(userRole);
    setProfile(userProfile);
    return userRole!;
  };

  const signup = async (email: string, password: string, role: UserRole, profileData: Record<string, any>) => {
    const firebaseUser = await signUp(email, password, role, profileData);
    setUser(firebaseUser);
    setRole(role);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setProfile(userProfile);
  };

  const logout = async () => {
    await logOut();
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
