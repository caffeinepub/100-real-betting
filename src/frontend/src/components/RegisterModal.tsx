import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../App";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (
    data: User & { password: string; referralCode?: string },
  ) => void;
  onSwitchToLogin: () => void;
  existingUsers: string[];
  initialReferralCode?: string;
}

export function RegisterModal({
  open,
  onClose,
  onRegister,
  onSwitchToLogin,
  existingUsers,
  initialReferralCode,
}: RegisterModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [referral, setReferral] = useState(initialReferralCode ?? "");
  const [loading, setLoading] = useState(false);

  function reset() {
    setName("");
    setPhone("");
    setUsername("");
    setPassword("");
    setConfirm("");
    setReferral(initialReferralCode ?? "");
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      onClose();
      reset();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!phone.match(/^03\d{2}[- ]?\d{7}$/)) {
      toast.error("Enter a valid Pakistani phone number (e.g. 03XX-XXXXXXX)");
      return;
    }
    if (!username.trim() || username.length < 4) {
      toast.error("Username must be at least 4 characters");
      return;
    }
    if (existingUsers.includes(username.trim())) {
      toast.error("Username already taken. Please choose another.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onRegister({
        name: name.trim(),
        phone: phone.trim(),
        username: username.trim(),
        password,
        referralCode: referral.trim() || undefined,
      });
      toast.success(`Welcome to 100%Real, ${name.trim()}! 🎉`);
      reset();
      setLoading(false);
    }, 400);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md w-full border border-border"
        style={{
          background: "oklch(0.15 0.09 285)",
          boxShadow: "0 0 60px oklch(0.88 0.18 195 / 0.3)",
        }}
        data-ocid="register.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-2xl text-center">
            Create Account
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Join 100%Real and start winning
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label
              htmlFor="reg-name"
              className="text-foreground font-semibold text-sm"
            >
              Full Name
            </Label>
            <Input
              id="reg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Muhammad Ali"
              data-ocid="register.name.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="reg-phone"
              className="text-foreground font-semibold text-sm"
            >
              Phone Number
            </Label>
            <Input
              id="reg-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX-XXXXXXX"
              data-ocid="register.phone.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="reg-username"
              className="text-foreground font-semibold text-sm"
            >
              Username
            </Label>
            <Input
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coolplayer123"
              data-ocid="register.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="reg-password"
              className="text-foreground font-semibold text-sm"
            >
              Password
            </Label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              data-ocid="register.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="reg-confirm"
              className="text-foreground font-semibold text-sm"
            >
              Confirm Password
            </Label>
            <Input
              id="reg-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              data-ocid="register.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="reg-referral"
              className="text-muted-foreground font-semibold text-sm"
            >
              Referral Code <span className="text-xs">(optional)</span>
              {initialReferralCode && (
                <span
                  className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: "oklch(0.80 0.18 130 / 0.2)",
                    color: "oklch(0.80 0.18 130)",
                  }}
                >
                  ✓ Auto-filled from referral link
                </span>
              )}
            </Label>
            <Input
              id="reg-referral"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="Enter referral code / username"
              data-ocid="register.referral.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-ocid="register.submit_button"
            className="w-full bg-cyan-accent hover:bg-cyan-accent/90 text-black font-black text-base h-11 mt-2"
          >
            {loading ? "Creating Account..." : "Register 🎰"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-pink hover:underline font-bold"
              data-ocid="register.login.link"
            >
              Login
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
