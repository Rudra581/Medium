
import { Navbar } from "../components/Navbar"
import { HeroSection } from "../components/Hero-section"
import { Footer } from "../components/Footer"
export default function LandingPage(){
     return (
   <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  )
}