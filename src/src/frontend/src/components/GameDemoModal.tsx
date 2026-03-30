import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

interface GameDemoModalProps {
  open: boolean;
  onClose: () => void;
  gameName: string;
  provider: string;
}

const SYMBOLS = [
  "\uD83C\uDF52",
  "\uD83C\uDF4B",
  "\uD83C\uDF47",
  "\uD83D\uDD14",
  "\u2B50",
  "\uD83D\uDCB0",
  "\uD83C\uDFB0",
  "7\uFE0F\u20E3",
];
const REEL_KEYS = ["reel-1", "reel-2", "reel-3"] as const;

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function GameDemoModal({
  open,
  onClose,
  gameName,
  provider,
}: GameDemoModalProps) {
  const [reels, setReels] = useState([
    "\uD83C\uDFB0",
    "\uD83C\uDFB0",
    "\uD83C\uDFB0",
  ]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(500);
  const [result, setResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      setReels(["\uD83C\uDFB0", "\uD83C\uDFB0", "\uD83C\uDFB0"]);
      setSpinning(false);
      setBalance(500);
      setResult(null);
      setSpinCount(0);
    }
  }, [open]);

  function spin() {
    if (spinning || balance < 50) return;
    setBalance((prev) => prev - 50);
    setResult(null);
    setSpinning(true);
    setSpinCount((c) => c + 1);

    intervalRef.current = setInterval(() => {
      setReels([randomSymbol(), randomSymbol(), randomSymbol()]);
    }, 80);

    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const final = [randomSymbol(), randomSymbol(), randomSymbol()];
      setReels(final);
      setSpinning(false);

      if (final[0] === final[1] && final[1] === final[2]) {
        setResult("jackpot");
        setBalance((prev) => prev + 500);
      } else if (
        final[0] === final[1] ||
        final[1] === final[2] ||
        final[0] === final[2]
      ) {
        setResult("win");
        setBalance((prev) => prev + 200);
      } else {
        setResult("lose");
      }
    }, 1500);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm w-full border border-border"
        style={{
          background: "oklch(0.13 0.09 285)",
          boxShadow: "0 0 80px oklch(0.55 0.28 330 / 0.4)",
        }}
        data-ocid="gamedemo.modal"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle
              className="font-display text-lg leading-tight"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              {gameName}
            </DialogTitle>
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: "oklch(0.55 0.22 195 / 0.2)",
                color: "oklch(0.75 0.2 195)",
                border: "1px solid oklch(0.75 0.2 195 / 0.4)",
              }}
            >
              DEMO MODE
            </span>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.60 0.05 285)" }}>
            {provider}
          </p>
        </DialogHeader>

        {/* Balance */}
        <div
          className="rounded-xl px-4 py-2 flex items-center justify-between"
          style={{
            background: "oklch(0.11 0.07 285)",
            border: "1px solid oklch(0.25 0.08 285)",
          }}
        >
          <span
            className="text-xs font-bold"
            style={{ color: "oklch(0.60 0.05 285)" }}
          >
            Balance
          </span>
          <span
            className="font-black text-lg"
            style={{ color: "oklch(0.85 0.18 50)" }}
          >
            PKR {balance.toLocaleString()}
          </span>
        </div>

        {/* Slot Machine */}
        <div
          className="rounded-2xl p-4 flex flex-col items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.16 0.1 290), oklch(0.12 0.08 280))",
            border: "2px solid oklch(0.85 0.18 50 / 0.3)",
            boxShadow: "inset 0 0 40px oklch(0.1 0.07 285 / 0.8)",
          }}
        >
          {/* Reels */}
          <div className="flex gap-3">
            {reels.map((symbol, idx) => (
              <div
                key={REEL_KEYS[idx]}
                className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                style={{
                  background: "oklch(0.1 0.07 285)",
                  border: "2px solid oklch(0.85 0.18 50 / 0.4)",
                  boxShadow: spinning
                    ? "0 0 20px oklch(0.85 0.18 50 / 0.5)"
                    : "none",
                  transition: "box-shadow 0.2s",
                  filter: spinning ? "blur(1px)" : "none",
                }}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Result message */}
          <div className="h-8 flex items-center justify-center">
            {result === "jackpot" && (
              <p
                className="font-black text-base animate-pulse"
                style={{ color: "oklch(0.85 0.18 50)" }}
              >
                \uD83C\uDF89 JACKPOT! You Win! +PKR 500
              </p>
            )}
            {result === "win" && (
              <p
                className="font-black text-base"
                style={{ color: "oklch(0.75 0.2 195)" }}
              >
                Nice! Small Win! +PKR 200
              </p>
            )}
            {result === "lose" && spinCount > 0 && (
              <p className="text-sm" style={{ color: "oklch(0.55 0.05 285)" }}>
                Try Again! -PKR 50
              </p>
            )}
          </div>

          {/* Spin Button */}
          <Button
            type="button"
            onClick={spin}
            disabled={spinning || balance < 50}
            className="w-full h-12 text-lg font-black transition-all"
            data-ocid="gamedemo.spin.button"
            style={{
              background:
                spinning || balance < 50
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.75 0.25 330), oklch(0.65 0.28 350))",
              boxShadow:
                spinning || balance < 50
                  ? "none"
                  : "0 4px 20px oklch(0.75 0.25 330 / 0.5)",
              color: spinning || balance < 50 ? "oklch(0.5 0.03 285)" : "white",
            }}
          >
            {spinning
              ? "Spinning..."
              : balance < 50
                ? "No Balance"
                : "\uD83C\uDFB0 SPIN \u2014 PKR 50"}
          </Button>

          <p
            className="text-[10px] text-center"
            style={{ color: "oklch(0.45 0.04 285)" }}
          >
            Demo credits only \u00b7 No real money involved
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs px-1">
          <span style={{ color: "oklch(0.55 0.05 285)" }}>
            Spins: {spinCount}
          </span>
          <span style={{ color: "oklch(0.55 0.05 285)" }}>
            Cost per spin: PKR 50
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
