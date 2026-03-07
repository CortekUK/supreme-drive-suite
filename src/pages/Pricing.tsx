import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Car, CarFront, Crown, User, Fuel, Wifi, Phone, Plane,
  Droplets, Clock, Sparkles, Shield, GlassWater, ChevronLeft, ChevronRight, X, ZoomIn
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price_per_mile: number;
  overnight_surcharge: number;
  features: string[];
  image_url?: string;
}

interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

interface ServiceInclusion {
  id: string;
  title: string;
  icon_name: string;
  category: 'standard' | 'premium';
  display_order: number;
  is_active: boolean;
}

const getVehicleIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('ultra') || lower.includes('luxury')) return Crown;
  if (lower.includes('suv')) return CarFront;
  return Car;
};

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    User, Fuel, Droplets, Wifi, Plane, Shield,
    Clock, Phone, GlassWater, Sparkles, Car, Crown, CarFront
  };
  return icons[iconName] || User;
};

// Image Carousel Component
const VehicleImageCarousel = ({ images, vehicleName }: { images: VehicleImage[]; vehicleName: string }) => {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent(c => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent(c => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="relative w-full lg:w-72 flex-shrink-0 group cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-glow border border-accent/20">
          {images.map((img, i) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={`${vehicleName} - photo ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 rounded-full p-2">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Nav arrows (show if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {images.length > 1 && (
          <p className="text-xs text-muted-foreground/60 text-center mt-1">{current + 1} / {images.length} — click to enlarge</p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={images[current].image_url}
              alt={`${vehicleName} - photo ${current + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Thumbnails */}
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  {images.map((img, i) => (
                    <button key={img.id} onClick={() => setCurrent(i)}
                      className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${i === current ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-white/50 text-sm text-center mt-2">{current + 1} / {images.length}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Pricing = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleImages, setVehicleImages] = useState<Record<string, VehicleImage[]>>({});
  const [serviceInclusions, setServiceInclusions] = useState<ServiceInclusion[]>([]);
  const [pricingFaqs, setPricingFaqs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [vehiclesRes, imagesRes, inclusionsRes, faqsRes] = await Promise.all([
      supabase.from("vehicles").select("*").eq("is_active", true).order("base_price_per_mile"),
      supabase.from("vehicle_images").select("*").order("display_order"),
      supabase.from("service_inclusions").select("*").eq("is_active", true).order("category, display_order"),
      supabase.from("faqs").select("*").eq("is_active", true).eq("category", "Pricing").order("display_order"),
    ]);

    if (!vehiclesRes.error && vehiclesRes.data) setVehicles(vehiclesRes.data);
    if (!imagesRes.error && imagesRes.data) {
      const grouped: Record<string, VehicleImage[]> = {};
      imagesRes.data.forEach((img: VehicleImage) => {
        if (!grouped[img.vehicle_id]) grouped[img.vehicle_id] = [];
        grouped[img.vehicle_id].push(img);
      });
      setVehicleImages(grouped);
    }
    if (!inclusionsRes.error && inclusionsRes.data) setServiceInclusions(inclusionsRes.data as any);
    if (faqsRes.data) setPricingFaqs(faqsRes.data);
  };

  const standardInclusions = serviceInclusions.filter(inc => inc.category === 'standard');
  const premiumInclusions = serviceInclusions.filter(inc => inc.category === 'premium');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient-metal leading-tight">
              Our Fleet
            </h1>
            <div className="flex items-center justify-center mb-8">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our exclusive selection of luxury vehicles — each maintained to the highest standard for your comfort, style, and security.
            </p>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-8 mb-24">
            {vehicles.map((vehicle, index) => {
              const VehicleIcon = getVehicleIcon(vehicle.category);
              const imgs = vehicleImages[vehicle.id] || [];
              const hasImages = imgs.length > 0 || vehicle.image_url;

              // Build image list: prefer vehicle_images table, fallback to legacy image_url
              const imageList: VehicleImage[] = imgs.length > 0 ? imgs : (vehicle.image_url ? [{
                id: 'legacy',
                vehicle_id: vehicle.id,
                image_url: vehicle.image_url,
                display_order: 0,
                is_cover: true,
              }] : []);

              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-secondary/20 opacity-80" />
                  <div className="relative p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                      {/* Images */}
                      {imageList.length > 0 ? (
                        <VehicleImageCarousel images={imageList} vehicleName={vehicle.name} />
                      ) : (
                        <div className="hidden lg:flex w-72 aspect-[4/3] items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                          <VehicleIcon className="w-16 h-16 text-accent/40" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 space-y-6">
                        <div className="flex items-start gap-4">
                          {!hasImages && (
                            <div className="lg:hidden p-3 rounded-lg bg-accent/10 border border-accent/20">
                              <VehicleIcon className="w-6 h-6 text-accent" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-gradient-silver">
                              {vehicle.name}
                            </h3>
                            <p className="text-sm uppercase tracking-widest text-accent/80 font-medium mt-2">
                              {vehicle.category}
                            </p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-base">{vehicle.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features?.map((feature, idx) => (
                            <Badge key={idx} variant="outline"
                              className="px-4 py-2 rounded-full bg-secondary/50 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* What's Included */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal mb-4">What's Included</h2>
              <div className="flex items-center justify-center">
                <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-accent to-transparent" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-card/50 backdrop-blur shadow-metal border-accent/20">
                <div className="mb-6">
                  <h4 className="text-2xl font-display font-semibold mb-2 text-gradient-silver">Standard Service</h4>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-accent to-transparent" />
                </div>
                <ul className="space-y-4">
                  {standardInclusions.map((inclusion) => {
                    const IconComponent = getIconComponent(inclusion.icon_name);
                    return (
                      <li key={inclusion.id} className="flex items-start gap-3 text-muted-foreground">
                        <IconComponent className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{inclusion.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>

              <Card className="p-8 bg-card/50 backdrop-blur shadow-metal border-accent/20">
                <div className="mb-6">
                  <h4 className="text-2xl font-display font-semibold mb-2 text-gradient-silver">Premium Add-ons</h4>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-accent to-transparent" />
                </div>
                <ul className="space-y-4">
                  {premiumInclusions.map((inclusion) => {
                    const IconComponent = getIconComponent(inclusion.icon_name);
                    return (
                      <li key={inclusion.id} className="flex items-start gap-3 text-muted-foreground">
                        <IconComponent className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{inclusion.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="/#booking">
                <Button size="lg" className="text-base px-8 py-6">Book Your Journey</Button>
              </a>
            </div>
          </div>

          {/* FAQs */}
          {pricingFaqs.length > 0 && (
            <div className="max-w-4xl mx-auto mb-24">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal mb-4">FAQs</h2>
                <div className="flex items-center justify-center">
                  <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-accent to-transparent" />
                </div>
              </div>
              <Card className="p-8 shadow-metal bg-card/50 backdrop-blur border-accent/20">
                <Accordion type="single" collapsible className="w-full">
                  {pricingFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`pricing-${index}`} className="border-b border-accent/10 last:border-0">
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
            </div>
          )}

          {/* Trust Banner */}
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card via-secondary/20 to-card shadow-metal border-accent/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <div className="flex items-center gap-6">
                <Shield className="w-10 h-10 text-accent flex-shrink-0" />
                <Separator orientation="vertical" className="h-12 hidden md:block bg-accent/30" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Every journey includes full insurance, professional service, and absolute discretion.
              </p>
              <div className="flex items-center gap-6">
                <Separator orientation="vertical" className="h-12 hidden md:block bg-accent/30" />
                <Crown className="w-10 h-10 text-accent flex-shrink-0" />
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
