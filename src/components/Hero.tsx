import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCar from "@/assets/hero-car.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 gradient-dark opacity-90" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gradient-metal leading-tight">
              TRAVEL IN<br />SUPREME STYLE
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience unparalleled luxury with our elite chauffeur services and professional close protection
            </p>
          </div>

          <div className="relative w-full max-w-2xl mx-auto my-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <img
              src={heroCar}
              alt="Luxury vehicle line art"
              className="w-full h-auto shadow-metal"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <a href="tel:08001234567">
              <Button size="lg" className="gradient-accent shadow-glow text-lg px-8 py-6">
                <Phone className="w-5 h-5 mr-2" />
                Call 0800 123 4567
              </Button>
            </a>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
              Book Online
            </Button>
          </div>

          <p className="text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
            Available 24/7 • Immediate Response • Discreet Service
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
