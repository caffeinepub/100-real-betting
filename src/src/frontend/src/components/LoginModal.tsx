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

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  open,
  onClose,
  onLogin,
  onSwitchToRegister,
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  function handleOpenChange(val: boolean) {
    if (!val) {
      onClose();
      setUsername("");
      setPassword("");
    }
  }

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
            Login
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Welcome back to 100%Real
          </p>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
