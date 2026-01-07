# Release checklist (multi-language)

- JS/TS (npm): `bun version <x.y.z> && bun publish`
- Python (PyPI): bump version in `pyproject.toml`; `pip install build && python -m build && twine upload dist/*`
- PHP (Packagist): tag release; `composer validate`; ensure Packagist webhook runs
- Ruby (RubyGems): bump in `aria_bridge.gemspec`; `gem build aria_bridge.gemspec && gem push aria_bridge-<ver>.gem`
- Rust (crates.io): set `publish = true` when ready; `cargo package && cargo publish`
- Go (module proxy): tag `vX.Y.Z`; verify with `go list -m github.com/shaneholloman/aria-bridge/go/ariabridge@latest`
- Swift (SPM): tag release; ensure `Package.swift` reachable at tag
- Java (Maven Central): configure staging; `mvn deploy -P release`

Pre-publish protocol validation:
`bun run sdk:php && bun run sdk:ruby && bun run sdk:rust && bun run sdk:swift && bun run sdk:java && bun run sdk:python && bun run sdk:go`
