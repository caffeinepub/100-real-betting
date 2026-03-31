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

type RegisteredUser = {
  username: string;
  password: string;
  phone: string;
  name: string;
  referralCode?: string;
  balance: number;
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
  onSwitchToRegister: () => void;
  onResetPassword?: (username: string, newPassword: string) => boolean;
}

type Step = "login" | "forgot-verify" | "forgot-reset";

export function LoginModal({
  open,
  onClose,
  onLogin,
  onSwitchToRegister,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [fpUsername, setFpUsername] = useState("");
  const [fpPhone, setFpPhone] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpVerified, setFpVerified] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(username.trim(), password);
      if (ok) {
        toast.success(`Welcome back, ${username}! 🎰`);
        setUsername("");
        setPassword("");
      } else {
        toast.error("Invalid username or password. Please try again.");
      }
      setLoading(false);
    }, 300);
  }

  function handleVerifyIdentity(e: React.FormEvent) {
    e.preventDefault();
    if (!fpUsername.trim() || !fpPhone.trim()) {
      toast.error("Please enter both username and phone number.");
      return;
    }
    // Look up in localStorage
    try {
      const stored = localStorage.getItem("app_registered_users");
      const users: RegisteredUser[] = stored ? JSON.parse(stored) : [];
      const match = users.find(
        (u) =>
          u.username.toLowerCase() === fpUsername.trim().toLowerCase() &&
          u.phone === fpPhone.trim(),
      );
      if (match) {
        setFpVerified(true);
        setStep("forgot-reset");
      } else {
        toast.error("No account found with that username and phone number.");
      }
    } catch {
      toast.error("Could not verify identity. Please try again.");
    }
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (fpNewPassword.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    // Update password in localStorage directly
    try {
      const stored = localStorage.getItem("app_registered_users");
      const users: RegisteredUser[] = stored ? JSON.parse(stored) : [];
      const updated = users.map((u) =>
        u.username.toLowerCase() === fpUsername.trim().toLowerCase()
          ? { ...u, password: fpNewPassword }
          : u,
      );
      localStorage.setItem("app_registered_users", JSON.stringify(updated));
      toast.success("Password reset successfully! You can now log in.");
      resetForgot();
      setStep("login");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    }
  }

  function resetForgot() {
    setFpUsername("");
    setFpPhone("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpVerified(false);
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      onClose();
      setUsername("");
      setPassword("");
      resetForgot();
      setStep("login");
    }
  }

  const titles: Record<Step, string> = {
    login: "Login",
    "forgot-verify": "Forgot Password",
    "forgot-reset": "Reset Password",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md w-full border border-border"
        style={{
          background: "oklch(0.15 0.09 285)",
          boxShadow: "0 0 60px oklch(0.55 0.28 0 / 0.3)",
        }}
        data-ocid="login.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-2xl text-center">
            {titles[step]}
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            {step === "login" && "Welcome back to 100%Real"}
            {step === "forgot-verify" &&
              "Enter your username and registered phone number"}
            {step === "forgot-reset" &&
              "Choose a new password for your account"}
          </p>
        </DialogHeader>

        {/* LOGIN FORM */}
        {step === "login" && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="login-username"
                className="text-foreground font-semibold"
              >
                Username
              </Label>
              <Input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                data-ocid="login.input"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="login-password"
                className="text-foreground font-semibold"
              >
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                data-ocid="login.input"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep("forgot-verify")}
              className="text-cyan text-sm hover:underline w-full text-right"
            >
              Forgot Password?
            </button>

            <Button
              type="submit"
              disabled={loading}
              data-ocid="login.submit_button"
              className="w-full bg-pink-accent hover:bg-pink-accent/90 text-black font-black text-base h-11"
            >
              {loading ? "Logging in..." : "Login 🎰"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-cyan hover:underline font-bold"
                data-ocid="login.register.link"
              >
                Register Now
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD - VERIFY IDENTITY */}
        {step === "forgot-verify" && (
          <form onSubmit={handleVerifyIdentity} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-foreground font-semibold">Username</Label>
              <Input
                value={fpUsername}
                onChange={(e) => setFpUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground font-semibold">
                Registered Phone Number
              </Label>
              <Input
                value={fpPhone}
                onChange={(e) => setFpPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                type="tel"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-accent hover:bg-pink-accent/90 text-black font-black text-base h-11"
            >
              Verify Identity
            </Button>

            <button
              type="button"
              onClick={() => {
                resetForgot();
                setStep("login");
              }}
              className="text-cyan text-sm hover:underline w-full text-center"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD - SET NEW PASSWORD */}
        {step === "forgot-reset" && fpVerified && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
            <div className="rounded-lg px-4 py-3 text-sm text-green-400 bg-green-900/30 border border-green-700/40">
              ✅ Identity verified for <strong>{fpUsername}</strong>. Set your
              new password below.
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground font-semibold">
                New Password
              </Label>
              <Input
                type="password"
                value={fpNewPassword}
                onChange={(e) => setFpNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground font-semibold">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={fpConfirmPassword}
                onChange={(e) => setFpConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-accent hover:bg-pink-accent/90 text-black font-black text-base h-11"
            >
              Reset Password
            </Button>

            <button
              type="button"
              onClick={() => {
                resetForgot();
                setStep("login");
              }}
              className="text-cyan text-sm hover:underline w-full text-center"
            >
              Back to Login
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
