import React from "react"
import { Toaster } from "sonner"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher, getUser } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { BreakpointIndicator } from "@/components/breakpoint-indicator"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  const user = useStore((state) => state.user)
  const updateUser = useStore((state) => state.updateUser)

  React.useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  React.useEffect(() => {
    if (!user) return

    const revalidateUser = async () => {
      const { success, data } = await getUser({
        email: user.email,
        password: user.password,
      })

      if (
        success &&
        data &&
        JSON.stringify(user.subscription) !== JSON.stringify(data.subscription)
      ) {
        updateUser(data)
      }
    }

    revalidateUser()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </SWRConfig>

      <Toaster />
      <BreakpointIndicator />
    </>
  )
}
