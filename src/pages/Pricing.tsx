import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Vehicle {
  name: string;
  category: string;
  description: string;
  base_price_per_mile: number;
  overnight_surcharge: number;
  features: string[];
}

const Pricing = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("is_active", true)
      .order("base_price_per_mile");

    if (!error && data) {
      setVehicles(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No surprises. Just premium service at competitive rates.
            </p>
          </div>

          <div className="space-y-6 mb-16">
            {vehicles.map((vehicle, index) => (
              <Card key={index} className="p-8 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold mb-2 text-primary">
                      {vehicle.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{vehicle.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features?.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-secondary/50 text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-display font-bold text-accent mb-2">
                      £{vehicle.base_price_per_mile}
                    </div>
                    <div className="text-sm text-muted-foreground">per mile</div>
                    {vehicle.overnight_surcharge > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-2xl font-display font-semibold text-primary">
                          +£{vehicle.overnight_surcharge}
                        </div>
                        <div className="text-xs text-muted-foreground">overnight surcharge</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur">
            <h2 className="text-3xl font-display font-bold mb-6 text-gradient-metal">
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Standard Service</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Professional chauffeur</li>
                  <li>• Fuel and insurance</li>
                  <li>• Complimentary water and refreshments</li>
                  <li>• WiFi and device charging</li>
                  <li>• Flight tracking (airport transfers)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Premium Add-ons</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Close protection officer: from £500/day</li>
                  <li>• Extended waiting time: £50/hour</li>
                  <li>• Last-minute bookings: +25%</li>
                  <li>• Champagne service: £75</li>
                  <li>• Multiple stops: POA</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
