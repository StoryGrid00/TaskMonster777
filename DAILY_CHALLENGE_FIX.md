# Daily Challenge Bug Fix

## Issue
Daily challenges were being marked as complete prematurely. For example, a challenge stating "Complete 2 tasks" would be marked complete after only completing 1 task.

## Root Cause
The `generateDailyChallenge()` function was hardcoding the `target` property to `1` for all challenges, regardless of what the challenge description specified.

```javascript
// BEFORE (BUGGY CODE)
gameState.dailyChallenge = {
    id: 'daily_' + challengeIndex,
    name: 'Daily Challenge',
    desc: DAILY_CHALLENGES[challengeIndex],
    target: 1,  // ❌ Always set to 1
    progress: 0,
    reward: 50,
    color: CARD_COLORS[cardColorIndex]
};
```

## Solution
Created a new `parseChallengeTarget()` function that intelligently extracts the target number from the challenge description text.

### New Function: `parseChallengeTarget()`
This function:
1. Parses the challenge description to find numeric targets
2. Matches patterns like "Complete 3", "Finish 2", "Reach 5", etc.
3. Handles special cases like XP challenges (where the number represents XP amount, not task count)
4. Defaults to 1 for challenges without specific numbers

```javascript
// AFTER (FIXED CODE)
const challengeDesc = DAILY_CHALLENGES[challengeIndex];
gameState.dailyChallenge = {
    id: 'daily_' + challengeIndex,
    name: 'Daily Challenge',
    desc: challengeDesc,
    target: parseChallengeTarget(challengeDesc),  // ✅ Dynamically parsed
    progress: 0,
    reward: 50,
    color: CARD_COLORS[cardColorIndex]
};
```

## Examples of Fixed Challenges

| Challenge Description | Old Target | New Target | Status |
|----------------------|------------|------------|---------|
| "Complete 3 work tasks today" | 1 ❌ | 3 ✅ | Fixed |
| "Complete 2 personal tasks" | 1 ❌ | 2 ✅ | Fixed |
| "Complete 4 quick tasks today" | 1 ❌ | 4 ✅ | Fixed |
| "Reach 5 completed tasks today" | 1 ❌ | 5 ✅ | Fixed |
| "Reach a 2-day streak!" | 1 ❌ | 2 ✅ | Fixed |
| "Add 2 new tasks for tomorrow" | 1 ❌ | 2 ✅ | Fixed |
| "Earn 50 XP today" | 1 ✅ | 1 ✅ | Correct (XP challenges) |
| "Check off one high-priority task" | 1 ✅ | 1 ✅ | Already correct |

## Testing
All 24 test cases passed, covering:
- Multi-task challenges
- Streak challenges  
- XP/point-based challenges
- Single-task challenges
- Complex descriptions with multiple numbers

## Files Modified
- `index.html` (lines 5366-5487)
  - Added `parseChallengeTarget()` function
  - Updated `generateDailyChallenge()` to use dynamic target parsing

## Impact
- ✅ Daily challenges now require the correct number of completions
- ✅ Challenge progress tracking remains accurate
- ✅ No breaking changes to existing functionality
- ✅ Backwards compatible with saved game states

