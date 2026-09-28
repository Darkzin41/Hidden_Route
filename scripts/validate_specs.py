from pathlib import Path
import re
import sys


root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
required = [
    root / "specs" / "README.md",
    root / "specs" / "system.md",
    root / "specs" / "testing.md",
    root / "specs" / "open-decisions.md",
    root / "specs" / "history.md",
    root / "specs" / "capabilities" / "core.md",
    root / "specs" / "changes" / "CHG-20260927-modernizacao-catalogo.md",
    root / "specs" / "changes" / "CHG-20260927-publicacao-segura.md",
    root / "specs" / "decisions" / "ADR-0001-workspace-local.md",
    root / "specs" / "decisions" / "ADR-0002-autenticacao-cookie.md",
    root / "specs" / "decisions" / "ADR-0003-publicacao-segura-github.md",
    root / "docs" / "state.md",
]

errors = []
for path in required:
    if not path.is_file():
        errors.append(f"arquivo obrigatório ausente: {path.relative_to(root)}")

capability = root / "specs" / "capabilities" / "core.md"
if capability.is_file():
    text = capability.read_text(encoding="utf-8")
    for field in ("id", "contract_status", "implementation_status", "last_verified", "last_verified_ref"):
        if not re.search(rf"(?m)^{field}:\s*\S+", text):
            errors.append(f"campo ausente em specs/capabilities/core.md: {field}")
    if re.search(r"(?m)^implementation_status:\s*in_progress\s*$", text):
        errors.append("a capacidade principal ainda está marcada como in_progress")

link_pattern = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
for markdown in (root / "specs").rglob("*.md"):
    text = markdown.read_text(encoding="utf-8")
    for target in link_pattern.findall(text):
        clean = target.split("#", 1)[0].strip()
        if not clean or clean.startswith(("http://", "https://", "mailto:")):
            continue
        destination = (markdown.parent / clean).resolve()
        if not destination.exists():
            errors.append(f"link local quebrado em {markdown.relative_to(root)}: {target}")

if errors:
    print("Falha na validação das specs:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print(f"Specs válidas: {len(required)} arquivos obrigatórios e links locais verificados.")
