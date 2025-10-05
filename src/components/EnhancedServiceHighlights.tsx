import { Crown, ShieldCheck, Timer, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Crown,
    title: "Luxury Chauffeur",
    description: "Executive fleet and professional drivers delivering exceptional travel experiences with meticulous attention to every detail."
  },
  {
    icon: ShieldCheck,
    title: "Close Protection",
    description: "Discreet professional security with military-grade protocols, providing seamless protection for high-profile clients."
  },
  {
    icon: Timer,
    title: "24/7 Availability",
    description: "Round-the-clock support with immediate response times, ensuring premium service whenever you need us."
  },
  {
    icon: Medal,
    title: "Premium Experience",
    description: "Bespoke service and unmatched attention to detail, crafting every journey to perfection."
  }
];

const EnhancedServiceHighlights = () => {
  return (
    <section className="py-24 md:py-28 lg:py-32 bg-muted/30 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20 space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal">
            Elite Services
          </h2>
          <p className="text-base text-muted-foreground uppercase tracking-wider">
            Delivering excellence through premium transportation and security solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="relative overflow-hidden p-10 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_10px_40px_rgba(255,215,0,0.25)] animate-fade-in-up group min-h-[280px] flex flex-col"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Subtle metallic shine effect */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative space-y-6 flex-1 flex flex-col">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/60 opacity-20 blur-2xl rounded-full group-hover:opacity-35 transition-all duration-500" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)] group-hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] group-hover:ring-2 group-hover:ring-accent/50 transition-all duration-500">
                      <Icon className="w-10 h-10 text-background" strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-semibold text-foreground font-display leading-tight">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base flex-1">{service.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EnhancedServiceHighlights;
