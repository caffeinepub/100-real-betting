import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onLoginSuccess: (username: string) => void;
}

type View = "login" | "forgot";

export default function LoginModal({
  open,
  onClose,
  onOpenSignup,
  onLoginSuccess,
}: Props) {
  const { actor } = useActor();
  const [view, setView] = useState<View>("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [resetPhone, setResetPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleClose = () => {
    onClose();
    setView("login");
    setForm({ username: "", password: "" });
    setResetPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please enter your username and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = actor
        ? await actor.loginAccount(form.username, form.password)
        : "error:Service unavailable";
      if (result.startsWith("ok:")) {
        toast.success(`Welcome back, ${form.username}!`);
        onLoginSuccess(form.username);
        setForm({ username: "", password: "" });
        setView("login");
      } else {
        const msg = result.startsWith("error:") ? result.slice(6) : result;
        toast.error(msg);
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPhone.trim()) {
      toast.error("Please enter your registered phone number.");
      return;
    }
    const phoneRegex = /^03\d{2}-?\d{7}$/;
    if (!phoneRegex.test(resetPhone.trim())) {
      toast.error("Enter a valid Pakistani phone number (e.g. 03XX-XXXXXXX).");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    toast.success(
      "Reset request submitted. Our support team will contact you on your registered number within 24 hours.",
    );
    setView("login");
    setResetPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent data-ocid="login.dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {view === "login" ? (
              <>
                Login to <span className="text-emerald-brand">100%</span>Real
                &mdash; Pakistan's #1 Betting Platform
              </>
            ) : (
              <>Forgot Password</>
            )}
          </DialogTitle>
        </DialogHeader>

        {view === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="login-username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="login-username"
                data-ocid="login.username.input"
                placeholder="Enter your username"
                value={form.username}
                onChange={set("username")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  data-ocid="login.forgot_password.link"
                  className="text-xs text-emerald-brand hover:underline"
                  onClick={() => setView("forgot")}
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="login-password"
                data-ocid="login.password.input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
              />
            </div>

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                data-ocid="login.signup.link"
                className="text-emerald-brand hover:underline font-medium"
                onClick={() => {
                  handleClose();
                  onOpenSignup();
                }}
              >
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Enter your registered phone number. Our support team will contact
              you to reset your password.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="reset-phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reset-phone"
                data-ocid="forgot.phone.input"
                placeholder="03XX-XXXXXXX"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              data-ocid="forgot.submit_button"
              className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Reset Request"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                data-ocid="forgot.back_to_login.link"
                className="text-emerald-brand hover:underline font-medium"
                onClick={() => {
                  setView("login");
                  setResetPhone("");
                }}
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
