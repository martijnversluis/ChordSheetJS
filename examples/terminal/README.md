# Experimental terminal layout and OpenTUI viewer

From the repository root:

```sh
yarn build:release
node script/check_terminal_runtime.mjs
yarn tsx script/check_terminal_runtime.mjs --source
cd examples/terminal
bun install
bun test
bun run index.ts --smoke
bun run index.ts --list-songs
bun run index.ts                         # Kingdom (default)
bun run index.ts --song fit-columns
bun run index.ts --song firm-foundation
bun run index.ts --song kingdom --scroll  # optional legacy scrolling mode
```

The interactive viewer reuses three longer Playground ChordPro fixtures: **Kingdom**,
**Firm Foundation (He Won't)**, and **Fit Content to Columns**. These charts exercise
real lyric/chord wrapping, pagination, columns, semantic rhythm tokens, and long-song
navigation. Use `--list-songs` for their stable CLI slugs. The synthetic 24-line song is
retained only by `--smoke`, keeping that automation deterministic.

OpenTUI 0.5.11 is **example-local**, not a production library dependency. Requires
Bun >=1.3.0; tested with Bun 1.3.10 using the actual native headless renderer.
The example imports freshly built release output. Root runtime remains Node >=16,
ESM/CommonJS-compatible, DOM-free and Bun-free. Do not use unsupported Node native
FFI execution for this OpenTUI version.

## Library usage

```ts
const formatter = new TerminalFormatter({
  width: 80,
  height: 24,
  layout: {
    global: {
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
      pageSpacing: 1,
    },
    header: { height: 1, text: '{title}', align: 'center' },
    footer: { height: 1, text: '{page}/{pages}', align: 'right' },
    sections: {
      global: { columnCount: 2, columnSpacing: 3 },
      base: { display: { showLabel: true, repeatedSections: 'full' } },
    },
  },
  styles: { chord: { foreground: '#00ffff', bold: true } },
});
const document = formatter.format(song);
const resized = formatter.format(song, { width: 100, height: 30 });
```

Per-call overrides do not mutate the formatter's configuration. `configure()` still
updates persistent options. Formatting preserves source song content and musical
line context. Default `new TerminalFormatter()` remains an 80-cell single-column,
unbounded scroll document with no title, header, footer or margins.

## Configuration compatibility

The preferred schema mirrors measurement-based organization, but all geometry is in
integer cells. `width`/`height` remain top-level dynamic viewport inputs; `cellWidth`
and `styles` remain terminal-specific. There are no font sizes, diagrams, section-type
overrides, or arbitrary measurement-based layout content items.

Legacy flat inputs are accepted by the constructor, `configure()`, and `format()`
overrides. They are normalized before merging; nested leaves win within the same input.
Stored `formatter.configuration` and defaults contain only the canonical nested form.
`showLabels` maps to `showLabel`, `uppercaseLabels` to `labelStyle: 'uppercase'` (false
clears it), and repeat `preserve`/`title-only`/`lyrics-only` map to
`full`/`title_only`/`lyrics_only`. Legacy `pageSpacing` maps to `layout.global.pageSpacing`.
Blocks retain terminal fixed `height`/`text` and `{metadata}` templates, not PDF/HTML
`content` arrays, font settings, `%{metadata}` syntax or auto heights.

## Configuration matrix

| Options | Terminal behavior |
| --- | --- |
| `width=80`, optional `height` | Whole page dimensions in positive integer cells. Omitted height is the only unbounded representation. |
| optional `layout.sections.global.columnCount`, `layout.sections.global.columnSpacing=0` | Default effective count is one. Multiple columns require finite height. Explicit count wins. |
| optional `layout.sections.global.minColumnWidth`, `layout.sections.global.maxColumnWidth` | Validate explicit counts; otherwise choose the fewest columns needed by the maximum while respecting the minimum, keeping responsive columns as wide as possible. If a narrow viewport cannot satisfy both, readability wins: use fewer columns and allow the preferred maximum to be exceeded. |
| `layout.global.margins={top:0,right:0,bottom:0,left:0}` | Reserve whole-page cell margins. Empty content frames throw. |
| `layout.sections.global.chordSpacing=1` | Inter-chord measured space advances, using the selected cell-width policy. |
| `layout.sections.global.chordLyricSpacing=0` | Empty rows between the upper tokens and lyrics of a mixed visual line. |
| `layout.sections.global.linePadding=0` | Trailing rows after each atomic visual line; does not move lyrics within that line. Preserved at document end for rendered content; fully filtered/nonvisual lines receive no padding. |
| `layout.sections.global.paragraphSpacing=1` | Pending inter-paragraph rows only. Suppressed at column tops; never creates a trailing page. |
| `layout.global.pageSpacing=1` | Gaps in the stacked compatibility projection, not part of page geometry. |
| `layout.sections.base.display.showLabel=true`, optional `labelStyle:'uppercase'` | Visibility/case applied before measurement and wrapping. Comments remain literal; bracket annotations are measured upper-row annotation tokens. |
| `layout.sections.base.display.lyricsOnly=false` | Existing engine lyric-only processing, including hyphen joining. Use `layout.sections.base.display.showLabel:false` to also suppress labels. |
| `layout.sections.base.display.repeatedSections='full'` | Alternatives `hide`, `title_only`, `lyrics_only` affect subsequent occurrences of the same trimmed, case-insensitive label. No cached body replay. Each occurrence retains its own body. |
| `normalizeChords`, `normalizeChordSuffix`, `useUnicodeModifiers`, `decapo` | Existing musical helper semantics. Decapo applies the existing negative-capo shift, not positive transpose. |
| `key` | A target `Key` (e.g. `Key.parse('D')`) goes through chord measurement and painting once. Existing song/line keys, transpose context, and symbol/solfege/numeral/number notation remain supported. |
| `expandChorusDirective=false` | Existing source chorus expansion before repeat policy and layout. Occurrence identifiers distinguish recalled sections. |
| optional `layout.header`, `layout.footer` | Fixed-height semantic text reservations, described below. Footer requires finite height. |
| `styles={}` | Renderer-neutral foreground/background/bold/dim/italic/underline overrides keyed by semantic style role; never changes metrics. |
| optional `cellWidth` | Inject a host width policy, e.g. `Bun.stringWidth`. |

Geometry uses uniform
`floor((contentWidth - (columnCount - 1) * columnSpacing) / columnCount)`
widths. Unused remainder cells stay on the right. Resolved geometry is emitted and
used for measurement, placement, metadata and clipping—not independently guessed
by the adapter.

### Fixed-height metadata blocks

`header`/`footer` require `height` (nonnegative integer) and `text`. Text may contain
`{title}`, `{artist}`, other metadata keys, final `{page}`/`{pages}` substitutions,
and `{rule}` for a viewport-width ASCII-dot divider. Unknown keys become empty strings.
`metadata.separator` joins multi-valued metadata;
`metadata.additionalMetadataDirectives` enables custom fields. Existing metadata
expression/provider behavior is reused, not a general JavaScript template engine.

Optional `align` is `left` (default), `center`, or `right`; `overflow` is `wrap`
(default, grapheme/cell wrapping) or `clip` (first row only). Content is limited to the
reserved height and content width. LF/CRLF provides explicit block line breaks.
`condition` is `all` (default), `first`, `last`, or `not-first`. Hidden blocks still
reserve height; page totals therefore require no circular relayout. Body spans have
columns; header/footer spans intentionally do not. Blocks are absent unless enabled.

## Placement and output contract

`LayoutEngine.computePositionedLayout` is an opt-in path, independent of legacy
PDF/Measured HTML pagination. It measures unpaginated source paragraphs, keeps a
paragraph/explicit-break segment together when it fits an empty column, and otherwise
splits between atomic visual lines. Mixed chord/lyric lines never split vertically
across columns. A finite content frame shorter than any atomic visual line **throws**.

Explicit leading, consecutive, mixed-line, and trailing column breaks each advance
once in finite mode, including empty destination pages. Repeat visibility policies never remove these controls.
In default unbounded mode,
column breaks remain ignored for backwards compatibility. Unsupported literal/body
content yields `unsupported-content` diagnostics instead of implied delegate support.

`TerminalDocument` contains:

- `width`, `height`: width and total height of the stacked compatibility projection.
- `geometry`: effective column count/width/gap and content bounds (`contentHeight:null`
  in unbounded mode).
- `pages`: 1-based page indices, full page dimensions, 1-based column rectangles with
  `usedHeight`, and page-local rows.
- `rows`: mechanically derived page-stacked rows, including all columns and page gaps.
- `diagnostics`: unsupported-content and horizontal-overflow records.

Coordinates are 0-based integer cells. Spans' `x` and page rows' `y` are page-local;
column-local x is `span.x - column.x`. Rows at the same y merge columns, sorted by x.
Body spans include `column`, `source.paragraph` (0-based occurrence), and `source.line`
(original line within that occurrence, **not** a wrapped-row/grapheme index).
Spans preserve token kind, variant and style role, actual painted cell width, and
optional semantic styles. Empty input has one page; default compatibility rows remain
empty. Output has no mutable Song/Line/item references and is JSON-serializable.

## OpenTUI behavior

The default viewer is a page turner: it keeps one persistent viewport shell and mounts
exactly one `TerminalDocument.pages` entry at a time. Left/up/PageUp/`k` move backward;
right/down/PageDown/space/`j` move forward; Home/End jump to the first/last page.
`+`/`-` transpose, and `q`/Ctrl-C exit. Page navigation clamps at document boundaries.

Its example formatter renders available artist information below the title, followed
by one line of available key/BPM/time/capo metadata, a full-width ASCII-dot divider,
and a blank row before the chart. It reserves a one-row top/bottom margin and three
cells on each side, with four cells between columns. It uses a responsive 32–52-cell column-width
band: a narrow viewport gets one readable column, then wider viewports add only as many
columns as needed. Resize recomputes page and column geometry from the actual viewport width and
height, then relocates the old page's first source occurrence/line when possible. Each
body column has its own clipping box; OpenTUI never independently wraps semantic spans.
Impossible transient geometry displays an error in the same shell and recovers on the
next valid resize. Transposition uses the existing Song transposition semantics.

`--scroll` retains the earlier stacked-page `ScrollBoxRenderable` demonstration. In that
mode native arrows/mouse scroll, `j`/`k` move one row, and resize preserves the first
visible source anchor plus viewport offset when resolvable.

The theme distinguishes chords, lyrics, comments, labels, rhythm, no-chord,
instructions, annotations and page blocks. `styleRole` overrides kind (e.g. mute `x`
is noChord style). Document style overrides take precedence over the theme.

## Width policy and explicit deferrals

Default width uses string-width **4.2.3** (CommonJS, Node >=8) and Graphemer **1.4.0**,
with normalized CommonJS/ESM interop. CJK, combining accents and emoji are supported
according to those packages' Unicode tables, not every terminal's newest or ambiguous
width conventions. Wrapping is lossless and grapheme-safe, not word-based. The optional
measurer reconstruction contract leaves existing HTML/PDF word-joining unchanged.

Indivisible horizontal glyph/chord overflow and existing engine soft-break choices
can exceed a column. Widths remain truthful; diagnostics report the overflow and
adapters clip it. Text controls/ANSI/tabs are rejected, never executed. Comments and
labels are plain text, not HTML/Pango execution.

Deferred: migration of legacy pagination; auto-height headers; arbitrary expressions
or metadata predicates in block conditions; arbitrary section geometry/indentation;
font inheritance, proportional metrics, superscripts, glyph probing; diagrams, images,
grids, ABC/tab/LilyPond/SVG rendering, CSS and general delegates; cached-body replay;
precise grapheme-offset anchoring. Inherited base options are not promises of full PDF
parity: metadata ordering is not an automatic metadata list, and body `evaluate`,
directive normalization, user/instrument settings and delegates are not a separate
terminal rendering pipeline. User/instrument metadata providers can participate in
explicit block templates through existing metadata APIs.
