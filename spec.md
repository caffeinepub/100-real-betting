# 100%Real Betting

## Current State
App has: Dashboard with sports betting markets, Bet Slip, My Bets, Admin Panel, Account Summary.
Header has branding 'WinSport', nav links, login, deposit button.

## Requested Changes (Diff)

### Add
- Rebrand to '100%Real' with updated header logo/name
- Casino Games lobby page with sections: Slots (JILI, JDB), Live Casino, Crash Games, Fishing Games, Poker/Card Games
- Member Signup/Registration modal with form: name, phone, username, password, referral code (optional)
- Deposit modal with payment methods: JazzCash, Easypaisa, Bank Transfer — each with account details and amount input
- Withdrawal modal with same payment methods — enter amount + account number/IBAN
- Nav link for Casino Games
- Games page with game cards showing provider name (JILI/JDB), game name, thumbnail, Play button

### Modify
- Header branding from 'WinSport' to '100%Real'
- Header buttons: Login, Sign Up (opens signup modal), Deposit (opens payment modal), Withdraw (opens payment modal)
- App.tsx to add Casino page routing

### Remove
- Nothing

## Implementation Plan
1. Update Header branding to '100%Real'
2. Create SignupModal component with registration form
3. Create PaymentModal component with deposit/withdrawal tabs, three payment methods
4. Create CasinoGames page with game cards grid (JILI, JDB, Live, Crash, Fishing, Poker sections)
5. Wire all modals into header buttons
6. Add Casino nav item in App.tsx
