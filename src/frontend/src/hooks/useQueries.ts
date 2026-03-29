import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bet, Event, Selection, Status, UserAccount } from "../backend";
import { useActor } from "./useActor";

export function useActiveMarkets() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["activeMarkets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveMarkets();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useMyBets() {
  const { actor, isFetching } = useActor();
  return useQuery<Bet[]>({
    queryKey: ["myBets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyBalance() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["myBalance"],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getMyBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAccountSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<UserAccount>({
    queryKey: ["accountSummary"],
    queryFn: async () => {
      if (!actor) {
        return {
          balance: 0,
          user: null as any,
          totalWagered: 0,
          totalLost: 0,
          totalWon: 0,
        };
      }
      return actor.getMyAccountSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceBet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      selectionId,
      stake,
    }: { eventId: bigint; selectionId: bigint; stake: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBet(eventId, selectionId, stake);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBets"] });
      qc.invalidateQueries({ queryKey: ["myBalance"] });
      qc.invalidateQueries({ queryKey: ["accountSummary"] });
    },
  });
}

export function useDepositCredits() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.depositCredits(amount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBalance"] });
      qc.invalidateQueries({ queryKey: ["accountSummary"] });
    },
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      sport: string;
      startTime: bigint;
      selections: Selection[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEvent(
        params.title,
        params.description,
        params.sport,
        params.startTime,
        params.selections,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeMarkets"] });
    },
  });
}

export function useSettleEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      winningSelectionId,
    }: { eventId: bigint; winningSelectionId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleEvent(eventId, winningSelectionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeMarkets"] });
      qc.invalidateQueries({ queryKey: ["myBets"] });
    },
  });
}

export function useUpdateEventStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      status,
    }: { eventId: bigint; status: Status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEventStatus(eventId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeMarkets"] });
    },
  });
}

export function useCancelEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelEvent(eventId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeMarkets"] });
    },
  });
}
