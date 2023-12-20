import React from "react"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher } from "@/lib/fetchers"
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
