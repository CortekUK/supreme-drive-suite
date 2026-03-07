import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

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

  const isPdf = promo.image_url.includes(".pdf");

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "hsla(0,0%,0%,0.8)" }}
      onClick={handleClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-accent/30 animate-in fade-in zoom-in-95 duration-300"
        style={{ width: "min(700px, 95vw)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-black/60 hover:bg-black/90 p-2 transition-colors border border-white/20"
          aria-label="Close promotion"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Flyer */}
        {isPdf ? (
          <iframe
            src={`${promo.image_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={promo.title}
            className="w-full block"
            style={{ height: "90vh", border: "none" }}
          />
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: "92vh" }}>
            <img
              src={promo.image_url}
              alt={promo.title}
              className="w-full block"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoPopup;
