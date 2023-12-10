/* eslint-disable no-unused-vars */

import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import type { User } from "@/types/api"

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
        partialize: (state) => ({ user: state.user }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.loading = false
          }
        },
        skipHydration: true,
      },
    ),
  ),
)
