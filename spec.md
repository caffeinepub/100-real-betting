# 100%Real Betting

## Current State
All user data (accounts, balances, transactions, notifications) is stored in browser `localStorage`. This means:
- Data is lost when the app is redeployed to a new URL
- Data is device-specific (can't log in from another device)
- The Motoko backend has `registerAccount` and `loginAccount` functions but they use non-stable variables (`let` not `stable var`) so they reset on canister upgrade
- The frontend never calls the backend for user management

## Requested Changes (Diff)

### Add
- Stable storage in Motoko backend for: user profiles, balances, transactions, notifications
- Backend API endpoints: `getMembers`, `submitTransaction`, `updateTransaction`, `getUserTransactions`, `getUserNotifications`, `addNotificationForUser`, `broadcastNotification`, `markNotificationRead`, `forgotPassword`
- Frontend uses backend APIs for all user data operations instead of localStorage

### Modify
- `main.mo`: Add `stable var` maps for profiles, balances, transactions, notifications; add new API endpoints
- `App.tsx`: Replace localStorage-based state with backend API calls for users, transactions, notifications
- All components that receive member/transaction/notification data: update to use async backend data

### Remove
- `useLocalState` calls for `app_registered_users`, `app_transactions`, `app_notifications` (replace with backend calls)

## Implementation Plan
1. Rewrite `main.mo` with stable storage for all user data and comprehensive API surface
2. Regenerate `backend.d.ts` via generate_motoko_code
3. Update `App.tsx` to load/save data via backend instead of localStorage
4. Update `AdminPanel.tsx` to fetch members and transactions from backend
5. Keep `app_current_user` in localStorage only for session (login state), not for master data
