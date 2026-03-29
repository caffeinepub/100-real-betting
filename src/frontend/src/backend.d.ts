import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Selection {
    id: bigint;
    name: string;
    odds: number;
}
export interface Bet {
    id: bigint;
    status: Status__1;
    eventId: bigint;
    user: Principal;
    stake: number;
    selectionId: bigint;
    potentialPayout: number;
}
export interface Event {
    id: bigint;
    startTime: Time;
    status: Status;
    title: string;
    winningSelection?: bigint;
    description: string;
    sport: string;
    selections: Array<Selection>;
}
export interface UserAccount {
    balance: number;
    user: Principal;
    totalWagered: number;
    totalLost: number;
    totalWon: number;
}
export interface UserProfile {
    name: string;
}
export enum Status {
    closed = "closed",
    upcoming = "upcoming",
    settled = "settled",
    live = "live"
}
export enum Status__1 {
    won = "won",
    active = "active",
    cancelled = "cancelled",
    lost = "lost"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelEvent(eventId: bigint): Promise<void>;
    createEvent(title: string, description: string, sport: string, startTime: Time, selections: Array<Selection>): Promise<bigint>;
    depositCredits(amount: number): Promise<number>;
    getActiveMarkets(): Promise<Array<Event>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvent(eventId: bigint): Promise<Event>;
    getMyAccountSummary(): Promise<UserAccount>;
    getMyBalance(): Promise<number>;
    getMyBets(): Promise<Array<Bet>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginAccount(username: string, password: string): Promise<string>;
    placeBet(eventId: bigint, selectionId: bigint, stake: number): Promise<bigint>;
    registerAccount(username: string, password: string, fullName: string, phone: string, referralCode: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    settleEvent(eventId: bigint, winningSelectionId: bigint): Promise<void>;
    updateEventStatus(eventId: bigint, status: Status): Promise<void>;
}
