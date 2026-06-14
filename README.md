# Dokumentacja języka polskiego

Projekt strony z materiałami PDF do języka polskiego, budowanej przez MkDocs.

## Start lokalnie

```bash
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
./.venv/bin/mkdocs serve
```

Strona lokalna będzie dostępna pod adresem pokazywanym przez `mkdocs serve`, zwykle `http://127.0.0.1:8000/`.

## Build

```bash
./.venv/bin/mkdocs build
```

## Publikacja na GitHub Pages

```bash
./.venv/bin/mkdocs gh-deploy
```

## Struktura materiałów

- `docs/` - źródła strony
- `docs/gramatyka/` - dział gramatyczny
- `docs/gramatyka/zaimki/` - sekcja o zaimkach
- `docs/gramatyka/zaimki/pdf/` - pliki PDF widoczne z poziomu strony

---
