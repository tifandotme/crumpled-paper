/* eslint-disable no-unused-vars */

import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import type { User } from "@/types/db"

type State = {
  loading: boolean
  user: User | null
}

type Actions = {
  updateUser: (user: User | null) => void
}

export const useStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        loading: true,
        user: null,
        updateUser: (user) => set(() => ({ user })),
      }),
      {
        name: "userStorage",
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: true,
      },
    ),
  ),
)
