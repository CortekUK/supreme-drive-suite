import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your message. We'll be in touch shortly!");
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient-metal">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              We're here to answer any questions and discuss your requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-metal flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:08001234567" className="text-accent hover:underline">
                      0800 123 4567
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available 24/7 for bookings and emergencies
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-metal flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:info@supremedrive.co.uk" className="text-accent hover:underline">
                      info@supremedrive.co.uk
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      We respond within 2 hours during business hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-metal flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-muted-foreground">
                      Mayfair, London<br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-metal bg-card/50 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-metal flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Availability</h3>
                    <p className="text-muted-foreground">
                      24 hours a day<br />
                      7 days a week<br />
                      365 days a year
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 md:p-8 shadow-metal bg-card/50 backdrop-blur">
              <h3 className="text-2xl font-display font-bold mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-accent shadow-glow"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
