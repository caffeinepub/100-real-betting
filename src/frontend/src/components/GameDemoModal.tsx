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
  hasDeposited?: boolean;
  userBalance?: number;
  onBalanceChange?: (delta: number) => void;
  onOpenDeposit?: () => void;
}

// ===================== SLOT CONFIG =====================
type SlotConfig = {
  symbols: string[];
  accentColor: string;
  bgGradient: string;
};

const SLOT_CONFIGS: Record<string, SlotConfig> = {
  "Fortune Gems": {
    symbols: ["💎", "💍", "💠", "🔷", "✨", "🌟", "👑", "💜"],
    accentColor: "oklch(0.75 0.25 300)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.12 300), oklch(0.10 0.09 270))",
  },
  "Super Ace": {
    symbols: ["🂡", "🂱", "🃁", "🃑", "♠", "♥", "♦", "♣"],
    accentColor: "oklch(0.75 0.2 220)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.10 220), oklch(0.10 0.08 240))",
  },
  "Money Coming": {
    symbols: ["💰", "💵", "💳", "🏦", "🤑", "💸", "🪙", "💱"],
    accentColor: "oklch(0.8 0.22 130)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.10 130), oklch(0.10 0.08 140))",
  },
  "Crazy 777": {
    symbols: ["7️⃣", "🍒", "🔔", "⭐", "🍋", "🎰", "💎", "BAR"],
    accentColor: "oklch(0.85 0.18 50)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.15 0.10 50), oklch(0.10 0.07 60))",
  },
  "Lucky Goldbricks": {
    symbols: ["🧱", "🟡", "⚱️", "🏺", "💛", "🌕", "⭐", "🔱"],
    accentColor: "oklch(0.8 0.22 60)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.10 60), oklch(0.10 0.08 55))",
  },
  "Zeus 2": {
    symbols: ["⚡", "🌩️", "🏛️", "🦅", "🔱", "⚡", "🌪️", "🌟"],
    accentColor: "oklch(0.75 0.22 270)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.11 270), oklch(0.10 0.08 280))",
  },
  "Mahjong Ways": {
    symbols: ["🀄", "🎴", "🀅", "🀃", "🀆", "🎲", "🀁", "🀂"],
    accentColor: "oklch(0.7 0.22 30)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.10 30), oklch(0.10 0.08 20))",
  },
  "Ganesha Gold": {
    symbols: ["🐘", "🌺", "🙏", "🪷", "✨", "🏆", "💫", "🎋"],
    accentColor: "oklch(0.75 0.22 80)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.10 80), oklch(0.10 0.08 65))",
  },
  "Wild Bounty": {
    symbols: ["🤠", "🔫", "💰", "🐎", "⭐", "🏜️", "🌵", "🎯"],
    accentColor: "oklch(0.7 0.2 50)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.09 45), oklch(0.10 0.07 35))",
  },
  "Treasures of Aztec": {
    symbols: ["🗿", "🦜", "⚗️", "🌿", "💎", "🦎", "🌞", "🪬"],
    accentColor: "oklch(0.7 0.2 140)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.10 140), oklch(0.10 0.07 130))",
  },
  "Sweet Bonanza": {
    symbols: ["🍬", "🍭", "🍒", "🍇", "🍓", "🍑", "🍋", "🍑"],
    accentColor: "oklch(0.75 0.25 330)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.11 330), oklch(0.10 0.09 320))",
  },
  "Gates of Olympus": {
    symbols: ["⚡", "🏛️", "👑", "🔮", "💫", "🌟", "🔱", "🌩️"],
    accentColor: "oklch(0.75 0.22 270)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.12 270), oklch(0.10 0.09 285))",
  },
  "The Dog House": {
    symbols: ["🐶", "🦴", "🐾", "🏠", "🐕", "🐩", "🎾", "💛"],
    accentColor: "oklch(0.7 0.2 50)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.09 50), oklch(0.10 0.07 45))",
  },
  "Starlight Princess": {
    symbols: ["⭐", "🌟", "💫", "✨", "🌸", "🎀", "🌙", "👸"],
    accentColor: "oklch(0.75 0.22 320)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.11 320), oklch(0.10 0.08 305))",
  },
  "Lucky Koi": {
    symbols: ["🐠", "🌊", "🌸", "🍀", "💮", "🐡", "🎏", "⛩️"],
    accentColor: "oklch(0.7 0.22 195)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.11 195), oklch(0.10 0.08 210))",
  },
  "Book of Myth": {
    symbols: ["📖", "🔮", "🦅", "⚖️", "🏛️", "🌙", "⭐", "🪄"],
    accentColor: "oklch(0.75 0.18 60)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.09 60), oklch(0.10 0.07 50))",
  },
  "Dancing Fever": {
    symbols: ["💃", "🕺", "🎵", "🎶", "🌈", "✨", "🎤", "🎸"],
    accentColor: "oklch(0.75 0.25 330)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.12 330), oklch(0.10 0.09 310))",
  },
  "Alien Hunter": {
    symbols: ["👽", "🛸", "🔭", "🚀", "🌌", "⭐", "💫", "🔫"],
    accentColor: "oklch(0.7 0.22 195)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.11 0.10 210), oklch(0.08 0.07 225))",
  },
  "Boom Legend": {
    symbols: ["💣", "💥", "🔥", "⚡", "🎆", "🌋", "💫", "🔱"],
    accentColor: "oklch(0.7 0.25 27)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.11 27), oklch(0.10 0.08 15))",
  },
  "Thor Hammer": {
    symbols: ["🔨", "⚡", "🌩️", "🛡️", "⚔️", "🏔️", "❄️", "🌟"],
    accentColor: "oklch(0.7 0.2 240)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.10 240), oklch(0.10 0.08 255))",
  },
  "Sky Conquest": {
    symbols: ["✈️", "🚀", "🛩️", "🌌", "⭐", "🌙", "🛸", "💫"],
    accentColor: "oklch(0.65 0.2 220)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.11 0.10 220), oklch(0.08 0.07 230))",
  },
  "Slot Car Rally": {
    symbols: ["🏎️", "🏁", "⚡", "🔥", "🏆", "🛣️", "🎯", "💨"],
    accentColor: "oklch(0.7 0.25 50)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.11 27), oklch(0.10 0.08 15))",
  },
  "Money Train": {
    symbols: ["🚂", "💰", "🤠", "💣", "⭐", "🔫", "💵", "🎯"],
    accentColor: "oklch(0.75 0.22 50)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.14 0.10 45), oklch(0.10 0.07 35))",
  },
  "Fishing God": {
    symbols: ["🐟", "🐠", "🦈", "🐡", "🦐", "🐙", "🦞", "🎣"],
    accentColor: "oklch(0.7 0.22 195)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.13 0.11 195), oklch(0.10 0.08 210))",
  },
  "Mega Win": {
    symbols: ["💰", "⭐", "🏆", "💎", "🎰", "7️⃣", "🔔", "🍒"],
    accentColor: "oklch(0.85 0.22 60)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.15 0.10 60), oklch(0.11 0.07 50))",
  },
};

const DEFAULT_SLOT_SYMBOLS = ["🍒", "🍋", "🍇", "🔔", "⭐", "💰", "🎰", "7️⃣"];
const DEFAULT_SLOT_CONFIG: SlotConfig = {
  symbols: DEFAULT_SLOT_SYMBOLS,
  accentColor: "oklch(0.75 0.25 330)",
  bgGradient:
    "linear-gradient(135deg, oklch(0.16 0.1 290), oklch(0.12 0.08 280))",
};

// Determine game type from provider or game name
function getGameType(provider: string, gameName: string): string {
  const p = provider.toLowerCase();
  const g = gameName.toLowerCase();

  // Crash games
  if (
    p.includes("crash") ||
    g.includes("aviator") ||
    g.includes("jetx") ||
    g.includes("spaceman") ||
    g.includes("crash")
  )
    return "crash";

  // Fishing games
  if (
    p.includes("fishing") ||
    g.includes("ocean king") ||
    g.includes("crab") ||
    g.includes("fish") ||
    g.includes("golden toad") ||
    g.includes("pirate king")
  )
    return "fishing";

  // Dragon Tiger — must come BEFORE general card check
  if (g.includes("dragon tiger") || g.includes("dragontiger"))
    return "dragontiger";

  // Baccarat — must come BEFORE general card check
  if (g.includes("baccarat")) return "baccarat";

  // Roulette → live
  if (g.includes("roulette")) return "live";

  // Card/table games
  if (
    p.includes("card") ||
    p.includes("poker") ||
    g.includes("teen patti") ||
    g.includes("andar") ||
    g.includes("blackjack") ||
    g.includes("poker") ||
    g.includes("royal flush")
  )
    return "card";

  // Live casino provider default → live
  if (p.includes("live casino") || p.includes("live")) return "live";

  // Sports
  if (
    p.includes("sport") ||
    g.includes("cricket") ||
    g.includes("football") ||
    g.includes("tennis") ||
    g.includes("psl")
  )
    return "sports";

  // Lottery / keno
  if (
    p.includes("lottery") ||
    p.includes("keno") ||
    g.includes("lottery") ||
    g.includes("keno") ||
    g.includes("lucky draw") ||
    g.includes("scratch") ||
    g.includes("mega")
  )
    return "lottery";

  return "slots";
}

// ===================== SLOTS DEMO =====================
function randomSymbolFrom(symbols: string[]) {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function SlotsDemo({
  config,
  initialBalance,
  onBalanceChange,
}: {
  config?: SlotConfig;
  initialBalance: number;
  onBalanceChange: (delta: number) => void;
}) {
  const cfg = config ?? DEFAULT_SLOT_CONFIG;
  const [reels, setReels] = useState([
    cfg.symbols[0],
    cfg.symbols[0],
    cfg.symbols[0],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(initialBalance);
  const [result, setResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function spin() {
    if (spinning || balance < 50) return;
    setBalance((b) => b - 50);
    onBalanceChange(-50);
    setResult(null);
    setSpinning(true);
    setSpinCount((c) => c + 1);
    intervalRef.current = setInterval(
      () =>
        setReels([
          randomSymbolFrom(cfg.symbols),
          randomSymbolFrom(cfg.symbols),
          randomSymbolFrom(cfg.symbols),
        ]),
      80,
    );
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const final = [
        randomSymbolFrom(cfg.symbols),
        randomSymbolFrom(cfg.symbols),
        randomSymbolFrom(cfg.symbols),
      ];
      setReels(final);
      setSpinning(false);
      if (final[0] === final[1] && final[1] === final[2]) {
        setResult("jackpot");
        setBalance((b) => b + 500);
        onBalanceChange(500);
      } else if (
        final[0] === final[1] ||
        final[1] === final[2] ||
        final[0] === final[2]
      ) {
        setResult("win");
        setBalance((b) => b + 200);
        onBalanceChange(200);
      } else setResult("lose");
    }, 1500);
  }

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 flex flex-col items-center gap-4"
        style={{
          background: cfg.bgGradient,
          border: `2px solid ${cfg.accentColor.replace(")", " / 0.35)").replace("oklch(", "oklch(")}`,
        }}
      >
        <div className="flex gap-3">
          {reels.map((s, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static reel positions
              key={i}
              className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
              style={{
                background: "oklch(0.1 0.07 285)",
                border: `2px solid ${cfg.accentColor.replace(")", " / 0.4)").replace("oklch(", "oklch(")}`,
                filter: spinning ? "blur(1px)" : "none",
              }}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="h-7 flex items-center">
          {result === "jackpot" && (
            <p
              className="font-black text-sm animate-pulse"
              style={{ color: cfg.accentColor }}
            >
              🎉 JACKPOT! +PKR 500
            </p>
          )}
          {result === "win" && (
            <p
              className="font-black text-sm"
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
          style={{
            background:
              spinning || balance < 50
                ? "oklch(0.35 0.05 285)"
                : `linear-gradient(135deg, ${cfg.accentColor}, oklch(0.6 0.28 ${cfg.accentColor.match(/\d+\)$/)?.[0]?.replace(")", "") ?? "330"}))`,
            color: spinning || balance < 50 ? "oklch(0.5 0.03 285)" : "white",
          }}
        >
          {spinning
            ? "Spinning..."
            : balance < 50
              ? "No Balance"
              : "🎰 SPIN — PKR 50"}
        </Button>
      </div>
      <div
        className="flex justify-between text-xs px-1"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        <span>Spins: {spinCount}</span>
        <span>PKR {balance.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ===================== CRASH DEMO =====================
function CrashDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [phase, setPhase] = useState<"waiting" | "flying" | "crashed">(
    "waiting",
  );
  const [multiplier, setMultiplier] = useState(1.0);
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(50);
  const [cashedOut, setCashedOut] = useState<number | null>(null);
  const [crashAt, setCrashAt] = useState(1.0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const crashAtRef = useRef(1.0);

  function startRound() {
    if (balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    setCashedOut(null);
    const target = 1 + Math.random() * 8;
    setCrashAt(target);
    crashAtRef.current = target;
    setMultiplier(1.0);
    setPhase("flying");
    startRef.current = performance.now();
    function tick(now: number) {
      const elapsed = (now - startRef.current) / 1000;
      const m = 1 + elapsed * 0.8;
      setMultiplier(Number.parseFloat(m.toFixed(2)));
      if (m >= crashAtRef.current) {
        setPhase("crashed");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function cashOut() {
    if (phase !== "flying") return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const win = Math.floor(bet * multiplier);
    setBalance((b) => b + win);
    onBalanceChange(win);
    setCashedOut(win);
    setPhase("crashed");
  }

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 flex flex-col items-center gap-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 260), oklch(0.1 0.08 280))",
          border: "2px solid oklch(0.6 0.25 270 / 0.4)",
        }}
      >
        <div
          className="text-6xl font-black"
          style={{
            color:
              phase === "crashed" && !cashedOut
                ? "oklch(0.65 0.25 27)"
                : "oklch(0.85 0.2 140)",
            textShadow: "0 0 30px currentColor",
          }}
        >
          {multiplier.toFixed(2)}x
        </div>
        <div
          className="text-sm font-bold"
          style={{ color: "oklch(0.65 0.05 285)" }}
        >
          {phase === "waiting" && "Place bet & Start"}
          {phase === "flying" && "🚀 Flying! Cash out before it crashes!"}
          {phase === "crashed" &&
            cashedOut &&
            `✅ Cashed out! +PKR ${cashedOut}`}
          {phase === "crashed" &&
            !cashedOut &&
            `💥 CRASHED at ${crashAt.toFixed(2)}x!`}
        </div>
        <div className="flex gap-2 w-full">
          {[25, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setBet(v)}
              className="flex-1 rounded-lg py-1.5 text-xs font-black transition-all"
              style={{
                background:
                  bet === v ? "oklch(0.6 0.25 270)" : "oklch(0.2 0.08 285)",
                color: "white",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        {phase === "flying" ? (
          <Button
            type="button"
            onClick={cashOut}
            className="w-full h-12 text-lg font-black"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.25 130), oklch(0.65 0.28 150))",
              color: "black",
            }}
          >
            💰 CASH OUT — {multiplier.toFixed(2)}x
          </Button>
        ) : (
          <Button
            type="button"
            onClick={startRound}
            disabled={balance < bet}
            className="w-full h-12 text-lg font-black"
            style={{
              background:
                balance < bet
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.6 0.25 270), oklch(0.5 0.28 290))",
              color: "white",
            }}
          >
            🚀 BET PKR {bet} & FLY
          </Button>
        )}
      </div>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== FISHING DEMO =====================
function FishingDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [fish, setFish] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 75 + 5,
      y: Math.random() * 55 + 10,
      emoji: ["🐟", "🐠", "🦈", "🐡", "🦐", "🐙"][
        Math.floor(Math.random() * 6)
      ],
      points: [10, 20, 50, 30, 15, 100][Math.floor(Math.random() * 6)],
      hit: false,
    })),
  );
  const [shots, setShots] = useState(20);
  const [msg, setMsg] = useState("");

  function shoot(f: (typeof fish)[0]) {
    if (shots <= 0 || f.hit) return;
    setShots((s) => s - 1);
    const hit = Math.random() > 0.35;
    if (hit) {
      setFish((prev) =>
        prev.map((fi) => (fi.id === f.id ? { ...fi, hit: true } : fi)),
      );
      setBalance((b) => b + f.points);
      onBalanceChange(f.points);
      setMsg(`+PKR ${f.points}!`);
      setTimeout(() => setMsg(""), 1000);
    } else {
      setMsg("Missed!");
      setTimeout(() => setMsg(""), 700);
    }
  }

  function reload() {
    setShots(20);
    setFish(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 75 + 5,
        y: Math.random() * 55 + 10,
        emoji: ["🐟", "🐠", "🦈", "🐡", "🦐", "🐙"][
          Math.floor(Math.random() * 6)
        ],
        points: [10, 20, 50, 30, 15, 100][Math.floor(Math.random() * 6)],
        hit: false,
      })),
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: 200,
          background:
            "linear-gradient(180deg, oklch(0.25 0.15 230) 0%, oklch(0.15 0.12 220) 100%)",
          border: "2px solid oklch(0.5 0.2 220 / 0.4)",
        }}
      >
        {fish.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => shoot(f)}
            className="absolute text-2xl transition-all"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              opacity: f.hit ? 0.2 : 1,
              transform: f.hit ? "scale(0.5)" : "scale(1)",
              filter: f.hit ? "grayscale(1)" : "none",
            }}
          >
            {f.emoji}
          </button>
        ))}
        {msg && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 font-black text-lg"
            style={{
              color: "oklch(0.85 0.18 50)",
              textShadow: "0 0 10px currentColor",
            }}
          >
            {msg}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span
          className="text-sm font-bold"
          style={{ color: "oklch(0.65 0.05 285)" }}
        >
          Shots: {shots} | Balance: PKR {balance}
        </span>
        {shots === 0 && (
          <Button
            type="button"
            onClick={reload}
            className="text-xs font-black px-3 py-1"
            style={{ background: "oklch(0.6 0.25 195)", color: "black" }}
          >
            Reload
          </Button>
        )}
      </div>
      <p
        className="text-[10px] text-center"
        style={{ color: "oklch(0.45 0.04 285)" }}
      >
        Tap fish to shoot! Different fish = different prizes.
      </p>
    </div>
  );
}

// ===================== CARD DEMO (Teen Patti style) =====================
const CARD_LABELS = [
  "A",
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
];
const SUITS = ["♠", "♥", "♦", "♣"];

function randomCard() {
  return {
    label: CARD_LABELS[Math.floor(Math.random() * 13)],
    suit: SUITS[Math.floor(Math.random() * 4)],
    value: Math.floor(Math.random() * 13) + 1,
  };
}

function CardDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(50);
  const [playerCards, setPlayerCards] = useState<
    ReturnType<typeof randomCard>[]
  >([]);
  const [dealerCards, setDealerCards] = useState<
    ReturnType<typeof randomCard>[]
  >([]);
  const [phase, setPhase] = useState<"bet" | "playing" | "result">("bet");
  const [resultMsg, setResultMsg] = useState("");

  function deal() {
    if (balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    setPlayerCards([randomCard(), randomCard(), randomCard()]);
    setDealerCards([randomCard(), randomCard(), randomCard()]);
    setPhase("playing");
  }

  function showdown() {
    const pScore = playerCards.reduce((a, c) => a + Math.min(c.value, 10), 0);
    const dScore = dealerCards.reduce((a, c) => a + Math.min(c.value, 10), 0);
    if (pScore > dScore) {
      setBalance((b) => b + bet * 2);
      onBalanceChange(bet * 2);
      setResultMsg(`You Win! +PKR ${bet * 2}`);
    } else if (pScore === dScore) {
      setBalance((b) => b + bet);
      onBalanceChange(bet);
      setResultMsg(`Tie! Bet returned PKR ${bet}`);
    } else setResultMsg(`Dealer wins! Lost PKR ${bet}`);
    setPhase("result");
  }

  const cardStyle = (suit: string) => ({
    color:
      suit === "♥" || suit === "♦"
        ? "oklch(0.65 0.25 27)"
        : "oklch(0.95 0.02 285)",
    background: "oklch(0.97 0.01 285)",
    border: "1px solid oklch(0.8 0.02 285)",
  });

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 150), oklch(0.1 0.08 130))",
          border: "2px solid oklch(0.5 0.2 150 / 0.4)",
        }}
      >
        {phase !== "bet" && (
          <>
            <div className="text-center">
              <p
                className="text-xs font-bold mb-1"
                style={{ color: "oklch(0.65 0.05 285)" }}
              >
                Dealer
              </p>
              <div className="flex justify-center gap-2">
                {dealerCards.map((c, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed card positions
                    key={i}
                    className="w-12 h-16 rounded-lg flex flex-col items-center justify-center text-lg font-black"
                    style={cardStyle(c.suit)}
                  >
                    <span className="text-sm">{c.label}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p
                className="text-xs font-bold mb-1"
                style={{ color: "oklch(0.75 0.18 50)" }}
              >
                You
              </p>
              <div className="flex justify-center gap-2">
                {playerCards.map((c, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed card positions
                    key={i}
                    className="w-12 h-16 rounded-lg flex flex-col items-center justify-center text-lg font-black"
                    style={cardStyle(c.suit)}
                  >
                    <span className="text-sm">{c.label}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {phase === "result" && (
          <p
            className="text-center font-black"
            style={{
              color: resultMsg.includes("Win")
                ? "oklch(0.75 0.2 140)"
                : resultMsg.includes("Tie")
                  ? "oklch(0.85 0.18 50)"
                  : "oklch(0.65 0.25 27)",
            }}
          >
            {resultMsg}
          </p>
        )}
        <div className="flex gap-2">
          {[25, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setBet(v)}
              className="flex-1 rounded-lg py-1.5 text-xs font-black"
              style={{
                background:
                  bet === v ? "oklch(0.5 0.2 150)" : "oklch(0.2 0.08 285)",
                color: "white",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        {phase === "bet" && (
          <Button
            type="button"
            onClick={deal}
            disabled={balance < bet}
            className="w-full h-11 font-black"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.5 0.2 150), oklch(0.4 0.22 130))",
              color: "white",
            }}
          >
            🃏 DEAL — PKR {bet}
          </Button>
        )}
        {phase === "playing" && (
          <Button
            type="button"
            onClick={showdown}
            className="w-full h-11 font-black"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 330), oklch(0.55 0.28 350))",
              color: "white",
            }}
          >
            Show Cards (Showdown)
          </Button>
        )}
        {phase === "result" && (
          <Button
            type="button"
            onClick={() => setPhase("bet")}
            className="w-full h-11 font-black"
            style={{ background: "oklch(0.35 0.05 285)", color: "white" }}
          >
            Play Again
          </Button>
        )}
      </div>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== DRAGON TIGER DEMO =====================
const DT_CARD_VALUES: Record<string, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
};

function DragonTigerDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(50);
  const [side, setSide] = useState<"dragon" | "tiger" | "tie" | null>(null);
  const [dragonCard, setDragonCard] = useState<ReturnType<
    typeof randomCard
  > | null>(null);
  const [tigerCard, setTigerCard] = useState<ReturnType<
    typeof randomCard
  > | null>(null);
  const [phase, setPhase] = useState<"bet" | "result">("bet");
  const [resultMsg, setResultMsg] = useState("");
  const [resultWin, setResultWin] = useState(false);

  function deal() {
    if (!side || balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    const dc = randomCard();
    const tc = randomCard();
    setDragonCard(dc);
    setTigerCard(tc);
    const dv = DT_CARD_VALUES[dc.label];
    const tv = DT_CARD_VALUES[tc.label];
    let winner: "dragon" | "tiger" | "tie";
    if (dv > tv) winner = "dragon";
    else if (tv > dv) winner = "tiger";
    else winner = "tie";
    if (winner === side) {
      const payout = side === "tie" ? bet * 8 : bet * 2;
      setBalance((b) => b + payout);
      onBalanceChange(payout);
      setResultMsg(`✅ ${winner.toUpperCase()} wins! +PKR ${payout}`);
      setResultWin(true);
    } else {
      setResultMsg(`❌ ${winner.toUpperCase()} wins! Lost PKR ${bet}`);
      setResultWin(false);
    }
    setPhase("result");
  }

  function reset() {
    setDragonCard(null);
    setTigerCard(null);
    setSide(null);
    setPhase("bet");
    setResultMsg("");
  }

  const cardStyle = (suit: string) => ({
    color:
      suit === "♥" || suit === "♦"
        ? "oklch(0.6 0.25 27)"
        : "oklch(0.15 0.02 285)",
    background: "white",
    border: "2px solid oklch(0.85 0.02 285)",
    borderRadius: 10,
  });

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.12 30), oklch(0.10 0.08 45))",
          border: "2px solid oklch(0.65 0.22 50 / 0.5)",
        }}
      >
        {/* Card zones */}
        <div className="flex items-center justify-between gap-2">
          {/* Dragon */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span
              className="text-xs font-black"
              style={{ color: "oklch(0.75 0.25 30)" }}
            >
              🐉 Dragon
            </span>
            <div
              className="w-16 h-22 flex flex-col items-center justify-center text-xl font-black"
              style={
                dragonCard
                  ? cardStyle(dragonCard.suit)
                  : {
                      background: "oklch(0.2 0.08 285)",
                      border: "2px dashed oklch(0.4 0.08 285)",
                      borderRadius: 10,
                      width: 60,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "oklch(0.45 0.05 285)",
                    }
              }
            >
              {dragonCard ? (
                <>
                  <span style={{ fontSize: 18 }}>{dragonCard.label}</span>
                  <span style={{ fontSize: 20 }}>{dragonCard.suit}</span>
                </>
              ) : (
                "?"
              )}
            </div>
          </div>
          {/* VS */}
          <div className="flex flex-col items-center">
            <span
              className="text-lg font-black"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              VS
            </span>
          </div>
          {/* Tiger */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span
              className="text-xs font-black"
              style={{ color: "oklch(0.7 0.22 270)" }}
            >
              🐯 Tiger
            </span>
            <div
              className="w-16 flex flex-col items-center justify-center text-xl font-black"
              style={
                tigerCard
                  ? cardStyle(tigerCard.suit)
                  : {
                      background: "oklch(0.2 0.08 285)",
                      border: "2px dashed oklch(0.4 0.08 285)",
                      borderRadius: 10,
                      width: 60,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "oklch(0.45 0.05 285)",
                    }
              }
            >
              {tigerCard ? (
                <>
                  <span style={{ fontSize: 18 }}>{tigerCard.label}</span>
                  <span style={{ fontSize: 20 }}>{tigerCard.suit}</span>
                </>
              ) : (
                "?"
              )}
            </div>
          </div>
        </div>

        {/* Bet selection */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (phase === "bet") setSide("dragon");
            }}
            className="flex-1 rounded-lg py-2 text-xs font-black"
            style={{
              background:
                side === "dragon"
                  ? "oklch(0.55 0.25 27)"
                  : "oklch(0.22 0.08 285)",
              color: "white",
              border:
                side === "dragon" ? "2px solid white" : "2px solid transparent",
            }}
          >
            🐉 Dragon
            <br />
            <span style={{ fontSize: 10 }}>2x</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (phase === "bet") setSide("tie");
            }}
            className="rounded-lg py-2 px-2 text-xs font-black"
            style={{
              background:
                side === "tie"
                  ? "oklch(0.55 0.22 130)"
                  : "oklch(0.22 0.08 285)",
              color: "white",
              border:
                side === "tie" ? "2px solid white" : "2px solid transparent",
            }}
          >
            Tie
            <br />
            <span style={{ fontSize: 10 }}>8x</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (phase === "bet") setSide("tiger");
            }}
            className="flex-1 rounded-lg py-2 text-xs font-black"
            style={{
              background:
                side === "tiger"
                  ? "oklch(0.5 0.22 270)"
                  : "oklch(0.22 0.08 285)",
              color: "white",
              border:
                side === "tiger" ? "2px solid white" : "2px solid transparent",
            }}
          >
            🐯 Tiger
            <br />
            <span style={{ fontSize: 10 }}>2x</span>
          </button>
        </div>

        {/* Bet amounts */}
        <div className="flex gap-2">
          {[25, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setBet(v)}
              className="flex-1 rounded-lg py-1.5 text-xs font-black"
              style={{
                background:
                  bet === v ? "oklch(0.65 0.22 50)" : "oklch(0.2 0.08 285)",
                color: bet === v ? "black" : "white",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {resultMsg && (
          <p
            className="text-center font-black text-sm"
            style={{
              color: resultWin ? "oklch(0.75 0.2 140)" : "oklch(0.65 0.25 27)",
            }}
          >
            {resultMsg}
          </p>
        )}

        {phase === "bet" ? (
          <Button
            type="button"
            onClick={deal}
            disabled={!side || balance < bet}
            className="w-full h-11 font-black"
            style={{
              background:
                !side || balance < bet
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.65 0.25 50), oklch(0.55 0.28 35))",
              color: !side || balance < bet ? "oklch(0.5 0.03 285)" : "black",
            }}
          >
            {!side ? "Select Dragon / Tiger / Tie" : `🃏 DEAL — PKR ${bet}`}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={reset}
            className="w-full h-11 font-black"
            style={{ background: "oklch(0.35 0.05 285)", color: "white" }}
          >
            Play Again
          </Button>
        )}
      </div>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== BACCARAT DEMO =====================
function baccaratValue(cards: ReturnType<typeof randomCard>[]) {
  const total = cards.reduce((sum, c) => {
    const v = DT_CARD_VALUES[c.label];
    return sum + (v >= 10 ? 0 : v);
  }, 0);
  return total % 10;
}

function BaccaratDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(50);
  const [side, setSide] = useState<"player" | "banker" | "tie" | null>(null);
  const [playerCards, setPlayerCards] = useState<
    ReturnType<typeof randomCard>[]
  >([]);
  const [bankerCards, setBankerCards] = useState<
    ReturnType<typeof randomCard>[]
  >([]);
  const [phase, setPhase] = useState<"bet" | "result">("bet");
  const [resultMsg, setResultMsg] = useState("");
  const [resultWin, setResultWin] = useState(false);

  function deal() {
    if (!side || balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    const pc = [randomCard(), randomCard()];
    const bc = [randomCard(), randomCard()];
    setPlayerCards(pc);
    setBankerCards(bc);
    const pv = baccaratValue(pc);
    const bv = baccaratValue(bc);
    let winner: "player" | "banker" | "tie";
    if (pv > bv) winner = "player";
    else if (bv > pv) winner = "banker";
    else winner = "tie";
    if (winner === side) {
      const payout = side === "tie" ? bet * 9 : bet * 2;
      setBalance((b) => b + payout);
      onBalanceChange(payout);
      setResultMsg(
        `✅ ${winner.toUpperCase()} wins (${winner === "player" ? pv : bv})! +PKR ${payout}`,
      );
      setResultWin(true);
    } else {
      setResultMsg(
        `❌ ${winner.toUpperCase()} wins! P:${pv} B:${bv} — Lost PKR ${bet}`,
      );
      setResultWin(false);
    }
    setPhase("result");
  }

  function reset() {
    setPlayerCards([]);
    setBankerCards([]);
    setSide(null);
    setPhase("bet");
    setResultMsg("");
  }

  const cardStyle = (suit: string) => ({
    color:
      suit === "♥" || suit === "♦"
        ? "oklch(0.6 0.25 27)"
        : "oklch(0.15 0.02 285)",
    background: "white",
    border: "1.5px solid oklch(0.85 0.02 285)",
    borderRadius: 8,
    width: 44,
    height: 60,
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    fontSize: 14,
    fontWeight: 900,
  });

  const pv = playerCards.length ? baccaratValue(playerCards) : null;
  const bv = bankerCards.length ? baccaratValue(bankerCards) : null;

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.10 160), oklch(0.09 0.07 140))",
          border: "2px solid oklch(0.55 0.22 160 / 0.5)",
        }}
      >
        {/* Scores */}
        {phase === "result" && (
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs" style={{ color: "oklch(0.65 0.05 285)" }}>
                Player
              </p>
              <p
                className="text-2xl font-black"
                style={{ color: "oklch(0.75 0.22 220)" }}
              >
                {pv}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "oklch(0.65 0.05 285)" }}>
                Banker
              </p>
              <p
                className="text-2xl font-black"
                style={{ color: "oklch(0.75 0.22 27)" }}
              >
                {bv}
              </p>
            </div>
          </div>
        )}

        {/* Cards */}
        {phase === "result" && (
          <div className="flex justify-around">
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs font-bold"
                style={{ color: "oklch(0.7 0.2 220)" }}
              >
                Player
              </span>
              <div className="flex gap-1">
                {playerCards.map((c, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed positions
                  <div key={i} style={cardStyle(c.suit)}>
                    <span>{c.label}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs font-bold"
                style={{ color: "oklch(0.7 0.22 27)" }}
              >
                Banker
              </span>
              <div className="flex gap-1">
                {bankerCards.map((c, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed positions
                  <div key={i} style={cardStyle(c.suit)}>
                    <span>{c.label}</span>
                    <span>{c.suit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bet selection */}
        <div className="flex gap-1.5">
          {(["player", "banker", "tie"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (phase === "bet") setSide(opt);
              }}
              className="flex-1 rounded-lg py-2 text-xs font-black capitalize"
              style={{
                background:
                  side === opt
                    ? opt === "player"
                      ? "oklch(0.5 0.22 220)"
                      : opt === "banker"
                        ? "oklch(0.5 0.22 27)"
                        : "oklch(0.5 0.22 130)"
                    : "oklch(0.22 0.08 285)",
                color: "white",
                border:
                  side === opt ? "2px solid white" : "2px solid transparent",
              }}
            >
              {opt === "player"
                ? "👤 Player"
                : opt === "banker"
                  ? "🏦 Banker"
                  : "🤝 Tie"}
              <br />
              <span style={{ fontSize: 10 }}>
                {opt === "tie" ? "9x" : "2x"}
              </span>
            </button>
          ))}
        </div>

        {/* Bet amounts */}
        <div className="flex gap-2">
          {[25, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setBet(v)}
              className="flex-1 rounded-lg py-1.5 text-xs font-black"
              style={{
                background:
                  bet === v ? "oklch(0.55 0.22 160)" : "oklch(0.2 0.08 285)",
                color: "white",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {resultMsg && (
          <p
            className="text-center font-black text-sm"
            style={{
              color: resultWin ? "oklch(0.75 0.2 140)" : "oklch(0.65 0.25 27)",
            }}
          >
            {resultMsg}
          </p>
        )}

        {phase === "bet" ? (
          <Button
            type="button"
            onClick={deal}
            disabled={!side || balance < bet}
            className="w-full h-11 font-black"
            style={{
              background:
                !side || balance < bet
                  ? "oklch(0.35 0.05 285)"
                  : "linear-gradient(135deg, oklch(0.55 0.22 160), oklch(0.45 0.25 140))",
              color: "white",
            }}
          >
            {!side ? "Select Player / Banker / Tie" : `🃏 DEAL — PKR ${bet}`}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={reset}
            className="w-full h-11 font-black"
            style={{ background: "oklch(0.35 0.05 285)", color: "white" }}
          >
            Play Again
          </Button>
        )}
      </div>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== LIVE ROULETTE DEMO =====================
const RED_NUMS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

function LiveDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(50);
  const [betOn, setBetOn] = useState<
    "red" | "black" | "green" | "odd" | "even"
  >("red");
  const [spinning, setSpinning] = useState(false);
  const [msg, setMsg] = useState("");
  const [spinDisplay, setSpinDisplay] = useState<number | null>(null);

  function spin() {
    if (balance < bet || spinning) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    setSpinning(true);
    setMsg("");
    let ticks = 0;
    const iv = setInterval(() => {
      setSpinDisplay(Math.floor(Math.random() * 37));
      ticks++;
      if (ticks > 20) {
        clearInterval(iv);
        const landed = Math.floor(Math.random() * 37);
        setSpinDisplay(landed);
        setSpinning(false);
        let won = false;
        if (betOn === "green" && landed === 0) won = true;
        else if (betOn === "red" && RED_NUMS.includes(landed)) won = true;
        else if (betOn === "black" && landed > 0 && !RED_NUMS.includes(landed))
          won = true;
        else if (betOn === "odd" && landed > 0 && landed % 2 !== 0) won = true;
        else if (betOn === "even" && landed > 0 && landed % 2 === 0) won = true;
        if (won) {
          const mult = betOn === "green" ? 35 : 2;
          const win = bet * mult;
          setBalance((b) => b + win);
          onBalanceChange(win);
          setMsg(`✅ ${landed} — You Win! +PKR ${win}`);
        } else setMsg(`❌ ${landed} — Lost PKR ${bet}`);
      }
    }, 80);
  }

  const numColor = (n: number | null) =>
    n === null
      ? ""
      : n === 0
        ? "oklch(0.65 0.25 140)"
        : RED_NUMS.includes(n)
          ? "oklch(0.55 0.25 27)"
          : "oklch(0.3 0.02 285)";

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.08 60), oklch(0.1 0.06 50))",
          border: "2px solid oklch(0.55 0.2 50 / 0.4)",
        }}
      >
        <div className="flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-full border-4 flex items-center justify-center text-3xl font-black"
            style={{
              borderColor: "oklch(0.85 0.18 50)",
              background: numColor(spinDisplay ?? null),
              color: "white",
              transition: "background 0.1s",
            }}
          >
            {spinDisplay ?? "?"}
          </div>
        </div>
        {msg && (
          <p
            className="text-center font-black text-sm"
            style={{
              color: msg.includes("Win")
                ? "oklch(0.75 0.2 140)"
                : "oklch(0.65 0.25 27)",
            }}
          >
            {msg}
          </p>
        )}
        <div className="grid grid-cols-5 gap-1.5">
          {(["red", "black", "green", "odd", "even"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setBetOn(opt)}
              className="rounded-lg py-2 text-xs font-black capitalize"
              style={{
                background:
                  betOn === opt
                    ? opt === "red"
                      ? "oklch(0.55 0.25 27)"
                      : opt === "green"
                        ? "oklch(0.55 0.25 140)"
                        : opt === "black"
                          ? "oklch(0.25 0.02 285)"
                          : "oklch(0.6 0.25 270)"
                    : "oklch(0.2 0.08 285)",
                color: "white",
                border:
                  betOn === opt ? "2px solid white" : "2px solid transparent",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[25, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setBet(v)}
              className="flex-1 rounded-lg py-1.5 text-xs font-black"
              style={{
                background:
                  bet === v ? "oklch(0.6 0.25 50)" : "oklch(0.2 0.08 285)",
                color: "white",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <Button
          type="button"
          onClick={spin}
          disabled={spinning || balance < bet}
          className="w-full h-11 font-black"
          style={{
            background:
              spinning || balance < bet
                ? "oklch(0.35 0.05 285)"
                : "linear-gradient(135deg, oklch(0.65 0.25 50), oklch(0.55 0.28 60))",
            color: "white",
          }}
        >
          {spinning ? "Spinning..." : `🎡 SPIN — PKR ${bet}`}
        </Button>
      </div>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== SPORTS BETTING DEMO =====================
const MATCHES = [
  {
    id: 1,
    team1: "Pakistan",
    team2: "India",
    sport: "🏏",
    odd1: 1.9,
    odd2: 2.1,
  },
  {
    id: 2,
    team1: "Manchester Utd",
    team2: "Arsenal",
    sport: "⚽",
    odd1: 2.4,
    odd2: 1.7,
  },
  {
    id: 3,
    team1: "Karachi Kings",
    team2: "Lahore Qalandars",
    sport: "🏏",
    odd1: 2.0,
    odd2: 2.0,
  },
  {
    id: 4,
    team1: "Djokovic",
    team2: "Alcaraz",
    sport: "🎾",
    odd1: 1.8,
    odd2: 2.2,
  },
];

function SportsDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [selections, setSelections] = useState<
    { matchId: number; team: string; odd: number }[]
  >([]);
  const [bet, setBet] = useState(50);
  const [result, setResult] = useState("");

  function select(matchId: number, team: string, odd: number) {
    setSelections((prev) => {
      const existing = prev.findIndex((s) => s.matchId === matchId);
      if (existing >= 0) {
        const n = [...prev];
        n[existing] = { matchId, team, odd };
        return n;
      }
      return [...prev, { matchId, team, odd }];
    });
  }

  function placeBet() {
    if (selections.length === 0 || balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    const win = Math.random() > 0.5;
    const totalOdd = selections.reduce((a, s) => a * s.odd, 1);
    if (win) {
      const winAmt = Math.floor(bet * totalOdd);
      setBalance((b) => b + winAmt);
      onBalanceChange(winAmt);
      setResult(`✅ Won! +PKR ${winAmt} (odds: ${totalOdd.toFixed(2)}x)`);
    } else setResult(`❌ Lost PKR ${bet}. Better luck next time!`);
    setSelections([]);
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl space-y-2"
        style={{ maxHeight: 220, overflowY: "auto" }}
      >
        {MATCHES.map((m) => {
          const sel = selections.find((s) => s.matchId === m.id);
          return (
            <div
              key={m.id}
              className="rounded-xl p-3"
              style={{
                background: "oklch(0.16 0.08 220)",
                border: "1px solid oklch(0.3 0.1 220)",
              }}
            >
              <p
                className="text-xs font-bold text-center mb-2"
                style={{ color: "oklch(0.75 0.05 285)" }}
              >
                {m.sport} {m.team1} vs {m.team2}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => select(m.id, m.team1, m.odd1)}
                  className="flex-1 rounded-lg py-2 text-xs font-black"
                  style={{
                    background:
                      sel?.team === m.team1
                        ? "oklch(0.55 0.25 220)"
                        : "oklch(0.22 0.08 285)",
                    color: "white",
                    border:
                      sel?.team === m.team1
                        ? "2px solid white"
                        : "2px solid transparent",
                  }}
                >
                  {m.team1}
                  <br />
                  {m.odd1.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={() => select(m.id, m.team2, m.odd2)}
                  className="flex-1 rounded-lg py-2 text-xs font-black"
                  style={{
                    background:
                      sel?.team === m.team2
                        ? "oklch(0.55 0.25 220)"
                        : "oklch(0.22 0.08 285)",
                    color: "white",
                    border:
                      sel?.team === m.team2
                        ? "2px solid white"
                        : "2px solid transparent",
                  }}
                >
                  {m.team2}
                  <br />
                  {m.odd2.toFixed(2)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {result && (
        <p
          className="text-center font-black text-sm"
          style={{
            color: result.includes("Won")
              ? "oklch(0.75 0.2 140)"
              : "oklch(0.65 0.25 27)",
          }}
        >
          {result}
        </p>
      )}
      <div className="flex gap-2">
        {[25, 50, 100, 200].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setBet(v)}
            className="flex-1 rounded-lg py-1.5 text-xs font-black"
            style={{
              background:
                bet === v ? "oklch(0.6 0.25 220)" : "oklch(0.2 0.08 285)",
              color: "white",
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <Button
        type="button"
        onClick={placeBet}
        disabled={selections.length === 0 || balance < bet}
        className="w-full h-11 font-black"
        style={{
          background:
            selections.length === 0 || balance < bet
              ? "oklch(0.35 0.05 285)"
              : "linear-gradient(135deg, oklch(0.6 0.25 220), oklch(0.5 0.28 240))",
          color: "white",
        }}
      >
        ⚽ PLACE BET — PKR {bet} ({selections.length} selection
        {selections.length !== 1 ? "s" : ""})
      </Button>
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== LOTTERY DEMO =====================
function LotteryDemo({
  initialBalance,
  onBalanceChange,
}: { initialBalance: number; onBalanceChange: (delta: number) => void }) {
  const [balance, setBalance] = useState(initialBalance);
  const [picks, setPicks] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [phase, setPhase] = useState<"pick" | "result">("pick");
  const [bet] = useState(50);

  function togglePick(n: number) {
    if (phase !== "pick") return;
    setPicks((prev) =>
      prev.includes(n)
        ? prev.filter((x) => x !== n)
        : prev.length < 5
          ? [...prev, n]
          : prev,
    );
  }

  function draw() {
    if (picks.length < 5 || balance < bet) return;
    setBalance((b) => b - bet);
    onBalanceChange(-bet);
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    const shuffled = nums.sort(() => Math.random() - 0.5).slice(0, 5);
    setDrawn(shuffled);
    setPhase("result");
    const matches = picks.filter((p) => shuffled.includes(p)).length;
    if (matches >= 5) {
      setBalance((b) => b + 5000);
      onBalanceChange(5000);
    } else if (matches >= 4) {
      setBalance((b) => b + 500);
      onBalanceChange(500);
    } else if (matches >= 3) {
      setBalance((b) => b + 150);
      onBalanceChange(150);
    } else if (matches >= 2) {
      setBalance((b) => b + 75);
      onBalanceChange(75);
    }
  }

  function reset() {
    setPicks([]);
    setDrawn([]);
    setPhase("pick");
  }

  const matches = drawn.length
    ? picks.filter((p) => drawn.includes(p)).length
    : 0;

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 60), oklch(0.1 0.08 80))",
          border: "2px solid oklch(0.55 0.25 60 / 0.4)",
        }}
      >
        <p
          className="text-xs font-bold text-center mb-2"
          style={{ color: "oklch(0.75 0.05 285)" }}
        >
          {phase === "pick" ? `Pick 5 numbers (${picks.length}/5)` : "Results"}
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => {
            const isPicked = picks.includes(n);
            const isDrawn = drawn.includes(n);
            const isMatch = isPicked && isDrawn;
            return (
              <button
                key={n}
                type="button"
                onClick={() => togglePick(n)}
                className="rounded-full aspect-square flex items-center justify-center text-xs font-black transition-all"
                style={{
                  background: isMatch
                    ? "oklch(0.75 0.25 130)"
                    : isDrawn && phase === "result"
                      ? "oklch(0.65 0.25 27)"
                      : isPicked
                        ? "oklch(0.65 0.25 270)"
                        : "oklch(0.2 0.08 285)",
                  color: "white",
                  transform: isMatch ? "scale(1.15)" : "scale(1)",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
        {phase === "result" && (
          <p
            className="text-center font-black text-sm mt-2"
            style={{
              color:
                matches >= 3 ? "oklch(0.75 0.2 140)" : "oklch(0.65 0.05 285)",
            }}
          >
            {matches >= 5
              ? "🎉 JACKPOT! +PKR 5000"
              : matches >= 4
                ? `🎊 ${matches} matches! +PKR 500`
                : matches >= 3
                  ? `✅ ${matches} matches! +PKR 150`
                  : matches >= 2
                    ? `💚 ${matches} matches! +PKR 75`
                    : `❌ ${matches} match. Try again!`}
          </p>
        )}
      </div>
      {phase === "pick" ? (
        <Button
          type="button"
          onClick={draw}
          disabled={picks.length < 5 || balance < bet}
          className="w-full h-11 font-black"
          style={{
            background:
              picks.length < 5 || balance < bet
                ? "oklch(0.35 0.05 285)"
                : "linear-gradient(135deg, oklch(0.65 0.25 60), oklch(0.55 0.28 80))",
            color: "black",
          }}
        >
          🎟 DRAW — PKR {bet}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={reset}
          className="w-full h-11 font-black"
          style={{ background: "oklch(0.35 0.05 285)", color: "white" }}
        >
          Play Again
        </Button>
      )}
      <div
        className="text-xs text-center"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Balance: PKR {balance.toLocaleString()}
      </div>
    </div>
  );
}

// ===================== MAIN MODAL =====================
export function GameDemoModal({
  open,
  onClose,
  gameName,
  provider,
  hasDeposited = false,
  userBalance = 0,
  onBalanceChange = () => {},
  onOpenDeposit = () => {},
}: GameDemoModalProps) {
  const gameType = getGameType(provider, gameName);
  const slotConfig = SLOT_CONFIGS[gameName];

  if (!hasDeposited) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          style={{
            background: "oklch(0.13 0.05 285)",
            border: "1px solid oklch(0.25 0.08 285)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "oklch(0.92 0.18 85)" }}>
              Deposit Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔒</div>
            <p style={{ color: "oklch(0.75 0.05 285)" }} className="mb-2">
              You need to make a deposit first to play games.
            </p>
            <p
              style={{ color: "oklch(0.55 0.04 285)", fontSize: "0.85rem" }}
              className="mb-6"
            >
              Minimum deposit: PKR 500 via JazzCash or Easypaisa
            </p>
            <Button
              data-ocid="gamedemo.deposit.primary_button"
              onClick={() => {
                onClose();
                onOpenDeposit();
              }}
              style={{
                background: "oklch(0.75 0.18 85)",
                color: "black",
                fontWeight: 700,
              }}
            >
              Deposit Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const gameTypeLabels: Record<string, string> = {
    slots: "Slots",
    crash: "Crash Game",
    fishing: "Fishing",
    card: "Card Game",
    dragontiger: "Dragon Tiger",
    baccarat: "Baccarat",
    live: "Live Casino",
    sports: "Sports Betting",
    lottery: "Lottery",
  };

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
            {provider} · {gameTypeLabels[gameType] ?? gameType}
          </p>
        </DialogHeader>

        {gameType === "slots" && (
          <SlotsDemo
            config={slotConfig}
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "crash" && (
          <CrashDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "fishing" && (
          <FishingDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "card" && (
          <CardDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "dragontiger" && (
          <DragonTigerDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "baccarat" && (
          <BaccaratDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "live" && (
          <LiveDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "sports" && (
          <SportsDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
        {gameType === "lottery" && (
          <LotteryDemo
            initialBalance={userBalance}
            onBalanceChange={onBalanceChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
