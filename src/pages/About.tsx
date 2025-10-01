import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              Everything you need to know about our luxury chauffeur services
            </p>

            {categories.length > 0 ? (
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map(category => (
                  <TabsContent key={category} value={category}>
                    <Card className="p-6 shadow-metal bg-card/50 backdrop-blur">
                      <Accordion type="single" collapsible className="w-full">
                        {faqsByCategory(category).map((faq, index) => (
                          <AccordionItem key={faq.id} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
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

            <Card className="mt-12 p-8 text-center shadow-metal bg-card/50 backdrop-blur">
              <h3 className="text-2xl font-display font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is here to help. Contact us for personalized assistance.
              </p>
              <a href="tel:08001234567" className="inline-block">
                <button className="gradient-accent shadow-glow px-8 py-3 rounded-md font-medium">
                  Call 0800 123 4567
                </button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;