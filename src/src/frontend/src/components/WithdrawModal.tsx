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
import type { TransactionRequest } from "../App";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  username?: string;
  onSubmitRequest?: (
    req: Omit<TransactionRequest, "id" | "status" | "submittedAt">,
  ) => void;
}

export function WithdrawModal({
  open,
  onClose,
  username,
  onSubmitRequest,
}: WithdrawModalProps) {
  const [method, setMethod] = useState("jazzcash");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const methodLabel = method === "jazzcash" ? "JazzCash" : "Easypaisa";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || Number.isNaN(num) || num < 500) {
      toast.error("Minimum withdrawal is PKR 500");
      return;
    }
    if (!account.match(/^03\d{9}$/)) {
      toast.error("Enter a valid Pakistani mobile number (03XXXXXXXXX)");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (onSubmitRequest && username) {
        onSubmitRequest({
          type: "withdrawal",
          username,
          amount: num,
          method: methodLabel,
          accountNumber: account,
        });
      }
      toast.success(
        "Your withdrawal request has been submitted. Admin will process shortly. 💸",
      );
      setAmount("");
      setAccount("");
      setLoading(false);
      onClose();
    }, 500);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-md w-full border border-border"
        style={{
          background: "oklch(0.15 0.09 285)",
          boxShadow: "0 0 60px oklch(0.82 0.2 155 / 0.3)",
        }}
        data-ocid="withdraw.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-2xl text-center">
            Withdraw Funds
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Minimum withdrawal: PKR 500
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">
              Payment Method
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {["jazzcash", "easypaisa"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  data-ocid={`withdraw.${m}.toggle`}
                  className={`p-3 rounded-lg border-2 text-sm font-bold capitalize transition-all ${
                    method === m
                      ? "border-green-neon text-green-neon glow-cyan"
                      : "border-border text-foreground hover:border-green-neon/50"
                  }`}
                >
                  {m === "jazzcash" ? "JazzCash" : "Easypaisa"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground font-semibold">
              Amount (PKR)
            </Label>
            <Input
              type="number"
              min={500}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min 500)"
              data-ocid="withdraw.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground font-semibold">
              {methodLabel} Number
            </Label>
            <Input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="03XXXXXXXXX"
              data-ocid="withdraw.account.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-ocid="withdraw.submit_button"
            className="w-full bg-green-neon hover:bg-green-neon/90 text-black font-black text-base h-11"
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
