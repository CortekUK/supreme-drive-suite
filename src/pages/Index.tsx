import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServiceHighlights from "@/components/ServiceHighlights";
import BookingWidget from "@/components/BookingWidget";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      <ServiceHighlights />
      
      <section className="py-20 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient-metal">
            Ready to Experience Supreme Service?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your requirements or make a booking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="gradient-accent shadow-glow">
                Get in Touch
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="border-primary/50">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
