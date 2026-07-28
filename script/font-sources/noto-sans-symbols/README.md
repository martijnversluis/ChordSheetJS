# Noto Sans Symbols source fonts

These static source faces are from the Noto Sans Symbols v2.003 release:

- Upstream: https://github.com/notofonts/symbols/releases/tag/NotoSansSymbols-v2.003
- Upstream commit: `b61fa7f86fb7d4163ee11d46d0977393f98d4f7a`
- License: SIL Open Font License 1.1 (see `src/formatter/pdf_formatter/fonts/ChordSheetSymbols.OFL.txt`)

SHA-256:

```text
NotoSansSymbols-Regular.ttf  aedeec1cd0514930aeeafc4a88a6deff83cda1e6b58086f0b9bb9c7dd0157578
NotoSansSymbols-Bold.ttf     5682f6c88d6199623edf026f67a8722697e8c5f409e5249477594e409d657eb0
```

Run `yarn fonts:build` after changing the generator or replacing these source faces.
The generated derivative is renamed to ChordSheet Symbols and remains under the OFL.
