import React from "react"
import { Toaster } from "react-hot-toast"

import type { AppPropsWithLayout } from "@/types/next"
import { useStore } from "@/lib/store"
import { BreakpointIndicator } from "@/components/breakpoint-indicator"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  React.useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <>
      {getLayout(<Component {...pageProps} />)}

      <Toaster />
      <BreakpointIndicator />
    </>
  )
}
