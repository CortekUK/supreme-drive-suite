import { Shield, Lock, Crown, Award } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Safety & Security",
    description: "Military-grade security protocols and fully insured services"
  },
  {
    icon: Lock,
    title: "Privacy & Discretion",
    description: "Absolute confidentiality and NDAs for all high-profile clients"
  },
  {
    icon: Crown,
    title: "Luxury Fleet",
    description: "Premium vehicles maintained to the highest standards"
  }
];

const TrustBadges = () => {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-20 text-gradient-metal animate-fade-in">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex flex-col items-center text-center space-y-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/60 opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-all duration-500" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.35)] group-hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all duration-500">
                    <Icon className="w-12 h-12 text-background" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-semibold text-foreground">{point.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
