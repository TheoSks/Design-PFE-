'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

export interface UserData {
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  ville: string;
  statut: string;
  bio: string;
  notifPush: boolean;
  newsletter: boolean;
  avatarUrl?: string;
}

const STORAGE_KEY = 'labelimmo_user';

const DEFAULT_USER: UserData = {
  prenom: '',
  nom: '',
  email: '',
  phone: '',
  ville: '',
  statut: 'locataire',
  bio: '',
  notifPush: true,
  newsletter: false,
};

interface UserContextValue {
  user: UserData | null;
  isLoggedIn: boolean;
  saveUser: (data: Partial<UserData>) => void;
  updateUser: (data: Partial<UserData>) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoggedIn: false,
  saveUser: () => {},
  updateUser: () => {},
  clearUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserData) : null;
    } catch {
      return null;
    }
  });

  const persist = (data: UserData) => {
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  /** Create a new session (inscription) */
  const saveUser = useCallback((data: Partial<UserData>) => {
    persist({ ...DEFAULT_USER, ...data });
  }, []);

  /** Update existing profile (Mon Compte) */
  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser((prev) => {
      const next = { ...(prev ?? DEFAULT_USER), ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: user !== null, saveUser, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
