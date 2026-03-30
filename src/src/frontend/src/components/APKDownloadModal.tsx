import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface APKDownloadModalProps {
  open: boolean;
  onClose: () => void;
}

export function APKDownloadModal({ open, onClose }: APKDownloadModalProps) {
  const deferredPromptRef = useRef<(Event & { prompt: () => void }) | null>(
    null,
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as Event & { prompt: () => void };
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
    } else {
      toast.info(
        "Open this site in Chrome on Android → tap ⋮ menu → 'Add to Home Screen' to install the app",
        { duration: 7000 },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md w-full border border-border"
        style={{
          background: "oklch(0.13 0.09 285)",
          boxShadow: "0 0 80px oklch(0.85 0.18 50 / 0.3)",
        }}
        data-ocid="apk.modal"
      >
        <DialogHeader>
          <DialogTitle
            className="font-display text-2xl text-center"
            style={{ color: "oklch(0.85 0.18 50)" }}
          >
            Download 100%Real App
          </DialogTitle>
        </DialogHeader>

        {/* Android Icon */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.12 285), oklch(0.18 0.09 285))",
              border: "2px solid oklch(0.85 0.18 50 / 0.3)",
              boxShadow: "0 0 30px oklch(0.85 0.18 50 / 0.2)",
            }}
          >
            🤖
          </div>
          <div className="text-center">
            <p
              className="font-black text-lg"
              style={{ color: "oklch(0.90 0.03 285)" }}
            >
              Android App
            </p>
            <p className="text-sm" style={{ color: "oklch(0.60 0.05 285)" }}>
              Version 1.0 · Free Download
            </p>
          </div>
        </div>

        {/* Install Button */}
        <Button
          type="button"
          onClick={handleInstall}
          className="w-full h-14 text-lg font-black text-black flex items-center justify-center gap-3"
          data-ocid="apk.download.button"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.80 0.22 60))",
            boxShadow: "0 4px 20px oklch(0.85 0.18 50 / 0.4)",
          }}
        >
          <Download size={22} />
          Install App / Download APK
        </Button>

        {/* Instructions */}
        <div
          className="rounded-xl p-4 space-y-3 border"
          style={{
            background: "oklch(0.11 0.07 285)",
            borderColor: "oklch(0.25 0.08 285)",
          }}
          data-ocid="apk.instructions.panel"
        >
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.75 0.2 195)" }}
          >
            Installation Steps
          </p>
          {[
            { step: 1, text: 'Tap "Install App / Download APK" above' },
            { step: 2, text: "Open Chrome on Android and visit this site" },
            {
              step: 3,
              text: "Tap the ⋮ menu → 'Add to Home Screen' to install",
            },
            { step: 4, text: "App will appear on your home screen. Enjoy! 🎰" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                style={{
                  background: "oklch(0.75 0.2 195 / 0.2)",
                  color: "oklch(0.75 0.2 195)",
                  border: "1px solid oklch(0.75 0.2 195 / 0.4)",
                }}
              >
                {step}
              </span>
              <p className="text-sm" style={{ color: "oklch(0.72 0.04 285)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Manual APK section */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "oklch(0.10 0.06 285)",
            borderColor: "oklch(0.22 0.07 285)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "oklch(0.65 0.18 50)" }}
          >
            Manual APK Install
          </p>
          <p className="text-sm" style={{ color: "oklch(0.60 0.04 285)" }}>
            APK file coming soon. Use &apos;Add to Home Screen&apos; on Android
            Chrome for the best experience.
          </p>
        </div>

        {/* iOS note */}
        <p
          className="text-center text-sm"
          style={{ color: "oklch(0.55 0.05 285)" }}
        >
          🍎{" "}
          <span
            className="font-semibold"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            iOS version coming soon
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
