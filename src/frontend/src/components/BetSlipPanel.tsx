import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useBetSlip } from "../context/BetSlipContext";
import { usePlaceBet } from "../hooks/useQueries";

export default function BetSlipPanel() {
  const { selection, stake, setStake, clearSlip } = useBetSlip();
  const placeBet = usePlaceBet();

  const stakeNum = Number.parseFloat(stake) || 0;
  const potentialPayout = selection ? stakeNum * selection.odds : 0;

  const handlePlaceBet = async () => {
    if (!selection) return;
    if (stakeNum <= 0) {
      toast.error("Please enter a valid stake");
      return;
    }
    try {
      await placeBet.mutateAsync({
        eventId: selection.eventId,
        selectionId: selection.selectionId,
        stake: stakeNum,
      });
      toast.success("Bet placed successfully!");
      clearSlip();
    } catch {
      toast.error("Failed to place bet. Check your balance.");
    }
  };

  return (
    <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Bet Slip
        </h3>
        {selection && (
          <button
            type="button"
            data-ocid="betslip.close_button"
            onClick={clearSlip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!selection ? (
        <div data-ocid="betslip.empty_state" className="px-4 py-8 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm text-muted-foreground">
            Click an odds button to add a selection
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="text-xs text-muted-foreground truncate">
            {selection.eventTitle}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {selection.selectionName}
            </span>
            <span className="text-sm font-bold text-emerald-brand">
              {selection.odds.toFixed(2)}
            </span>
          </div>

          <Separator />

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Stake</Label>
            <Input
              data-ocid="betslip.input"
              type="number"
              min="1"
              placeholder="0.00"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Odds</span>
              <span className="font-medium text-foreground">
                {selection.odds.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Stake</span>
              <span className="font-medium text-foreground">
                {stakeNum.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Potential Payout</span>
              <span className="text-emerald-brand">
                {potentialPayout.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            data-ocid="betslip.submit_button"
            className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 font-semibold"
            onClick={handlePlaceBet}
            disabled={placeBet.isPending || stakeNum <= 0}
          >
            {placeBet.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Placing...
              </>
            ) : (
              "Place Bet"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
