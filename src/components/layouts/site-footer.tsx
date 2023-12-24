import { siteConfig } from "@/config"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { Shell } from "@/components/shell"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell>
        <section className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-sm">
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
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>

          <ThemeToggle />
        </section>
      </Shell>
    </footer>
  )
}
