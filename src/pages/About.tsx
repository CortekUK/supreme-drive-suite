import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
const About = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal text-center">About Supreme Style</h1>
            
            <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur mb-8">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary">
                Excellence in Every Journey
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded on the principles of discretion, professionalism, and uncompromising quality, 
                  Supreme Drive Suite has established itself as the premier luxury chauffeur and close 
                  protection service provider in the United Kingdom.
                </p>
                <p>
                  Our team comprises highly trained professionals with backgrounds in military operations, 
                  law enforcement, and luxury hospitality. This unique combination ensures that every client 
                  receives not only the highest standards of safety and security but also an experience 
                  defined by comfort and sophistication.
                </p>
                <p>
                  We understand that our clients value their privacy and time above all else. That's why we've 
                  built our service around these core values, offering 24/7 availability, immediate response 
                  times, and a fleet of the world's finest vehicles.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </Card>
              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Journeys Completed</div>
              </Card>
              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur text-center">
                <div className="text-4xl font-display font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </Card>
            </div>

            <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary">
                Why Choose Us
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Discretion Guaranteed</h4>
                  <p>
                    All our chauffeurs and security personnel sign strict confidentiality agreements. 
                    Your privacy is sacred to us.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Premium Fleet</h4>
                  <p>
                    From the iconic Rolls-Royce Phantom to the commanding Range Rover Autobiography, 
                    our vehicles represent the pinnacle of automotive excellence.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Elite Security</h4>
                  <p>
                    Our close protection officers are among the best in the industry, with proven track 
                    records in protecting high-profile individuals across the globe.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">24/7 Availability</h4>
                  <p>
                    Day or night, weekday or weekend, we're always ready to serve you at a moment's notice.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;