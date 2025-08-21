# Repository Guidelines

## Project Structure & Module Organization
- `modules/`: Surge rule modules (`.sgmodule`). Keep modules focused and composable, e.g., `base.sgmodule`, `splash.sgmodule`, `tracker.sgmodule`.
- `scripts/`: Optional helper scripts for fine‑tuning (e.g., request cleaners). Keep scripts stateless and easy to audit.
- `README.md`: Usage and setup. `CHANGELOG.md`: Human‑readable release notes.

Example layout:
```
modules/
  base.sgmodule
  splash.sgmodule
  tracker.sgmodule
scripts/
  cleaner.js
```

## Build, Test, and Development Commands
- No build step. Edit `.sgmodule` files directly and test in Surge.
- Local import in Surge: Module → + → Install from File/URL (use repo raw URL).
- Quick scan for risky wildcards locally (optional): `rg -n '\*\.' modules/*.sgmodule`

## Coding Style & Naming Conventions
- `.sgmodule` files: lowercase, concise purpose (e.g., `base.sgmodule`). Group rules by vendor/app and add brief comments for non‑obvious domains.
- Prefer precise domains over broad wildcards; one host per line; keep rewrites/maps minimal and documented.
- Scripts (`.js`): Node 18+, 2‑space indent, no external deps unless justified. Use clear names (e.g., `cleaner.js`, `rewrite-check.js`).

## Testing Guidelines
- Functional test: import the module in Surge, enable MitM only for necessary domains, restart target apps, and confirm reduced ads without feature breakage.
- Log review: Inspect Surge requests; if something breaks, whitelist and document rationale.
- Regressions: Avoid false positives; prefer opt‑in modules for aggressive rules.

## Commit & Pull Request Guidelines
- Commits use Conventional Commits:
  - `feat(rules): add xyz tracker domains`
  - `fix(rewrite): scope rule to api.example.com`
  - `docs: update usage notes`
- PRs should include: clear description, linked issues, what changed and why, test evidence (logs/screenshots), risk notes, and a `CHANGELOG.md` entry under Unreleased.

## Security & Configuration Tips
- Scope MitM to target domains; never enable global MitM.
- Prefer blocklists that minimize collateral damage; remove or comment rules that cause app breakage.
- Keep scripts transparent: no network exfiltration, minimal privileges, and clear comments for each action.

