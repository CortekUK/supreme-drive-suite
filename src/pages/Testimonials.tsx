import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquareQuote, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
      
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-metal leading-tight">
              Client Testimonials
            </h1>
            <div className="flex items-center justify-center mb-8">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              What our clients say about their Supreme Style experience.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="max-w-5xl mx-auto">
            {testimonials.length > 0 ? (
              <div className="space-y-8 animate-fade-in animation-delay-200">
                {testimonials.map((testimonial, index) => (
                  <Card 
                    key={testimonial.id} 
                    className="group p-8 md:p-10 shadow-metal bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-glow border-accent/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Star Rating */}
                    <div className="flex justify-center mb-6 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 transition-all duration-300 ${
                            i < testimonial.rating
                              ? "fill-accent text-accent drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <MessageSquareQuote className="w-8 h-8 text-accent/40" />
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-lg md:text-xl text-muted-foreground mb-8 italic text-center leading-relaxed max-w-3xl mx-auto">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Customer Details */}
                    <div className="text-center space-y-1">
                      <p className="text-xl font-display font-semibold text-gradient-silver">
                        {testimonial.customer_name}
                      </p>
                      {testimonial.customer_title && (
                        <p className="text-sm uppercase tracking-wider text-accent/80">
                          {testimonial.customer_title}
                        </p>
                      )}
                    </div>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center mt-6">
                      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Empty State
              <Card className="p-16 text-center shadow-metal bg-card/50 backdrop-blur border-accent/20 animate-fade-in">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
                    <Sparkles className="w-12 h-12 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4 text-muted-foreground">
                  No testimonials available yet
                </h3>
                <p className="text-muted-foreground/70">
                  New client feedback will appear here soon.
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-10 md:p-12 text-center shadow-metal bg-gradient-to-br from-card via-secondary/20 to-card backdrop-blur border-accent/20">
              <MessageSquareQuote className="w-12 h-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient-silver">
                Would you like to share your experience?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                We value your feedback and would love to hear about your journey with Supreme Style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="shadow-glow hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all text-base px-10 py-6"
                  asChild
                >
                  <Link to="/contact">
                    Submit Feedback
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base px-10 py-6 border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                  asChild
                >
                  <Link to="/">
                    Book Your Journey
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
