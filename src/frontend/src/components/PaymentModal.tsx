import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, Smartphone, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDepositCredits } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultTab?: "deposit" | "withdraw";
}

type PaymentMethod = "jazzcash" | "easypaisa" | "bank";

const METHOD_ICONS = {
  jazzcash: <Smartphone className="h-4 w-4" />,
  easypaisa: <Smartphone className="h-4 w-4" />,
  bank: <Building2 className="h-4 w-4" />,
};

const METHOD_LABELS = {
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  bank: "Bank Transfer",
};

export default function PaymentModal({
  open,
  onClose,
  defaultTab = "deposit",
}: Props) {
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>("jazzcash");
  const [withdrawMethod, setWithdrawMethod] =
    useState<PaymentMethod>("jazzcash");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [iban, setIban] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const deposit = useDepositCredits();

  const handleDeposit = async () => {
    const num = Number.parseFloat(depositAmount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    try {
      await deposit.mutateAsync(num);
      toast.success(`Deposit of PKR ${num} confirmed! Credits added.`);
      setDepositAmount("");
      onClose();
    } catch {
      toast.error("Deposit failed. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    const num = Number.parseFloat(withdrawAmount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setIsWithdrawing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsWithdrawing(false);
    toast.success("Withdrawal request submitted! Processing in 24-48 hours.");
    setWithdrawAmount("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="payment.dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-brand" />
            Payments — <span className="text-emerald-brand">100%</span>Real
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger data-ocid="payment.deposit.tab" value="deposit">
              Deposit
            </TabsTrigger>
            <TabsTrigger data-ocid="payment.withdraw.tab" value="withdraw">
              Withdrawal
            </TabsTrigger>
          </TabsList>

          {/* DEPOSIT TAB */}
          <TabsContent value="deposit" className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Select Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["jazzcash", "easypaisa", "bank"] as PaymentMethod[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      data-ocid={`payment.deposit.${m}.button`}
                      onClick={() => setDepositMethod(m)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                        depositMethod === m
                          ? "border-emerald-brand bg-emerald-brand/5 text-emerald-brand"
                          : "border-border text-muted-foreground hover:border-emerald-brand/50"
                      }`}
                    >
                      {METHOD_ICONS[m]}
                      {METHOD_LABELS[m]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/60 text-sm space-y-1">
              {depositMethod === "jazzcash" && (
                <>
                  <p className="font-semibold text-foreground">
                    Send to JazzCash:
                  </p>
                  <p className="text-muted-foreground">
                    Number:{" "}
                    <span className="font-mono font-bold text-foreground">
                      0300-1234567
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Account Name:{" "}
                    <span className="font-bold text-foreground">
                      100Real Pvt Ltd
                    </span>
                  </p>
                </>
              )}
              {depositMethod === "easypaisa" && (
                <>
                  <p className="font-semibold text-foreground">
                    Send to Easypaisa:
                  </p>
                  <p className="text-muted-foreground">
                    Number:{" "}
                    <span className="font-mono font-bold text-foreground">
                      0333-9876543
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Account Name:{" "}
                    <span className="font-bold text-foreground">
                      BettingHub
                    </span>
                  </p>
                </>
              )}
              {depositMethod === "bank" && (
                <>
                  <p className="font-semibold text-foreground">
                    Bank Transfer Details:
                  </p>
                  <p className="text-muted-foreground">
                    Bank: <span className="font-bold text-foreground">HBL</span>
                  </p>
                  <p className="text-muted-foreground">
                    Account Title:{" "}
                    <span className="font-bold text-foreground">
                      100Real Pvt Ltd
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Account #:{" "}
                    <span className="font-mono font-bold text-foreground">
                      01234567890123
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    IBAN:{" "}
                    <span className="font-mono font-bold text-foreground">
                      PK36HABB0000001123456702
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deposit-amount">Amount (PKR)</Label>
              <Input
                id="deposit-amount"
                data-ocid="payment.deposit.amount.input"
                type="number"
                min="1"
                placeholder="Enter amount..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Upload Payment Receipt
              </Label>
              <label
                data-ocid="payment.deposit.upload_button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground cursor-pointer hover:border-emerald-brand hover:text-emerald-brand transition-colors"
              >
                <Upload className="h-4 w-4" />
                Click to upload receipt
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <Button
              data-ocid="payment.deposit.submit_button"
              className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 font-semibold"
              onClick={handleDeposit}
              disabled={deposit.isPending}
            >
              {deposit.isPending ? "Processing..." : "Confirm Deposit"}
            </Button>
          </TabsContent>

          {/* WITHDRAW TAB */}
          <TabsContent value="withdraw" className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Select Withdrawal Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["jazzcash", "easypaisa", "bank"] as PaymentMethod[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      data-ocid={`payment.withdraw.${m}.button`}
                      onClick={() => setWithdrawMethod(m)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                        withdrawMethod === m
                          ? "border-secondary bg-secondary/5 text-secondary"
                          : "border-border text-muted-foreground hover:border-secondary/50"
                      }`}
                    >
                      {METHOD_ICONS[m]}
                      {METHOD_LABELS[m]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="withdraw-amount">Amount (PKR)</Label>
              <Input
                id="withdraw-amount"
                data-ocid="payment.withdraw.amount.input"
                type="number"
                min="1"
                placeholder="Enter amount..."
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            {(withdrawMethod === "jazzcash" ||
              withdrawMethod === "easypaisa") && (
              <div className="space-y-1.5">
                <Label htmlFor="withdraw-mobile">
                  Your {METHOD_LABELS[withdrawMethod]} Number
                </Label>
                <Input
                  id="withdraw-mobile"
                  data-ocid="payment.withdraw.mobile.input"
                  placeholder="03XX-XXXXXXX"
                  value={mobileNum}
                  onChange={(e) => setMobileNum(e.target.value)}
                />
              </div>
            )}

            {withdrawMethod === "bank" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="withdraw-acctitle">Account Title</Label>
                  <Input
                    id="withdraw-acctitle"
                    data-ocid="payment.withdraw.acctitle.input"
                    placeholder="Your bank account title"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="withdraw-iban">IBAN</Label>
                  <Input
                    id="withdraw-iban"
                    data-ocid="payment.withdraw.iban.input"
                    placeholder="PKXXXXXXXXXXXXXXXXXXXX"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              data-ocid="payment.withdraw.submit_button"
              className="w-full bg-secondary hover:bg-secondary/90 text-white border-0 font-semibold"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
