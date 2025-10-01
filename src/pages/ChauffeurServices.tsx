import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const ChauffeurServices = () => {
  const services = [
    {
      title: "Airport Transfers",
      description: "Professional meet and greet service with flight tracking and complimentary waiting time",
      features: ["Flight monitoring", "Meet and greet", "Luggage assistance", "Complimentary refreshments"],
    },
    {
      title: "Corporate Travel",
      description: "Executive transportation for business professionals and corporate events",
      features: ["Flexible scheduling", "Multiple stops", "WiFi and charging", "Confidential service"],
    },
    {
      title: "Special Events",
      description: "Red carpet service for weddings, galas, and exclusive events",
      features: ["Event coordination", "Multiple vehicles", "Extended hours", "Champagne service"],
    },
    {
      title: "City Tours",
      description: "Bespoke sightseeing experiences with knowledgeable chauffeurs",
      features: ["Custom itineraries", "Local expertise", "Flexible duration", "Photography stops"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Chauffeur Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the epitome of luxury travel with our professional chauffeur services. 
              Every journey is an opportunity to relax in supreme comfort and style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 shadow-metal bg-card/50 backdrop-blur">
                <h3 className="text-2xl font-display font-bold mb-3 text-primary">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChauffeurServices;
