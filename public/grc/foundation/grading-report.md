# Ashgrove Dental (level 2): grading and feedback

Submission graded: my 7 findings and 1 can't-test note.

## Summary
- **Planted gaps caught: 7 of 8.** Missed: INC-04 (incident procedure step 3).
- **Ratings:** 5 of 7 within one step of the key; 2 rated too low (PatientPing, incident reviews).
- **False traps avoided:** password length, DPO role, backups, training/privacy notice.
- **Can't test:** C-10 handled correctly (not a gap, evidence requested).
- **Slots:** only 7 findings submitted; the deliverable is exactly 8.

## Item-by-item

| # | Planted gap | Result | Rating (yours / key) |
|---|---|---|---|
| 1 | Leavers still enabled (access rule 3): 5 of 30, 3 signed in after leaving | Caught | 9 / 9 |
| 2 | MFA off (access rule 2): 8 of 30, INC-05 linked | Caught | 9 / 9 |
| 3 | Shared logins without approval (access rule 1): 2 of 3 | Caught | 4 / 6 (same band) |
| 4 | Access review overdue (access rule 4): due 2026-08-20, none filed | Caught | 6 / 4 (same band) |
| 5 | INC-04 not assessed (incident step 3) | **Missed** | n/a / 9 |
| 6 | Incident reviews missing (incident step 4): 2 of 5 | Caught, **rated too low** | 2 / 6 |
| 7 | PatientPing, no DPA (supplier rule 1): 5 of 6 have DPAs | Caught, **rated too low** | 2 / 6 to 9 |
| 8 | ScanVault review overdue (supplier rule 2): 1 of 4 critical | Caught | 6 / 4 to 6 |

## What you missed
**INC-04.** On 2026-07-23 a receptionist emailed tomorrow's appointment list (patient names and treatments) to the wrong patient. The only action was a phone call asking them to delete it. No ICO or patient decision was recorded, and no review followed. The interview note says "we didn't want to alarm anyone". This breaks incident procedure step 3 (decision within 72 hours, recorded in the log). Rating: Likelihood 3 x Impact 3 = High (9).

How it slipped through: C-03 was marked "meets" because 3 of 5 incidents had a decision logged. The rule is conditional ("if patient data may be affected"). The right test is per incident: does the condition apply, and if so, is a decision recorded? INC-03 and INC-04 are the two without one. INC-04 also supports finding 6, but it needs its own finding with its own evidence.

## Where findings need work
- **Counts:** F-04 says "3/30 … another 3/30". The count is 5 of 30 leavers enabled, 3 of those 5 signed in afterwards. Day counts are right but run to 2026-10-22, not the 2026-10-14 export.
- **F-03:** `x-ray-pc` should be `xray-pc`. Add "4 of 6 dentists" and explain why all 8 accounts can open patient records.
- **F-05 and F-06:** quantify the overdue time. Review due 2026-08-20, no review filed by 30 Sep (41 days). ScanVault due 2025-11-05, about 11 months overdue at 30 Sep 2026.
- **F-07 impact:** the stronger point is accountability: with a shared login you can't tell who opened which record.
- **F-08 rating:** the Low rating rests on "online companies usually have standard terms". That is an outside assumption, and the policy requires a written DPA before data is shared. PatientPing holds patient names and mobile numbers and was "Never" reviewed. Medium to High.
- **F-09 rating:** Low (2) is too low. Incidents are going unreviewed now (likelihood 3). Medium (6). The title is also confusing: it should say the review and cause are missing for 2 of 5.
- **Missing Cause lines:** F-03, F-05, F-06, F-07 and F-09 have no Cause line. The five-C format needs one.

## Errors in the notes
- The notes say "ICO was notified" for INC-01, 02 and 05. It wasn't. The decision in each case was that no notification was needed, and nothing was sent.
- **C-13** marked "gap". This double-counts ScanVault, since that is the overdue-review gap (finding 8). The rule is about keeping the register updated.
- **C-03** marked "meets" (see above).

## Done well
- Quoted the policy rule in every finding, and used counts ("8/30", "2 of 3", "5/6").
- Correctly marked C-09 (password length 10 and lockout after 5) as "meets" and did not spend a slot on it.
- Linked INC-05 to the MFA finding and kept it inside that finding.
- Noticed that a timely access review would likely have caught the leavers.
- Dropped the weak C-01 candidate rather than padding.
- Logged the C-10 request as "can't test" and did not treat it as a gap. Next time also ask for the clinic permission settings, as well as the logs.
- Evidence log notes reliability (for example, supplier start dates come from the practice manager's own records).

## Things the key credits that were not mentioned
- INC-01, 02 and 05 followed the procedure (reviewed within 5 working days, cause and decision recorded).
- DentaCloud and Microsoft have DPAs and were reviewed within 12 months.
- MFA is on for 22 of 30 accounts, including all management and the IT contractor.

## For next time
1. When a rule is conditional, test the condition for every item, then check the outcome. Don't count entries.
2. Use the eight slots. If you have seven strong findings, go back through the "meets" rows before you submit.
3. Rate with the scale, and check that a finding's rating matches its own wording ("it's already happening" is a 3 for likelihood).
4. Give every finding a Cause line.
5. Check any claim in your notes against the source before it goes into a finding.
