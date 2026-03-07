import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

const STORAGE_KEY = "tiss_promo_dismissed";

const PromoPopup = () => {
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Check if already dismissed this session
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (dismissed) return;

      const { data, error } = await supabase
        .from("promotions")
        .select("id, title, description, image_url")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setPromo(data);
        // Small delay so page loads first
        setTimeout(() => setVisible(true), 800);
      }
    };
    load();
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  if (!promo || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "hsla(0,0%,0%,0.75)" }}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-accent/30 bg-card animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-label={promo.title}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-background/80 hover:bg-background p-1.5 transition-colors"
          aria-label="Close promotion"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Flyer — PDF or image */}
        {promo.image_url.includes(".pdf") ? (
          <iframe
            src={`${promo.image_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={promo.title}
            className="w-full"
            style={{ height: "65vh", border: "none", pointerEvents: "none" }}
          />
        ) : (
          <img
            src={promo.image_url}
            alt={promo.title}
            className="w-full object-contain max-h-[70vh]"
          />
        )}

        {/* Footer strip */}
        <div className="px-6 py-4 bg-card border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">{promo.title}</p>
            {promo.description && (
              <p className="text-xs text-muted-foreground truncate">{promo.description}</p>
            )}
          </div>
          <Button
            size="sm"
            className="gradient-accent shadow-glow shrink-0"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
