import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config"
import authBg from "@/assets/images/auth-bg.jpg"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/icons"

export function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={authBg}
          alt="Magazines displayed on a rack"
          fill
          className="absolute bottom-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
        <Link
          href="/"
          className="absolute left-8 top-6 z-20 flex items-center text-lg font-bold tracking-tight"
        >
          <Icons.Logo className="mr-2 h-8 w-8 translate-y-0.5" />
          <span>{siteConfig.name}</span>
        </Link>
        <div className="absolute bottom-6 left-8 z-20 line-clamp-1 hidden text-base md:block">
          <span>Photo by&nbsp;</span>
          <a
            href="https://unsplash.com/photos/magazines-displayed-on-a-rack-2G8mnFvH8xk"
            className="hover:underline"
            rel="noopener noreferrer"
          >
            Markus Spiske
          </a>
        </div>
      </AspectRatio>

      <main className="container absolute top-16 col-span-1 flex items-center md:static md:top-0 md:col-span-2 md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  )
}
