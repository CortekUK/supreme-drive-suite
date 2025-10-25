import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string;
  content: string;
  rating: number;
}

const EnhancedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) setTestimonials(data);
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-metal pb-2">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center mt-6">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </div>

        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          onMouseEnter={() => {
            const interval = setInterval(() => {
              setActiveIndex((current) => (current + 1) % testimonials.length);
            }, 5000);
            return () => clearInterval(interval);
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`p-8 shadow-metal bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-glow flex flex-col ${
                index === activeIndex ? 'ring-2 ring-accent/50' : ''
              }`}
              style={{
                animation: `fadeIn 0.6s ease-out forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0
              }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-accent text-accent drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" 
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="text-foreground/90 mb-6 italic leading-relaxed min-h-[7rem] flex items-start text-base">
                "{testimonial.content}"
              </p>

              <div className="border-t border-accent/20 pt-4 mt-auto">
                <p className="font-semibold text-gradient-silver font-display text-lg">{testimonial.customer_name}</p>
                {testimonial.customer_title && (
                  <p className="text-sm text-accent/80 uppercase tracking-wider mt-1">{testimonial.customer_title}</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-accent w-8 shadow-[0_0_10px_rgba(255,215,0,0.5)]' 
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
