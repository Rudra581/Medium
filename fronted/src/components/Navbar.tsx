"use client"

import { useState } from "react"
import { PenLine, Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-[#F7F4ED]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">Medium</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex"> 
          <a
            href={localStorage.getItem("token") == null ? "/signup" : "/publish"}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <PenLine className="h-4 w-4" />
            Write
          </a>
          <a href="/signin" className="text-sm text-muted-foreground transition-colors hover:text-foreground ">
            Sign in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden bg-[#F7F4ED]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            
            <a
              href="/write"
              className="flex items-center gap-1.5 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <PenLine className="h-4 w-4" />
              Write
            </a>
            <a href="/signin" className="text-base text-muted-foreground transition-colors hover:text-foreground">
              Sign in
            </a>
            <a
              href="/signup"
              className="mt-2 w-full rounded-full bg-foreground py-3 text-center text-base font-medium text-background transition-colors hover:bg-foreground/90 bg-[#F7F4ED]"
            >
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
