# 100%Real Betting

## Current State
The ReferralModal shows a member's referral count (how many friends joined via their code) and the PKR 200 welcome bonuses given to those friends. The 10% deposit bonus earned by the referrer on approved deposits from referred friends is tracked implicitly in transactions but not displayed anywhere on the member dashboard.

## Requested Changes (Diff)

### Add
- `totalReferralBonusEarned`: computed in App.tsx — sum of 10% of all approved deposit transactions made by users who joined using the current member's referral code
- Pass `totalReferralBonusEarned` as a prop to `ReferralModal`
- Referral Earnings Summary card in `ReferralModal` showing: friends joined count + total bonuses paid to the referrer

### Modify
- `ReferralModal` props: add `totalEarned: number`
- `ReferralModal` UI: replace or augment the existing count card with a 2-column stats row (Friends Joined | Total Earned by You)

### Remove
- Nothing removed

## Implementation Plan
1. In `App.tsx`: compute `referralBonusEarned` by finding all approved deposit transactions where the depositor's `referralCode === user.username`, then summing 10% of each
2. Pass `totalEarned={referralBonusEarned}` to `ReferralModal`
3. Update `ReferralModalProps` to include `totalEarned: number`
4. Update the stats card in `ReferralModal` to show a 2-stat row: left = friends joined, right = total PKR earned by referrer
