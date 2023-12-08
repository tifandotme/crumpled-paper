import React from "react"
import { Toaster } from "react-hot-toast"

import type { AppPropsWithLayout } from "@/types/next"
import { useStore } from "@/lib/store"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  React.useEffect(() => {
    useStore.persist.rehydrate()
    useStore.persist.onFinishHydration((state) => {
      state.loading = false
    })
  }, [])

  return (
    <>
      {getLayout(<Component {...pageProps} />)}

      <Toaster />
    </>
  )
}
