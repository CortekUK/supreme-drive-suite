import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Award, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

interface SecurityTeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  profile_image_url: string;
  specializations: string[] | null;
  certifications: string[] | null;
  experience_years: number | null;
  is_featured: boolean;
}

interface SecurityTeamCarouselProps {
  title: string;
  subtitle?: string;
}

export const SecurityTeamCarousel = ({ title, subtitle }: SecurityTeamCarouselProps) => {
  const [members, setMembers] = useState<SecurityTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("security_team")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true })
        .limit(6);

      if (error) {
        console.error("Security team fetch error:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} security team members:`, data);
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching security team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? members.length - 2 : prev - 2));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= members.length - 2 ? 0 : prev + 2));
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-80 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-muted/30 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-metal pb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base text-muted-foreground max-w-2xl mx-auto uppercase tracking-wider">
                {subtitle}
              </p>
            )}
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            {members.length > 2 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background hover:border-accent transition-all shadow-lg"
                  onClick={handlePrevious}
                  aria-label="Previous members"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background hover:border-accent transition-all shadow-lg"
                  onClick={handleNext}
                  aria-label="Next members"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Carousel */}
            <div className="overflow-hidden">
              <div
                className="grid md:grid-cols-2 gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / 2)}%)`,
                  width: `${(members.length / 2) * 100}%`,
                }}
              >
                {members.map((member, index) => (
                  <Card
                    key={member.id}
                    className="group w-full md:min-w-[400px] overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,215,0,0.25)] hover:shadow-glow  hover:border-accent/50 bg-card border-border/50 min-h-[480px] flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Profile Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={member.profile_image_url}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Featured Badge */}
                      {member.is_featured && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-accent/95 backdrop-blur-md text-accent-foreground border-accent-foreground/20 gap-1.5 shadow-[0_0_20px_rgba(255,215,0,0.3)] flex-shrink-0">
                            <Shield className="w-3 h-3 fill-current" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4 flex-1 flex flex-col">
                      {/* Name & Title */}
                      <h3 className="text-2xl font-display font-semibold group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {member.name}
                      </h3>

                      <p className="text-sm text-muted-foreground font-medium -mt-2">
                        {member.title}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                          {member.bio}
                        </p>
                      )}

                      {/* Specializations */}
                      {member.specializations && member.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {member.specializations.slice(0, 3).map((spec, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-accent/10 border-accent/30 text-accent"
                            >
                              {spec.replace(/_/g, " ")}
                            </Badge>
                          ))}
                          {member.specializations.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-muted border-muted-foreground/30"
                            >
                              +{member.specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Footer with Experience & Certifications */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
                        {member.experience_years && (
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>{member.experience_years} years</span>
                          </div>
                        )}
                        {member.certifications && member.certifications.length > 0 && (
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            <span>{member.certifications.length} certifications</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
