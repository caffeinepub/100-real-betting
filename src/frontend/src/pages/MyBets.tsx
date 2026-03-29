import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { Status__1 } from "../backend";
import type { Bet } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyBets } from "../hooks/useQueries";

const skeletonKeys = ["sk1", "sk2", "sk3"];

function BetCard({ bet, index }: { bet: Bet; index: number }) {
  const statusColors = {
    [Status__1.active]: "bg-blue-100 text-blue-700",
    [Status__1.won]: "bg-green-100 text-green-700",
    [Status__1.lost]: "bg-red-100 text-red-700",
    [Status__1.cancelled]: "bg-gray-100 text-gray-500",
  };

  return (
    <motion.div
      data-ocid={`mybets.item.${index}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl card-shadow border border-border p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">
            Bet #{bet.id.toString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Event #{bet.eventId.toString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Selection #{bet.selectionId.toString()}
          </div>
        </div>
        <Badge
          className={`text-[10px] px-2 py-0.5 border-0 font-bold ${statusColors[bet.status]}`}
        >
          {bet.status.toUpperCase()}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div className="bg-muted rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Stake</div>
          <div className="text-sm font-bold text-foreground">
            {bet.stake.toFixed(0)}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Payout</div>
          <div className="text-sm font-bold text-emerald-brand">
            {bet.potentialPayout.toFixed(0)}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Status</div>
          <div className="text-sm font-bold text-foreground capitalize">
            {bet.status}
          </div>
        </div>
      </div>
      {bet.status === Status__1.active && (
        <div className="mt-3">
          <Progress value={45} className="h-1.5 [&>div]:bg-emerald-brand" />
        </div>
      )}
    </motion.div>
  );
}

export default function MyBets() {
  const { loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: bets, isLoading } = useMyBets();

  const activeBets = bets?.filter((b) => b.status === Status__1.active) ?? [];
  const historyBets = bets?.filter((b) => b.status !== Status__1.active) ?? [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">My Bets</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Track your active and past wagers.
        </p>

        {!isLoggedIn ? (
          <div className="bg-white rounded-xl card-shadow border border-border py-16 text-center">
            <p className="text-muted-foreground">
              Please login to view your bets.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger data-ocid="mybets.active.tab" value="active">
                Active{" "}
                {activeBets.length > 0 && (
                  <Badge className="ml-1.5 bg-emerald-brand text-white border-0 text-[10px] px-1.5 py-0">
                    {activeBets.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger data-ocid="mybets.history.tab" value="history">
                History{" "}
                {historyBets.length > 0 && (
                  <Badge className="ml-1.5 bg-muted text-muted-foreground border-0 text-[10px] px-1.5 py-0">
                    {historyBets.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {isLoading ? (
                <div data-ocid="mybets.loading_state" className="space-y-3">
                  {skeletonKeys.map((k) => (
                    <Skeleton key={k} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              ) : activeBets.length === 0 ? (
                <div
                  data-ocid="mybets.active.empty_state"
                  className="bg-white rounded-xl card-shadow border border-border py-16 text-center"
                >
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-muted-foreground">
                    No active bets. Head to the dashboard to place your first
                    bet!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeBets.map((bet, i) => (
                    <BetCard key={bet.id.toString()} bet={bet} index={i + 1} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {isLoading ? (
                <div className="space-y-3">
                  {skeletonKeys.map((k) => (
                    <Skeleton key={k} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              ) : historyBets.length === 0 ? (
                <div
                  data-ocid="mybets.history.empty_state"
                  className="bg-white rounded-xl card-shadow border border-border py-16 text-center"
                >
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-muted-foreground">No bet history yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {historyBets.map((bet, i) => (
                    <BetCard key={bet.id.toString()} bet={bet} index={i + 1} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  );
}
