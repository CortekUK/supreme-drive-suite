import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X, Lock, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import tissLogo from "@/assets/tiss-logo.png";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const isActive = (path: string) => location.pathname === path;
  
  // Format phone number for tel: link (remove spaces and special chars except +)
  const phoneLink = settings.phone.replace(/[^\d+]/g, '');

  useEffect(() => {
    // Set initial scroll state
    setIsScrolled(window.scrollY > 20);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [{
    path: "/",
    label: "Home"
  }, {
    path: "/chauffeur-services",
    label: "Chauffeur"
  }, {
    path: "/close-protection",
    label: "Close Protection"
  }, {
    path: "/portfolio",
    label: "Portfolio"
  }, {
    path: "/pricing",
    label: "Pricing"
  }, {
    path: "/about",
    label: "About"
  }, {
    path: "/testimonials",
    label: "Testimonials"
  }, {
    path: "/contact",
    label: "Contact"
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-metal py-3 h-[72px]">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="flex items-center w-full justify-between gap-2 lg:gap-4 xl:gap-8">
          {/* Logo/Branding - Left */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img src={tissLogo} alt="TISS - Travel in Supreme Style" className="h-14 lg:h-16 w-auto -my-2 object-contain" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden xl:flex items-center justify-center flex-1 gap-3 2xl:gap-5">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary px-2 whitespace-nowrap ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>)}
          </div>

          {/* Right-side Action Area */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <a href={`tel:${phoneLink}`}>
              <Button className="gradient-accent shadow-glow text-sm font-semibold whitespace-nowrap">
                <Phone className="w-4 h-4 2xl:mr-2" />
                <span className="hidden 2xl:inline">{settings.phone}</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="xl:hidden pb-4 pt-4 space-y-3 border-t border-border/50 mt-4 bg-background/95 backdrop-blur-sm -mx-2 px-2">
            {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block py-2.5 text-sm font-medium transition-colors pl-0 ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>)}
            <div className="pt-4 space-y-3">
              <a href={`tel:${phoneLink}`}>
                <Button className="w-full gradient-accent shadow-glow">
                  <Phone className="w-4 h-4 mr-2" />
                  {settings.phone}
                </Button>
              </a>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;