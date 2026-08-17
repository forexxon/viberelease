# Browser QA execution plan

This workflow executes the P0 diagnostic in real Chromium and Firefox using Playwright against a local static server.

It covers:
- all 9 predefined IDEA/STUCK/READYISH personas;
- critical-gate behavior;
- weakest-area ordering;
- multi-select max;
- restart/recalculation;
- required lead fields;
- authorization payload behavior;
- clipboard copy in Chromium;
- keyboard activation;
- 360px and 390px overflow checks.

A green workflow means automated browser QA passed for these checks. It still does not replace manual visual review, real completion-time measurement, or Telegram delivery testing.
