# ChordSheetJS Architecture

This document provides a high-level overview of the ChordSheetJS architecture.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INPUT FORMATS                                   │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│   ChordPro      │  Chords Over Words  │         Ultimate Guitar             │
│                 │                     │                                     │
│  {title: ...}   │    Am       G       │   [Verse]                           │
│  [Am]lyrics     │  Lyrics here        │   Am              G                 │
│                 │                     │   Lyrics here                       │
└────────┬────────┴──────────┬──────────┴──────────────────┬──────────────────┘
         │                   │                             │
         ▼                   ▼                             ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────────────┐
│ ChordProParser  │ │ChordsOverWords- │ │       UltimateGuitarParser          │
│                 │ │     Parser      │ │                                     │
└────────┬────────┘ └────────┬────────┘ └──────────────────┬──────────────────┘
         │                   │                             │
         └───────────────────┼─────────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │      Song       │  ◄── Central data structure
                    │                 │
                    │  ┌───────────┐  │
                    │  │   Lines   │  │
                    │  │  ┌─────┐  │  │
                    │  │  │Items│  │  │
                    │  │  └─────┘  │  │
                    │  └───────────┘  │
                    │                 │
                    │  ┌───────────┐  │
                    │  │ Metadata  │  │
                    │  └───────────┘  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  TextFormatter  │ │ChordProFormatter│ │  HtmlFormatter  │ ...
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             OUTPUT FORMATS                                   │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│   Plain Text    │      ChordPro       │    HTML (div/table) / PDF           │
└─────────────────┴─────────────────────┴─────────────────────────────────────┘
```

## Core Components

### Song (`src/chord_sheet/song.ts`)

The central data structure representing a parsed chord sheet. Contains:

- **lines**: Array of `Line` objects
- **metadata**: Song metadata (title, artist, key, capo, etc.)
- **paragraphs**: Lines grouped into paragraphs (verses, choruses, etc.)

### Line (`src/chord_sheet/line.ts`)

A single line in a song, containing an array of **items**:

| Item Type | Description | Example |
|-----------|-------------|---------|
| `ChordLyricsPair` | Chord + associated lyrics | `[Am]Hello` |
| `Tag` | ChordPro directive | `{title: My Song}` |
| `Comment` | Text comment | `{comment: Play softly}` |
| `SoftLineBreak` | Line continuation | `\ ` |

### Chord (`src/chord.ts`)

Represents a musical chord with parsing and manipulation:

```
   Chord: "Cmaj7/G"
   ┌──────────────────────────────────┐
   │  root: C                         │
   │  modifier: maj                   │
   │  suffix: 7                       │
   │  bass: G                         │
   └──────────────────────────────────┘
```

Key operations:
- `transpose(delta)` - Transpose up/down by semitones
- `toChordSymbol()` - Convert to chord symbol notation
- `normalize()` - Normalize chord representation

### Key (`src/key.ts`)

Represents a musical key, used for transposition and key changes.

## Parsers (`src/parser/`)

All parsers use [Peggy](https://peggyjs.org/) (PEG parser generator) to parse input:

```
Input String → Peggy Grammar → AST → ChordSheetSerializer → Song
```

| Parser | Input Format | Grammar Location |
|--------|--------------|------------------|
| `ChordProParser` | ChordPro format | `src/parser/chord_pro/grammar.pegjs` |
| `ChordsOverWordsParser` | Chords above lyrics | `src/parser/chords_over_words/grammar.pegjs` |
| `UltimateGuitarParser` | Ultimate Guitar tabs | `src/parser/ultimate_guitar/grammar.pegjs` |

**Note**: The `peg_parser.ts` files are **generated** - edit the `.pegjs` grammar files instead.

## Formatters (`src/formatter/`)

Formatters convert a `Song` back to a specific output format:

```
                    ┌─────────────┐
                    │  Formatter  │  (base class)
                    └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│TextFormatter│    │HtmlFormatter│    │ PdfFormatter│
└─────────────┘    └──────┬──────┘    └─────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
      ┌─────────────┐         ┌─────────────┐
      │HtmlDivFormat│         │HtmlTableFmt │
      └─────────────┘         └─────────────┘
```

All formatters accept a **configuration** object for customization (see `src/formatter/configuration/`).

## ChordPro Directives (Tags)

ChordPro uses directives (tags) for metadata and structure:

```
{title: My Song}           # Metadata
{key: C}                   # Song key
{capo: 2}                  # Capo position
{start_of_chorus}          # Section marker
{chorus}                   # Reference to chorus
```

Tags are defined in `src/chord_sheet/tags.ts` and interpreted by `src/chord_sheet/tag.ts`.

## Directory Structure

```
src/
├── chord.ts                 # Chord class
├── key.ts                   # Key class
├── index.ts                 # Public API exports
│
├── chord_sheet/             # Core data structures
│   ├── song.ts              # Song class
│   ├── line.ts              # Line class
│   ├── chord_lyrics_pair.ts # Chord + lyrics
│   ├── tag.ts               # ChordPro directive
│   ├── metadata.ts          # Song metadata
│   └── chord_pro/           # ChordPro-specific items
│       ├── ternary.ts       # Ternary expressions
│       └── literal.ts       # Literal values
│
├── parser/                  # Input parsers
│   ├── chord_pro/           # ChordPro parser + grammar
│   ├── chords_over_words/   # Chords-over-words parser
│   ├── ultimate_guitar/     # Ultimate Guitar parser
│   └── chord/               # Chord string parser
│
├── formatter/               # Output formatters
│   ├── formatter.ts         # Base class
│   ├── text_formatter.ts
│   ├── chord_pro_formatter.ts
│   ├── html_formatter.ts
│   ├── html_div_formatter.ts
│   ├── html_table_formatter.ts
│   ├── pdf_formatter.ts
│   └── configuration/       # Formatter settings
│
└── layout/                  # PDF layout engine
    ├── engine/              # Layout calculation
    └── measurement/         # Text measurement (DOM, Canvas, jsPDF)
```

## Common Operations

### Parse and format a chord sheet

```typescript
import { ChordProParser, TextFormatter } from 'chordsheetjs';

const parser = new ChordProParser();
const song = parser.parse(chordProString);

const formatter = new TextFormatter();
const output = formatter.format(song);
```

### Transpose a song

```typescript
const transposedSong = song.transpose(2);  // Up 2 semitones
```

### Change key

```typescript
const newSong = song.changeKey('G');  // Transpose to key of G
```

### Access metadata

```typescript
song.title;    // "My Song"
song.artist;   // "Artist Name"
song.key;      // Key object
song.capo;     // "2"
```

## Glossary

| Term | Description |
|------|-------------|
| **Chord sheet** | A document with song lyrics and chord annotations |
| **ChordPro** | A standard format for chord sheets using `{directives}` and `[chords]` |
| **Transpose** | Shift all chords up or down by a number of semitones |
| **Capo** | A clamp on the guitar neck that raises the pitch |
| **Key** | The tonal center of a song (e.g., C major, A minor) |
| **Directive** | A ChordPro instruction in curly braces: `{title: ...}` |
