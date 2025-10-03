import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Star } from "lucide-react";
import { format } from "date-fns";

interface PortfolioCardProps {
  item: {
    slug: string;
    title: string;
    summary: string;
    cover_image_url: string;
    service_type: string;
    location: string;
    event_date: string;
    is_featured: boolean;
  };
}

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <Link to={`/portfolio/${item.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 bg-card border-border/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Featured Badge */}
          {item.is_featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground border-accent-foreground/20 gap-1">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Service Type Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant={item.service_type === "chauffeur" ? "default" : "secondary"}>
              {item.service_type === "chauffeur" ? "Chauffeur" : "Close Protection"}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.summary}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(item.event_date), "MMM yyyy")}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
