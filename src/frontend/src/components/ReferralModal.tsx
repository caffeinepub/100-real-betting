import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Gift, Share2, Users } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  referralCount: number;
  referredMembers?: Array<{
    username: string;
    name: string;
    joinedAt?: string;
  }>;
  unclaimedBonus?: number;
  onClaimBonus?: () => void;
}

export function ReferralModal({
  open,
  onClose,
  username,
  referralCount,
  referredMembers = [],
  unclaimedBonus = 0,
  onClaimBonus,
}: ReferralModalProps) {
  const referralLink = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(username)}`;

  function handleCopy() {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => toast.success("Referral link copied! 🎉"))
      .catch(() => toast.error("Could not copy link"));
  }

  function handleWhatsApp() {
    window.open(
      `https://wa.me/?text=Join+100%25Real+and+get+PKR+200+bonus!+%0A${encodeURIComponent(referralLink)}`,
      "_blank",
    );
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "100%Real — PKR 200 Bonus",
          text: "Join 100%Real and get PKR 200 welcome bonus!",
          url: referralLink,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => toast.success("Link copied! Share it anywhere 🎉"))
        .catch(() => toast.error("Could not copy link"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md w-full border border-border"
        style={{
          background: "oklch(0.15 0.09 285)",
          boxShadow: "0 0 60px oklch(0.80 0.18 130 / 0.25)",
        }}
        data-ocid="referral.modal"
      >
        <DialogHeader>
          <DialogTitle
            className="font-display text-2xl text-center flex items-center justify-center gap-2"
            style={{ color: "oklch(0.85 0.18 50)" }}
          >
            <Gift size={22} />
            Refer &amp; Earn
          </DialogTitle>
          <p
            className="text-center text-sm"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            Share your link and your friend gets a{" "}
            <span
              className="font-black"
              style={{ color: "oklch(0.80 0.18 130)" }}
            >
              PKR 200 welcome bonus
            </span>{" "}
            instantly when they join!
          </p>
        </DialogHeader>

        {/* Referral Count */}
        <div
          className="rounded-xl p-4 flex items-center gap-4 border"
          style={{
            background: "oklch(0.80 0.18 130 / 0.08)",
            borderColor: "oklch(0.80 0.18 130 / 0.25)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.80 0.18 130 / 0.2)" }}
          >
            <Users size={22} style={{ color: "oklch(0.80 0.18 130)" }} />
          </div>
          <div>
            <p
              className="text-3xl font-black"
              style={{ color: "oklch(0.80 0.18 130)" }}
              data-ocid="referral.count.panel"
            >
              {referralCount}
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.60 0.05 285)" }}
            >
              {referralCount === 1 ? "Friend Referred" : "Friends Referred"}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p
              className="text-xl font-black"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              PKR {(referralCount * 200).toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
              Bonus given to friends
            </p>
          </div>
        </div>

        {/* Claim Bonus Button */}
        {unclaimedBonus > 0 ? (
          <button
            type="button"
            onClick={onClaimBonus}
            data-ocid="referral.primary_button"
            className="w-full py-3 rounded-xl font-black text-black text-lg flex items-center justify-center gap-2 animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.18 130), oklch(0.72 0.22 145))",
              boxShadow: "0 4px 20px oklch(0.80 0.18 130 / 0.5)",
            }}
          >
            🎁 CLAIM PKR {unclaimedBonus.toLocaleString()} Bonus!
          </button>
        ) : (
          <button
            type="button"
            disabled
            data-ocid="referral.secondary_button"
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            style={{
              background: "oklch(0.22 0.06 285)",
              color: "oklch(0.55 0.05 285)",
              border: "1px solid oklch(0.28 0.06 285)",
            }}
          >
            🎁 No bonus to claim yet — refer friends to earn 10%!
          </button>
        )}

        {/* Referred Members List */}
        {referredMembers.length > 0 && (
          <div className="space-y-2">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "oklch(0.60 0.06 285)" }}
            >
              Your Referred Members ({referredMembers.length})
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {referredMembers.map((m, i) => (
                <div
                  key={m.username}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  data-ocid={`referral.item.${i + 1}`}
                  style={{
                    background: "oklch(0.80 0.18 130 / 0.08)",
                    border: "1px solid oklch(0.80 0.18 130 / 0.2)",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: "oklch(0.80 0.18 130 / 0.25)",
                      color: "oklch(0.80 0.18 130)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "oklch(0.88 0.04 285)" }}
                    >
                      {m.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.05 285)" }}
                    >
                      @{m.username}
                    </p>
                  </div>
                  <span
                    className="text-xs font-black"
                    style={{ color: "oklch(0.85 0.18 50)" }}
                  >
                    +PKR 200
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referral Link */}
        <div className="space-y-2">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.60 0.06 285)" }}
          >
            Your Referral Link
          </p>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border"
            style={{
              background: "oklch(0.11 0.07 285)",
              borderColor: "oklch(0.25 0.08 285)",
            }}
          >
            <span
              className="flex-1 text-sm font-mono truncate"
              style={{ color: "oklch(0.75 0.2 195)" }}
            >
              {referralLink}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              data-ocid="referral.copy.button"
              className="flex-shrink-0 h-8 px-3 font-black text-black text-xs flex items-center gap-1.5"
              style={{ background: "oklch(0.85 0.18 50)" }}
            >
              <Copy size={13} />
              Copy
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.60 0.06 285)" }}
          >
            Share &amp; Grow Your Team
          </p>
          <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
            Share your link on WhatsApp, Telegram, or any platform to grow your
            team
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleWhatsApp}
              data-ocid="referral.primary_button"
              className="flex-1 h-11 font-black text-white flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.35)",
              }}
            >
              <SiWhatsapp size={18} />
              WhatsApp
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              data-ocid="referral.secondary_button"
              className="flex-1 h-11 font-black flex items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.80 0.22 60))",
                color: "black",
                boxShadow: "0 4px 15px oklch(0.85 0.18 50 / 0.35)",
              }}
            >
              <Share2 size={18} />
              Share Link
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div
          className="rounded-xl p-4 space-y-2 border"
          style={{
            background: "oklch(0.75 0.25 335 / 0.06)",
            borderColor: "oklch(0.75 0.25 335 / 0.2)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.75 0.25 335)" }}
          >
            How it works
          </p>
          {[
            "Share your referral link with a friend",
            "Friend clicks the link and the sign-up form opens automatically with your code filled in",
            "New user gets PKR 200 bonus credited instantly!",
          ].map((step, i) => (
            <div key={step} className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                style={{
                  background: "oklch(0.75 0.25 335 / 0.25)",
                  color: "oklch(0.75 0.25 335)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: "oklch(0.72 0.04 285)" }}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
