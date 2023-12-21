import { MoonIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Shell } from "@/components/shell"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell>
        <section className="flex items-center justify-between">
          <div className="space-x-2 text-sm">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span className="select-none text-xs text-muted-foreground">
              &bull;
            </span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span className="select-none text-xs text-muted-foreground">
              &bull;
            </span>
            <span className="text-muted-foreground">
              © {new Date().getFullYear()} QPost
            </span>
          </div>

          <div className="cursor-not-allowed space-x-2">
            <Button size="sm" variant="ghost">
              <MoonIcon className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </Shell>
    </footer>
  )
}
