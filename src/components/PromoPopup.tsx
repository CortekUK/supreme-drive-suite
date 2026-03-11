import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ExternalLink } from "lucide-react";

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
  const [pdfError, setPdfError] = useState(false);

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
      style={{ backgroundColor: "rgba(0,0,0,0.8)", WebkitTapHighlightColor: "transparent" }}
      onClick={handleClose}
      onTouchEnd={(e) => {
        // Only close if tap was directly on the backdrop (not the inner card)
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-accent/30"
        style={{
          width: "min(700px, 95vw)",
          maxHeight: "92vh",
          animation: "fadeInScale 0.3s ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          onTouchEnd={(e) => { e.preventDefault(); handleClose(); }}
          className="absolute top-3 right-3 z-20 rounded-full bg-black/60 hover:bg-black/90 active:bg-black/90 p-2 transition-colors border border-white/20"
          aria-label="Close promotion"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Flyer */}
        {isPdf ? (
          pdfError ? (
            /* Fallback if Google Docs Viewer fails */
            <div className="flex flex-col items-center justify-center gap-4 p-10 bg-background text-center" style={{ minHeight: "40vh" }}>
              <div className="w-16 h-20 bg-destructive/10 border border-destructive/30 rounded flex items-center justify-center">
                <span className="text-destructive font-bold text-sm">PDF</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The PDF viewer couldn't load. For the best experience, ask your admin to re-upload this flyer as a JPG or PNG image.
              </p>
              <a
                href={promo.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Open PDF in New Tab
              </a>
            </div>
          ) : (
            <iframe
              src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(promo.image_url)}`}
              title={promo.title}
              className="w-full block"
              style={{ height: "90vh", border: "none" }}
              onError={() => setPdfError(true)}
            />
          )
        ) : (
          <div
            style={{
              maxHeight: "92vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <img
              src={promo.image_url}
              alt={promo.title}
              className="w-full block"
              draggable={false}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PromoPopup;
