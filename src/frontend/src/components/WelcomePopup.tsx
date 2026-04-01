import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

export function WelcomePopup({ open, onClose }: WelcomePopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  function handleClose() {
    if (dontShowAgain) {
      localStorage.setItem("100real_welcome_dismissed", "1");
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent
        data-ocid="welcome.dialog"
        className="max-w-md border-0 p-0 overflow-hidden"
        style={{
          background: "oklch(0.15 0.09 285)",
          boxShadow:
            "0 0 60px oklch(0.82 0.22 75 / 0.3), 0 0 120px oklch(0.6 0.25 200 / 0.15)",
        }}
      >
        {/* Header Banner */}
        <div
          className="relative text-center py-6 px-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.82 0.22 75 / 0.25), oklch(0.6 0.25 200 / 0.2))",
            borderBottom: "1px solid oklch(0.82 0.22 75 / 0.3)",
          }}
        >
          <div className="text-5xl mb-2">🎰</div>
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ color: "oklch(0.82 0.22 75)" }}
          >
            Welcome to 100%Real!
          </h2>
          <p className="mt-1 text-sm" style={{ color: "oklch(0.75 0.05 285)" }}>
            Pakistan&apos;s #1 Real Money Casino Platform
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p
            className="text-center text-sm"
            style={{ color: "oklch(0.8 0.05 285)" }}
          >
            Enjoy{" "}
            <strong style={{ color: "oklch(0.82 0.22 75)" }}>
              12 top game providers
            </strong>{" "}
            — slots, crash games, live casino, sports betting, and more!
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💳", label: "Deposit via JazzCash & Easypaisa" },
              { icon: "🎁", label: "PKR 200 Referral Bonus" },
              { icon: "🏆", label: "VIP Rewards Program" },
              { icon: "📞", label: "24/7 Helpline Support" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-start gap-2 rounded-xl p-3 text-xs font-medium"
                style={{
                  background: "oklch(0.2 0.09 285)",
                  border: "1px solid oklch(0.82 0.22 75 / 0.2)",
                  color: "oklch(0.85 0.05 285)",
                }}
              >
                <span className="text-base shrink-0">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            data-ocid="welcome.primary_button"
            onClick={handleClose}
            className="w-full font-black text-base py-5 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.22 75), oklch(0.7 0.25 60))",
              color: "oklch(0.1 0.05 285)",
              boxShadow: "0 4px 20px oklch(0.82 0.22 75 / 0.4)",
            }}
          >
            🚀 Start Playing!
          </Button>

          {/* Don't show again */}
          <label
            className="flex items-center justify-center gap-2 cursor-pointer text-xs select-none"
            style={{ color: "oklch(0.55 0.05 285)" }}
          >
            <input
              data-ocid="welcome.checkbox"
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-yellow-400"
            />
            Don&apos;t show this again
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
