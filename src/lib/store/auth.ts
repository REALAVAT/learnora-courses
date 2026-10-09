"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { unsplash } from "@/lib/images";

export type Role = "student" | "instructor";

export type DemoUser = {
  id: string;
  role: Role;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  instructorSlug?: string;
};

export const demoUsers: Record<Role, DemoUser> = {
  student: {
    id: "demo-student",
    role: "student",
    name: "Alex Morgan",
    email: "alex.morgan@learnora.demo",
    avatar: unsplash("1527689368864-3a821dbccc34", 200),
    headline: "Marketing manager learning product design",
  },
  instructor: {
    id: "demo-instructor",
    role: "instructor",
    name: "Maya Chen",
    email: "maya.chen@learnora.demo",
    avatar: unsplash("1580489944761-15a19d654956", 200),
    headline: "Principal Product Designer",
    instructorSlug: "maya-chen",
  },
};

type AuthState = {
  user: DemoUser | null;
  login: (role: Role, overrides?: Partial<Pick<DemoUser, "name" | "email">>) => DemoUser;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<DemoUser, "name" | "email" | "headline">>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (role, overrides) => {
        const user = { ...demoUsers[role], ...overrides };
        set({ user });
        return user;
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...patch } });
      },
    }),
    { name: "learnora-auth", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
