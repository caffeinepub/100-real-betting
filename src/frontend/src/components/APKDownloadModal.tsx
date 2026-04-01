import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Download, Smartphone } from "lucide-react";
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
        "Open this site in Chrome on Android → tap ⋮ menu → 'Add to Home Screen'",
        { duration: 7000 },
      );
    }
  }

  function handleCopyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() =>
        toast.success("App link copied! Share it to install on any device 🎉"),
      )
      .catch(() => toast.error("Could not copy link"));
  }

  const steps = [
    {
      num: 1,
      icon: "🌐",
      text: "Open this site in Chrome browser on your Android phone",
    },
    { num: 2, icon: "⋮", text: "Tap the ⋮ menu (three dots) at top right" },
    { num: 3, icon: "📲", text: 'Tap "Add to Home Screen"' },
    {
      num: 4,
      icon: "🎉",
      text: '"Add" — app installs instantly on your home screen!',
    },
  ];

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
            Install 100%Real App
          </DialogTitle>
          <p
            className="text-center text-sm"
            style={{ color: "oklch(0.60 0.05 285)" }}
          >
            Works exactly like an APK — full screen, home screen icon, no
            browser bar
          </p>
        </DialogHeader>

        {/* Icon */}
        <div className="flex justify-center py-2">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.12 285), oklch(0.18 0.09 285))",
              border: "2px solid oklch(0.85 0.18 50 / 0.3)",
              boxShadow: "0 0 30px oklch(0.85 0.18 50 / 0.2)",
            }}
          >
            <Smartphone size={40} style={{ color: "oklch(0.85 0.18 50)" }} />
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
          Install on Android
        </Button>

        {/* Steps */}
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
            How to Install — Step by Step
          </p>
          {steps.map(({ num, icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
                style={{
                  background: "oklch(0.85 0.18 50 / 0.15)",
                  color: "oklch(0.85 0.18 50)",
                  border: "1px solid oklch(0.85 0.18 50 / 0.35)",
                }}
              >
                {num}
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.75 0.04 285)" }}
              >
                <span className="mr-1">{icon}</span>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Copy Link */}
        <Button
          type="button"
          onClick={handleCopyLink}
          variant="outline"
          className="w-full h-11 font-bold flex items-center gap-2"
          data-ocid="apk.copy.button"
          style={{
            borderColor: "oklch(0.75 0.2 195 / 0.4)",
            color: "oklch(0.75 0.2 195)",
            background: "oklch(0.75 0.2 195 / 0.06)",
          }}
        >
          <Copy size={16} />
          Copy App Link to Share
        </Button>

        {/* PWA note */}
        <div
          className="rounded-xl p-3 border text-center"
          style={{
            background: "oklch(0.10 0.06 285)",
            borderColor: "oklch(0.22 0.07 285)",
          }}
        >
          <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
            ✅ This is a{" "}
            <span
              className="font-bold"
              style={{ color: "oklch(0.70 0.06 285)" }}
            >
              PWA app
            </span>{" "}
            — installs directly from Chrome, no APK file needed
          </p>
        </div>

        {/* iOS */}
        <div
          className="rounded-xl p-3 border text-center"
          style={{
            background: "oklch(0.10 0.06 285)",
            borderColor: "oklch(0.22 0.07 285)",
          }}
        >
          <p
            className="text-xs font-semibold mb-1"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            🍎 iPhone / iPad
          </p>
          <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
            Open in Safari → tap the Share icon → "Add to Home Screen"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
