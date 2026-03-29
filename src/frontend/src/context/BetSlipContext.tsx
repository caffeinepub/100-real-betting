import { type ReactNode, createContext, useContext, useState } from "react";

export interface BetSlipItem {
  eventId: bigint;
  eventTitle: string;
  selectionId: bigint;
  selectionName: string;
  odds: number;
}

interface BetSlipContextType {
  selection: BetSlipItem | null;
  setSelection: (item: BetSlipItem | null) => void;
  stake: string;
  setStake: (v: string) => void;
  clearSlip: () => void;
}

const BetSlipContext = createContext<BetSlipContextType | null>(null);

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BetSlipItem | null>(null);
  const [stake, setStake] = useState("");

  const clearSlip = () => {
    setSelection(null);
    setStake("");
  };

  return (
    <BetSlipContext.Provider
      value={{ selection, setSelection, stake, setStake, clearSlip }}
    >
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used within BetSlipProvider");
  return ctx;
}
