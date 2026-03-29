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

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SignupModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.username || !form.password) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    toast.success("Account created! Please login to continue.");
    onClose();
    setForm({
      fullName: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="signup.dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Join <span className="text-emerald-brand">100%</span>Real —
            Pakistan's #1 Betting Platform
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="signup-fullname">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signup-fullname"
              data-ocid="signup.fullname.input"
              placeholder="Muhammad Ali Khan"
              value={form.fullName}
              onChange={set("fullName")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signup-phone"
              data-ocid="signup.phone.input"
              placeholder="03XX-XXXXXXX"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signup-username"
              data-ocid="signup.username.input"
              placeholder="Choose a username"
              value={form.username}
              onChange={set("username")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="signup-password"
                data-ocid="signup.password.input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-confirm">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="signup-confirm"
                data-ocid="signup.confirmpassword.input"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-referral">
              Referral Code{" "}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="signup-referral"
              data-ocid="signup.referral.input"
              placeholder="Enter referral code"
              value={form.referralCode}
              onChange={set("referralCode")}
            />
          </div>

          <Button
            type="submit"
            data-ocid="signup.submit_button"
            className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              data-ocid="signup.login.link"
              className="text-emerald-brand hover:underline font-medium"
              onClick={onClose}
            >
              Login
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
