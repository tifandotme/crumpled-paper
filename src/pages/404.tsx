import Head from "next/head"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold">404</h1>
        <p className="text-center text-lg">
          The page you are looking for does not exist
        </p>
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    </>
  )
}
