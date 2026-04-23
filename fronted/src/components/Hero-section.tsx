export function HeroSection() {
  return (
    <section className="relative flex h-full items-center overflow-hidden border-b border-border bg-[#F7F4ED]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Human stories & ideas
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A place to read, write, and deepen your understanding
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={localStorage.getItem("token")=== null ? "/signup" : "/blogs"}
              className="rounded-full bg-foreground px-6 py-3 text-center text-base font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Start reading
            </a>
            <a
              href={localStorage.getItem("token")=== null ? "/signup" : "/publish"}
              className="rounded-full border border-foreground bg-transparent px-6 py-3 text-center text-base font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Start writing
            </a>
          </div>
        </div>
      </div>
      {/* Decorative element */}
      <div className="absolute -right-20 top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl lg:block bg-[#F7F4ED]" />
    </section>
  )
}
