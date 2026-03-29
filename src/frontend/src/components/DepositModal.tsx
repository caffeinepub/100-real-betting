import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDepositCredits } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onClose: () => void;
}

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function DepositModal({ open, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const deposit = useDepositCredits();

  const handleDeposit = async () => {
    const num = Number.parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await deposit.mutateAsync(num);
      toast.success(`Successfully deposited ${num} credits!`);
      setAmount("");
      onClose();
    } catch {
      toast.error("Deposit failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="deposit.dialog" className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Deposit Credits</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <Button
                key={a}
                variant={amount === String(a) ? "default" : "outline"}
                size="sm"
                className={
                  amount === String(a)
                    ? "bg-emerald-brand hover:bg-emerald-light text-white border-0"
                    : ""
                }
                onClick={() => setAmount(String(a))}
              >
                {a}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deposit-amount">Amount</Label>
            <Input
              id="deposit-amount"
              data-ocid="deposit.input"
              type="number"
              min="1"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            data-ocid="deposit.cancel_button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="deposit.submit_button"
            className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
            onClick={handleDeposit}
            disabled={deposit.isPending}
          >
            {deposit.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Deposit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
