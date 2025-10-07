import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import QRCode from "qrcode";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  // Detect platform and browser
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(navigator.userAgent);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);
    };
    
    checkInstalled();

    // Generate QR code (only for desktop)
    if (canvasRef.current && !isMobile) {
      const appUrl = 'https://travelinsupremestyle.cortek.io/';
      QRCode.toCanvas(
        canvasRef.current,
        appUrl,
        {
          width: 144,
          margin: 1,
          color: {
            dark: '#E5C26E',
            light: '#0c0c0c'
          }
        },
        (error) => {
          if (error) console.error('QR code generation failed:', error);
        }
      );
    }

    // Capture Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome flow
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed');
      }
      
      setDeferredPrompt(null);
    } else {
      // Show instructions for platforms without prompt
      setShowInstructions(true);
    }
  };

  // Auto-show instructions for iOS
  useEffect(() => {
    if (isIOS && !isInstalled) {
      setShowInstructions(true);
    }
  }, [isIOS, isInstalled]);

  // If already installed, show success message
  if (isInstalled) {
    return (
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="pwa-card">
            <div className="flex-1 text-center">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground flex items-center justify-center gap-2">
                <span className="text-accent">✓</span> App Installed
              </h3>
              <p className="text-base text-muted-foreground">
                Supreme Drive is installed on your device. Find it on your home screen for quick access.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="pwa-card">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">
              Install Supreme Drive
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              {isMobile 
                ? "Add our app to your home screen for faster booking and instant access."
                : "Scan the QR code with your phone to install our app for faster booking."}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              {/* Show Install button only for Android or desktop with prompt */}
              {(deferredPrompt || (isAndroid && !isIOS)) && (
                <Button
                  onClick={handleInstallClick}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  size="lg"
                >
                  Install App
                </Button>
              )}
              
              {/* For iOS, only show "How it works" or auto-show instructions */}
              {!isIOS && (
                <Button
                  onClick={() => setShowInstructions(!showInstructions)}
                  variant="outline"
                  className="border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                  size="lg"
                >
                  How it works
                </Button>
              )}
            </div>

            {showInstructions && (
              <div className="mt-6 p-5 rounded-lg bg-muted/30 border border-accent/20 animate-fade-in">
                {isIOS ? (
                  // iOS-specific instructions (simplified, no Android clutter)
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="text-accent">📱</span> Install on iPhone
                    </h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Tap the <strong className="text-foreground">Share</strong> button (⤴︎) at the bottom of Safari</li>
                      <li>Scroll down and choose <strong className="text-foreground">Add to Home Screen</strong></li>
                      <li>Tap <strong className="text-foreground">Add</strong> in the top right</li>
                      <li>Find the Supreme Drive icon on your home screen</li>
                    </ol>
                  </div>
                ) : isMobile ? (
                  // Android-specific instructions
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="text-accent">🤖</span> Install on Android
                    </h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Tap <strong className="text-foreground">Install App</strong> button above or the menu ⋮</li>
                      <li>Select <strong className="text-foreground">Add to Home screen</strong> or <strong className="text-foreground">Install</strong></li>
                      <li>Confirm the installation</li>
                    </ol>
                  </div>
                ) : (
                  // Desktop instructions
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="text-accent">💻</span> Install on Desktop
                    </h4>
                    {isSafari ? (
                      <p className="text-sm text-muted-foreground">
                        Safari on Mac doesn't support PWA installation. Please use <strong className="text-foreground">Chrome</strong> or <strong className="text-foreground">Edge</strong>, or scan the QR code with your phone.
                      </p>
                    ) : isChrome ? (
                      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Click the <strong className="text-foreground">⋮</strong> menu (top right)</li>
                        <li>Select <strong className="text-foreground">Install Supreme Drive</strong></li>
                        <li>Click <strong className="text-foreground">Install</strong></li>
                      </ol>
                    ) : isEdge ? (
                      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Click the <strong className="text-foreground">⋯</strong> menu (top right)</li>
                        <li>Go to <strong className="text-foreground">Apps</strong> → <strong className="text-foreground">Install this site as an app</strong></li>
                        <li>Click <strong className="text-foreground">Install</strong></li>
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Look for an install option in your browser's menu, or scan the QR code with your phone for the best experience.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {!isMobile && (
            <div className="flex flex-col items-center gap-3 mt-6 sm:mt-0">
              <canvas
                ref={canvasRef}
                width={144}
                height={144}
                className="rounded-lg border border-accent/20"
                aria-label="QR code to open Supreme Drive"
              />
              <p className="text-xs text-muted-foreground text-center">
                Scan to open on your phone
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PWAInstall;
