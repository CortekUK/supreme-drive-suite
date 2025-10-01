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
    <section className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16 text-gradient-metal">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex flex-col items-center text-center space-y-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45,100%,50%)] to-[hsl(35,100%,40%)] opacity-20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(45,100%,50%)] to-[hsl(35,100%,40%)] flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                    <Icon className="w-10 h-10 text-background" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-foreground">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
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
