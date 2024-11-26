# ChordSheetJS [![Code Climate](https://codeclimate.com/github/martijnversluis/ChordSheetJS/badges/gpa.svg)](https://codeclimate.com/github/martijnversluis/ChordSheetJS) [![CI](https://github.com/martijnversluis/ChordSheetJS/actions/workflows/ci.yml/badge.svg)](https://github.com/martijnversluis/ChordSheetJS/actions/workflows/ci.yml?query=branch%3Amaster) [![Release](https://github.com/martijnversluis/ChordSheetJS/actions/workflows/release.yml/badge.svg)](https://github.com/martijnversluis/ChordSheetJS/actions/workflows/release.yml)

A JavaScript library for parsing and formatting chord sheets

**Contents**

- [Installation](#installation)
- [How to ...?](#how-to-)
- [Supported ChordPro directives](#supported-chordpro-directives)
- [API docs](#api-docs)
- [Contributing](CONTRIBUTING.md)

## Installation

### Package managers

`ChordSheetJS` is on npm, to install run:

```bash
npm install chordsheetjs
```

Load with `import`:

```javascript
import ChordSheetJS from 'chordsheetjs';
```

or `require()`:

```javascript
var ChordSheetJS = require('chordsheetjs').default;
```

### Standalone bundle file

If you're not using a build tool, you can download and use the `bundle.js` from the
[latest release](https://github.com/martijnversluis/ChordSheetJS/releases/latest):

```html
<script src="bundle.js"></script>
<script>
// ChordSheetJS is available in global namespace now
const parser = new ChordSheetJS.ChordProParser();
</script>
```

## How to ...?

### Parse chord sheet

#### Regular chord sheets

```javascript
const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

const parser = new ChordSheetJS.ChordsOverWordsParser();
const song = parser.parse(chordSheet);
```

#### Ultimate Guitar chord sheets

```javascript
const chordSheet = `
[Chorus]
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

const parser = new ChordSheetJS.UltimateGuitarParser();
const song = parser.parse(chordSheet);
```

#### Chord pro format

```javascript
const chordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}

{start_of_chorus: Chorus}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]
{end_of_chorus}`.substring(1);

const parser = new ChordSheetJS.ChordProParser();
const song = parser.parse(chordSheet);
```

### Display a parsed sheet

#### Plain text format

```javascript
const formatter = new ChordSheetJS.TextFormatter();
const disp = formatter.format(song);
```

#### HTML format

##### Table-based layout

```javascript
const formatter = new ChordSheetJS.HtmlTableFormatter();
const disp = formatter.format(song);
```

##### Div-based layout

```javascript
const formatter = new ChordSheetJS.HtmlDivFormatter();
const disp = formatter.format(song);
```

#### Chord pro format

```javascript
const formatter = new ChordSheetJS.ChordProFormatter();
const disp = formatter.format(song);
```

### Serialize/deserialize

Chord sheets (`Song`s) can be serialized to plain JavaScript objects, which can be converted to JSON, XML etc by
third-party libraries. The serialized object can also be deserialized back into a `Song`.

```javascript
const serializedSong = new ChordSheetSerializer().serialize(song);
const deserialized = new ChordSheetSerializer().deserialize(serializedSong);
```

### Add styling

The HTML formatters (HtmlTableFormatter and HtmlDivFormatter) can provide basic CSS to help with styling the output:

```javascript
HtmlTableFormatter.cssString();
// .paragraph {
//   margin-bottom: 1em;
// }

HtmlTableFormatter.cssString('.chordSheetViewer');
// .chordSheetViewer .paragraph {
//   margin-bottom: 1em;
// }

HtmlTableFormatter.cssObject();
// '.paragraph': {
//   marginBottom: '1em'
// }
```

### Parsing and modifying chords

```javascript
import { Chord } from 'chordsheetjs';
```

#### Parse

```javascript
const chord = Chord.parse('Ebsus4/Bb');
```

Parse numeric chords (Nashville system):

```javascript
const chord = Chord.parse('b1sus4/#3');
```

#### Display with #toString

Use #toString() to convert the chord to a chord string (eg Dsus/F#)

```javascript
const chord = Chord.parse('Ebsus4/Bb');
chord.toString(); // --> "Ebsus4/Bb"
```

#### Clone

```javascript
var chord2 = chord.clone();
```

#### Normalize

Normalizes keys B#, E#, Cb and Fb to C, F, B and E

```javascript
const chord = Chord.parse('E#/B#');
normalizedChord = chord.normalize();
normalizedChord.toString(); // --> "F/C"
```

#### ~~Switch modifier~~

***Deprecated***

Convert # to b and vice versa

```javascript
const chord = parseChord('Eb/Bb');
const chord2 = chord.switchModifier();
chord2.toString(); // --> "D#/A#"
```

#### Use specific modifier

Set the chord to a specific modifier (# or b)

```javascript
const chord = Chord.parse('Eb/Bb');
const chord2 = chord.useModifier('#');
chord2.toString(); // --> "D#/A#"
```

```javascript
const chord = Chord.parse('Eb/Bb');
const chord2 = chord.useModifier('b');
chord2.toString(); // --> "Eb/Bb"
```

#### Transpose up

```javascript
const chord = Chord.parse('Eb/Bb');
const chord2 = chord.transposeUp();
chord2.toString(); // -> "E/B"
```

#### Transpose down

```javascript
const chord = Chord.parse('Eb/Bb');
const chord2 = chord.transposeDown();
chord2.toString(); // -> "D/A"
```

#### Transpose

```javascript
const chord = Chord.parse('C/E');
const chord2 = chord.transpose(4);
chord2.toString(); // -> "E/G#"
```

```javascript
const chord = Chord.parse('C/E');
const chord2 = chord.transpose(-4);
chord2.toString(); // -> "Ab/C"
```

#### Convert numeric chord to chord symbol

```javascript
const numericChord = Chord.parse('2/4');
const chordSymbol = numericChord.toChordSymbol('E');
chordSymbol.toString(); // -> "F#/A"
```

## Supported ChordPro directives

All directives are parsed and are added to `Song.metadata`. The list below indicates whether formatters actually
use those to change the generated output.

:heavy_check_mark: = supported

:clock2: = will be supported in a future version

:heavy_multiplication_x: = currently no plans to support it in the near future

### Meta-data directives

| Directive        | Support            |
|:---------------- |:------------------:|
| title (short: t) | :heavy_check_mark: |
| subtitle         | :heavy_check_mark: |
| artist           | :heavy_check_mark: |
| composer         | :heavy_check_mark: |
| lyricist         | :heavy_check_mark: |
| copyright        | :heavy_check_mark: |
| album            | :heavy_check_mark: |
| year             | :heavy_check_mark: |
| key              | :heavy_check_mark: |
| time             | :heavy_check_mark: |
| tempo            | :heavy_check_mark: |
| duration         | :heavy_check_mark: |
| capo             | :heavy_check_mark: |
| meta             | :heavy_check_mark: |

### Formatting directives

| Directive                  | Support                  |
|:-------------------------- |:------------------------:|
| comment (short: c)         | :heavy_check_mark:       |
| comment_italic (short: ci) | :heavy_multiplication_x: |
| comment_box (short: cb)    | :heavy_multiplication_x: |
| chorus                     | :heavy_multiplication_x: |
| image                      | :heavy_multiplication_x: |

### Environment directives

| Directive                    | Support            |
|:---------------------------- |:------------------:|
| start_of_chorus (short: soc) | :heavy_check_mark: |
| end_of_chorus (short: eoc)   | :heavy_check_mark: |
| start_of_verse               | :heavy_check_mark: |
| end_of_verse                 | :heavy_check_mark: |
| start_of_tab (short: sot)    | :heavy_check_mark: |
| end_of_tab (short: eot)      | :heavy_check_mark: |
| start_of_grid                | :heavy_check_mark: |
| end_of_grid                  | :heavy_check_mark: |

### Chord diagrams

| Directive | Support            |
|:--------- |:------------------:|
| define    | :heavy_check_mark: |
| chord     | :heavy_check_mark: |

### Fonts, sizes and colours

| Directive   | Support                  |
|:----------- |:------------------------:|
| textfont    | :heavy_check_mark:       |
| textsize    | :heavy_check_mark:       |
| textcolour  | :heavy_check_mark:       |
| chordfont   | :heavy_check_mark:       |
| chordsize   | :heavy_check_mark:       |
| chordcolour | :heavy_check_mark:       |
| tabfont     | :heavy_multiplication_x: |
| tabsize     | :heavy_multiplication_x: |
| tabcolour   | :heavy_multiplication_x: |

### Output related directives

| Directive                      | Support                  |
|:------------------------------ |:------------------------:|
| new_page (short: np)           | :heavy_multiplication_x: |
| new_physical_page (short: npp) | :heavy_multiplication_x: |
| column_break (short: cb)       | :heavy_multiplication_x: |
| grid (short: g)                | :heavy_multiplication_x: |
| no_grid (short: ng)            | :heavy_multiplication_x: |
| titles                         | :heavy_multiplication_x: |
| columns (short: col)           | :heavy_multiplication_x: |

### Custom extensions

| Directive | Support            |
|:--------- |:------------------:|
| x_        | :heavy_check_mark: |

## API docs

Note: all classes, methods and constants that are documented here can be considered public API and will only be
subject to breaking changes between major versions.
