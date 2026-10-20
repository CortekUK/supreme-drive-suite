import { useEffect } from "react";

declare global {
  interface Window {
    onmessage: ((event: MessageEvent) => void) | null;
  }
}

/**
 * MyLimoBiz online reservations widget.
 * Renders the required anchor, then injects the MyLimoBiz loader script which
 * replaces the anchor with a self-resizing booking iframe.
 *
 * The loader only scans the DOM once per script execution, so a cache-busted
 * copy is (re)injected on every mount — this makes the widget work correctly
 * when the user navigates between pages in the SPA.
 */
const MyLimoBizBooking = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://book.mylimobiz.com/v4/widgets/widget-loader.js?m=${Date.now()}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="w-full min-h-[640px] rounded-2xl overflow-hidden bg-card/40 border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <a
        href="https://book.mylimobiz.com/v4/travelinsupreme"
        data-ores-widget="website"
        data-ores-alias="travelinsupreme"
        className="flex items-center justify-center h-40 text-sm uppercase tracking-widest text-muted-foreground"
      >
        Online Reservations
      </a>
    </div>
  );
};

export default MyLimoBizBooking;
