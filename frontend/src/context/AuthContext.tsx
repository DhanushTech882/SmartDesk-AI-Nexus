"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "employee" | "agent" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  employee: {
    id: "usr-emp-101",
    name: "Alex Rivera",
    email: "alex.rivera@originx.corp",
    role: "employee",
    department: "Software Engineering",
    avatar: "👤",
  },
  agent: {
    id: "usr-agt-204",
    name: "Devon Vance",
    email: "devon.vance@originx.corp",
    role: "agent",
    department: "IT Service Desk Tier 2",
    avatar: "🛠️",
  },
  admin: {
    id: "usr-adm-001",
    name: "Elena Rostova",
    email: "elena.r@originx.corp",
    role: "admin",
    department: "Cloud & Infrastructure Operations",
    avatar: "🛡️",
  },
};

interface AuthContextType {
  user: UserProfile;
  setRole: (role: UserRole) => void;
  companyName: string;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_USERS.employee,
  setRole: () => {},
  companyName: "Origin X",
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("employee");

  useEffect(() => {
    const saved = localStorage.getItem("originx_active_role") as UserRole;
    if (saved && PRESET_USERS[saved]) {
      setCurrentRole(saved);
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem("originx_active_role", role);
  };

  return (
    <AuthContext.Provider
      value={{
        user: PRESET_USERS[currentRole],
        setRole: handleSetRole,
        companyName: "Origin X",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
