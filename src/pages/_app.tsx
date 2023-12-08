import type { AppPropsWithLayout } from "@/types/next"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
