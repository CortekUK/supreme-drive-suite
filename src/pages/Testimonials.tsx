import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string | null;
  content: string;
  rating: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTestimonials(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Client Testimonials
            </h1>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. Here's what our clients have to say about our services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-8 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="text-lg text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-primary">{testimonial.customer_name}</p>
                  {testimonial.customer_title && (
                    <p className="text-sm text-muted-foreground">{testimonial.customer_title}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
