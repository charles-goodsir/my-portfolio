# Grading report: Halden & Moss LLP, level 1

**Assessor:** Charles Goodsir
**Scope:** access control and incident handling, 1 Jan to 30 Sep 2026
**Submission graded:** my five findings (F-01 to F-05)

## Grade: B (about 70%)

Four of five planted gaps found, three rated correctly. The main weaknesses were one missed finding, one rating too low, and one slot spent on an item that was not a planted gap.

## Results by planted item

| # | Planted item | Your finding | Result | Rating |
|---|---|---|---|---|
| 1 | Leavers still enabled (3 of 16 accounts) | F-04 | Caught. Found g.barros and k.shah signing in after leaving. Missed l.okoro (left 11 Sep, still enabled). | High, correct |
| 2 | MFA off for 4 accounts (3 partners + office-admin) | F-03 | Caught, but "What to do" was blank and "Why it matters" was written as a fix. | Medium, **too low** (should be High) |
| 3 | Shared login (office-admin) | none | **Missed as a finding.** Spotted in notes, not in the five. | Should be Medium to High |
| 4 | INC-03 not assessed | F-05 | Caught, but anchored on a signed deletion confirmation the procedure does not require. Missed the real gap: no partner decision on ICO reporting within 72 hours (step 3), no cause recorded (step 4). | High, correct |
| 5 | Incident contact has left | F-01 | Caught. Cross-checked the procedure against the interview and user list. Did not note that Priya's account (k.shah) is still enabled. | Medium, correct |

## Done well
- Cross-file check on the incident contact (F-01), the item most often missed.
- Noticed that the procedure has the partners deciding on breaches, but the interview says they only see a yearly summary.
- Recognised INC-02 (lost phone: wipe within 2 hours, PIN set, cause recorded, risk assessed) as good practice and as the contrast to INC-03.
- Asked sensible follow-ups about the contractor and about backups.

## What to improve
1. **Quote the policy line.** F-02 and F-05 relied on standards ("zero trust", signed deletion confirmation) that the data room does not contain.
2. **Count the evidence.** Findings should say "3 of 16" or "4 of 16" and name the file. Counting rows would have found l.okoro.
3. **Spend findings where the evidence is strongest.** F-02 (contractor) was a fair observation, not a planted gap, and cost the shared-login finding. The "no contract" detail also came from the client in chat, not from the data room.
4. **Complete every line.** F-03 left "What to do" blank.
5. **Link related controls.** The shared login also has no MFA; strong answers keep these as two separate findings.

## Not tested from the evidence
Policy rule 4 (client file access limited to staff on that client) cannot be tested from the data room. Noting this and asking for evidence is the right response.

## Observations, not gaps
Reliance on a single Friday contractor is reasonable at 15 staff but a dependency. Backups are unconfirmed ("I believe it's all fine"), though out of scope at this level.
