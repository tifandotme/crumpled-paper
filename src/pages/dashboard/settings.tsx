import React from "react"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layouts/dashboard"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function SettingsPage() {
  return (
    <Shell variant="sidebar">
      <PageHeader separated>
        <PageHeaderHeading size="sm">Settings</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Tweaks and customizations
        </PageHeaderDescription>
      </PageHeader>

      <Settings />
    </Shell>
  )
}

function Settings() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="grid max-w-3xl gap-4 p-6">
      <h3 className="text-lg font-semibold sm:text-xl">Mode</h3>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setTheme("light")}
          className={cn(mounted && theme === "light" && "bg-accent")}
        >
          <SunIcon className="mr-2 h-4 w-4" />
          Light
        </Button>
        <Button
          variant="outline"
          onClick={() => setTheme("dark")}
          className={cn(mounted && theme === "dark" && "bg-accent")}
        >
          <MoonIcon className="mr-2 h-4 w-4" />
          Dark
        </Button>
        <Button
          variant="outline"
          onClick={() => setTheme("system")}
          className={cn(mounted && theme === "system" && "bg-accent")}
        >
          <LaptopIcon className="mr-2 h-4 w-4" />
          System
        </Button>
      </div>
    </Card>
  )
}

SettingsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}
