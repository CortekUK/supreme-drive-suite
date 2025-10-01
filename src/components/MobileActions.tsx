import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileActions = () => {
  return (
    <div className="lg:hidden fixed bottom-4 right-4 z-40">
      <a
        href="tel:08001234567"
        aria-label="Call us"
      >
        <Button size="lg" className="gradient-accent shadow-glow rounded-full w-14 h-14 p-0">
          <Phone className="w-6 h-6" />
        </Button>
      </a>
    </div>
  );
};

export default MobileActions;
