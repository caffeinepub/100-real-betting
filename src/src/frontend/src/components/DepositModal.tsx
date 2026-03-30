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

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  username?: string;
  onSubmitRequest?: (
    req: Omit<TransactionRequest, "id" | "status" | "submittedAt">,
  ) => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];
const METHODS = [
  { id: "jazzcash", label: "JazzCash", account: "03125030697" },
  { id: "easypaisa", label: "Easypaisa", account: "03125030697" },
  { id: "hbl", label: "HBL Bank", account: "Coming Soon", disabled: true },
];

export function DepositModal({
  open,
  onClose,
  username,
  onSubmitRequest,
}: DepositModalProps) {
  const [method, setMethod] = useState("jazzcash");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = METHODS.find((m) => m.id === method)!;

  function handleQuick(val: number) {
    setAmount(String(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || Number.isNaN(num) || num < 500) {
      toast.error("Minimum deposit is PKR 500");
      return;
    }
    if (!receipt) {
      toast.error("Please upload your payment receipt");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (onSubmitRequest && username) {
        onSubmitRequest({
          type: "deposit",
          username,
          amount: num,
          method: selected.label,
        });
      }
      toast.success(
        "Your deposit request has been submitted. Admin will confirm shortly. ✅",
      );
      setAmount("");
      setReceipt(null);
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
          boxShadow: "0 0 60px oklch(0.85 0.18 85 / 0.3)",
        }}
        data-ocid="deposit.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-2xl text-center">
            Deposit Funds
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            Minimum deposit: PKR 500
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">
              Payment Method
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={m.disabled}
                  onClick={() => !m.disabled && setMethod(m.id)}
                  data-ocid={`deposit.${m.id}.toggle`}
                  className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    m.disabled
                      ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
                      : method === m.id
                        ? "border-gold text-gold glow-gold"
                        : "border-border text-foreground hover:border-gold/50"
                  }`}
                  style={{
                    background:
                      method === m.id && !m.disabled
                        ? "oklch(0.2 0.1 285)"
                        : undefined,
                  }}
                >
                  {m.label}
                  {m.disabled && (
                    <span className="block text-[10px] text-muted-foreground">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg p-3 border border-gold/40"
            style={{ background: "oklch(0.18 0.1 285)" }}
          >
            <p className="text-xs text-muted-foreground">
              Send to {selected.label} account:
            </p>
            <p className="text-gold font-black font-display text-xl tracking-wider mt-1">
              {selected.account}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-semibold">
              Amount (PKR)
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuick(val)}
                  data-ocid="deposit.amount.toggle"
                  className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                    amount === String(val)
                      ? "bg-gold text-black border-gold"
                      : "border-border text-foreground hover:border-gold/60"
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}K` : val}
                </button>
              ))}
            </div>
            <Input
              type="number"
              min={500}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Or enter amount (min 500)"
              data-ocid="deposit.input"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground font-semibold">
              Upload Receipt
            </Label>
            <label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold/60 transition-colors"
              data-ocid="deposit.dropzone"
            >
              <span className="text-2xl">{receipt ? "✅" : "📎"}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {receipt ? receipt.name : "Click to upload receipt"}
              </span>
            </label>
            <input
              id="receipt-upload"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              data-ocid="deposit.upload_button"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-ocid="deposit.submit_button"
            className="w-full bg-gold hover:bg-gold/90 text-black font-black text-base h-11"
          >
            {loading ? "Submitting..." : "Submit Deposit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
