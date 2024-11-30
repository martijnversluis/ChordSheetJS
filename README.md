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

<a name="readmemd"></a>

**chordsheetjs**

***

# chordsheetjs

## Classes

- [Chord](#classeschordmd)
- [ChordDefinition](#classeschorddefinitionmd)
- [ChordLyricsPair](#classeschordlyricspairmd)
- [ChordProFormatter](#classeschordproformattermd)
- [ChordProParser](#classeschordproparsermd)
- [ChordSheetParser](#classeschordsheetparsermd)
- [ChordSheetSerializer](#classeschordsheetserializermd)
- [ChordsOverWordsFormatter](#classeschordsoverwordsformattermd)
- [ChordsOverWordsParser](#classeschordsoverwordsparsermd)
- [Comment](#classescommentmd)
- [Composite](#classescompositemd)
- [Formatter](#classesformattermd)
- [HtmlDivFormatter](#classeshtmldivformattermd)
- [HtmlFormatter](#classeshtmlformattermd)
- [HtmlTableFormatter](#classeshtmltableformattermd)
- [Key](#classeskeymd)
- [Line](#classeslinemd)
- [Literal](#classesliteralmd)
- [Metadata](#classesmetadatamd)
- [Paragraph](#classesparagraphmd)
- [SoftLineBreak](#classessoftlinebreakmd)
- [Song](#classessongmd)
- [Tag](#classestagmd)
- [Ternary](#classesternarymd)
- [TextFormatter](#classestextformattermd)
- [UltimateGuitarParser](#classesultimateguitarparsermd)

## Variables

- [ABC](#variablesabcmd)
- [CHORUS](#variableschorusmd)
- [default](#variablesdefaultmd)
- [INDETERMINATE](#variablesindeterminatemd)
- [LILYPOND](#variableslilypondmd)
- [NONE](#variablesnonemd)
- [NUMERAL](#variablesnumeralmd)
- [NUMERIC](#variablesnumericmd)
- [SOLFEGE](#variablessolfegemd)
- [SYMBOL](#variablessymbolmd)
- [TAB](#variablestabmd)
- [templateHelpers](#variablestemplatehelpersmd)
- [VERSE](#variablesversemd)

# Classes


<a name="classeschordmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Chord

## Class: Chord

Represents a Chord, consisting of a root, suffix (quality) and bass

### Implements

- `ChordProperties`

### Constructors

#### new Chord()

> **new Chord**(`__namedParameters`): [`Chord`](#classeschordmd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.base

`null` \| `string` \| `number` = `null`

####### __namedParameters.bass

`null` \| [`Key`](#classeskeymd) = `null`

####### __namedParameters.bassBase

`null` \| `string` \| `number` = `null`

####### __namedParameters.bassModifier

`null` \| `Modifier` = `null`

####### __namedParameters.chordType

`null` \| `ChordType` = `null`

####### __namedParameters.modifier

`null` \| `Modifier` = `null`

####### __namedParameters.root

`null` \| [`Key`](#classeskeymd) = `null`

####### __namedParameters.suffix

`null` \| `string` = `null`

##### Returns

[`Chord`](#classeschordmd)

##### Defined in

[chord.ts:344](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L344)

### Properties

#### bass

> **bass**: `null` \| [`Key`](#classeskeymd)

##### Implementation of

`ChordProperties.bass`

##### Defined in

[chord.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L24)

***

#### root

> **root**: `null` \| [`Key`](#classeskeymd)

##### Implementation of

`ChordProperties.root`

##### Defined in

[chord.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L26)

***

#### suffix

> **suffix**: `null` \| `string`

##### Implementation of

`ChordProperties.suffix`

##### Defined in

[chord.ts:28](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L28)

### Methods

#### clone()

> **clone**(): [`Chord`](#classeschordmd)

Returns a deep copy of the chord

##### Returns

[`Chord`](#classeschordmd)

##### Defined in

[chord.ts:60](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L60)

***

#### equals()

> **equals**(`otherChord`): `boolean`

##### Parameters

###### otherChord

[`Chord`](#classeschordmd)

##### Returns

`boolean`

##### Defined in

[chord.ts:374](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L374)

***

#### isChordSolfege()

> **isChordSolfege**(): `boolean`

Determines whether the chord is a chord solfege

##### Returns

`boolean`

##### Defined in

[chord.ts:160](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L160)

***

#### isChordSymbol()

> **isChordSymbol**(): `boolean`

Determines whether the chord is a chord symbol

##### Returns

`boolean`

##### Defined in

[chord.ts:110](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L110)

***

#### isMinor()

> **isMinor**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord.ts:432](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L432)

***

#### isNumeral()

> **isNumeral**(): `boolean`

Determines whether the chord is a numeral

##### Returns

`boolean`

##### Defined in

[chord.ts:246](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L246)

***

#### isNumeric()

> **isNumeric**(): `boolean`

Determines whether the chord is numeric

##### Returns

`boolean`

##### Defined in

[chord.ts:227](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L227)

***

#### makeMinor()

> **makeMinor**(): [`Chord`](#classeschordmd)

##### Returns

[`Chord`](#classeschordmd)

##### Defined in

[chord.ts:436](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L436)

***

#### normalize()

> **normalize**(`key`?, `options`?): [`Chord`](#classeschordmd)

Normalizes the chord root and bass notes:
- Fab becomes Mi
- Dob becomes Si
- Si# becomes Do
- Mi# becomes Fa
- Fb becomes E
- Cb becomes B
- B# becomes C
- E# becomes F
- 4b becomes 3
- 1b becomes 7
- 7# becomes 1
- 3# becomes 4

Besides that it normalizes the suffix if `normalizeSuffix` is `true`.
For example, `sus2` becomes `2`, `sus4` becomes `sus`.
All suffix normalizations can be found in `src/normalize_mappings/suffix-mapping.txt`.

When the chord is minor, bass notes are normalized off of the relative major
of the root note. For example, `Em/A#` becomes `Em/Bb`.

##### Parameters

###### key?

`null` | `string` | [`Key`](#classeskeymd)

###### options?

options

####### options.normalizeSuffix

`boolean` = `true`

whether to normalize the chord suffix after transposing

##### Returns

[`Chord`](#classeschordmd)

the normalized chord

##### Defined in

[chord.ts:294](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L294)

***

#### set()

> **set**(`properties`): [`Chord`](#classeschordmd)

##### Parameters

###### properties

`ChordProperties`

##### Returns

[`Chord`](#classeschordmd)

##### Defined in

[chord.ts:442](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L442)

***

#### toChordSolfege()

> **toChordSolfege**(`referenceKey`?): [`Chord`](#classeschordmd)

Converts the chord to a chord solfege, using the supplied key as a reference.
For example, a numeric chord `#4` with reference key `Mi` will return the chord symbol `La#`.
When the chord is already a chord solfege, it will return a clone of the object.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Chord`](#classeschordmd)

the chord solfege

##### Defined in

[chord.ts:122](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L122)

***

#### toChordSolfegeString()

> **toChordSolfegeString**(`referenceKey`?): `string`

Converts the chord to a chord solfege string, using the supplied key as a reference.
For example, a numeric chord `#4` with reference key `E` will return the chord solfege `A#`.
When the chord is already a chord solfege, it will return a string version of the chord.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

`string`

the chord solfege string

##### See

##### Defined in

[chord.ts:152](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L152)

***

#### toChordSymbol()

> **toChordSymbol**(`referenceKey`?): [`Chord`](#classeschordmd)

Converts the chord to a chord symbol, using the supplied key as a reference.
For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
When the chord is already a chord symbol, it will return a clone of the object.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Chord`](#classeschordmd)

the chord symbol

##### Defined in

[chord.ts:72](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L72)

***

#### toChordSymbolString()

> **toChordSymbolString**(`referenceKey`?): `string`

Converts the chord to a chord symbol string, using the supplied key as a reference.
For example, a numeric chord `#4` with reference key `E` will return the chord symbol `A#`.
When the chord is already a chord symbol, it will return a string version of the chord.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

`string`

the chord symbol string

##### See

##### Defined in

[chord.ts:102](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L102)

***

#### toNumeral()

> **toNumeral**(`referenceKey`?): [`Chord`](#classeschordmd)

Converts the chord to a numeral chord, using the supplied key as a reference.
For example, a chord symbol A# with reference key E will return the numeral chord #IV.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Chord`](#classeschordmd)

the numeral chord

##### Defined in

[chord.ts:194](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L194)

***

#### toNumeralString()

> **toNumeralString**(`referenceKey`?): `string`

Converts the chord to a numeral chord string, using the supplied kye as a reference.
For example, a chord symbol A# with reference key E will return the numeral chord #4.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

`string`

the numeral chord string

##### See

##### Defined in

[chord.ts:219](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L219)

***

#### toNumeric()

> **toNumeric**(`referenceKey`?): [`Chord`](#classeschordmd)

Converts the chord to a numeric chord, using the supplied key as a reference.
For example, a chord symbol A# with reference key E will return the numeric chord #4.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Chord`](#classeschordmd)

the numeric chord

##### Defined in

[chord.ts:170](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L170)

***

#### toNumericString()

> **toNumericString**(`referenceKey`?): `string`

Converts the chord to a numeric chord string, using the supplied kye as a reference.
For example, a chord symbol A# with reference key E will return the numeric chord #4.

##### Parameters

###### referenceKey?

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

`string`

the numeric chord string

##### See

##### Defined in

[chord.ts:238](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L238)

***

#### toString()

> **toString**(`configuration`?): `string`

Converts the chord to a string, eg `Esus4/G#` or `1sus4/#3`

##### Parameters

###### configuration?

options

####### configuration.useUnicodeModifier

`boolean` = `false`

Whether or not to use unicode modifiers.
This will make `#` (sharp) look like `♯` and `b` (flat) look like `♭`

##### Returns

`string`

the chord string

##### Defined in

[chord.ts:257](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L257)

***

#### transpose()

> **transpose**(`delta`): [`Chord`](#classeschordmd)

Transposes the chord by the specified number of semitones

##### Parameters

###### delta

`number`

de number of semitones

##### Returns

[`Chord`](#classeschordmd)

the new, transposed chord

##### Defined in

[chord.ts:340](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L340)

***

#### transposeDown()

> **transposeDown**(): [`Chord`](#classeschordmd)

Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb

##### Returns

[`Chord`](#classeschordmd)

the new, transposed chord

##### Defined in

[chord.ts:331](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L331)

***

#### transposeUp()

> **transposeUp**(): [`Chord`](#classeschordmd)

Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E

##### Returns

[`Chord`](#classeschordmd)

the new, transposed chord

##### Defined in

[chord.ts:323](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L323)

***

#### useModifier()

> **useModifier**(`newModifier`): [`Chord`](#classeschordmd)

Switches to the specified modifier

##### Parameters

###### newModifier

`Modifier`

the modifier to use: `'#'` or `'b'`

##### Returns

[`Chord`](#classeschordmd)

the new, changed chord

##### Defined in

[chord.ts:315](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L315)

***

#### determineBass()

> `static` **determineBass**(`__namedParameters`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.bass

`null` \| [`Key`](#classeskeymd)

####### __namedParameters.bassBase

`null` \| `string` \| `number`

####### __namedParameters.bassModifier

`null` \| `Modifier`

####### __namedParameters.chordType

`null` \| `ChordType`

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[chord.ts:407](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L407)

***

#### determineRoot()

> `static` **determineRoot**(`__namedParameters`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.base

`null` \| `string` \| `number`

####### __namedParameters.chordType

`null` \| `ChordType`

####### __namedParameters.modifier

`null` \| `Modifier`

####### __namedParameters.root

`null` \| [`Key`](#classeskeymd)

####### __namedParameters.suffix

`null` \| `string`

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[chord.ts:380](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L380)

***

#### parse()

> `static` **parse**(`chordString`): `null` \| [`Chord`](#classeschordmd)

Tries to parse a chord string into a chord
Any leading or trailing whitespace is removed first, so a chord like `  \n  E/G# \r ` is valid.

##### Parameters

###### chordString

`string`

the chord string, eg `Esus4/G#` or `1sus4/#3`.

##### Returns

`null` \| [`Chord`](#classeschordmd)

##### Defined in

[chord.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L36)

***

#### parseOrFail()

> `static` **parseOrFail**(`chordString`): [`Chord`](#classeschordmd)

##### Parameters

###### chordString

`string`

##### Returns

[`Chord`](#classeschordmd)

##### Defined in

[chord.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord.ts#L44)


<a name="classeschorddefinitionmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordDefinition

## Class: ChordDefinition

Represents a chord definition.

Definitions are made using the `{chord}` or `{define}` directive.
A chord definitions overrides a previous chord definition for the exact same chord.

### See

 - https://chordpro.org/chordpro/directives-define/
 - https://chordpro.org/chordpro/directives-chord/

### Constructors

#### new ChordDefinition()

> **new ChordDefinition**(`name`, `baseFret`, `frets`, `fingers`?): [`ChordDefinition`](#classeschorddefinitionmd)

##### Parameters

###### name

`string`

###### baseFret

`number`

###### frets

`Fret`[]

###### fingers?

`number`[]

##### Returns

[`ChordDefinition`](#classeschorddefinitionmd)

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:48](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L48)

### Properties

#### baseFret

> **baseFret**: `number`

Defines the offset for the chord, which is the position of the topmost finger.
The offset must be 1 or higher.

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:25](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L25)

***

#### fingers

> **fingers**: `number`[]

defines finger settings. This part may be omitted.

For the frets and the fingers positions, there must be exactly as many positions as there are strings,
which is 6 by default. For the fingers positions, values corresponding to open or damped strings are ignored.
Finger settings may be numeric (0 .. 9) or uppercase letters (A .. Z).
Note that the values -, x, X, and N are used to designate a string without finger setting.

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L46)

***

#### frets

> **frets**: `Fret`[]

Defines the string positions.
Strings are enumerated from left (lowest) to right (highest), as they appear in the chord diagrams.
Fret positions are relative to the offset minus one, so with base-fret 1 (the default),
the topmost fret position is 1. With base-fret 3, fret position 1 indicates the 3rd position.
`0` (zero) denotes an open string. Use `-1`, `N` or `x` to denote a non-sounding string.

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:35](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L35)

***

#### name

> **name**: `string`

The chord name, e.g. `C`, `Dm`, `G7`.

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:18](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L18)

### Methods

#### clone()

> **clone**(): [`ChordDefinition`](#classeschorddefinitionmd)

##### Returns

[`ChordDefinition`](#classeschorddefinitionmd)

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:74](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L74)

***

#### parse()

> `static` **parse**(`chordDefinition`): [`ChordDefinition`](#classeschorddefinitionmd)

Parses a chord definition in the form of:
- <name> base-fret <offset> frets <pos> <pos> … <pos>
- <name> base-fret <offset> frets <pos> <pos> … <pos> fingers <pos> <pos> … <pos>

##### Parameters

###### chordDefinition

`string`

##### Returns

[`ChordDefinition`](#classeschorddefinitionmd)

##### See

https://chordpro.org/chordpro/directives-define/#common-usage

##### Defined in

[chord\_sheet/chord\_pro/chord\_definition.ts:63](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/chord_definition.ts#L63)


<a name="classeschordlyricspairmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordLyricsPair

## Class: ChordLyricsPair

Represents a chord with the corresponding (partial) lyrics

### Constructors

#### new ChordLyricsPair()

> **new ChordLyricsPair**(`chords`, `lyrics`, `annotation`): [`ChordLyricsPair`](#classeschordlyricspairmd)

Initialises a ChordLyricsPair

##### Parameters

###### chords

`string` = `''`

The chords

###### lyrics

`null` | `string`

###### annotation

`null` | `string`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:21](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L21)

### Properties

#### annotation

> **annotation**: `null` \| `string`

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:13](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L13)

***

#### chords

> **chords**: `string`

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:9](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L9)

***

#### lyrics

> **lyrics**: `null` \| `string`

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:11](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L11)

### Methods

#### changeChord()

> **changeChord**(`func`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### func

(`chord`) => [`Chord`](#classeschordmd)

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:100](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L100)

***

#### clone()

> **clone**(): [`ChordLyricsPair`](#classeschordlyricspairmd)

Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:56](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L56)

***

#### isRenderable()

> **isRenderable**(): `boolean`

Indicates whether a ChordLyricsPair should be visible in a formatted chord sheet (except for ChordPro sheets)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:48](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L48)

***

#### set()

> **set**(`__namedParameters`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.annotation

`string`

####### __namedParameters.chords

`string`

####### __namedParameters.lyrics

`string`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:64](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L64)

***

#### setAnnotation()

> **setAnnotation**(`annotation`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### annotation

`string`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:76](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L76)

***

#### setLyrics()

> **setLyrics**(`lyrics`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### lyrics

`string`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:72](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L72)

***

#### toString()

> **toString**(): `string`

##### Returns

`string`

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:60](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L60)

***

#### transpose()

> **transpose**(`delta`, `key`, `__namedParameters`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### delta

`number`

###### key

`null` | `string` | [`Key`](#classeskeymd)

###### \_\_namedParameters

####### __namedParameters.normalizeChordSuffix

`boolean`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:80](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L80)

***

#### useModifier()

> **useModifier**(`modifier`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### modifier

`Modifier`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/chord\_lyrics\_pair.ts:96](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_lyrics_pair.ts#L96)


<a name="classeschordproformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordProFormatter

## Class: ChordProFormatter

Formats a song into a ChordPro chord sheet

### Extends

- [`Formatter`](#classesformattermd)

### Constructors

#### new ChordProFormatter()

> **new ChordProFormatter**(`configuration`?): [`ChordProFormatter`](#classeschordproformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`ChordProFormatter`](#classeschordproformattermd)

##### Inherited from

[`Formatter`](#classesformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`Formatter`](#classesformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

### Methods

#### format()

> **format**(`song`): `string`

Formats a song into a ChordPro chord sheet.

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

The ChordPro string

##### Defined in

[formatter/chord\_pro\_formatter.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L24)

***

#### formatChordLyricsPair()

> **formatChordLyricsPair**(`chordLyricsPair`): `string`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:132](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L132)

***

#### formatChordLyricsPairChords()

> **formatChordLyricsPairChords**(`chordLyricsPair`): `string`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:139](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L139)

***

#### formatChordLyricsPairLyrics()

> **formatChordLyricsPairLyrics**(`chordLyricsPair`): `string`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:158](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L158)

***

#### formatComment()

> **formatComment**(`comment`): `string`

##### Parameters

###### comment

[`Comment`](#classescommentmd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:162](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L162)

***

#### formatExpression()

> **formatExpression**(`expression`): `string`

##### Parameters

###### expression

`Evaluatable`

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:112](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L112)

***

#### formatExpressionRange()

> **formatExpressionRange**(`expressionRange`): `string`

##### Parameters

###### expressionRange

`Evaluatable`[]

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:104](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L104)

***

#### formatItem()

> **formatItem**(`item`, `metadata`): `string`

##### Parameters

###### item

`Item`

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:38](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L38)

***

#### formatLine()

> **formatLine**(`line`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:32](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L32)

***

#### formatOrEvaluateItem()

> **formatOrEvaluateItem**(`item`, `metadata`): `string`

##### Parameters

###### item

`Evaluatable`

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:62](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L62)

***

#### formatTag()

> **formatTag**(`tag`): `string`

##### Parameters

###### tag

[`Tag`](#classestagmd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:124](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L124)

***

#### formatTernary()

> **formatTernary**(`ternary`): `string`

##### Parameters

###### ternary

[`Ternary`](#classesternarymd)

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L78)

***

#### formatValueTest()

> **formatValueTest**(`valueTest`): `string`

##### Parameters

###### valueTest

`null` | `string`

##### Returns

`string`

##### Defined in

[formatter/chord\_pro\_formatter.ts:96](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chord_pro_formatter.ts#L96)


<a name="classeschordproparsermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordProParser

## Class: ChordProParser

Parses a ChordPro chord sheet

### Constructors

#### new ChordProParser()

> **new ChordProParser**(): [`ChordProParser`](#classeschordproparsermd)

##### Returns

[`ChordProParser`](#classeschordproparsermd)

### Properties

#### song?

> `optional` **song**: [`Song`](#classessongmd)

##### Defined in

[parser/chord\_pro\_parser.ts:16](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_pro_parser.ts#L16)

### Accessors

#### warnings

##### Get Signature

> **get** **warnings**(): `ParserWarning`[]

All warnings raised during parsing the chord sheet

###### Member

###### Returns

`ParserWarning`[]

##### Defined in

[parser/chord\_pro\_parser.ts:23](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_pro_parser.ts#L23)

### Methods

#### parse()

> **parse**(`chordSheet`, `options`?): [`Song`](#classessongmd)

Parses a ChordPro chord sheet into a song

##### Parameters

###### chordSheet

`string`

the ChordPro chord sheet

###### options?

`ChordProParserOptions`

Parser options.

##### Returns

[`Song`](#classessongmd)

The parsed song

##### See

https://peggyjs.org/documentation.html#using-the-parser

##### Defined in

[parser/chord\_pro\_parser.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_pro_parser.ts#L36)


<a name="classeschordsheetparsermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordSheetParser

## Class: ChordSheetParser

Parses a normal chord sheet

ChordSheetParser is deprecated, please use ChordsOverWordsParser.

ChordsOverWordsParser aims to support any kind of chord, whereas ChordSheetParser lacks
support for many variations. Besides that, some chordpro feature have been ported back
to ChordsOverWordsParser, which adds some interesting functionality.

### Extended by

- [`UltimateGuitarParser`](#classesultimateguitarparsermd)

### Constructors

#### new ChordSheetParser()

> **new ChordSheetParser**(`__namedParameters`?, `showDeprecationWarning`?): [`ChordSheetParser`](#classeschordsheetparsermd)

Instantiate a chord sheet parser
ChordSheetParser is deprecated, please use ChordsOverWordsParser.

##### Parameters

###### \_\_namedParameters?

####### __namedParameters.preserveWhitespace

`boolean` = `true`

###### showDeprecationWarning?

`boolean` = `true`

##### Returns

[`ChordSheetParser`](#classeschordsheetparsermd)

##### Deprecated

##### Defined in

[parser/chord\_sheet\_parser.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L46)

### Properties

#### chordLyricsPair

> **chordLyricsPair**: `null` \| [`ChordLyricsPair`](#classeschordlyricspairmd) = `null`

##### Defined in

[parser/chord\_sheet\_parser.ts:31](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L31)

***

#### currentLine

> **currentLine**: `number` = `0`

##### Defined in

[parser/chord\_sheet\_parser.ts:35](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L35)

***

#### lineCount

> **lineCount**: `number` = `0`

##### Defined in

[parser/chord\_sheet\_parser.ts:37](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L37)

***

#### lines

> **lines**: `string`[] = `[]`

##### Defined in

[parser/chord\_sheet\_parser.ts:33](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L33)

***

#### preserveWhitespace

> **preserveWhitespace**: `boolean` = `true`

##### Defined in

[parser/chord\_sheet\_parser.ts:23](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L23)

***

#### processingText

> **processingText**: `boolean` = `true`

##### Defined in

[parser/chord\_sheet\_parser.ts:21](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L21)

***

#### song

> **song**: [`Song`](#classessongmd)

##### Defined in

[parser/chord\_sheet\_parser.ts:25](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L25)

***

#### songBuilder

> **songBuilder**: `SongBuilder`

##### Defined in

[parser/chord\_sheet\_parser.ts:27](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L27)

***

#### songLine

> **songLine**: `null` \| [`Line`](#classeslinemd) = `null`

##### Defined in

[parser/chord\_sheet\_parser.ts:29](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L29)

### Methods

#### addCharacter()

> **addCharacter**(`chr`, `nextChar`): `void`

##### Parameters

###### chr

`any`

###### nextChar

`any`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:160](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L160)

***

#### endOfSong()

> **endOfSong**(): `void`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:82](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L82)

***

#### ensureChordLyricsPairInitialized()

> **ensureChordLyricsPairInitialized**(): `void`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:177](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L177)

***

#### hasNextLine()

> **hasNextLine**(): `boolean`

##### Returns

`boolean`

##### Defined in

[parser/chord\_sheet\_parser.ts:124](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L124)

***

#### initialize()

> **initialize**(`document`, `song`): `void`

##### Parameters

###### document

`any`

###### song

`null` | [`Song`](#classessongmd)

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:107](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L107)

***

#### parse()

> **parse**(`chordSheet`, `options`?): [`Song`](#classessongmd)

Parses a chord sheet into a song

##### Parameters

###### chordSheet

`string`

The ChordPro chord sheet

###### options?

Optional parser options

####### options.song

[`Song`](#classessongmd)

The [Song](#classessongmd) to store the song data in

##### Returns

[`Song`](#classessongmd)

The parsed song

##### Defined in

[parser/chord\_sheet\_parser.ts:70](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L70)

***

#### parseLine()

> **parseLine**(`line`): `void`

##### Parameters

###### line

`any`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:84](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L84)

***

#### parseLyricsWithChords()

> **parseLyricsWithChords**(`chordsLine`, `lyricsLine`): `void`

##### Parameters

###### chordsLine

`any`

###### lyricsLine

`any`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:128](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L128)

***

#### parseNonEmptyLine()

> **parseNonEmptyLine**(`line`): `void`

##### Parameters

###### line

`any`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:94](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L94)

***

#### processCharacters()

> **processCharacters**(`chordsLine`, `lyricsLine`): `void`

##### Parameters

###### chordsLine

`any`

###### lyricsLine

`any`

##### Returns

`void`

##### Defined in

[parser/chord\_sheet\_parser.ts:146](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L146)

***

#### readLine()

> **readLine**(): `string`

##### Returns

`string`

##### Defined in

[parser/chord\_sheet\_parser.ts:118](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L118)

***

#### shouldAddCharacterToChords()

> **shouldAddCharacterToChords**(`nextChar`): `any`

##### Parameters

###### nextChar

`any`

##### Returns

`any`

##### Defined in

[parser/chord\_sheet\_parser.ts:173](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L173)


<a name="classeschordsheetserializermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordSheetSerializer

## Class: ChordSheetSerializer

Serializes a song into een plain object, and deserializes the serialized object back into a [Song](#classessongmd)

### Constructors

#### new ChordSheetSerializer()

> **new ChordSheetSerializer**(): [`ChordSheetSerializer`](#classeschordsheetserializermd)

##### Returns

[`ChordSheetSerializer`](#classeschordsheetserializermd)

### Properties

#### song

> **song**: [`Song`](#classessongmd)

##### Defined in

[chord\_sheet\_serializer.ts:40](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L40)

***

#### songBuilder

> **songBuilder**: `SongBuilder`

##### Defined in

[chord\_sheet\_serializer.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L42)

### Methods

#### deserialize()

> **deserialize**(`serializedSong`): [`Song`](#classessongmd)

Deserializes a song that has been serialized using [serialize](#serialize)

##### Parameters

###### serializedSong

`SerializedSong`

The serialized song

##### Returns

[`Song`](#classessongmd)

The deserialized song

##### Defined in

[chord\_sheet\_serializer.ts:151](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L151)

***

#### parseAstComponent()

> **parseAstComponent**(`astComponent`): `null` \| [`ChordLyricsPair`](#classeschordlyricspairmd) \| [`Tag`](#classestagmd) \| [`Comment`](#classescommentmd) \| [`Ternary`](#classesternarymd) \| [`Literal`](#classesliteralmd) \| [`SoftLineBreak`](#classessoftlinebreakmd)

##### Parameters

###### astComponent

`SerializedComponent`

##### Returns

`null` \| [`ChordLyricsPair`](#classeschordlyricspairmd) \| [`Tag`](#classestagmd) \| [`Comment`](#classescommentmd) \| [`Ternary`](#classesternarymd) \| [`Literal`](#classesliteralmd) \| [`SoftLineBreak`](#classessoftlinebreakmd)

##### Defined in

[chord\_sheet\_serializer.ts:156](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L156)

***

#### parseChordLyricsPair()

> **parseChordLyricsPair**(`astComponent`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### astComponent

`SerializedChordLyricsPair`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet\_serializer.ts:201](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L201)

***

#### parseChordSheet()

> **parseChordSheet**(`astComponent`): `void`

##### Parameters

###### astComponent

`SerializedSong`

##### Returns

`void`

##### Defined in

[chord\_sheet\_serializer.ts:184](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L184)

***

#### parseComment()

> **parseComment**(`astComponent`): [`Comment`](#classescommentmd)

##### Parameters

###### astComponent

`SerializedComment`

##### Returns

[`Comment`](#classescommentmd)

##### Defined in

[chord\_sheet\_serializer.ts:234](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L234)

***

#### parseExpression()

> **parseExpression**(`expression`): (`null` \| `AstType`)[]

##### Parameters

###### expression

(`string` \| `SerializedTernary`)[]

##### Returns

(`null` \| `AstType`)[]

##### Defined in

[chord\_sheet\_serializer.ts:259](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L259)

***

#### parseLine()

> **parseLine**(`astComponent`): `void`

##### Parameters

###### astComponent

`SerializedLine`

##### Returns

`void`

##### Defined in

[chord\_sheet\_serializer.ts:191](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L191)

***

#### parseTag()

> **parseTag**(`astComponent`): [`Tag`](#classestagmd)

##### Parameters

###### astComponent

`SerializedTag`

##### Returns

[`Tag`](#classestagmd)

##### Defined in

[chord\_sheet\_serializer.ts:213](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L213)

***

#### parseTernary()

> **parseTernary**(`astComponent`): [`Ternary`](#classesternarymd)

##### Parameters

###### astComponent

`SerializedTernary`

##### Returns

[`Ternary`](#classesternarymd)

##### Defined in

[chord\_sheet\_serializer.ts:239](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L239)

***

#### serialize()

> **serialize**(`song`): `SerializedSong`

Serializes the chord sheet to a plain object, which can be converted to any format like JSON, XML etc
Can be deserialized using [deserialize](#deserialize)

##### Parameters

###### song

[`Song`](#classessongmd)

##### Returns

`SerializedSong`

object A plain JS object containing all chord sheet data

##### Defined in

[chord\_sheet\_serializer.ts:49](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L49)

***

#### serializeChordDefinition()

> **serializeChordDefinition**(`chordDefinition`): `SerializedChordDefinition`

##### Parameters

###### chordDefinition

[`ChordDefinition`](#classeschorddefinitionmd)

##### Returns

`SerializedChordDefinition`

##### Defined in

[chord\_sheet\_serializer.ts:91](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L91)

***

#### serializeChordLyricsPair()

> **serializeChordLyricsPair**(`chordLyricsPair`): `object`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Returns

`object`

###### annotation

> **annotation**: `null` \| `string` = `chordLyricsPair.annotation`

###### chord

> **chord**: `null` = `null`

###### chords

> **chords**: `string` = `chordLyricsPair.chords`

###### lyrics

> **lyrics**: `null` \| `string` = `chordLyricsPair.lyrics`

###### type

> **type**: `string` = `CHORD_LYRICS_PAIR`

##### Defined in

[chord\_sheet\_serializer.ts:114](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L114)

***

#### serializeComment()

> **serializeComment**(`comment`): `SerializedComment`

##### Parameters

###### comment

[`Comment`](#classescommentmd)

##### Returns

`SerializedComment`

##### Defined in

[chord\_sheet\_serializer.ts:142](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L142)

***

#### serializeExpression()

> **serializeExpression**(`expression`): `SerializedComponent`[]

##### Parameters

###### expression

`AstType`[]

##### Returns

`SerializedComponent`[]

##### Defined in

[chord\_sheet\_serializer.ts:138](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L138)

***

#### serializeItem()

> **serializeItem**(`item`): `SerializedComponent`

##### Parameters

###### item

`AstType`

##### Returns

`SerializedComponent`

##### Defined in

[chord\_sheet\_serializer.ts:63](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L63)

***

#### serializeLine()

> **serializeLine**(`line`): `SerializedLine`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`SerializedLine`

##### Defined in

[chord\_sheet\_serializer.ts:56](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L56)

***

#### serializeLiteral()

> **serializeLiteral**(`literal`): `string`

##### Parameters

###### literal

[`Literal`](#classesliteralmd)

##### Returns

`string`

##### Defined in

[chord\_sheet\_serializer.ts:134](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L134)

***

#### serializeTag()

> **serializeTag**(`tag`): `SerializedTag`

##### Parameters

###### tag

[`Tag`](#classestagmd)

##### Returns

`SerializedTag`

##### Defined in

[chord\_sheet\_serializer.ts:100](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L100)

***

#### serializeTernary()

> **serializeTernary**(`ternary`): `object`

##### Parameters

###### ternary

[`Ternary`](#classesternarymd)

##### Returns

`object`

##### Defined in

[chord\_sheet\_serializer.ts:124](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet_serializer.ts#L124)


<a name="classeschordsoverwordsformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordsOverWordsFormatter

## Class: ChordsOverWordsFormatter

Formats a song into a plain text chord sheet

### Extends

- [`Formatter`](#classesformattermd)

### Constructors

#### new ChordsOverWordsFormatter()

> **new ChordsOverWordsFormatter**(`configuration`?): [`ChordsOverWordsFormatter`](#classeschordsoverwordsformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`ChordsOverWordsFormatter`](#classeschordsoverwordsformattermd)

##### Inherited from

[`Formatter`](#classesformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`Formatter`](#classesformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

***

#### song

> **song**: [`Song`](#classessongmd)

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:18](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L18)

### Methods

#### chordLyricsPairLength()

> **chordLyricsPairLength**(`chordLyricsPair`, `line`): `number`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

###### line

[`Line`](#classeslinemd)

##### Returns

`number`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:88](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L88)

***

#### format()

> **format**(`song`): `string`

Formats a song into a plain text chord sheet

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

the chord sheet

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:25](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L25)

***

#### formatHeader()

> **formatHeader**(): `string`

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:34](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L34)

***

#### formatItemBottom()

> **formatItemBottom**(`item`, `metadata`, `line`): `string`

##### Parameters

###### item

`Item`

###### metadata

[`Metadata`](#classesmetadatamd)

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:145](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L145)

***

#### formatItemTop()

> **formatItemTop**(`item`, `_metadata`, `line`): `string`

##### Parameters

###### item

`Item`

###### \_metadata

[`Metadata`](#classesmetadatamd)

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:101](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L101)

***

#### formatLine()

> **formatLine**(`line`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:68](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L68)

***

#### formatLineBottom()

> **formatLineBottom**(`line`, `metadata`): `null` \| `string`

##### Parameters

###### line

`any`

###### metadata

`any`

##### Returns

`null` \| `string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:126](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L126)

***

#### formatLineTop()

> **formatLineTop**(`line`, `metadata`): `null` \| `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`null` \| `string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:80](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L80)

***

#### formatLineWithFormatter()

> **formatLineWithFormatter**(`line`, `formatter`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### formatter

(`_item`, `_metadata`, `_line`) => `string`

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:134](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L134)

***

#### formatParagraph()

> **formatParagraph**(`paragraph`, `metadata`): `string`

##### Parameters

###### paragraph

[`Paragraph`](#classesparagraphmd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:55](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L55)

***

#### formatParagraphs()

> **formatParagraphs**(): `string`

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L42)

***

#### renderChord()

> **renderChord**(`item`, `line`): `string`

##### Parameters

###### item

[`ChordLyricsPair`](#classeschordlyricspairmd)

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

##### Defined in

[formatter/chords\_over\_words\_formatter.ts:114](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/chords_over_words_formatter.ts#L114)


<a name="classeschordsoverwordsparsermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ChordsOverWordsParser

## Class: ChordsOverWordsParser

Parses a chords over words sheet into a song

It support "regular" chord sheets:

           Am         C/G        F          C
    Let it be, let it be, let it be, let it be
    C                G              F  C/E Dm C
    Whisper words of wisdom, let it be

Additionally, some chordpro features have been "ported back". For example, you can use chordpro directives:

    {title: Let it be}
    {key: C}
    Chorus 1:
           Am
    Let it be

For convenience, you can leave out the brackets:

    title: Let it be
    Chorus 1:
           Am
    Let it be

You can even use a markdown style frontmatter separator to separate the header from the song:

    title: Let it be
    key: C
    ---
    Chorus 1:
           Am         C/G        F          C
    Let it be, let it be, let it be, let it be
    C                G              F  C/E Dm C
    Whisper words of wisdom, let it be

`ChordsOverWordsParser` is the better version of `ChordSheetParser`, which is deprecated.

### Constructors

#### new ChordsOverWordsParser()

> **new ChordsOverWordsParser**(): [`ChordsOverWordsParser`](#classeschordsoverwordsparsermd)

##### Returns

[`ChordsOverWordsParser`](#classeschordsoverwordsparsermd)

### Properties

#### song?

> `optional` **song**: [`Song`](#classessongmd)

##### Defined in

[parser/chords\_over\_words\_parser.ts:51](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chords_over_words_parser.ts#L51)

### Accessors

#### warnings

##### Get Signature

> **get** **warnings**(): `ParserWarning`[]

All warnings raised during parsing the chord sheet

###### Member

###### Returns

`ParserWarning`[]

##### Defined in

[parser/chords\_over\_words\_parser.ts:58](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chords_over_words_parser.ts#L58)

### Methods

#### parse()

> **parse**(`chordSheet`, `options`?): [`Song`](#classessongmd)

Parses a chords over words sheet into a song

##### Parameters

###### chordSheet

`string`

the chords over words sheet

###### options?

`ChordsOverWordsParserOptions`

Parser options.

##### Returns

[`Song`](#classessongmd)

The parsed song

##### See

https://peggyjs.org/documentation.html#using-the-parser

##### Defined in

[parser/chords\_over\_words\_parser.ts:71](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chords_over_words_parser.ts#L71)


<a name="classescommentmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Comment

## Class: Comment

Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview

### Constructors

#### new Comment()

> **new Comment**(`content`): [`Comment`](#classescommentmd)

##### Parameters

###### content

`string`

##### Returns

[`Comment`](#classescommentmd)

##### Defined in

[chord\_sheet/comment.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/comment.ts#L7)

### Properties

#### content

> **content**: `string`

##### Defined in

[chord\_sheet/comment.ts:5](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/comment.ts#L5)

### Methods

#### clone()

> **clone**(): [`Comment`](#classescommentmd)

Returns a deep copy of the Comment, useful when programmatically transforming a song

##### Returns

[`Comment`](#classescommentmd)

##### Defined in

[chord\_sheet/comment.ts:23](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/comment.ts#L23)

***

#### isRenderable()

> **isRenderable**(): `boolean`

Indicates whether a Comment should be visible in a formatted chord sheet (except for ChordPro sheets)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/comment.ts:15](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/comment.ts#L15)

***

#### toString()

> **toString**(): `string`

##### Returns

`string`

##### Defined in

[chord\_sheet/comment.ts:27](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/comment.ts#L27)


<a name="classescompositemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Composite

## Class: Composite

### Extends

- `Evaluatable`

### Constructors

#### new Composite()

> **new Composite**(`expressions`, `variable`): [`Composite`](#classescompositemd)

##### Parameters

###### expressions

`Evaluatable`[]

###### variable

`null` | `string`

##### Returns

[`Composite`](#classescompositemd)

##### Overrides

`Evaluatable.constructor`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:9](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L9)

### Properties

#### column

> **column**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.column`

##### Defined in

[chord\_sheet/ast\_component.ts:6](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L6)

***

#### expressions

> **expressions**: `Evaluatable`[] = `[]`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:5](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L5)

***

#### line

> **line**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.line`

##### Defined in

[chord\_sheet/ast\_component.ts:4](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L4)

***

#### offset

> **offset**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.offset`

##### Defined in

[chord\_sheet/ast\_component.ts:8](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L8)

***

#### variable

> **variable**: `null` \| `string`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L7)

### Methods

#### clone()

> **clone**(): [`Composite`](#classescompositemd)

##### Returns

[`Composite`](#classescompositemd)

##### Overrides

`Evaluatable.clone`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:25](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L25)

***

#### evaluate()

> **evaluate**(`metadata`, `metadataSeparator`): `string`

##### Parameters

###### metadata

[`Metadata`](#classesmetadatamd)

###### metadataSeparator

`string`

##### Returns

`string`

##### Overrides

`Evaluatable.evaluate`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:15](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L15)

***

#### isRenderable()

> **isRenderable**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/chord\_pro/composite.ts:21](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/composite.ts#L21)


<a name="classesformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Formatter

## Class: Formatter

Base class for all formatters, taking care of receiving a configuration wrapping that inside a Configuration object

### Extended by

- [`ChordProFormatter`](#classeschordproformattermd)
- [`ChordsOverWordsFormatter`](#classeschordsoverwordsformattermd)
- [`HtmlFormatter`](#classeshtmlformattermd)
- [`TextFormatter`](#classestextformattermd)

### Constructors

#### new Formatter()

> **new Formatter**(`configuration`?): [`Formatter`](#classesformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`Formatter`](#classesformattermd)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)


<a name="classeshtmldivformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / HtmlDivFormatter

## Class: HtmlDivFormatter

Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.

### Extends

- [`HtmlFormatter`](#classeshtmlformattermd)

### Constructors

#### new HtmlDivFormatter()

> **new HtmlDivFormatter**(`configuration`?): [`HtmlDivFormatter`](#classeshtmldivformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`HtmlDivFormatter`](#classeshtmldivformattermd)

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

### Accessors

#### cssObject

##### Get Signature

> **get** **cssObject**(): `CSS`

Basic CSS, in object style à la useStyles, to use with the HTML output
For a CSS string see [cssString](#cssstring)

Example:

    '.paragraph': {
      marginBottom: '1em'
    }

###### Returns

`CSS`

the CSS object

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`cssObject`](#cssobject)

##### Defined in

[formatter/html\_formatter.ts:66](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L66)

***

#### defaultCss

##### Get Signature

> **get** **defaultCss**(): `CSS`

###### Returns

`CSS`

##### Overrides

[`HtmlFormatter`](#classeshtmlformattermd).[`defaultCss`](#defaultcss)

##### Defined in

[formatter/html\_div\_formatter.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_div_formatter.ts#L44)

***

#### template

##### Get Signature

> **get** **template**(): `Template`

###### Returns

`Template`

##### Overrides

[`HtmlFormatter`](#classeshtmlformattermd).[`template`](#template)

##### Defined in

[formatter/html\_div\_formatter.ts:40](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_div_formatter.ts#L40)

### Methods

#### cssString()

> **cssString**(`scope`): `string`

Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output

For example, execute cssString('.chordSheetViewer') will result in CSS like:

    .chordSheetViewer .paragraph {
      margin-bottom: 1em;
    }

##### Parameters

###### scope

`string` = `''`

the CSS scope to use, for example `.chordSheetViewer`

##### Returns

`string`

the CSS string

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`cssString`](#cssstring)

##### Defined in

[formatter/html\_formatter.ts:50](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L50)

***

#### format()

> **format**(`song`): `string`

Formats a song into HTML.

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

The HTML string

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`format`](#format)

##### Defined in

[formatter/html\_formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L26)


<a name="classeshtmlformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / HtmlFormatter

## Class: `abstract` HtmlFormatter

Acts as a base class for HTML formatters

### Extends

- [`Formatter`](#classesformattermd)

### Extended by

- [`HtmlDivFormatter`](#classeshtmldivformattermd)
- [`HtmlTableFormatter`](#classeshtmltableformattermd)

### Constructors

#### new HtmlFormatter()

> **new HtmlFormatter**(`configuration`?): [`HtmlFormatter`](#classeshtmlformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`HtmlFormatter`](#classeshtmlformattermd)

##### Inherited from

[`Formatter`](#classesformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`Formatter`](#classesformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

### Accessors

#### cssObject

##### Get Signature

> **get** **cssObject**(): `CSS`

Basic CSS, in object style à la useStyles, to use with the HTML output
For a CSS string see [cssString](#cssstring)

Example:

    '.paragraph': {
      marginBottom: '1em'
    }

###### Returns

`CSS`

the CSS object

##### Defined in

[formatter/html\_formatter.ts:66](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L66)

***

#### defaultCss

##### Get Signature

> **get** `abstract` **defaultCss**(): `CSS`

###### Returns

`CSS`

##### Defined in

[formatter/html\_formatter.ts:70](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L70)

***

#### template

##### Get Signature

> **get** `abstract` **template**(): `Template`

###### Returns

`Template`

##### Defined in

[formatter/html\_formatter.ts:72](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L72)

### Methods

#### cssString()

> **cssString**(`scope`): `string`

Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output

For example, execute cssString('.chordSheetViewer') will result in CSS like:

    .chordSheetViewer .paragraph {
      margin-bottom: 1em;
    }

##### Parameters

###### scope

`string` = `''`

the CSS scope to use, for example `.chordSheetViewer`

##### Returns

`string`

the CSS string

##### Defined in

[formatter/html\_formatter.ts:50](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L50)

***

#### format()

> **format**(`song`): `string`

Formats a song into HTML.

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

The HTML string

##### Defined in

[formatter/html\_formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L26)


<a name="classeshtmltableformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / HtmlTableFormatter

## Class: HtmlTableFormatter

Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
PDF conversion.

### Extends

- [`HtmlFormatter`](#classeshtmlformattermd)

### Constructors

#### new HtmlTableFormatter()

> **new HtmlTableFormatter**(`configuration`?): [`HtmlTableFormatter`](#classeshtmltableformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`HtmlTableFormatter`](#classeshtmltableformattermd)

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

### Accessors

#### cssObject

##### Get Signature

> **get** **cssObject**(): `CSS`

Basic CSS, in object style à la useStyles, to use with the HTML output
For a CSS string see [cssString](#cssstring)

Example:

    '.paragraph': {
      marginBottom: '1em'
    }

###### Returns

`CSS`

the CSS object

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`cssObject`](#cssobject)

##### Defined in

[formatter/html\_formatter.ts:66](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L66)

***

#### defaultCss

##### Get Signature

> **get** **defaultCss**(): `CSS`

###### Returns

`CSS`

##### Overrides

[`HtmlFormatter`](#classeshtmlformattermd).[`defaultCss`](#defaultcss)

##### Defined in

[formatter/html\_table\_formatter.ts:45](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_table_formatter.ts#L45)

***

#### template

##### Get Signature

> **get** **template**(): `Template`

###### Returns

`Template`

##### Overrides

[`HtmlFormatter`](#classeshtmlformattermd).[`template`](#template)

##### Defined in

[formatter/html\_table\_formatter.ts:41](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_table_formatter.ts#L41)

### Methods

#### cssString()

> **cssString**(`scope`): `string`

Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output

For example, execute cssString('.chordSheetViewer') will result in CSS like:

    .chordSheetViewer .paragraph {
      margin-bottom: 1em;
    }

##### Parameters

###### scope

`string` = `''`

the CSS scope to use, for example `.chordSheetViewer`

##### Returns

`string`

the CSS string

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`cssString`](#cssstring)

##### Defined in

[formatter/html\_formatter.ts:50](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L50)

***

#### format()

> **format**(`song`): `string`

Formats a song into HTML.

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

The HTML string

##### Inherited from

[`HtmlFormatter`](#classeshtmlformattermd).[`format`](#format)

##### Defined in

[formatter/html\_formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/html_formatter.ts#L26)


<a name="classeskeymd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Key

## Class: Key

Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).

The only function considered public API is `Key.distance`

### Implements

- `KeyProperties`

### Constructors

#### new Key()

> **new Key**(`__namedParameters`): [`Key`](#classeskeymd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.grade

`null` \| `number` = `null`

####### __namedParameters.minor

`boolean`

####### __namedParameters.modifier

`null` \| `Modifier`

####### __namedParameters.number

`null` \| `number` = `null`

####### __namedParameters.originalKeyString

`null` \| `string` = `null`

####### __namedParameters.preferredModifier

`null` \| `Modifier` = `null`

####### __namedParameters.referenceKeyGrade

`null` \| `number` = `null`

####### __namedParameters.type

`ChordType`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:249](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L249)

### Properties

#### grade

> **grade**: `null` \| `number`

##### Implementation of

`KeyProperties.grade`

##### Defined in

[key.ts:51](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L51)

***

#### minor

> **minor**: `boolean` = `false`

##### Implementation of

`KeyProperties.minor`

##### Defined in

[key.ts:70](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L70)

***

#### modifier

> **modifier**: `null` \| `Modifier`

##### Implementation of

`KeyProperties.modifier`

##### Defined in

[key.ts:55](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L55)

***

#### number

> **number**: `null` \| `number` = `null`

##### Implementation of

`KeyProperties.number`

##### Defined in

[key.ts:53](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L53)

***

#### originalKeyString

> **originalKeyString**: `null` \| `string` = `null`

##### Defined in

[key.ts:74](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L74)

***

#### preferredModifier

> **preferredModifier**: `null` \| `Modifier`

##### Implementation of

`KeyProperties.preferredModifier`

##### Defined in

[key.ts:76](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L76)

***

#### referenceKeyGrade

> **referenceKeyGrade**: `null` \| `number` = `null`

##### Implementation of

`KeyProperties.referenceKeyGrade`

##### Defined in

[key.ts:72](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L72)

***

#### type

> **type**: `ChordType`

##### Implementation of

`KeyProperties.type`

##### Defined in

[key.ts:57](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L57)

### Accessors

#### effectiveGrade

##### Get Signature

> **get** **effectiveGrade**(): `number`

###### Returns

`number`

##### Defined in

[key.ts:285](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L285)

***

#### minorSign

##### Get Signature

> **get** **minorSign**(): `""` \| `"m"`

###### Returns

`""` \| `"m"`

##### Defined in

[key.ts:519](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L519)

***

#### note

##### Get Signature

> **get** **note**(): `string`

###### Returns

`string`

##### Defined in

[key.ts:490](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L490)

***

#### relativeMajor

##### Get Signature

> **get** **relativeMajor**(): [`Key`](#classeskeymd)

###### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:301](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L301)

***

#### relativeMinor

##### Get Signature

> **get** **relativeMinor**(): [`Key`](#classeskeymd)

###### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:305](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L305)

***

#### unicodeModifier

##### Get Signature

> **get** **unicodeModifier**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Defined in

[key.ts:59](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L59)

### Methods

#### canBeFlat()

> **canBeFlat**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:595](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L595)

***

#### canBeSharp()

> **canBeSharp**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:603](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L603)

***

#### changeGrade()

> **changeGrade**(`delta`): [`Key`](#classeskeymd)

##### Parameters

###### delta

`any`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:558](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L558)

***

#### clone()

> **clone**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:317](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L317)

***

#### distanceTo()

> **distanceTo**(`otherKey`): `number`

##### Parameters

###### otherKey

`string` | [`Key`](#classeskeymd)

##### Returns

`number`

##### Defined in

[key.ts:280](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L280)

***

#### equals()

> **equals**(`otherKey`): `boolean`

##### Parameters

###### otherKey

[`Key`](#classeskeymd)

##### Returns

`boolean`

##### Defined in

[key.ts:410](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L410)

***

#### is()

> **is**(`type`): `boolean`

##### Parameters

###### type

`ChordType`

##### Returns

`boolean`

##### Defined in

[key.ts:390](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L390)

***

#### isChordSolfege()

> **isChordSolfege**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:402](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L402)

***

#### isChordSymbol()

> **isChordSymbol**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:398](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L398)

***

#### isMinor()

> **isMinor**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:293](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L293)

***

#### isNumeral()

> **isNumeral**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:406](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L406)

***

#### isNumeric()

> **isNumeric**(): `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:394](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L394)

***

#### makeMinor()

> **makeMinor**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:297](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L297)

***

#### normalize()

> **normalize**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:630](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L630)

***

#### normalizeEnharmonics()

> **normalizeEnharmonics**(`key`): [`Key`](#classeskeymd)

##### Parameters

###### key

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:644](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L644)

***

#### setGrade()

> **setGrade**(`newGrade`): [`Key`](#classeskeymd)

##### Parameters

###### newGrade

`number`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:611](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L611)

***

#### toChordSolfege()

> **toChordSolfege**(`key`): [`Key`](#classeskeymd)

##### Parameters

###### key

`string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:362](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L362)

***

#### toChordSolfegeString()

> **toChordSolfegeString**(`key`): `string`

##### Parameters

###### key

[`Key`](#classeskeymd)

##### Returns

`string`

##### Defined in

[key.ts:386](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L386)

***

#### toChordSymbol()

> **toChordSymbol**(`key`): [`Key`](#classeskeymd)

##### Parameters

###### key

`string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:342](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L342)

***

#### toChordSymbolString()

> **toChordSymbolString**(`key`): `string`

##### Parameters

###### key

[`Key`](#classeskeymd)

##### Returns

`string`

##### Defined in

[key.ts:382](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L382)

***

#### toMajor()

> **toMajor**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:309](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L309)

***

#### toNumeral()

> **toNumeral**(`key`): [`Key`](#classeskeymd)

##### Parameters

###### key

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:456](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L456)

***

#### toNumeralString()

> **toNumeralString**(`key`): `string`

##### Parameters

###### key

`null` | [`Key`](#classeskeymd)

##### Returns

`string`

##### Defined in

[key.ts:476](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L476)

***

#### toNumeric()

> **toNumeric**(`key`): [`Key`](#classeskeymd)

##### Parameters

###### key

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:431](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L431)

***

#### toNumericString()

> **toNumericString**(`key`): `string`

##### Parameters

###### key

`null` | [`Key`](#classeskeymd)

##### Returns

`string`

##### Defined in

[key.ts:452](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L452)

***

#### toString()

> **toString**(`__namedParameters`): `string`

Returns a string representation of an object.

##### Parameters

###### \_\_namedParameters

####### __namedParameters.showMinor

`boolean` = `true`

####### __namedParameters.useUnicodeModifier

`boolean` = `false`

##### Returns

`string`

##### Defined in

[key.ts:480](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L480)

***

#### transpose()

> **transpose**(`delta`): [`Key`](#classeskeymd)

##### Parameters

###### delta

`number`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:544](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L544)

***

#### transposeDown()

> **transposeDown**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:582](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L582)

***

#### transposeUp()

> **transposeUp**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:568](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L568)

***

#### useModifier()

> **useModifier**(`newModifier`): [`Key`](#classeskeymd)

##### Parameters

###### newModifier

`null` | `Modifier`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:625](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L625)

***

#### distance()

> `static` **distance**(`oneKey`, `otherKey`): `number`

Calculates the distance in semitones between one key and another.

##### Parameters

###### oneKey

`string` | [`Key`](#classeskeymd)

###### otherKey

`string` | [`Key`](#classeskeymd)

##### Returns

`number`

the distance in semitones

##### Defined in

[key.ts:245](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L245)

***

#### equals()

> `static` **equals**(`oneKey`, `otherKey`): `boolean`

##### Parameters

###### oneKey

`null` | [`Key`](#classeskeymd)

###### otherKey

`null` | [`Key`](#classeskeymd)

##### Returns

`boolean`

##### Defined in

[key.ts:419](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L419)

***

#### getNumberFromKey()

> `static` **getNumberFromKey**(`keyString`, `keyType`): `number`

##### Parameters

###### keyString

`string`

###### keyType

`ChordType`

##### Returns

`number`

##### Defined in

[key.ts:152](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L152)

***

#### isMinor()

> `static` **isMinor**(`key`, `keyType`, `minor`): `boolean`

##### Parameters

###### key

`string`

###### keyType

`ChordType`

###### minor

`undefined` | `string` | `boolean`

##### Returns

`boolean`

##### Defined in

[key.ts:193](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L193)

***

#### keyWithModifier()

> `static` **keyWithModifier**(`key`, `modifier`, `type`): `string`

##### Parameters

###### key

`string`

###### modifier

`null` | `Modifier`

###### type

`ChordType`

##### Returns

`string`

##### Defined in

[key.ts:161](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L161)

***

#### parse()

> `static` **parse**(`keyString`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### keyString

`null` | `string`

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[key.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L78)

***

#### parseAsType()

> `static` **parseAsType**(`trimmed`, `keyType`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### trimmed

`string`

###### keyType

`ChordType`

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[key.ts:93](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L93)

***

#### parseOrFail()

> `static` **parseOrFail**(`keyString`): [`Key`](#classeskeymd)

##### Parameters

###### keyString

`null` | `string`

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:209](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L209)

***

#### resolve()

> `static` **resolve**(`__namedParameters`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.key

`string` \| `number`

####### __namedParameters.keyType

`ChordType`

####### __namedParameters.minor

`string` \| `boolean`

####### __namedParameters.modifier

`null` \| `Modifier`

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[key.ts:108](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L108)

***

#### shiftGrade()

> `static` **shiftGrade**(`grade`): `any`

##### Parameters

###### grade

`number`

##### Returns

`any`

##### Defined in

[key.ts:617](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L617)

***

#### toGrade()

> `static` **toGrade**(`key`, `modifier`, `type`, `isMinor`): `null` \| `number`

##### Parameters

###### key

`string`

###### modifier

`ModifierMaybe`

###### type

`ChordType`

###### isMinor

`boolean`

##### Returns

`null` \| `number`

##### Defined in

[key.ts:176](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L176)

***

#### toString()

> `static` **toString**(`keyStringOrObject`): `string`

##### Parameters

###### keyStringOrObject

`string` | [`Key`](#classeskeymd)

##### Returns

`string`

##### Defined in

[key.ts:235](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L235)

***

#### wrap()

> `static` **wrap**(`keyStringOrObject`): `null` \| [`Key`](#classeskeymd)

##### Parameters

###### keyStringOrObject

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

`null` \| [`Key`](#classeskeymd)

##### Defined in

[key.ts:217](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L217)

***

#### wrapOrFail()

> `static` **wrapOrFail**(`keyStringOrObject`): [`Key`](#classeskeymd)

##### Parameters

###### keyStringOrObject

`null` | `string` | [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[key.ts:225](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/key.ts#L225)


<a name="classeslinemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Line

## Class: Line

Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag

### Constructors

#### new Line()

> **new Line**(`__namedParameters`): [`Line`](#classeslinemd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.items

`Item`[]

####### __namedParameters.type

`LineType`

##### Returns

[`Line`](#classeslinemd)

##### Defined in

[chord\_sheet/line.ts:62](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L62)

### Properties

#### chordFont

> **chordFont**: `Font`

The chord font that applies to this line. Is derived from the directives:
`chordfont`, `chordsize` and `chordcolour`
See: https://www.chordpro.org/chordpro/directives-props_chord_legacy/

##### Defined in

[chord\_sheet/line.ts:60](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L60)

***

#### currentChordLyricsPair

> **currentChordLyricsPair**: [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/line.ts:38](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L38)

***

#### items

> **items**: `Item`[] = `[]`

The items ([ChordLyricsPair](#classeschordlyricspairmd) or [Tag](#classestagmd) or [Comment](#classescommentmd)) of which the line consists

##### Defined in

[chord\_sheet/line.ts:29](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L29)

***

#### key

> **key**: `null` \| `string` = `null`

##### Defined in

[chord\_sheet/line.ts:40](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L40)

***

#### lineNumber

> **lineNumber**: `null` \| `number` = `null`

##### Defined in

[chord\_sheet/line.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L44)

***

#### textFont

> **textFont**: `Font`

The text font that applies to this line. Is derived from the directives:
`textfont`, `textsize` and `textcolour`
See: https://www.chordpro.org/chordpro/directives-props_text_legacy/

##### Defined in

[chord\_sheet/line.ts:52](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L52)

***

#### transposeKey

> **transposeKey**: `null` \| `string` = `null`

##### Defined in

[chord\_sheet/line.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L42)

***

#### type

> **type**: `LineType` = `NONE`

The line type, This is set by the ChordProParser when it read tags like {start_of_chorus} or {start_of_verse}
Values can be [VERSE](#variablesversemd), [CHORUS](#variableschorusmd) or [NONE](#variablesnonemd)

##### Defined in

[chord\_sheet/line.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L36)

### Accessors

#### \_tag

##### Get Signature

> **get** **\_tag**(): `null` \| [`Tag`](#classestagmd)

###### Returns

`null` \| [`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/line.ts:223](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L223)

### Methods

#### addChordLyricsPair()

> **addChordLyricsPair**(`chords`, `lyrics`): [`ChordLyricsPair`](#classeschordlyricspairmd)

##### Parameters

###### chords

`null` | `string` | [`ChordLyricsPair`](#classeschordlyricspairmd)

###### lyrics

`null` = `null`

##### Returns

[`ChordLyricsPair`](#classeschordlyricspairmd)

##### Defined in

[chord\_sheet/line.ts:174](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L174)

***

#### addComment()

> **addComment**(`content`): [`Comment`](#classescommentmd)

##### Parameters

###### content

`string` | [`Comment`](#classescommentmd)

##### Returns

[`Comment`](#classescommentmd)

##### Defined in

[chord\_sheet/line.ts:207](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L207)

***

#### addItem()

> **addItem**(`item`): `void`

Adds an item ([ChordLyricsPair](#classeschordlyricspairmd) or [Tag](#classestagmd)) to the line

##### Parameters

###### item

`Item`

The item to be added

##### Returns

`void`

##### Defined in

[chord\_sheet/line.ts:83](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L83)

***

#### addTag()

> **addTag**(`nameOrTag`, `value`): [`Tag`](#classestagmd)

##### Parameters

###### nameOrTag

`string` | [`Tag`](#classestagmd)

###### value

`null` | `string`

##### Returns

[`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/line.ts:201](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L201)

***

#### chords()

> **chords**(`chr`): `void`

##### Parameters

###### chr

`string`

##### Returns

`void`

##### Defined in

[chord\_sheet/line.ts:191](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L191)

***

#### clone()

> **clone**(): [`Line`](#classeslinemd)

Returns a deep copy of the line and all of its items

##### Returns

[`Line`](#classeslinemd)

##### Defined in

[chord\_sheet/line.ts:107](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L107)

***

#### ensureChordLyricsPair()

> **ensureChordLyricsPair**(): `void`

##### Returns

`void`

##### Defined in

[chord\_sheet/line.ts:185](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L185)

***

#### ~~hasContent()~~

> **hasContent**(): `boolean`

Indicates whether the line contains items that are renderable. Please use [hasRenderableItems](#hasrenderableitems)

##### Returns

`boolean`

##### Deprecated

##### Defined in

[chord\_sheet/line.ts:170](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L170)

***

#### hasRenderableItems()

> **hasRenderableItems**(): `boolean`

Indicates whether the line contains items that are renderable

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:99](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L99)

***

#### isBridge()

> **isBridge**(): `boolean`

Indicates whether the line type is BRIDGE

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:129](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L129)

***

#### isChorus()

> **isChorus**(): `boolean`

Indicates whether the line type is [CHORUS](#variableschorusmd)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:137](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L137)

***

#### isEmpty()

> **isEmpty**(): `boolean`

Indicates whether the line contains any items

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:71](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L71)

***

#### isGrid()

> **isGrid**(): `boolean`

Indicates whether the line type is GRID

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:145](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L145)

***

#### isNotEmpty()

> **isNotEmpty**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:75](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L75)

***

#### isSectionEnd()

> **isSectionEnd**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:241](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L241)

***

#### isSectionStart()

> **isSectionStart**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:237](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L237)

***

#### isTab()

> **isTab**(): `boolean`

Indicates whether the line type is [TAB](#variablestabmd)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:153](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L153)

***

#### isVerse()

> **isVerse**(): `boolean`

Indicates whether the line type is [VERSE](#variablesversemd)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/line.ts:161](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L161)

***

#### lyrics()

> **lyrics**(`chr`): `void`

##### Parameters

###### chr

`string`

##### Returns

`void`

##### Defined in

[chord\_sheet/line.ts:196](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L196)

***

#### mapItems()

> **mapItems**(`func`): [`Line`](#classeslinemd)

##### Parameters

###### func

`null` | `MapItemFunc`

##### Returns

[`Line`](#classeslinemd)

##### Defined in

[chord\_sheet/line.ts:111](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L111)

***

#### set()

> **set**(`properties`): [`Line`](#classeslinemd)

##### Parameters

###### properties

####### properties.items

`Item`[]

####### properties.type

`LineType`

##### Returns

[`Line`](#classeslinemd)

##### Defined in

[chord\_sheet/line.ts:213](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/line.ts#L213)


<a name="classesliteralmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Literal

## Class: Literal

### Extends

- `Evaluatable`

### Constructors

#### new Literal()

> **new Literal**(`string`): [`Literal`](#classesliteralmd)

##### Parameters

###### string

`string`

##### Returns

[`Literal`](#classesliteralmd)

##### Overrides

`Evaluatable.constructor`

##### Defined in

[chord\_sheet/chord\_pro/literal.ts:6](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/literal.ts#L6)

### Properties

#### column

> **column**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.column`

##### Defined in

[chord\_sheet/ast\_component.ts:6](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L6)

***

#### line

> **line**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.line`

##### Defined in

[chord\_sheet/ast\_component.ts:4](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L4)

***

#### offset

> **offset**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.offset`

##### Defined in

[chord\_sheet/ast\_component.ts:8](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L8)

***

#### string

> **string**: `string`

##### Defined in

[chord\_sheet/chord\_pro/literal.ts:4](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/literal.ts#L4)

### Methods

#### clone()

> **clone**(): [`Literal`](#classesliteralmd)

##### Returns

[`Literal`](#classesliteralmd)

##### Overrides

`Evaluatable.clone`

##### Defined in

[chord\_sheet/chord\_pro/literal.ts:19](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/literal.ts#L19)

***

#### evaluate()

> **evaluate**(): `string`

##### Returns

`string`

##### Overrides

`Evaluatable.evaluate`

##### Defined in

[chord\_sheet/chord\_pro/literal.ts:11](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/literal.ts#L11)

***

#### isRenderable()

> **isRenderable**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/chord\_pro/literal.ts:15](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/literal.ts#L15)


<a name="classesmetadatamd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Metadata

## Class: Metadata

Stores song metadata. Properties can be accessed using the get() method:

const metadata = new Metadata({ author: 'John' });
metadata.get('author')   // => 'John'

See [Metadata#get](#get)

### Extends

- `MetadataAccessors`

### Constructors

#### new Metadata()

> **new Metadata**(`metadata`): [`Metadata`](#classesmetadatamd)

##### Parameters

###### metadata

`Record`\<`string`, `string` \| `string`[]\> = `{}`

##### Returns

[`Metadata`](#classesmetadatamd)

##### Overrides

`MetadataAccessors.constructor`

##### Defined in

[chord\_sheet/metadata.ts:28](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L28)

### Properties

#### metadata

> **metadata**: `Record`\<`string`, `string` \| `string`[]\> = `{}`

##### Defined in

[chord\_sheet/metadata.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L26)

### Accessors

#### album

##### Get Signature

> **get** **album**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.album`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:38](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L38)

***

#### artist

##### Get Signature

> **get** **artist**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.artist`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L44)

***

#### capo

##### Get Signature

> **get** **capo**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.capo`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:28](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L28)

***

#### composer

##### Get Signature

> **get** **composer**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.composer`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L46)

***

#### copyright

##### Get Signature

> **get** **copyright**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.copyright`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:40](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L40)

***

#### duration

##### Get Signature

> **get** **duration**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.duration`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:30](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L30)

***

#### key

##### Get Signature

> **get** **key**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.key`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:22](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L22)

***

#### lyricist

##### Get Signature

> **get** **lyricist**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.lyricist`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L42)

***

#### subtitle

##### Get Signature

> **get** **subtitle**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.subtitle`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L26)

***

#### tempo

##### Get Signature

> **get** **tempo**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.tempo`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:32](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L32)

***

#### time

##### Get Signature

> **get** **time**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.time`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:34](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L34)

***

#### title

##### Get Signature

> **get** **title**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.title`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L24)

***

#### year

##### Get Signature

> **get** **year**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.year`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L36)

### Methods

#### add()

> **add**(`key`, `value`): `void`

##### Parameters

###### key

`string`

###### value

`string`

##### Returns

`void`

##### Defined in

[chord\_sheet/metadata.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L46)

***

#### calculateKeyFromCapo()

> **calculateKeyFromCapo**(): `null` \| `string`

##### Returns

`null` \| `string`

##### Defined in

[chord\_sheet/metadata.ts:178](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L178)

***

#### clone()

> **clone**(): [`Metadata`](#classesmetadatamd)

Returns a deep clone of this Metadata object

##### Returns

[`Metadata`](#classesmetadatamd)

the cloned Metadata object

##### Defined in

[chord\_sheet/metadata.ts:174](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L174)

***

#### contains()

> **contains**(`key`): `boolean`

##### Parameters

###### key

`string`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/metadata.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L42)

***

#### get()

> **get**(`prop`): `null` \| `string` \| `string`[]

Reads a metadata value by key. This method supports simple value lookup, as well as fetching single array values.

This method deprecates direct property access, eg: metadata['author']

Examples:

const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
metadata.get('lyricist') // => 'Pete'
metadata.get('author')   // => ['John', 'Mary']
metadata.get('author.1') // => 'John'
metadata.get('author.2') // => 'Mary'

Using a negative index will start counting at the end of the list:

const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
metadata.get('author.-1') // => 'Mary'
metadata.get('author.-2') // => 'John'

##### Parameters

###### prop

`string`

the property name

##### Returns

`null` \| `string` \| `string`[]

the metadata value(s). If there is only one value, it will return a String,
else it returns an array of strings.

##### Defined in

[chord\_sheet/metadata.ts:109](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L109)

***

#### getArrayItem()

> **getArrayItem**(`prop`): `null` \| `string`

##### Parameters

###### prop

`string`

##### Returns

`null` \| `string`

##### Defined in

[chord\_sheet/metadata.ts:150](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L150)

***

#### getMetadata()

> **getMetadata**(`name`): `null` \| `string` \| `string`[]

##### Parameters

###### name

`string`

##### Returns

`null` \| `string` \| `string`[]

##### Overrides

`MetadataAccessors.getMetadata`

##### Defined in

[chord\_sheet/metadata.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L78)

***

#### getSingleMetadata()

> **getSingleMetadata**(`name`): `null` \| `string`

##### Parameters

###### name

`string`

##### Returns

`null` \| `string`

##### Overrides

`MetadataAccessors.getSingleMetadata`

##### Defined in

[chord\_sheet/metadata.ts:82](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L82)

***

#### merge()

> **merge**(`metadata`): [`Metadata`](#classesmetadatamd)

##### Parameters

###### metadata

`Record`\<`string`, `string` \| `string`[]\>

##### Returns

[`Metadata`](#classesmetadatamd)

##### Defined in

[chord\_sheet/metadata.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L36)

***

#### parseArrayKey()

> **parseArrayKey**(`prop`): `null` \| [`string`, `number`]

##### Parameters

###### prop

`string`

##### Returns

`null` \| [`string`, `number`]

##### Defined in

[chord\_sheet/metadata.ts:138](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L138)

***

#### set()

> **set**(`key`, `value`): `void`

##### Parameters

###### key

`string`

###### value

`null` | `string`

##### Returns

`void`

##### Defined in

[chord\_sheet/metadata.ts:70](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata.ts#L70)


<a name="classesparagraphmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Paragraph

## Class: Paragraph

Represents a paragraph of lines in a chord sheet

### Constructors

#### new Paragraph()

> **new Paragraph**(): [`Paragraph`](#classesparagraphmd)

##### Returns

[`Paragraph`](#classesparagraphmd)

### Properties

#### lines

> **lines**: [`Line`](#classeslinemd)[] = `[]`

The [Line](#classeslinemd) items of which the paragraph consists

##### Member

##### Defined in

[chord\_sheet/paragraph.ts:16](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L16)

### Accessors

#### contents

##### Get Signature

> **get** **contents**(): `string`

Returns the paragraph contents as one string where lines are separated by newlines

###### Returns

`string`

##### Defined in

[chord\_sheet/paragraph.ts:52](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L52)

***

#### label

##### Get Signature

> **get** **label**(): `null` \| `string`

Returns the label of the paragraph. The label is the value of the first section delimiter tag
in the first line.

###### Returns

`null` \| `string`

##### Defined in

[chord\_sheet/paragraph.ts:68](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L68)

***

#### type

##### Get Signature

> **get** **type**(): `LineType`

Tries to determine the common type for all lines. If the types for all lines are equal, it returns that type.
If not, it returns [INDETERMINATE](#variablesindeterminatemd)

###### Returns

`LineType`

##### Defined in

[chord\_sheet/paragraph.ts:87](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L87)

### Methods

#### addLine()

> **addLine**(`line`): `void`

##### Parameters

###### line

`any`

##### Returns

`void`

##### Defined in

[chord\_sheet/paragraph.ts:18](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L18)

***

#### hasRenderableItems()

> **hasRenderableItems**(): `boolean`

Indicates whether the paragraph contains lines with renderable items.

##### Returns

`boolean`

##### See

[Line.hasRenderableItems](#hasrenderableitems)

##### Defined in

[chord\_sheet/paragraph.ts:103](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L103)

***

#### isEmpty()

> **isEmpty**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/paragraph.ts:107](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L107)

***

#### isLiteral()

> **isLiteral**(): `boolean`

Indicates whether the paragraph only contains literals. If true, [contents](#contents) can be used to retrieve
the paragraph contents as one string where lines are separated by newlines.

##### Returns

`boolean`

##### See

[contents](#contents)

##### Defined in

[chord\_sheet/paragraph.ts:28](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/paragraph.ts#L28)


<a name="classessoftlinebreakmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / SoftLineBreak

## Class: SoftLineBreak

### Constructors

#### new SoftLineBreak()

> **new SoftLineBreak**(): [`SoftLineBreak`](#classessoftlinebreakmd)

##### Returns

[`SoftLineBreak`](#classessoftlinebreakmd)

### Methods

#### clone()

> **clone**(): [`SoftLineBreak`](#classessoftlinebreakmd)

##### Returns

[`SoftLineBreak`](#classessoftlinebreakmd)

##### Defined in

[chord\_sheet/soft\_line\_break.ts:2](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/soft_line_break.ts#L2)


<a name="classessongmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Song

## Class: Song

Represents a song in a chord sheet. Currently a chord sheet can only have one song.

### Extends

- `MetadataAccessors`

### Constructors

#### new Song()

> **new Song**(`metadata`): [`Song`](#classessongmd)

Creates a new {Song} instance

##### Parameters

###### metadata

{Object|Metadata} predefined metadata

##### Returns

[`Song`](#classessongmd)

##### Overrides

`MetadataAccessors.constructor`

##### Defined in

[chord\_sheet/song.ts:54](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L54)

### Properties

#### \_bodyLines

> **\_bodyLines**: `null` \| [`Line`](#classeslinemd)[] = `null`

##### Defined in

[chord\_sheet/song.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L44)

***

#### \_bodyParagraphs

> **\_bodyParagraphs**: `null` \| [`Paragraph`](#classesparagraphmd)[] = `null`

##### Defined in

[chord\_sheet/song.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L46)

***

#### lines

> **lines**: [`Line`](#classeslinemd)[] = `[]`

The [Line](#classeslinemd) items of which the song consists

##### Member

##### Defined in

[chord\_sheet/song.ts:35](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L35)

***

#### metadata

> **metadata**: [`Metadata`](#classesmetadatamd)

The song's metadata. When there is only one value for an entry, the value is a string. Else, the value is
an array containing all unique values for the entry.

##### Defined in

[chord\_sheet/song.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L42)

***

#### warnings

> **warnings**: `ParserWarning`[] = `[]`

##### Defined in

[chord\_sheet/song.ts:48](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L48)

### Accessors

#### album

##### Get Signature

> **get** **album**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.album`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:38](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L38)

***

#### artist

##### Get Signature

> **get** **artist**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.artist`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L44)

***

#### bodyLines

##### Get Signature

> **get** **bodyLines**(): [`Line`](#classeslinemd)[]

Returns the song lines, skipping the leading empty lines (empty as in not rendering any content). This is useful
if you want to skip the "header lines": the lines that only contain meta data.

###### Returns

[`Line`](#classeslinemd)[]

The song body lines

##### Defined in

[chord\_sheet/song.ts:64](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L64)

***

#### bodyParagraphs

##### Get Signature

> **get** **bodyParagraphs**(): [`Paragraph`](#classesparagraphmd)[]

Returns the song paragraphs, skipping the paragraphs that only contain empty lines
(empty as in not rendering any content)

###### See

[bodyLines](#bodylines)

###### Returns

[`Paragraph`](#classesparagraphmd)[]

##### Defined in

[chord\_sheet/song.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L78)

***

#### capo

##### Get Signature

> **get** **capo**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.capo`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:28](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L28)

***

#### composer

##### Get Signature

> **get** **composer**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.composer`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:46](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L46)

***

#### copyright

##### Get Signature

> **get** **copyright**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.copyright`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:40](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L40)

***

#### duration

##### Get Signature

> **get** **duration**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.duration`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:30](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L30)

***

#### expandedBodyParagraphs

##### Get Signature

> **get** **expandedBodyParagraphs**(): [`Paragraph`](#classesparagraphmd)[]

The body paragraphs of the song, with any `{chorus}` tag expanded into the targeted chorus

###### Returns

[`Paragraph`](#classesparagraphmd)[]

##### Defined in

[chord\_sheet/song.ts:156](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L156)

***

#### key

##### Get Signature

> **get** **key**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.key`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:22](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L22)

***

#### lyricist

##### Get Signature

> **get** **lyricist**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.lyricist`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L42)

***

#### paragraphs

##### Get Signature

> **get** **paragraphs**(): [`Paragraph`](#classesparagraphmd)[]

The [Paragraph](#classesparagraphmd) items of which the song consists

###### Member

###### Returns

[`Paragraph`](#classesparagraphmd)[]

##### Defined in

[chord\_sheet/song.ts:148](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L148)

***

#### subtitle

##### Get Signature

> **get** **subtitle**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.subtitle`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L26)

***

#### tempo

##### Get Signature

> **get** **tempo**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.tempo`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:32](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L32)

***

#### time

##### Get Signature

> **get** **time**(): `null` \| `string` \| `string`[]

###### Returns

`null` \| `string` \| `string`[]

##### Inherited from

`MetadataAccessors.time`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:34](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L34)

***

#### title

##### Get Signature

> **get** **title**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.title`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L24)

***

#### year

##### Get Signature

> **get** **year**(): `null` \| `string`

###### Returns

`null` \| `string`

##### Inherited from

`MetadataAccessors.year`

##### Defined in

[chord\_sheet/metadata\_accessors.ts:36](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/metadata_accessors.ts#L36)

### Methods

#### addLine()

> **addLine**(`line`): `void`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`void`

##### Defined in

[chord\_sheet/song.ts:380](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L380)

***

#### changeKey()

> **changeKey**(`newKey`): [`Song`](#classessongmd)

Returns a copy of the song with the key set to the specified key. It changes:
- the value for `key` in the [metadata](#metadata) set
- any existing `key` directive
- all chords, those are transposed according to the distance between the current and the new key

##### Parameters

###### newKey

`string` | [`Key`](#classeskeymd)

##### Returns

[`Song`](#classessongmd)

The changed song

##### Defined in

[chord\_sheet/song.ts:304](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L304)

***

#### changeMetadata()

> **changeMetadata**(`name`, `value`): [`Song`](#classessongmd)

Returns a copy of the song with the directive value set to the specified value.
- when there is a matching directive in the song, it will update the directive
- when there is no matching directive, it will be inserted
If `value` is `null` it will act as a delete, any directive matching `name` will be removed.

##### Parameters

###### name

`string`

The directive name

###### value

`null` | `string`

##### Returns

[`Song`](#classessongmd)

##### Defined in

[chord\_sheet/song.ts:357](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L357)

***

#### clone()

> **clone**(): [`Song`](#classessongmd)

Returns a deep clone of the song

##### Returns

[`Song`](#classessongmd)

The cloned song

##### Defined in

[chord\_sheet/song.ts:186](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L186)

***

#### foreachItem()

> **foreachItem**(`func`): `void`

##### Parameters

###### func

`EachItemCallback`

##### Returns

`void`

##### Defined in

[chord\_sheet/song.ts:417](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L417)

***

#### getChordDefinitions()

> **getChordDefinitions**(): `Record`\<`string`, [`ChordDefinition`](#classeschorddefinitionmd)\>

Returns all chord definitions from the song.
Definitions are made using the `{chord}` or `{define}` directive.
A chord definitions overrides a previous chord definition for the exact same chord.

##### Returns

`Record`\<`string`, [`ChordDefinition`](#classeschorddefinitionmd)\>

the chord definitions

##### See

 - https://chordpro.org/chordpro/directives-define/
 - https://chordpro.org/chordpro/directives-chord/

##### Defined in

[chord\_sheet/song.ts:453](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L453)

***

#### getChords()

> **getChords**(): `string`[]

Returns all unique chords used in the song

##### Returns

`string`[]

the chords

##### Defined in

[chord\_sheet/song.ts:427](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L427)

***

#### getMetadata()

> **getMetadata**(`name`): `null` \| `string` \| `string`[]

##### Parameters

###### name

`string`

##### Returns

`null` \| `string` \| `string`[]

##### Overrides

`MetadataAccessors.getMetadata`

##### Defined in

[chord\_sheet/song.ts:194](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L194)

***

#### getSingleMetadata()

> **getSingleMetadata**(`name`): `null` \| `string`

##### Parameters

###### name

`string`

##### Returns

`null` \| `string`

##### Overrides

`MetadataAccessors.getSingleMetadata`

##### Defined in

[chord\_sheet/song.ts:198](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L198)

***

#### linesToParagraphs()

> **linesToParagraphs**(`lines`): [`Paragraph`](#classesparagraphmd)[]

##### Parameters

###### lines

[`Line`](#classeslinemd)[]

##### Returns

[`Paragraph`](#classesparagraphmd)[]

##### Defined in

[chord\_sheet/song.ts:164](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L164)

***

#### mapItems()

> **mapItems**(`func`): [`Song`](#classessongmd)

Change the song contents inline. Return a new Item to replace it. Return `null` to remove it.

##### Parameters

###### func

`MapItemsCallback`

the callback function

##### Returns

[`Song`](#classessongmd)

the changed song

##### Example

```ts
// transpose all chords:
song.mapItems((item) => {
  if (item instanceof ChordLyricsPair) {
    return item.transpose(2, 'D');
  }

  return item;
});
```

##### Defined in

[chord\_sheet/song.ts:398](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L398)

***

#### mapLines()

> **mapLines**(`func`): [`Song`](#classessongmd)

Change the song contents inline. Return a new [Line](#classeslinemd) to replace it. Return `null` to remove it.

##### Parameters

###### func

`MapLinesCallback`

the callback function

##### Returns

[`Song`](#classessongmd)

the changed song

##### Example

```ts
// remove lines with only Tags:
song.mapLines((line) => {
  if (line.items.every(item => item instanceof Tag)) {
    return null;
  }

  return line;
});
```

##### Defined in

[chord\_sheet/song.ts:485](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L485)

***

#### requireCurrentKey()

> **requireCurrentKey**(): [`Key`](#classeskeymd)

##### Returns

[`Key`](#classeskeymd)

##### Defined in

[chord\_sheet/song.ts:332](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L332)

***

#### selectRenderableItems()

> **selectRenderableItems**(`items`): ([`Line`](#classeslinemd) \| [`Paragraph`](#classesparagraphmd))[]

##### Parameters

###### items

([`Line`](#classeslinemd) \| [`Paragraph`](#classesparagraphmd))[]

##### Returns

([`Line`](#classeslinemd) \| [`Paragraph`](#classesparagraphmd))[]

##### Defined in

[chord\_sheet/song.ts:86](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L86)

***

#### setCapo()

> **setCapo**(`capo`): [`Song`](#classessongmd)

Returns a copy of the song with the key value set to the specified capo. It changes:
- the value for `capo` in the [metadata](#metadata) set
- any existing `capo` directive

##### Parameters

###### capo

`null` | `number`

##### Returns

[`Song`](#classessongmd)

The changed song

##### Defined in

[chord\_sheet/song.ts:225](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L225)

***

#### setKey()

> **setKey**(`key`): [`Song`](#classessongmd)

Returns a copy of the song with the key value set to the specified key. It changes:
- the value for `key` in the [metadata](#metadata) set
- any existing `key` directive

##### Parameters

###### key

`null` | `string` | `number`

##### Returns

[`Song`](#classessongmd)

The changed song

##### Defined in

[chord\_sheet/song.ts:211](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L211)

***

#### setMetadata()

> **setMetadata**(`name`, `value`): `void`

##### Parameters

###### name

`string`

###### value

`string`

##### Returns

`void`

##### Defined in

[chord\_sheet/song.ts:190](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L190)

***

#### transpose()

> **transpose**(`delta`, `options`?): [`Song`](#classessongmd)

Transposes the song by the specified delta. It will:
- transpose all chords, see: [Chord#transpose](#transpose)
- transpose the song key in [metadata](#metadata)
- update any existing `key` directive

##### Parameters

###### delta

`number`

The number of semitones (positive or negative) to transpose with

###### options?

options

####### options.normalizeChordSuffix

`boolean` = `false`

whether to normalize the chord suffixes after transposing

##### Returns

[`Song`](#classessongmd)

The transposed song

##### Defined in

[chord\_sheet/song.ts:252](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L252)

***

#### transposeDown()

> **transposeDown**(`options`?): [`Song`](#classessongmd)

Transposes the song down by one semitone. It will:
- transpose all chords, see: [Chord#transpose](#transpose)
- transpose the song key in [metadata](#metadata)
- update any existing `key` directive

##### Parameters

###### options?

options

####### options.normalizeChordSuffix

`boolean` = `false`

whether to normalize the chord suffixes after transposing

##### Returns

[`Song`](#classessongmd)

The transposed song

##### Defined in

[chord\_sheet/song.ts:292](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L292)

***

#### transposeUp()

> **transposeUp**(`options`?): [`Song`](#classessongmd)

Transposes the song up by one semitone. It will:
- transpose all chords, see: [Chord#transpose](#transpose)
- transpose the song key in [metadata](#metadata)
- update any existing `key` directive

##### Parameters

###### options?

options

####### options.normalizeChordSuffix

`boolean` = `false`

whether to normalize the chord suffixes after transposing

##### Returns

[`Song`](#classessongmd)

The transposed song

##### Defined in

[chord\_sheet/song.ts:279](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L279)

***

#### useModifier()

> **useModifier**(`modifier`): [`Song`](#classessongmd)

Returns a copy of the song with all chords changed to the specified modifier.

##### Parameters

###### modifier

`Modifier`

the new modifier

##### Returns

[`Song`](#classessongmd)

the changed song

##### Defined in

[chord\_sheet/song.ts:322](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/song.ts#L322)


<a name="classestagmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Tag

## Class: Tag

Represents a tag/directive. See https://www.chordpro.org/chordpro/chordpro-directives/

### Extends

- `AstComponent`

### Constructors

#### new Tag()

> **new Tag**(`name`, `value`, `traceInfo`): [`Tag`](#classestagmd)

##### Parameters

###### name

`string`

###### value

`null` | `string`

###### traceInfo

`null` | `TraceInfo`

##### Returns

[`Tag`](#classestagmd)

##### Overrides

`AstComponent.constructor`

##### Defined in

[chord\_sheet/tag.ts:412](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L412)

### Properties

#### \_isMetaTag

> **\_isMetaTag**: `boolean` = `false`

##### Defined in

[chord\_sheet/tag.ts:402](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L402)

***

#### \_name

> **\_name**: `string` = `''`

##### Defined in

[chord\_sheet/tag.ts:406](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L406)

***

#### \_originalName

> **\_originalName**: `string` = `''`

##### Defined in

[chord\_sheet/tag.ts:404](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L404)

***

#### \_value

> **\_value**: `string` = `''`

##### Defined in

[chord\_sheet/tag.ts:408](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L408)

***

#### chordDefinition?

> `optional` **chordDefinition**: [`ChordDefinition`](#classeschorddefinitionmd)

##### Defined in

[chord\_sheet/tag.ts:410](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L410)

***

#### column

> **column**: `null` \| `number` = `null`

##### Inherited from

`AstComponent.column`

##### Defined in

[chord\_sheet/ast\_component.ts:6](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L6)

***

#### line

> **line**: `null` \| `number` = `null`

##### Inherited from

`AstComponent.line`

##### Defined in

[chord\_sheet/ast\_component.ts:4](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L4)

***

#### offset

> **offset**: `null` \| `number` = `null`

##### Inherited from

`AstComponent.offset`

##### Defined in

[chord\_sheet/ast\_component.ts:8](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L8)

### Accessors

#### name

##### Get Signature

> **get** **name**(): `string`

The tag full name. When the original tag used the short name, `name` will return the full name.

###### Member

###### Returns

`string`

##### Set Signature

> **set** **name**(`name`): `void`

###### Parameters

####### name

`string`

###### Returns

`void`

##### Defined in

[chord\_sheet/tag.ts:491](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L491)

***

#### originalName

##### Get Signature

> **get** **originalName**(): `string`

The original tag name that was used to construct the tag.

###### Member

###### Returns

`string`

##### Defined in

[chord\_sheet/tag.ts:500](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L500)

***

#### value

##### Get Signature

> **get** **value**(): `string`

The tag value

###### Member

###### Returns

`string`

##### Set Signature

> **set** **value**(`value`): `void`

###### Parameters

####### value

`string`

###### Returns

`void`

##### Defined in

[chord\_sheet/tag.ts:513](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L513)

### Methods

#### clone()

> **clone**(): [`Tag`](#classestagmd)

Returns a clone of the tag.

##### Returns

[`Tag`](#classestagmd)

The cloned tag

##### Overrides

`AstComponent.clone`

##### Defined in

[chord\_sheet/tag.ts:555](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L555)

***

#### hasRenderableLabel()

> **hasRenderableLabel**(): `boolean`

Check whether this tag's label (if any) should be rendered, as applicable to tags like
`start_of_verse` and `start_of_chorus`.
See https://chordpro.org/chordpro/directives-env_chorus/, https://chordpro.org/chordpro/directives-env_verse/,
https://chordpro.org/chordpro/directives-env_bridge/, https://chordpro.org/chordpro/directives-env_tab/

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:539](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L539)

***

#### hasValue()

> **hasValue**(): `boolean`

Checks whether the tag value is a non-empty string.

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:521](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L521)

***

#### isInlineFontTag()

> **isInlineFontTag**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:477](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L477)

***

#### isMetaTag()

> **isMetaTag**(): `boolean`

Checks whether the tag is either a standard meta tag or a custom meta directive (`{x_some_name}`)

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:547](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L547)

***

#### isRenderable()

> **isRenderable**(): `boolean`

Checks whether the tag is usually rendered inline. It currently only applies to comment tags.

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:529](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L529)

***

#### isSectionDelimiter()

> **isSectionDelimiter**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:465](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L465)

***

#### isSectionEnd()

> **isSectionEnd**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:473](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L473)

***

#### isSectionStart()

> **isSectionStart**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/tag.ts:469](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L469)

***

#### set()

> **set**(`__namedParameters`): [`Tag`](#classestagmd)

##### Parameters

###### \_\_namedParameters

####### __namedParameters.value

`string`

##### Returns

[`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/tag.ts:563](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L563)

***

#### toString()

> **toString**(): `string`

Returns a string representation of an object.

##### Returns

`string`

##### Defined in

[chord\_sheet/tag.ts:559](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L559)

***

#### parse()

> `static` **parse**(`tag`): `null` \| [`Tag`](#classestagmd)

##### Parameters

###### tag

`string` | [`Tag`](#classestagmd)

##### Returns

`null` \| [`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/tag.ts:437](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L437)

***

#### parseOrFail()

> `static` **parseOrFail**(`tag`): [`Tag`](#classestagmd)

##### Parameters

###### tag

`string` | [`Tag`](#classestagmd)

##### Returns

[`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/tag.ts:455](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L455)

***

#### parseWithRegex()

> `static` **parseWithRegex**(`tag`, `regex`): `null` \| [`Tag`](#classestagmd)

##### Parameters

###### tag

`string`

###### regex

`RegExp`

##### Returns

`null` \| [`Tag`](#classestagmd)

##### Defined in

[chord\_sheet/tag.ts:445](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/tag.ts#L445)


<a name="classesternarymd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / Ternary

## Class: Ternary

### Extends

- `Evaluatable`

### Constructors

#### new Ternary()

> **new Ternary**(`__namedParameters`): [`Ternary`](#classesternarymd)

##### Parameters

###### \_\_namedParameters

`TernaryProperties`

##### Returns

[`Ternary`](#classesternarymd)

##### Overrides

`Evaluatable.constructor`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L24)

### Properties

#### column

> **column**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.column`

##### Defined in

[chord\_sheet/ast\_component.ts:6](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L6)

***

#### falseExpression

> **falseExpression**: `Evaluatable`[] = `[]`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:22](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L22)

***

#### line

> **line**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.line`

##### Defined in

[chord\_sheet/ast\_component.ts:4](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L4)

***

#### offset

> **offset**: `null` \| `number` = `null`

##### Inherited from

`Evaluatable.offset`

##### Defined in

[chord\_sheet/ast\_component.ts:8](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/ast_component.ts#L8)

***

#### trueExpression

> **trueExpression**: `Evaluatable`[] = `[]`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:20](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L20)

***

#### valueTest

> **valueTest**: `null` \| `string`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:18](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L18)

***

#### variable

> **variable**: `null` \| `string`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:16](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L16)

### Methods

#### clone()

> **clone**(): [`Ternary`](#classesternarymd)

##### Returns

[`Ternary`](#classesternarymd)

##### Overrides

`Evaluatable.clone`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:98](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L98)

***

#### evaluate()

> **evaluate**(`metadata`, `metadataSeparator`?, `upperContext`?): `string`

Evaluate the meta expression

##### Parameters

###### metadata

[`Metadata`](#classesmetadatamd)

The metadata object to use for evaluating the expression

###### metadataSeparator?

`string`

The metadata separator to use if necessary

###### upperContext?

`null` | `string`

##### Returns

`string`

The evaluated expression

##### Overrides

`Evaluatable.evaluate`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:48](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L48)

***

#### evaluateForTruthyValue()

> **evaluateForTruthyValue**(`metadata`, `metadataSeparator`, `value`): `string`

##### Parameters

###### metadata

[`Metadata`](#classesmetadatamd)

###### metadataSeparator

`string`

###### value

`string` | `string`[]

##### Returns

`string`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:86](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L86)

***

#### evaluateToString()

> **evaluateToString**(`value`, `metadataSeparator`): `string`

##### Parameters

###### value

`string` | `string`[]

###### metadataSeparator

`string`

##### Returns

`string`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:60](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L60)

***

#### evaluateWithVariable()

> **evaluateWithVariable**(`metadata`, `metadataSeparator`): `string`

##### Parameters

###### metadata

[`Metadata`](#classesmetadatamd)

###### metadataSeparator

`string`

##### Returns

`string`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:68](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L68)

***

#### isRenderable()

> **isRenderable**(): `boolean`

##### Returns

`boolean`

##### Defined in

[chord\_sheet/chord\_pro/ternary.ts:94](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/chord_sheet/chord_pro/ternary.ts#L94)


<a name="classestextformattermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / TextFormatter

## Class: TextFormatter

Formats a song into a plain text chord sheet

### Extends

- [`Formatter`](#classesformattermd)

### Constructors

#### new TextFormatter()

> **new TextFormatter**(`configuration`?): [`TextFormatter`](#classestextformattermd)

Instantiate

##### Parameters

###### configuration?

`Partial`\<`ConfigurationProperties`\> = `{}`

options

##### Returns

[`TextFormatter`](#classestextformattermd)

##### Inherited from

[`Formatter`](#classesformattermd).[`constructor`](#constructors)

##### Defined in

[formatter/formatter.ts:26](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L26)

### Properties

#### configuration

> **configuration**: `Configuration`

##### Inherited from

[`Formatter`](#classesformattermd).[`configuration`](#configuration)

##### Defined in

[formatter/formatter.ts:7](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/formatter.ts#L7)

***

#### song

> **song**: [`Song`](#classessongmd)

##### Defined in

[formatter/text\_formatter.ts:17](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L17)

### Methods

#### chordLyricsPairLength()

> **chordLyricsPairLength**(`chordLyricsPair`, `line`): `number`

##### Parameters

###### chordLyricsPair

[`ChordLyricsPair`](#classeschordlyricspairmd)

###### line

[`Line`](#classeslinemd)

##### Returns

`number`

##### Defined in

[formatter/text\_formatter.ts:102](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L102)

***

#### format()

> **format**(`song`): `string`

Formats a song into a plain text chord sheet

##### Parameters

###### song

[`Song`](#classessongmd)

The song to be formatted

##### Returns

`string`

the chord sheet

##### Defined in

[formatter/text\_formatter.ts:24](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L24)

***

#### formatHeader()

> **formatHeader**(): `string`

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:33](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L33)

***

#### formatItemBottom()

> **formatItemBottom**(`item`, `metadata`, `line`): `string`

##### Parameters

###### item

`Item`

###### metadata

[`Metadata`](#classesmetadatamd)

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:161](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L161)

***

#### formatItemTop()

> **formatItemTop**(`item`, `_metadata`, `line`): `string`

##### Parameters

###### item

`Item`

###### \_metadata

[`Metadata`](#classesmetadatamd)

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:129](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L129)

***

#### formatLine()

> **formatLine**(`line`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:66](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L66)

***

#### formatLineBottom()

> **formatLineBottom**(`line`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:142](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L142)

***

#### formatLineTop()

> **formatLineTop**(`line`, `metadata`): `null` \| `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`null` \| `string`

##### Defined in

[formatter/text\_formatter.ts:94](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L94)

***

#### formatLineWithFormatter()

> **formatLineWithFormatter**(`line`, `formatter`, `metadata`): `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

###### formatter

(`_item`, `_metadata`, `_line`) => `string`

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:150](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L150)

***

#### formatParagraph()

> **formatParagraph**(`paragraph`, `metadata`): `string`

##### Parameters

###### paragraph

[`Paragraph`](#classesparagraphmd)

###### metadata

[`Metadata`](#classesmetadatamd)

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:53](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L53)

***

#### formatParagraphs()

> **formatParagraphs**(): `string`

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:44](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L44)

***

#### formatSubTitle()

> **formatSubTitle**(`subtitle`): `string`

##### Parameters

###### subtitle

`null` | `string`

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:86](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L86)

***

#### formatTitle()

> **formatTitle**(`title`): `string`

##### Parameters

###### title

`null` | `string`

##### Returns

`string`

##### Defined in

[formatter/text\_formatter.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/formatter/text_formatter.ts#L78)


<a name="classesultimateguitarparsermd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / UltimateGuitarParser

## Class: UltimateGuitarParser

Parses an Ultimate Guitar chord sheet with metadata
Inherits from [ChordSheetParser](#classeschordsheetparsermd)

### Extends

- [`ChordSheetParser`](#classeschordsheetparsermd)

### Constructors

#### new UltimateGuitarParser()

> **new UltimateGuitarParser**(`options`?): [`UltimateGuitarParser`](#classesultimateguitarparsermd)

Instantiate a chord sheet parser

##### Parameters

###### options?

options

####### options.preserveWhitespace

`boolean` = `true`

whether to preserve trailing whitespace for chords

##### Returns

[`UltimateGuitarParser`](#classesultimateguitarparsermd)

##### Overrides

[`ChordSheetParser`](#classeschordsheetparsermd).[`constructor`](#constructors)

##### Defined in

[parser/ultimate\_guitar\_parser.ts:38](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L38)

### Properties

#### chordLyricsPair

> **chordLyricsPair**: `null` \| [`ChordLyricsPair`](#classeschordlyricspairmd) = `null`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`chordLyricsPair`](#chordlyricspair)

##### Defined in

[parser/chord\_sheet\_parser.ts:31](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L31)

***

#### currentLine

> **currentLine**: `number` = `0`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`currentLine`](#currentline)

##### Defined in

[parser/chord\_sheet\_parser.ts:35](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L35)

***

#### currentSectionType

> **currentSectionType**: `null` \| `string` = `null`

##### Defined in

[parser/ultimate\_guitar\_parser.ts:31](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L31)

***

#### lineCount

> **lineCount**: `number` = `0`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`lineCount`](#linecount)

##### Defined in

[parser/chord\_sheet\_parser.ts:37](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L37)

***

#### lines

> **lines**: `string`[] = `[]`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`lines`](#lines)

##### Defined in

[parser/chord\_sheet\_parser.ts:33](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L33)

***

#### preserveWhitespace

> **preserveWhitespace**: `boolean` = `true`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`preserveWhitespace`](#preservewhitespace)

##### Defined in

[parser/chord\_sheet\_parser.ts:23](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L23)

***

#### processingText

> **processingText**: `boolean` = `true`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`processingText`](#processingtext)

##### Defined in

[parser/chord\_sheet\_parser.ts:21](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L21)

***

#### song

> **song**: [`Song`](#classessongmd)

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`song`](#song)

##### Defined in

[parser/chord\_sheet\_parser.ts:25](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L25)

***

#### songBuilder

> **songBuilder**: `SongBuilder`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`songBuilder`](#songbuilder)

##### Defined in

[parser/chord\_sheet\_parser.ts:27](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L27)

***

#### songLine

> **songLine**: `null` \| [`Line`](#classeslinemd) = `null`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`songLine`](#songline)

##### Defined in

[parser/chord\_sheet\_parser.ts:29](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L29)

### Methods

#### addCharacter()

> **addCharacter**(`chr`, `nextChar`): `void`

##### Parameters

###### chr

`any`

###### nextChar

`any`

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`addCharacter`](#addcharacter)

##### Defined in

[parser/chord\_sheet\_parser.ts:160](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L160)

***

#### endOfSong()

> **endOfSong**(): `void`

##### Returns

`void`

##### Overrides

[`ChordSheetParser`](#classeschordsheetparsermd).[`endOfSong`](#endofsong)

##### Defined in

[parser/ultimate\_guitar\_parser.ts:79](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L79)

***

#### endSection()

> **endSection**(`__namedParameters`): `void`

##### Parameters

###### \_\_namedParameters

####### __namedParameters.addNewLine

`boolean` = `true`

##### Returns

`void`

##### Defined in

[parser/ultimate\_guitar\_parser.ts:100](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L100)

***

#### ensureChordLyricsPairInitialized()

> **ensureChordLyricsPairInitialized**(): `void`

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`ensureChordLyricsPairInitialized`](#ensurechordlyricspairinitialized)

##### Defined in

[parser/chord\_sheet\_parser.ts:177](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L177)

***

#### hasNextLine()

> **hasNextLine**(): `boolean`

##### Returns

`boolean`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`hasNextLine`](#hasnextline)

##### Defined in

[parser/chord\_sheet\_parser.ts:124](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L124)

***

#### initialize()

> **initialize**(`document`, `song`): `void`

##### Parameters

###### document

`any`

###### song

`null` | [`Song`](#classessongmd)

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`initialize`](#initialize)

##### Defined in

[parser/chord\_sheet\_parser.ts:107](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L107)

***

#### isSectionEnd()

> **isSectionEnd**(): `boolean`

##### Returns

`boolean`

##### Defined in

[parser/ultimate\_guitar\_parser.ts:72](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L72)

***

#### parse()

> **parse**(`chordSheet`, `options`?): [`Song`](#classessongmd)

Parses a chord sheet into a song

##### Parameters

###### chordSheet

`string`

The ChordPro chord sheet

###### options?

Optional parser options

####### options.song

[`Song`](#classessongmd)

The [Song](#classessongmd) to store the song data in

##### Returns

[`Song`](#classessongmd)

The parsed song

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`parse`](#parse)

##### Defined in

[parser/chord\_sheet\_parser.ts:70](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L70)

***

#### parseLine()

> **parseLine**(`line`): `void`

##### Parameters

###### line

`any`

##### Returns

`void`

##### Overrides

[`ChordSheetParser`](#classeschordsheetparsermd).[`parseLine`](#parseline)

##### Defined in

[parser/ultimate\_guitar\_parser.ts:42](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L42)

***

#### parseLyricsWithChords()

> **parseLyricsWithChords**(`chordsLine`, `lyricsLine`): `void`

##### Parameters

###### chordsLine

`any`

###### lyricsLine

`any`

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`parseLyricsWithChords`](#parselyricswithchords)

##### Defined in

[parser/chord\_sheet\_parser.ts:128](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L128)

***

#### parseNonEmptyLine()

> **parseNonEmptyLine**(`line`): `void`

##### Parameters

###### line

`any`

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`parseNonEmptyLine`](#parsenonemptyline)

##### Defined in

[parser/chord\_sheet\_parser.ts:94](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L94)

***

#### processCharacters()

> **processCharacters**(`chordsLine`, `lyricsLine`): `void`

##### Parameters

###### chordsLine

`any`

###### lyricsLine

`any`

##### Returns

`void`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`processCharacters`](#processcharacters)

##### Defined in

[parser/chord\_sheet\_parser.ts:146](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L146)

***

#### readLine()

> **readLine**(): `string`

##### Returns

`string`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`readLine`](#readline)

##### Defined in

[parser/chord\_sheet\_parser.ts:118](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L118)

***

#### shouldAddCharacterToChords()

> **shouldAddCharacterToChords**(`nextChar`): `any`

##### Parameters

###### nextChar

`any`

##### Returns

`any`

##### Inherited from

[`ChordSheetParser`](#classeschordsheetparsermd).[`shouldAddCharacterToChords`](#shouldaddcharactertochords)

##### Defined in

[parser/chord\_sheet\_parser.ts:173](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/chord_sheet_parser.ts#L173)

***

#### startNewLine()

> **startNewLine**(): `void`

##### Returns

`void`

##### Defined in

[parser/ultimate\_guitar\_parser.ts:113](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L113)

***

#### startSection()

> **startSection**(`sectionType`, `label`): `void`

##### Parameters

###### sectionType

`"chorus"` | `"verse"`

###### label

`string`

##### Returns

`void`

##### Defined in

[parser/ultimate\_guitar\_parser.ts:87](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/parser/ultimate_guitar_parser.ts#L87)

# Variables


<a name="variablesabcmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / ABC

## Variable: ABC

> `const` **ABC**: `"abc"` = `'abc'`

Used to mark a section as ABC music notation

### Constant

### Defined in

[constants.ts:62](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L62)


<a name="variableschorusmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / CHORUS

## Variable: CHORUS

> `const` **CHORUS**: `"chorus"` = `'chorus'`

Used to mark a paragraph as chorus

### Constant

### Defined in

[constants.ts:13](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L13)


<a name="variablesindeterminatemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / INDETERMINATE

## Variable: INDETERMINATE

> `const` **INDETERMINATE**: `"indeterminate"` = `'indeterminate'`

Used to mark a paragraph as containing lines with both verse and chorus type

### Constant

### Defined in

[constants.ts:27](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L27)


<a name="variableslilypondmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / LILYPOND

## Variable: LILYPOND

> `const` **LILYPOND**: `"ly"` = `'ly'`

Used to mark a section as Lilypond notation

### Constant

### Defined in

[constants.ts:55](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L55)


<a name="variablesnonemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / NONE

## Variable: NONE

> `const` **NONE**: `"none"` = `'none'`

Used to mark a paragraph as not containing a line marked with a type

### Constant

### Defined in

[constants.ts:34](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L34)


<a name="variablesnumeralmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / NUMERAL

## Variable: NUMERAL

> `const` **NUMERAL**: `"numeral"` = `'numeral'`

### Defined in

[constants.ts:77](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L77)


<a name="variablesnumericmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / NUMERIC

## Variable: NUMERIC

> `const` **NUMERIC**: `"numeric"` = `'numeric'`

### Defined in

[constants.ts:76](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L76)


<a name="variablessolfegemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / SOLFEGE

## Variable: SOLFEGE

> `const` **SOLFEGE**: `"solfege"` = `'solfege'`

### Defined in

[constants.ts:78](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L78)


<a name="variablessymbolmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / SYMBOL

## Variable: SYMBOL

> `const` **SYMBOL**: `"symbol"` = `'symbol'`

### Defined in

[constants.ts:75](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L75)


<a name="variablestabmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / TAB

## Variable: TAB

> `const` **TAB**: `"tab"` = `'tab'`

Used to mark a paragraph as tab

### Constant

### Defined in

[constants.ts:41](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L41)


<a name="variablesversemd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / VERSE

## Variable: VERSE

> `const` **VERSE**: `"verse"` = `'verse'`

Used to mark a paragraph as verse

### Constant

### Defined in

[constants.ts:48](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/constants.ts#L48)


<a name="variablesdefaultmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / default

## Variable: default

> **default**: `object`

### Type declaration

#### Chord

> **Chord**: *typeof* [`Chord`](#classeschordmd)

#### ChordDefinition

> **ChordDefinition**: *typeof* [`ChordDefinition`](#classeschorddefinitionmd)

#### ChordLyricsPair

> **ChordLyricsPair**: *typeof* [`ChordLyricsPair`](#classeschordlyricspairmd)

#### ChordProFormatter

> **ChordProFormatter**: *typeof* [`ChordProFormatter`](#classeschordproformattermd)

#### ChordProParser

> **ChordProParser**: *typeof* [`ChordProParser`](#classeschordproparsermd)

#### ChordSheetParser

> **ChordSheetParser**: *typeof* [`ChordSheetParser`](#classeschordsheetparsermd)

#### ChordSheetSerializer

> **ChordSheetSerializer**: *typeof* [`ChordSheetSerializer`](#classeschordsheetserializermd)

#### ChordsOverWordsFormatter

> **ChordsOverWordsFormatter**: *typeof* [`ChordsOverWordsFormatter`](#classeschordsoverwordsformattermd)

#### ChordsOverWordsParser

> **ChordsOverWordsParser**: *typeof* [`ChordsOverWordsParser`](#classeschordsoverwordsparsermd)

#### CHORUS

> **CHORUS**: `string`

#### Comment

> **Comment**: *typeof* [`Comment`](#classescommentmd)

#### Composite

> **Composite**: *typeof* [`Composite`](#classescompositemd)

#### HtmlDivFormatter

> **HtmlDivFormatter**: *typeof* [`HtmlDivFormatter`](#classeshtmldivformattermd)

#### HtmlTableFormatter

> **HtmlTableFormatter**: *typeof* [`HtmlTableFormatter`](#classeshtmltableformattermd)

#### INDETERMINATE

> **INDETERMINATE**: `string`

#### Line

> **Line**: *typeof* [`Line`](#classeslinemd)

#### Literal

> **Literal**: *typeof* [`Literal`](#classesliteralmd)

#### Metadata

> **Metadata**: *typeof* [`Metadata`](#classesmetadatamd)

#### NONE

> **NONE**: `string`

#### Paragraph

> **Paragraph**: *typeof* [`Paragraph`](#classesparagraphmd)

#### SoftLineBreak

> **SoftLineBreak**: *typeof* [`SoftLineBreak`](#classessoftlinebreakmd)

#### Song

> **Song**: *typeof* [`Song`](#classessongmd)

#### TAB

> **TAB**: `string`

#### Tag

> **Tag**: *typeof* [`Tag`](#classestagmd)

#### templateHelpers

> **templateHelpers**: `object`

##### templateHelpers.each()

> **each**: (`collection`, `callback`) => `string`

###### Parameters

####### collection

`any`[]

####### callback

`EachCallback`

###### Returns

`string`

##### templateHelpers.evaluate()

> **evaluate**: (`item`, `metadata`, `configuration`) => `string`

###### Parameters

####### item

`Evaluatable`

####### metadata

[`Metadata`](#classesmetadatamd)

####### configuration

`Configuration`

###### Returns

`string`

##### templateHelpers.fontStyleTag()

> **fontStyleTag**: (`font`) => `string`

###### Parameters

####### font

`Font`

###### Returns

`string`

##### templateHelpers.hasChordContents()

> **hasChordContents**: (`line`) => `boolean`

###### Parameters

####### line

[`Line`](#classeslinemd)

###### Returns

`boolean`

##### templateHelpers.hasTextContents()

> **hasTextContents**: (`line`) => `boolean`

###### Parameters

####### line

[`Line`](#classeslinemd)

###### Returns

`boolean`

##### templateHelpers.isChordLyricsPair()

> **isChordLyricsPair**: (`item`) => `boolean`

###### Parameters

####### item

`Item`

###### Returns

`boolean`

##### templateHelpers.isComment()

> **isComment**: (`item`) => `boolean`

###### Parameters

####### item

[`Tag`](#classestagmd)

###### Returns

`boolean`

##### templateHelpers.isEvaluatable()

> **isEvaluatable**: (`item`) => `boolean`

###### Parameters

####### item

`Item`

###### Returns

`boolean`

##### templateHelpers.isTag()

> **isTag**: (`item`) => `boolean`

###### Parameters

####### item

`Item`

###### Returns

`boolean`

##### templateHelpers.lineClasses()

> **lineClasses**: (`line`) => `string`

###### Parameters

####### line

[`Line`](#classeslinemd)

###### Returns

`string`

##### templateHelpers.lineHasContents()

> **lineHasContents**: (`line`) => `boolean`

###### Parameters

####### line

[`Line`](#classeslinemd)

###### Returns

`boolean`

##### templateHelpers.paragraphClasses()

> **paragraphClasses**: (`paragraph`) => `string`

###### Parameters

####### paragraph

[`Paragraph`](#classesparagraphmd)

###### Returns

`string`

##### templateHelpers.renderChord()

> **renderChord**: (`chordString`, `line`, `song`, `__namedParameters`) => `string`

###### Parameters

####### chordString

`string`

####### line

[`Line`](#classeslinemd)

####### song

[`Song`](#classessongmd)

####### \_\_namedParameters

`RenderChordOptions` = `{}`

###### Returns

`string`

##### templateHelpers.stripHTML()

> **stripHTML**: (`string`) => `string`

###### Parameters

####### string

`string`

###### Returns

`string`

##### templateHelpers.when()

> **when**: (`condition`, `callback`?) => `When`

###### Parameters

####### condition

`any`

####### callback?

`WhenCallback`

###### Returns

`When`

#### Ternary

> **Ternary**: *typeof* [`Ternary`](#classesternarymd)

#### TextFormatter

> **TextFormatter**: *typeof* [`TextFormatter`](#classestextformattermd)

#### UltimateGuitarParser

> **UltimateGuitarParser**: *typeof* [`UltimateGuitarParser`](#classesultimateguitarparsermd)

#### VERSE

> **VERSE**: `string`

### Defined in

[index.ts:76](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/index.ts#L76)


<a name="variablestemplatehelpersmd"></a>

[**chordsheetjs**](#readmemd)

***

[chordsheetjs](#readmemd) / templateHelpers

## Variable: templateHelpers

> **templateHelpers**: `object`

### Type declaration

#### each()

> **each**: (`collection`, `callback`) => `string`

##### Parameters

###### collection

`any`[]

###### callback

`EachCallback`

##### Returns

`string`

#### evaluate()

> **evaluate**: (`item`, `metadata`, `configuration`) => `string`

##### Parameters

###### item

`Evaluatable`

###### metadata

[`Metadata`](#classesmetadatamd)

###### configuration

`Configuration`

##### Returns

`string`

#### fontStyleTag()

> **fontStyleTag**: (`font`) => `string`

##### Parameters

###### font

`Font`

##### Returns

`string`

#### hasChordContents()

> **hasChordContents**: (`line`) => `boolean`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`boolean`

#### hasTextContents()

> **hasTextContents**: (`line`) => `boolean`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`boolean`

#### isChordLyricsPair()

> **isChordLyricsPair**: (`item`) => `boolean`

##### Parameters

###### item

`Item`

##### Returns

`boolean`

#### isComment()

> **isComment**: (`item`) => `boolean`

##### Parameters

###### item

[`Tag`](#classestagmd)

##### Returns

`boolean`

#### isEvaluatable()

> **isEvaluatable**: (`item`) => `boolean`

##### Parameters

###### item

`Item`

##### Returns

`boolean`

#### isTag()

> **isTag**: (`item`) => `boolean`

##### Parameters

###### item

`Item`

##### Returns

`boolean`

#### lineClasses()

> **lineClasses**: (`line`) => `string`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`string`

#### lineHasContents()

> **lineHasContents**: (`line`) => `boolean`

##### Parameters

###### line

[`Line`](#classeslinemd)

##### Returns

`boolean`

#### paragraphClasses()

> **paragraphClasses**: (`paragraph`) => `string`

##### Parameters

###### paragraph

[`Paragraph`](#classesparagraphmd)

##### Returns

`string`

#### renderChord()

> **renderChord**: (`chordString`, `line`, `song`, `__namedParameters`) => `string`

##### Parameters

###### chordString

`string`

###### line

[`Line`](#classeslinemd)

###### song

[`Song`](#classessongmd)

###### \_\_namedParameters

`RenderChordOptions` = `{}`

##### Returns

`string`

#### stripHTML()

> **stripHTML**: (`string`) => `string`

##### Parameters

###### string

`string`

##### Returns

`string`

#### when()

> **when**: (`condition`, `callback`?) => `When`

##### Parameters

###### condition

`any`

###### callback?

`WhenCallback`

##### Returns

`When`

### Defined in

[template\_helpers.ts:98](https://github.com/martijnversluis/ChordSheetJS/blob/a4a0ed8ec79a1c193012a5fa71ffb717736bbf24/src/template_helpers.ts#L98)
