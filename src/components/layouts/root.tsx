import { SiteHeader } from "@/components/site-header"

export function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">{children}</main>

      {/* <SiteFooter /> */}
    </div>
  )
}
