const footerLinks = [
  { label: "Help", href: "/help" },
  { label: "Status", href: "/status" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-3 bg-[#F7F4ED]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <a href="/" className="text-xl font-bold text-foreground">
            Medium
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href="/"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
