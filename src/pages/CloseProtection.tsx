import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Award, Users, Globe } from "lucide-react";

const CloseProtection = () => {
  const features = [
    {
      icon: Shield,
      title: "Elite Security Personnel",
      description: "All our close protection officers are ex-military or law enforcement with SIA licenses and extensive experience in high-threat environments.",
    },
    {
      icon: Award,
      title: "Discreet Operations",
      description: "We pride ourselves on providing security that is both highly effective and entirely discrete, allowing you to maintain your lifestyle without intrusion.",
    },
    {
      icon: Users,
      title: "Flexible Teams",
      description: "From single operator to full security details, we scale our service to match your exact requirements and threat assessment.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Our network of trusted partners enables us to provide close protection services anywhere in the world at short notice.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Close Protection Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Your security is our paramount concern. Our elite close protection team combines 
              military precision with discrete professionalism to ensure your complete safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 shadow-metal bg-card/50 backdrop-blur">
                <div className="w-14 h-14 rounded-full gradient-metal flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-background" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur">
            <h2 className="text-3xl font-display font-bold mb-6 text-gradient-metal">
              Our Approach
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We conduct comprehensive threat assessments to understand your unique security requirements. 
                Our team then develops a tailored protection strategy that addresses all potential risks 
                while maintaining your privacy and freedom of movement.
              </p>
              <p>
                All our operatives undergo continuous training in defensive driving, threat recognition, 
                counter-surveillance, and emergency medical response. They are equipped with the latest 
                communication technology to ensure seamless coordination and rapid response capabilities.
              </p>
              <p>
                Whether you require protection for a specific event, ongoing security during travels, or 
                residential protection, we deliver a service that is both comprehensive and completely discrete.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CloseProtection;
