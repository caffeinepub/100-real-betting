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
  gameCategory?: string;
}

const SYMBOLS = ["🍒", "🍋", "🍇", "🔔", "⭐", "💰", "🎰", "7️⃣"];
const REEL_KEYS = ["reel-1", "reel-2", "reel-3"] as const;

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// ---- Slot Game ----
function SlotGame() {
  const [reels, setReels] = useState(["🎰", "🎰", "🎰"]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(500);
  const [result, setResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.1 290), oklch(0.12 0.08 280))",
          border: "2px solid oklch(0.85 0.18 50 / 0.3)",
          boxShadow: "inset 0 0 40px oklch(0.1 0.07 285 / 0.8)",
        }}
      >
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
                filter: spinning ? "blur(1px)" : "none",
              }}
            >
              {symbol}
            </div>
          ))}
        </div>
        <div className="h-8 flex items-center justify-center">
          {result === "jackpot" && (
            <p
              className="font-black text-base animate-pulse"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              🎉 JACKPOT! +PKR 500
            </p>
          )}
          {result === "win" && (
            <p
              className="font-black text-base"
              style={{ color: "oklch(0.75 0.2 195)" }}
            >
              Nice Win! +PKR 200
            </p>
          )}
          {result === "lose" && spinCount > 0 && (
            <p className="text-sm" style={{ color: "oklch(0.55 0.05 285)" }}>
              Try Again! -PKR 50
            </p>
          )}
        </div>
        <Button
          type="button"
          onClick={spin}
          disabled={spinning || balance < 50}
          className="w-full h-12 text-lg font-black"
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
              : "🎰 SPIN — PKR 50"}
        </Button>
        <p
          className="text-[10px] text-center"
          style={{ color: "oklch(0.45 0.04 285)" }}
        >
          Demo credits only · No real money involved
        </p>
      </div>
      <div className="flex justify-between text-xs px-1">
        <span style={{ color: "oklch(0.55 0.05 285)" }}>
          Spins: {spinCount}
        </span>
        <span style={{ color: "oklch(0.55 0.05 285)" }}>
          Cost per spin: PKR 50
        </span>
      </div>
    </>
  );
}

// ---- Crash Game ----
function CrashGame() {
  const [balance, setBalance] = useState(500);
  const [multiplier, setMultiplier] = useState(1.0);
  const [phase, setPhase] = useState<
    "idle" | "running" | "cashedout" | "crashed"
  >("idle");
  const [crashAt, setCrashAt] = useState(2.0);
  const [result, setResult] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startRound() {
    if (balance < 100) return;
    setBalance((p) => p - 100);
    const target = 1.2 + Math.random() * 8.8;
    setCrashAt(target);
    setMultiplier(1.0);
    setResult(null);
    setPhase("running");
  }

  useEffect(() => {
    if (phase !== "running") return;
    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = prev + 0.05 + prev * 0.01;
        if (next >= crashAt) {
          clearInterval(intervalRef.current!);
          setPhase("crashed");
          setResult(`Crashed at ${next.toFixed(2)}x! -PKR 100`);
          return next;
        }
        return next;
      });
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, crashAt]);

  function cashOut() {
    if (phase !== "running") return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const won = Math.floor(100 * multiplier);
    setBalance((p) => p + won);
    setResult(`Cashed out at ${multiplier.toFixed(2)}x! +PKR ${won}`);
    setPhase("cashedout");
  }

  const color =
    phase === "crashed"
      ? "oklch(0.65 0.25 20)"
      : phase === "cashedout"
        ? "oklch(0.75 0.2 195)"
        : multiplier < 2
          ? "oklch(0.85 0.18 50)"
          : multiplier < 5
            ? "oklch(0.7 0.2 130)"
            : "oklch(0.65 0.25 20)";

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.1 260), oklch(0.1 0.08 280))",
          border: "2px solid oklch(0.85 0.18 50 / 0.3)",
        }}
      >
        <div
          className="text-7xl font-black tabular-nums"
          style={{ color, textShadow: `0 0 40px ${color}` }}
        >
          {phase === "crashed" ? "CRASHED" : `${multiplier.toFixed(2)}x`}
        </div>
        {result && (
          <p
            className="font-bold text-sm text-center"
            style={{
              color:
                phase === "cashedout"
                  ? "oklch(0.75 0.2 195)"
                  : "oklch(0.65 0.25 20)",
            }}
          >
            {result}
          </p>
        )}
        {phase === "idle" || phase === "crashed" || phase === "cashedout" ? (
          <Button
            type="button"
            onClick={startRound}
            disabled={balance < 100}
            className="w-full h-11 font-black"
            data-ocid="gamedemo.crash.button"
            style={{
              background:
                balance < 100
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.65 0.28 350), oklch(0.55 0.25 20))",
              color: "white",
            }}
          >
            {balance < 100 ? "No Balance" : "✈️ Place Bet & Start — PKR 100"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={cashOut}
            className="w-full h-11 font-black animate-pulse"
            data-ocid="gamedemo.cashout.button"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.2 130), oklch(0.65 0.22 150))",
              color: "black",
            }}
          >
            💰 Cash Out @ {multiplier.toFixed(2)}x
          </Button>
        )}
        <p className="text-[10px]" style={{ color: "oklch(0.45 0.04 285)" }}>
          Bet: PKR 100 · Demo only
        </p>
      </div>
    </>
  );
}

// ---- Card Game (Teen Patti style) ----
const SUITS = ["♠", "♥", "♦", "♣"];
const FACES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const FACE_VALUES: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 };
function cardValue(face: string) {
  return FACE_VALUES[face] ?? Number.parseInt(face);
}
function randomCard() {
  return {
    face: FACES[Math.floor(Math.random() * 13)],
    suit: SUITS[Math.floor(Math.random() * 4)],
  };
}
function handTotal(cards: { face: string; suit: string }[]) {
  return cards.reduce((s, c) => s + cardValue(c.face), 0);
}

function CardGame() {
  const [balance, setBalance] = useState(500);
  const [playerCards, setPlayerCards] = useState<
    { face: string; suit: string }[]
  >([]);
  const [dealerCards, setDealerCards] = useState<
    { face: string; suit: string }[]
  >([]);
  const [phase, setPhase] = useState<"idle" | "dealt">("idle");
  const [result, setResult] = useState<string | null>(null);

  function deal() {
    if (balance < 100) return;
    setBalance((p) => p - 100);
    const pCards = [randomCard(), randomCard(), randomCard()];
    const dCards = [randomCard(), randomCard(), randomCard()];
    setPlayerCards(pCards);
    setDealerCards(dCards);
    setPhase("dealt");
    const pt = handTotal(pCards);
    const dt = handTotal(dCards);
    if (pt > dt) {
      setResult("You win! +PKR 200");
      setBalance((p) => p + 200);
    } else if (pt < dt) {
      setResult("Dealer wins! -PKR 100");
    } else {
      setResult("Tie! No change.");
      setBalance((p) => p + 100);
    }
  }

  const redSuits = new Set(["♥", "♦"]);

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.1 260), oklch(0.1 0.08 280))",
          border: "2px solid oklch(0.85 0.18 50 / 0.3)",
        }}
      >
        {phase === "dealt" && (
          <>
            <div>
              <p
                className="text-xs font-bold mb-2"
                style={{ color: "oklch(0.75 0.2 195)" }}
              >
                Your Hand (Total: {handTotal(playerCards)})
              </p>
              <div className="flex gap-2">
                {playerCards.map((c, i) => (
                  <div
                    key={`p-${i}-${c.face}${c.suit}`}
                    className="w-14 h-20 rounded-lg flex flex-col items-center justify-center font-black text-lg"
                    style={{
                      background: "white",
                      color: redSuits.has(c.suit)
                        ? "oklch(0.55 0.25 20)"
                        : "oklch(0.15 0.05 285)",
                    }}
                  >
                    <span>{c.face}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p
                className="text-xs font-bold mb-2"
                style={{ color: "oklch(0.65 0.25 20)" }}
              >
                Dealer Hand (Total: {handTotal(dealerCards)})
              </p>
              <div className="flex gap-2">
                {dealerCards.map((c, i) => (
                  <div
                    key={`d-${i}-${c.face}${c.suit}`}
                    className="w-14 h-20 rounded-lg flex flex-col items-center justify-center font-black text-lg"
                    style={{
                      background: "white",
                      color: redSuits.has(c.suit)
                        ? "oklch(0.55 0.25 20)"
                        : "oklch(0.15 0.05 285)",
                    }}
                  >
                    <span>{c.face}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
            {result && (
              <p
                className="font-black text-center"
                style={{
                  color: result.includes("win")
                    ? "oklch(0.75 0.2 130)"
                    : result.includes("Tie")
                      ? "oklch(0.85 0.18 50)"
                      : "oklch(0.65 0.25 20)",
                }}
              >
                {result}
              </p>
            )}
          </>
        )}
        {phase === "idle" && (
          <p className="text-center text-muted-foreground text-sm py-4">
            Deal 3 cards each to compare hands
          </p>
        )}
        <Button
          type="button"
          onClick={deal}
          disabled={balance < 100}
          className="w-full h-11 font-black"
          data-ocid="gamedemo.deal.button"
          style={{
            background:
              balance < 100
                ? "oklch(0.35 0.05 285)"
                : "linear-gradient(135deg, oklch(0.7 0.2 130), oklch(0.6 0.22 150))",
            color: balance < 100 ? "oklch(0.5 0.03 285)" : "black",
          }}
        >
          {balance < 100 ? "No Balance" : "🃏 Deal Cards — PKR 100"}
        </Button>
        <p
          className="text-[10px] text-center"
          style={{ color: "oklch(0.45 0.04 285)" }}
        >
          Demo credits only · No real money
        </p>
      </div>
    </>
  );
}

// ---- Fishing Game ----
const FISH_LIST = [
  { emoji: "🐟", value: 10 },
  { emoji: "🐠", value: 20 },
  { emoji: "🐡", value: 50 },
  { emoji: "🦈", value: 100 },
  { emoji: "🦑", value: 200 },
  { emoji: "🐙", value: 500 },
];

function FishingGame() {
  const [balance, setBalance] = useState(500);
  const [caught, setCaught] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [reveals, setReveals] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [lastResult, setLastResult] = useState<string | null>(null);

  function shoot(idx: number) {
    if (caught[idx] || balance < 20) return;
    setBalance((p) => p - 20);
    const val = FISH_LIST[idx].value;
    const gained = val > 20 ? val : 0;
    setBalance((p) => p + gained);
    setLastResult(
      val > 20 ? `+PKR ${val}! Great catch!` : "-PKR 20. Small fish!",
    );
    const newCaught = [...caught];
    newCaught[idx] = true;
    setCaught(newCaught);
    const newReveals = [...reveals];
    newReveals[idx] = val;
    setReveals(newReveals);
    if (newCaught.every(Boolean)) {
      setTimeout(() => {
        setCaught([false, false, false, false, false, false]);
        setReveals([null, null, null, null, null, null]);
      }, 1500);
    }
  }

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.12 220), oklch(0.1 0.1 240))",
          border: "2px solid oklch(0.55 0.2 220 / 0.5)",
        }}
      >
        <p
          className="text-xs text-center"
          style={{ color: "oklch(0.65 0.15 220)" }}
        >
          Click a fish to shoot! Cost: PKR 20 per shot
        </p>
        <div className="grid grid-cols-3 gap-3">
          {FISH_LIST.map((fish, idx) => (
            <button
              key={fish.emoji}
              type="button"
              onClick={() => shoot(idx)}
              disabled={caught[idx] || balance < 20}
              className="h-20 rounded-xl flex flex-col items-center justify-center text-3xl transition-all"
              style={{
                background: caught[idx]
                  ? "oklch(0.15 0.05 285)"
                  : "oklch(0.2 0.12 220)",
                border: `2px solid ${caught[idx] ? "oklch(0.25 0.05 285)" : "oklch(0.55 0.2 220 / 0.6)"}`,
                opacity: caught[idx] ? 0.4 : 1,
                cursor: caught[idx] ? "not-allowed" : "pointer",
              }}
              data-ocid={`gamedemo.fish.button.${idx + 1}`}
            >
              {caught[idx] ? (
                <>
                  <span
                    className="text-sm font-black"
                    style={{ color: "oklch(0.85 0.18 50)" }}
                  >
                    {reveals[idx] !== null ? `PKR ${reveals[idx]}` : ""}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.05 285)" }}
                  >
                    Caught!
                  </span>
                </>
              ) : (
                <>
                  {fish.emoji}
                  <span
                    className="text-[10px] mt-1"
                    style={{ color: "oklch(0.65 0.12 220)" }}
                  >
                    Shoot!
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
        {lastResult && (
          <p
            className="text-center font-bold text-sm"
            style={{
              color: lastResult.startsWith("+")
                ? "oklch(0.75 0.2 130)"
                : "oklch(0.65 0.2 50)",
            }}
          >
            {lastResult}
          </p>
        )}
        <p
          className="text-[10px] text-center"
          style={{ color: "oklch(0.45 0.04 285)" }}
        >
          Demo credits only · No real money
        </p>
      </div>
    </>
  );
}

// ---- Sports Betting ----
const MATCHES = [
  { team1: "Pakistan", team2: "India", odds1: 2.1, odds2: 1.8 },
  { team1: "Lahore Qalandars", team2: "Karachi Kings", odds1: 1.9, odds2: 2.0 },
  { team1: "Manchester United", team2: "Arsenal", odds1: 2.3, odds2: 1.7 },
];

function SportsGame() {
  const [balance, setBalance] = useState(500);
  const [matchIdx] = useState(() => Math.floor(Math.random() * MATCHES.length));
  const match = MATCHES[matchIdx];
  const [pick, setPick] = useState<1 | 2 | null>(null);
  const [phase, setPhase] = useState<"idle" | "waiting" | "done">("idle");
  const [result, setResult] = useState<string | null>(null);

  function placeBet() {
    if (!pick || balance < 100 || phase !== "idle") return;
    setBalance((p) => p - 100);
    setPhase("waiting");
    setTimeout(() => {
      const odds = pick === 1 ? match.odds1 : match.odds2;
      const win = Math.random() < (1 / odds) * 0.85;
      if (win) {
        const gained = Math.floor(100 * odds);
        setBalance((p) => p + gained);
        setResult(
          `${pick === 1 ? match.team1 : match.team2} Won! +PKR ${gained}`,
        );
      } else {
        setResult(`${pick === 1 ? match.team2 : match.team1} Won! -PKR 100`);
      }
      setPhase("done");
    }, 2000);
  }

  function reset() {
    setPick(null);
    setPhase("idle");
    setResult(null);
  }

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.1 140), oklch(0.1 0.08 160))",
          border: "2px solid oklch(0.55 0.2 140 / 0.4)",
        }}
      >
        <p
          className="text-center font-bold text-sm"
          style={{ color: "oklch(0.85 0.18 50)" }}
        >
          ⚽ {match.team1} vs {match.team2}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((t) => {
            const team = t === 1 ? match.team1 : match.team2;
            const odds = t === 1 ? match.odds1 : match.odds2;
            const isSelected = pick === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => phase === "idle" && setPick(t as 1 | 2)}
                className="p-3 rounded-xl font-bold text-sm transition-all"
                data-ocid={`gamedemo.team.button.${t}`}
                style={{
                  background: isSelected
                    ? "oklch(0.55 0.2 140)"
                    : "oklch(0.18 0.08 140)",
                  border: `2px solid ${isSelected ? "oklch(0.65 0.22 140)" : "oklch(0.28 0.1 140 / 0.5)"}`,
                  color: isSelected ? "black" : "oklch(0.75 0.1 140)",
                }}
              >
                {team}
                <br />
                <span className="text-xs">{odds}x</span>
              </button>
            );
          })}
        </div>
        {phase === "waiting" && (
          <p
            className="text-center text-sm animate-pulse"
            style={{ color: "oklch(0.85 0.18 50)" }}
          >
            ⏳ Match in progress...
          </p>
        )}
        {result && (
          <p
            className="text-center font-black"
            style={{
              color: result.includes("+")
                ? "oklch(0.75 0.2 130)"
                : "oklch(0.65 0.25 20)",
            }}
          >
            {result}
          </p>
        )}
        {phase === "idle" && (
          <Button
            type="button"
            onClick={placeBet}
            disabled={!pick || balance < 100}
            className="w-full h-11 font-black"
            data-ocid="gamedemo.bet.button"
            style={{
              background:
                !pick || balance < 100
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.55 0.22 140), oklch(0.45 0.2 160))",
              color: !pick || balance < 100 ? "oklch(0.5 0.03 285)" : "white",
            }}
          >
            {!pick
              ? "Pick a team first"
              : balance < 100
                ? "No Balance"
                : "Place Bet — PKR 100"}
          </Button>
        )}
        {phase === "done" && (
          <Button
            type="button"
            onClick={reset}
            className="w-full h-11 font-black"
            data-ocid="gamedemo.newmatch.button"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.18 285), oklch(0.45 0.15 285))",
              color: "white",
            }}
          >
            New Match
          </Button>
        )}
        <p
          className="text-[10px] text-center"
          style={{ color: "oklch(0.45 0.04 285)" }}
        >
          Demo only · No real money
        </p>
      </div>
    </>
  );
}

// ---- Roulette (Live) ----
const RED_NUMS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

function RouletteGame() {
  const [balance, setBalance] = useState(500);
  const [pick, setPick] = useState<{
    type: "number" | "color";
    value: number | string;
  } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [landedOn, setLandedOn] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function spin() {
    if (!pick || balance < 50 || spinning) return;
    setBalance((p) => p - 50);
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const num = Math.floor(Math.random() * 37);
      setLandedOn(num);
      setSpinning(false);
      if (pick.type === "number" && pick.value === num) {
        setBalance((p) => p + 1800);
        setResult(`🎯 Hit ${num}! +PKR 1800`);
      } else if (pick.type === "color") {
        const color = num === 0 ? "Green" : RED_NUMS.has(num) ? "Red" : "Black";
        if (pick.value === color) {
          setBalance((p) => p + 200);
          setResult(`✅ ${color}! +PKR 200`);
        } else {
          setResult(`❌ Landed ${num} (${color}) -PKR 50`);
        }
      } else {
        setResult(`Landed on ${num} -PKR 50`);
      }
    }, 1800);
  }

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.1 20), oklch(0.1 0.08 350))",
          border: "2px solid oklch(0.55 0.2 20 / 0.4)",
        }}
      >
        <div className="flex gap-2 justify-center">
          {["Red", "Black", "Green"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPick({ type: "color", value: c })}
              data-ocid={"gamedemo.color.button"}
              className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                background:
                  c === "Red"
                    ? "oklch(0.5 0.25 20)"
                    : c === "Black"
                      ? "oklch(0.2 0.03 285)"
                      : "oklch(0.4 0.2 145)",
                border: `2px solid ${pick?.value === c ? "white" : "transparent"}`,
                color: "white",
                transform: pick?.value === c ? "scale(1.05)" : "scale(1)",
              }}
            >
              {c} +{c === "Green" ? "x18" : "x2"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-9 gap-1">
          {Array.from({ length: 37 }, (_, i) => i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPick({ type: "number", value: n })}
              data-ocid="gamedemo.number.button"
              className="h-7 rounded text-[10px] font-black transition-all"
              style={{
                background:
                  n === 0
                    ? "oklch(0.4 0.2 145)"
                    : RED_NUMS.has(n)
                      ? "oklch(0.45 0.22 20)"
                      : "oklch(0.2 0.03 285)",
                border: `1px solid ${pick?.value === n ? "white" : "transparent"}`,
                color: "white",
                transform: pick?.value === n ? "scale(1.1)" : "scale(1)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
        {spinning && <p className="text-center animate-spin text-2xl">🎡</p>}
        {landedOn !== null && !spinning && (
          <p
            className="text-center font-bold text-sm"
            style={{ color: "oklch(0.85 0.18 50)" }}
          >
            Ball: {landedOn}
          </p>
        )}
        {result && (
          <p
            className="text-center font-black text-sm"
            style={{
              color: result.includes("+")
                ? "oklch(0.75 0.2 130)"
                : "oklch(0.65 0.25 20)",
            }}
          >
            {result}
          </p>
        )}
        <Button
          type="button"
          onClick={spin}
          disabled={!pick || balance < 50 || spinning}
          className="w-full h-11 font-black"
          data-ocid="gamedemo.spin.button"
          style={{
            background:
              !pick || balance < 50 || spinning
                ? "oklch(0.35 0.05 285)"
                : "linear-gradient(135deg, oklch(0.55 0.22 20), oklch(0.45 0.25 350))",
            color:
              !pick || balance < 50 || spinning
                ? "oklch(0.5 0.03 285)"
                : "white",
          }}
        >
          {spinning
            ? "Spinning..."
            : !pick
              ? "Pick a number or color"
              : balance < 50
                ? "No Balance"
                : "🎡 Spin — PKR 50"}
        </Button>
      </div>
    </>
  );
}

// ---- Lottery / Keno ----
function LotteryGame() {
  const [balance, setBalance] = useState(500);
  const [selected, setSelected] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [phase, setPhase] = useState<"pick" | "done">("pick");
  const [result, setResult] = useState<string | null>(null);

  function toggleNum(n: number) {
    if (phase !== "pick") return;
    setSelected((prev) =>
      prev.includes(n)
        ? prev.filter((x) => x !== n)
        : prev.length < 3
          ? [...prev, n]
          : prev,
    );
  }

  function draw() {
    if (selected.length < 3 || balance < 50) return;
    setBalance((p) => p - 50);
    const pool = Array.from({ length: 20 }, (_, i) => i + 1).filter(
      (n) => !selected.includes(n),
    );
    // pick 2 random non-selected + sometimes 1-3 selected
    const drawNums: number[] = [];
    const shuffled = [...selected, ...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5 && drawNums.length < 5; i++) {
      if (!drawNums.includes(shuffled[i])) drawNums.push(shuffled[i]);
    }
    while (drawNums.length < 5) {
      const x = pool[Math.floor(Math.random() * pool.length)];
      if (!drawNums.includes(x)) drawNums.push(x);
    }
    setDrawn(drawNums);
    const matches = selected.filter((n) => drawNums.includes(n)).length;
    if (matches === 3) {
      setBalance((p) => p + 500);
      setResult("🏆 3 Matches! +PKR 500");
    } else if (matches === 2) {
      setBalance((p) => p + 100);
      setResult("🎉 2 Matches! +PKR 100");
    } else if (matches === 1) {
      setBalance((p) => p + 20);
      setResult("✨ 1 Match! +PKR 20");
    } else {
      setResult("-PKR 50. No matches!");
    }
    setPhase("done");
  }

  function reset() {
    setSelected([]);
    setDrawn([]);
    setPhase("pick");
    setResult(null);
  }

  return (
    <>
      <BalanceDisplay balance={balance} />
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.12 270), oklch(0.1 0.08 290))",
          border: "2px solid oklch(0.55 0.2 270 / 0.4)",
        }}
      >
        <p
          className="text-xs text-center"
          style={{ color: "oklch(0.65 0.15 270)" }}
        >
          Pick 3 numbers (1-20) · Cost: PKR 50
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
            const isSelected = selected.includes(n);
            const isDrawn = drawn.includes(n);
            const isMatch = isSelected && isDrawn;
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleNum(n)}
                data-ocid="gamedemo.lottery.button"
                className="h-9 rounded-lg font-black text-sm transition-all"
                style={{
                  background: isMatch
                    ? "oklch(0.55 0.25 130)"
                    : isDrawn
                      ? "oklch(0.5 0.2 50)"
                      : isSelected
                        ? "oklch(0.55 0.2 270)"
                        : "oklch(0.2 0.08 270)",
                  border: `1px solid ${isSelected ? "oklch(0.7 0.2 270)" : "transparent"}`,
                  color: "white",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
        {drawn.length > 0 && (
          <p
            className="text-xs text-center"
            style={{ color: "oklch(0.75 0.15 50)" }}
          >
            Drawn: {drawn.join(", ")}
          </p>
        )}
        {result && (
          <p
            className="text-center font-black text-sm"
            style={{
              color: result.includes("+")
                ? "oklch(0.75 0.2 130)"
                : "oklch(0.65 0.25 20)",
            }}
          >
            {result}
          </p>
        )}
        {phase === "pick" ? (
          <Button
            type="button"
            onClick={draw}
            disabled={selected.length < 3 || balance < 50}
            className="w-full h-11 font-black"
            data-ocid="gamedemo.draw.button"
            style={{
              background:
                selected.length < 3 || balance < 50
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.55 0.22 270), oklch(0.45 0.2 290))",
              color:
                selected.length < 3 || balance < 50
                  ? "oklch(0.5 0.03 285)"
                  : "white",
            }}
          >
            {selected.length < 3
              ? `Pick ${3 - selected.length} more`
              : balance < 50
                ? "No Balance"
                : "🎱 Draw! — PKR 50"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={reset}
            className="w-full h-11 font-black"
            data-ocid="gamedemo.newround.button"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.18 285), oklch(0.45 0.15 285))",
              color: "white",
            }}
          >
            Play Again
          </Button>
        )}
      </div>
    </>
  );
}

// ---- Shared Balance Display ----
function BalanceDisplay({ balance }: { balance: number }) {
  return (
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
        Demo Balance
      </span>
      <span
        className="font-black text-lg"
        style={{ color: "oklch(0.85 0.18 50)" }}
      >
        PKR {balance.toLocaleString()}
      </span>
    </div>
  );
}

// ---- Main Modal ----
export function GameDemoModal({
  open,
  onClose,
  gameName,
  provider,
  gameCategory,
}: GameDemoModalProps) {
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
              DEMO
            </span>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.60 0.05 285)" }}>
            {provider}
          </p>
        </DialogHeader>
        {gameCategory === "crash" ? (
          <CrashGame />
        ) : gameCategory === "card" ? (
          <CardGame />
        ) : gameCategory === "fishing" ? (
          <FishingGame />
        ) : gameCategory === "sports" ? (
          <SportsGame />
        ) : gameCategory === "live" ? (
          <RouletteGame />
        ) : gameCategory === "lottery" ? (
          <LotteryGame />
        ) : (
          <SlotGame />
        )}
      </DialogContent>
    </Dialog>
  );
}
