import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Car, 
  Star, 
  Shield, 
  Crown, 
  Lock, 
  PhoneCall 
} from "lucide-react";
const About = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    if (data) {
      setFaqs(data);
      const uniqueCategories = [...new Set(data.map(faq => faq.category))];
      setCategories(uniqueCategories);
    }
  };

  const faqsByCategory = (category: string) => 
    faqs.filter(faq => faq.category === category);

  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-metal leading-tight">
              About Supreme Style
            </h1>
            <div className="flex items-center justify-center mb-8">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Setting the standard for luxury chauffeur and close protection services across the United Kingdom.
            </p>
          </div>

          {/* Excellence in Every Journey */}
          <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur mb-12 animate-fade-in animation-delay-200">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-gradient-silver">
              Excellence in Every Journey
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded on the principles of discretion, professionalism, and uncompromising quality, 
                Supreme Drive Suite has become one of the United Kingdom's leading providers of luxury 
                chauffeur and close protection services.
              </p>
              <p>
                Our team consists of highly trained professionals with backgrounds in military operations, 
                law enforcement, and luxury hospitality — a combination that ensures unparalleled safety, 
                comfort, and sophistication.
              </p>
              <p>
                We understand our clients value privacy and time above all else. That's why our services 
                are built around discretion, punctuality, and excellence — available 24/7 with immediate 
                response times and access to the world's most prestigious vehicles.
              </p>
            </div>
          </Card>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 animate-fade-in animation-delay-400">
            <Card className="p-8 shadow-metal bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur text-center group hover:shadow-glow transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="text-5xl font-display font-bold bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent mb-3">
                15+
              </div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                Years Experience
              </div>
            </Card>

            <Card className="p-8 shadow-metal bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur text-center group hover:shadow-glow transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                  <Car className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="text-5xl font-display font-bold bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent mb-3">
                10,000+
              </div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                Journeys Completed
              </div>
            </Card>

            <Card className="p-8 shadow-metal bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur text-center group hover:shadow-glow transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                  <Star className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="text-5xl font-display font-bold bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent mb-3">
                100%
              </div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                Client Satisfaction
              </div>
            </Card>
          </div>

          {/* Why Choose Us */}
          <Card className="p-8 md:p-12 shadow-metal bg-card/50 backdrop-blur animate-fade-in animation-delay-600">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-silver mb-4">
                Why Choose Us
              </h2>
              <div className="h-[1px] w-24 bg-gradient-to-r from-accent to-transparent" />
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex-shrink-0">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold text-foreground mb-3">
                    Discretion Guaranteed
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    All chauffeurs and protection officers sign confidentiality agreements to guarantee complete privacy.
                  </p>
                </div>
              </div>

              <Separator className="bg-accent/20" />

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex-shrink-0">
                  <Crown className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold text-foreground mb-3">
                    Premium Fleet
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    From the Rolls-Royce Phantom to the Range Rover Autobiography, every vehicle represents British excellence and comfort.
                  </p>
                </div>
              </div>

              <Separator className="bg-accent/20" />

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold text-foreground mb-3">
                    Elite Security
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Our close protection officers are experienced professionals, trained to safeguard high-profile clients discreetly.
                  </p>
                </div>
              </div>

              <Separator className="bg-accent/20" />

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold text-foreground mb-3">
                    24/7 Availability
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether weekday or weekend, we're ready to respond at a moment's notice — anywhere across the UK.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal mb-6">
                Frequently Asked Questions
              </h2>
              <div className="flex items-center justify-center mb-6">
                <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-accent to-transparent" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground">
                Everything you need to know about our luxury chauffeur and protection services.
              </p>
            </div>

            {categories.length > 0 ? (
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-card/50 p-1 h-auto">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:border-accent/50 border border-transparent transition-all py-3"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map(category => (
                  <TabsContent key={category} value={category} className="animate-fade-in">
                    <Card className="p-8 shadow-metal bg-card/50 backdrop-blur border-accent/20">
                      <Accordion type="single" collapsible className="w-full">
                        {faqsByCategory(category).map((faq, index) => (
                          <AccordionItem 
                            key={faq.id} 
                            value={`item-${index}`}
                            className="border-b border-accent/10 last:border-0"
                          >
                            <AccordionTrigger className="text-left hover:text-accent transition-colors py-5">
                              <span className="font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card className="p-8 text-center shadow-metal bg-card/50 backdrop-blur">
                <p className="text-muted-foreground">Loading FAQs...</p>
              </Card>
            )}

            {/* Still Have Questions CTA */}
            <Card className="mt-16 p-10 text-center shadow-metal bg-gradient-to-br from-card via-secondary/20 to-card backdrop-blur border-accent/20">
              <PhoneCall className="w-12 h-12 text-accent mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-gradient-silver">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto leading-relaxed">
                Our team is here to help. Contact us for personalised assistance.
              </p>
              <Button 
                size="lg" 
                className="shadow-glow hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all text-base px-10 py-6"
                asChild
              >
                <a href="tel:08001234567">
                  Call 0800 123 4567
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;