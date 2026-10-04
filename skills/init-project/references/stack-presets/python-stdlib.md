# Stack preset: Python, standard library first

## Stack

- Python 3.12+; standard library preferred, dependencies justified one by one
- `venv` for the environment; `requirements.txt` (or `requirements-ci.txt` with hashes for CI tooling)
- `unittest` or `pytest` for tests; `ruff` for lint; `mypy` for types (settings in `mypy.ini`)

## Suggested commands

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/ruff check <pkg> tests
.venv/bin/mypy
python3 -m unittest discover -s tests -t .
```

## Layout hints

```
<pkg>/       # one module per concern; keep modules small
tests/       # harness + fixtures
docs/        # design doc, decisions
openspec/    # specs + changes
config/      # example config checked in; real config gitignored
```

## .gitignore keys

Common, Secrets, Python, OpenSpec working notes.

## Notes

- Warnings are errors in tests (`python3 -W error`) — an unclosed resource is a bug.
- No `# type: ignore` without a reason beside it; no lowering coverage gates.
- Live/paid integrations stay behind explicit opt-in flags defaulting to off; CI has no secrets.
