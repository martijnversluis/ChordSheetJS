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

| Directive                    | Support                  |
|:---------------------------- |:------------------------:|
| start_of_chorus (short: soc) | :heavy_check_mark:       |
| end_of_chorus (short: eoc)   | :heavy_check_mark:       |
| start_of_verse               | :heavy_check_mark:       |
| end_of_verse                 | :heavy_check_mark:       |
| start_of_tab (short: sot)    | :heavy_check_mark:       |
| end_of_tab (short: eot)      | :heavy_check_mark:       |
| start_of_grid                | :heavy_multiplication_x: |
| end_of_grid                  | :heavy_multiplication_x: |

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

## Classes

<dl>
<dt><a href="#ChordSheetSerializer">ChordSheetSerializer</a></dt>
<dd><p>Serializes a song into een plain object, and deserializes the serialized object back into a [Song](#Song)</p></dd>
<dt><a href="#ChordLyricsPair">ChordLyricsPair</a></dt>
<dd><p>Represents a chord with the corresponding (partial) lyrics</p></dd>
<dt><a href="#Comment">Comment</a></dt>
<dd><p>Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview</p></dd>
<dt><a href="#Line">Line</a></dt>
<dd><p>Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag</p></dd>
<dt><a href="#Metadata">Metadata</a></dt>
<dd><p>Stores song metadata. Properties can be accessed using the get() method:</p>
<p>const metadata = new Metadata({ author: 'John' });
metadata.get('author')   // =&gt; 'John'</p>
<p>See [get](#Metadata+get)</p></dd>
<dt><a href="#Paragraph">Paragraph</a></dt>
<dd><p>Represents a paragraph of lines in a chord sheet</p></dd>
<dt><a href="#Song">Song</a></dt>
<dd><p>Represents a song in a chord sheet. Currently a chord sheet can only have one song.</p></dd>
<dt><a href="#Tag">Tag</a></dt>
<dd><p>Represents a tag/directive. See https://www.chordpro.org/chordpro/chordpro-directives/</p></dd>
<dt><a href="#Chord">Chord</a></dt>
<dd><p>Represents a Chord, consisting of a root, suffix (quality) and bass</p></dd>
<dt><a href="#ChordProFormatter">ChordProFormatter</a></dt>
<dd><p>Formats a song into a ChordPro chord sheet</p></dd>
<dt><a href="#ChordsOverWordsFormatter">ChordsOverWordsFormatter</a></dt>
<dd><p>Formats a song into a plain text chord sheet</p></dd>
<dt><a href="#Formatter">Formatter</a></dt>
<dd><p>Base class for all formatters, taking care of receiving a configuration wrapping that inside a Configuration object</p></dd>
<dt><a href="#HtmlDivFormatter">HtmlDivFormatter</a></dt>
<dd><p>Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.</p></dd>
<dt><a href="#HtmlFormatter">HtmlFormatter</a></dt>
<dd><p>Acts as a base class for HTML formatters</p></dd>
<dt><a href="#HtmlTableFormatter">HtmlTableFormatter</a></dt>
<dd><p>Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
PDF conversion.</p></dd>
<dt><a href="#TextFormatter">TextFormatter</a></dt>
<dd><p>Formats a song into a plain text chord sheet</p></dd>
<dt><a href="#Key">Key</a></dt>
<dd><p>Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).</p>
<p>The only function considered public API is <code>Key.distance</code></p></dd>
<dt><a href="#ChordProParser">ChordProParser</a></dt>
<dd><p>Parses a ChordPro chord sheet</p></dd>
<dt><del><a href="#ChordSheetParser">ChordSheetParser</a></del></dt>
<dd><p>Parses a normal chord sheet</p>
<p>ChordSheetParser is deprecated, please use ChordsOverWordsParser.</p>
<p>ChordsOverWordsParser aims to support any kind of chord, whereas ChordSheetParser lacks
support for many variations. Besides that, some chordpro feature have been ported back
to ChordsOverWordsParser, which adds some interesting functionality.</p></dd>
<dt><a href="#ChordsOverWordsParser">ChordsOverWordsParser</a></dt>
<dd><p>Parses a chords over words sheet into a song</p>
<p>It support &quot;regular&quot; chord sheets:</p>
<pre><code>       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
</code></pre>
<p>Additionally, some chordpro features have been &quot;ported back&quot;. For example, you can use chordpro directives:</p>
<pre><code>{title: Let it be}
{key: C}
Chorus 1:
       Am
Let it be
</code></pre>
<p>For convenience, you can leave out the brackets:</p>
<pre><code>title: Let it be
Chorus 1:
       Am
Let it be
</code></pre>
<p>You can even use a markdown style frontmatter separator to separate the header from the song:</p>
<pre><code>title: Let it be
key: C
---
Chorus 1:
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
</code></pre>
<p><code>ChordsOverWordsParser</code> is the better version of <code>ChordSheetParser</code>, which is deprecated.</p></dd>
<dt><a href="#ParserWarning">ParserWarning</a></dt>
<dd><p>Represents a parser warning, currently only used by ChordProParser.</p></dd>
<dt><a href="#UltimateGuitarParser">UltimateGuitarParser</a></dt>
<dd><p>Parses an Ultimate Guitar chord sheet with metadata
Inherits from [ChordSheetParser](#ChordSheetParser)</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#ALBUM">ALBUM</a> : <code>string</code></dt>
<dd><p>Album meta directive. See https://www.chordpro.org/chordpro/directives-album/</p></dd>
<dt><a href="#ARRANGER">ARRANGER</a> : <code>string</code></dt>
<dd><p>Arranger meta directive. See https://chordpro.org/chordpro/directives-arranger/</p></dd>
<dt><a href="#ARTIST">ARTIST</a> : <code>string</code></dt>
<dd><p>Artist meta directive. See https://www.chordpro.org/chordpro/directives-artist/</p></dd>
<dt><a href="#CAPO">CAPO</a> : <code>string</code></dt>
<dd><p>Capo meta directive. See https://www.chordpro.org/chordpro/directives-capo/</p></dd>
<dt><a href="#COMMENT">COMMENT</a> : <code>string</code></dt>
<dd><p>Comment directive. See https://www.chordpro.org/chordpro/directives-comment/</p></dd>
<dt><a href="#COMPOSER">COMPOSER</a> : <code>string</code></dt>
<dd><p>Composer meta directive. See https://www.chordpro.org/chordpro/directives-composer/</p></dd>
<dt><a href="#COPYRIGHT">COPYRIGHT</a> : <code>string</code></dt>
<dd><p>Copyright meta directive. See https://www.chordpro.org/chordpro/directives-copyright/</p></dd>
<dt><a href="#DURATION">DURATION</a> : <code>string</code></dt>
<dd><p>Duration meta directive. See https://www.chordpro.org/chordpro/directives-duration/</p></dd>
<dt><a href="#END_OF_ABC">END_OF_ABC</a> : <code>string</code></dt>
<dd><p>End of ABC music notation section See https://chordpro.org/chordpro/directives-env_abc/</p></dd>
<dt><a href="#END_OF_BRIDGE">END_OF_BRIDGE</a> : <code>string</code></dt>
<dd><p>End of bridge directive. See https://chordpro.org/chordpro/directives-env_bridge/</p></dd>
<dt><a href="#END_OF_CHORUS">END_OF_CHORUS</a> : <code>string</code></dt>
<dd><p>End of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/</p></dd>
<dt><a href="#END_OF_GRID">END_OF_GRID</a> : <code>string</code></dt>
<dd><p>End of grid directive. See https://www.chordpro.org/chordpro/directives-env_grid/</p></dd>
<dt><a href="#END_OF_LY">END_OF_LY</a> : <code>string</code></dt>
<dd><p>End of Lilypond music notation section See https://chordpro.org/chordpro/directives-env_ly/</p></dd>
<dt><a href="#END_OF_TAB">END_OF_TAB</a> : <code>string</code></dt>
<dd><p>End of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/</p></dd>
<dt><a href="#END_OF_VERSE">END_OF_VERSE</a> : <code>string</code></dt>
<dd><p>End of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/</p></dd>
<dt><a href="#KEY">KEY</a> : <code>string</code></dt>
<dd><p>Key meta directive. See https://www.chordpro.org/chordpro/directives-key/</p></dd>
<dt><a href="#_KEY">_KEY</a> : <code>string</code></dt>
<dd><p>_Key meta directive. Reflects the key as transposed by the capo value
See https://www.chordpro.org/chordpro/directives-key/</p></dd>
<dt><a href="#LYRICIST">LYRICIST</a> : <code>string</code></dt>
<dd><p>Lyricist meta directive. See https://www.chordpro.org/chordpro/directives-lyricist/</p></dd>
<dt><a href="#SORTTITLE">SORTTITLE</a> : <code>string</code></dt>
<dd><p>Sorttitle meta directive. See https://chordpro.org/chordpro/directives-sorttitle/</p></dd>
<dt><a href="#START_OF_ABC">START_OF_ABC</a> : <code>string</code></dt>
<dd><p>Start of ABC music notation section See https://chordpro.org/chordpro/directives-env_abc/</p></dd>
<dt><a href="#START_OF_BRIDGE">START_OF_BRIDGE</a> : <code>string</code></dt>
<dd><p>Start of bridge directive. See https://chordpro.org/chordpro/directives-env_bridge/</p></dd>
<dt><a href="#START_OF_CHORUS">START_OF_CHORUS</a> : <code>string</code></dt>
<dd><p>Start of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/</p></dd>
<dt><a href="#START_OF_GRID">START_OF_GRID</a> : <code>string</code></dt>
<dd><p>Start of grid directive. See https://www.chordpro.org/chordpro/directives-env_grid/</p></dd>
<dt><a href="#START_OF_LY">START_OF_LY</a> : <code>string</code></dt>
<dd><p>Start of Lilypond music notation section See https://chordpro.org/chordpro/directives-env_ly/</p></dd>
<dt><a href="#START_OF_TAB">START_OF_TAB</a> : <code>string</code></dt>
<dd><p>Start of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/</p></dd>
<dt><a href="#START_OF_VERSE">START_OF_VERSE</a> : <code>string</code></dt>
<dd><p>Start of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/</p></dd>
<dt><a href="#SUBTITLE">SUBTITLE</a> : <code>string</code></dt>
<dd><p>Subtitle meta directive. See https://www.chordpro.org/chordpro/directives-subtitle/</p></dd>
<dt><a href="#TEMPO">TEMPO</a> : <code>string</code></dt>
<dd><p>Tempo meta directive. See https://www.chordpro.org/chordpro/directives-tempo/</p></dd>
<dt><a href="#TIME">TIME</a> : <code>string</code></dt>
<dd><p>Time meta directive. See https://www.chordpro.org/chordpro/directives-time/</p></dd>
<dt><a href="#TITLE">TITLE</a> : <code>string</code></dt>
<dd><p>Title meta directive. See https://www.chordpro.org/chordpro/directives-title/</p></dd>
<dt><a href="#TRANSPOSE">TRANSPOSE</a> : <code>string</code></dt>
<dd><p>Transpose meta directive. See: https://www.chordpro.org/chordpro/directives-transpose/</p></dd>
<dt><a href="#NEW_KEY">NEW_KEY</a> : <code>string</code></dt>
<dd><p>New Key meta directive. See: https://github.com/PraiseCharts/ChordChartJS/issues/53</p></dd>
<dt><a href="#YEAR">YEAR</a> : <code>string</code></dt>
<dd><p>Year meta directive. See https://www.chordpro.org/chordpro/directives-year/</p></dd>
<dt><a href="#CHORDFONT">CHORDFONT</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p></dd>
<dt><a href="#CHORDSIZE">CHORDSIZE</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p></dd>
<dt><a href="#CHORDCOLOUR">CHORDCOLOUR</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p></dd>
<dt><a href="#TEXTFONT">TEXTFONT</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p></dd>
<dt><a href="#TEXTSIZE">TEXTSIZE</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p></dd>
<dt><a href="#TEXTCOLOUR">TEXTCOLOUR</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p></dd>
<dt><a href="#TITLEFONT">TITLEFONT</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p></dd>
<dt><a href="#TITLESIZE">TITLESIZE</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p></dd>
<dt><a href="#TITLECOLOUR">TITLECOLOUR</a> : <code>string</code></dt>
<dd><p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p></dd>
<dt><a href="#CHORUS">CHORUS</a> : <code>string</code></dt>
<dd><p>Chorus directive. Support repeating an earlier defined section.
See https://www.chordpro.org/chordpro/directives-env_chorus/</p></dd>
<dt><a href="#CHORD_STYLE">CHORD_STYLE</a> : <code>string</code></dt>
<dd><p>Chord type directive. Determines the type of chords used in the rendered chord sheet.
Possible values are 'solfege', 'symbol', 'numeral' and 'number'</p></dd>
<dt><a href="#BRIDGE">BRIDGE</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as bridge</p></dd>
<dt><a href="#CHORUS">CHORUS</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as chorus</p></dd>
<dt><a href="#GRID">GRID</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as grid</p></dd>
<dt><a href="#INDETERMINATE">INDETERMINATE</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as containing lines with both verse and chorus type</p></dd>
<dt><a href="#NONE">NONE</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as not containing a line marked with a type</p></dd>
<dt><a href="#TAB">TAB</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as tab</p></dd>
<dt><a href="#VERSE">VERSE</a> : <code>string</code></dt>
<dd><p>Used to mark a paragraph as verse</p></dd>
<dt><a href="#LILYPOND">LILYPOND</a> : <code>string</code></dt>
<dd><p>Used to mark a section as Lilypond notation</p></dd>
<dt><a href="#ABC">ABC</a> : <code>string</code></dt>
<dd><p>Used to mark a section as ABC music notation</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#scopedCss">scopedCss(scope)</a> ⇒ <code>string</code></dt>
<dd><p>Generates basic CSS, scoped within the provided selector, to use with output generated by [HtmlTableFormatter](#HtmlTableFormatter)</p></dd>
<dt><a href="#scopedCss">scopedCss(scope)</a> ⇒ <code>string</code></dt>
<dd><p>Generates basic CSS, scoped within the provided selector, to use with output generated by [HtmlTableFormatter](#HtmlTableFormatter)</p></dd>
<dt><a href="#getCapos">getCapos(key)</a> ⇒ <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Returns applicable capos for the provided key</p></dd>
<dt><a href="#getKeys">getKeys(key)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Returns applicable keys to transpose to from the provided key</p></dd>
</dl>

<a name="ChordSheetSerializer"></a>

## ChordSheetSerializer
<p>Serializes a song into een plain object, and deserializes the serialized object back into a [Song](#Song)</p>

**Kind**: global class  

* [ChordSheetSerializer](#ChordSheetSerializer)
    * [.serialize()](#ChordSheetSerializer+serialize) ⇒
    * [.deserialize(serializedSong)](#ChordSheetSerializer+deserialize) ⇒ [<code>Song</code>](#Song)

<a name="ChordSheetSerializer+serialize"></a>

### chordSheetSerializer.serialize() ⇒
<p>Serializes the chord sheet to a plain object, which can be converted to any format like JSON, XML etc
Can be deserialized using [deserialize](deserialize)</p>

**Kind**: instance method of [<code>ChordSheetSerializer</code>](#ChordSheetSerializer)  
**Returns**: <p>object A plain JS object containing all chord sheet data</p>  
<a name="ChordSheetSerializer+deserialize"></a>

### chordSheetSerializer.deserialize(serializedSong) ⇒ [<code>Song</code>](#Song)
<p>Deserializes a song that has been serialized using [serialize](serialize)</p>

**Kind**: instance method of [<code>ChordSheetSerializer</code>](#ChordSheetSerializer)  
**Returns**: [<code>Song</code>](#Song) - <p>The deserialized song</p>  

| Param | Type | Description |
| --- | --- | --- |
| serializedSong | <code>object</code> | <p>The serialized song</p> |

<a name="ChordLyricsPair"></a>

## ChordLyricsPair
<p>Represents a chord with the corresponding (partial) lyrics</p>

**Kind**: global class  

* [ChordLyricsPair](#ChordLyricsPair)
    * [new ChordLyricsPair(chords, lyrics, annotation)](#new_ChordLyricsPair_new)
    * [.chords](#ChordLyricsPair+chords) : <code>string</code>
    * [.lyrics](#ChordLyricsPair+lyrics) : <code>string</code>
    * [.annotation](#ChordLyricsPair+annotation) : <code>string</code>
    * [.isRenderable()](#ChordLyricsPair+isRenderable) ⇒ <code>boolean</code>
    * [.clone()](#ChordLyricsPair+clone) ⇒ [<code>ChordLyricsPair</code>](#ChordLyricsPair)

<a name="new_ChordLyricsPair_new"></a>

### new ChordLyricsPair(chords, lyrics, annotation)
<p>Initialises a ChordLyricsPair</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chords | <code>string</code> |  | <p>The chords</p> |
| lyrics | <code>string</code> \| <code>null</code> | <code>null</code> | <p>The lyrics</p> |
| annotation | <code>string</code> \| <code>null</code> | <code>null</code> | <p>The annotation</p> |

<a name="ChordLyricsPair+chords"></a>

### chordLyricsPair.chords : <code>string</code>
<p>The chords</p>

**Kind**: instance property of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+lyrics"></a>

### chordLyricsPair.lyrics : <code>string</code>
<p>The lyrics</p>

**Kind**: instance property of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+annotation"></a>

### chordLyricsPair.annotation : <code>string</code>
<p>The annotation</p>

**Kind**: instance property of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+isRenderable"></a>

### chordLyricsPair.isRenderable() ⇒ <code>boolean</code>
<p>Indicates whether a ChordLyricsPair should be visible in a formatted chord sheet (except for ChordPro sheets)</p>

**Kind**: instance method of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+clone"></a>

### chordLyricsPair.clone() ⇒ [<code>ChordLyricsPair</code>](#ChordLyricsPair)
<p>Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song</p>

**Kind**: instance method of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="Comment"></a>

## Comment
<p>Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview</p>

**Kind**: global class  

* [Comment](#Comment)
    * [.isRenderable()](#Comment+isRenderable) ⇒ <code>boolean</code>
    * [.clone()](#Comment+clone) ⇒ [<code>Comment</code>](#Comment)

<a name="Comment+isRenderable"></a>

### comment.isRenderable() ⇒ <code>boolean</code>
<p>Indicates whether a Comment should be visible in a formatted chord sheet (except for ChordPro sheets)</p>

**Kind**: instance method of [<code>Comment</code>](#Comment)  
<a name="Comment+clone"></a>

### comment.clone() ⇒ [<code>Comment</code>](#Comment)
<p>Returns a deep copy of the Comment, useful when programmatically transforming a song</p>

**Kind**: instance method of [<code>Comment</code>](#Comment)  
<a name="Line"></a>

## Line
<p>Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag</p>

**Kind**: global class  

* [Line](#Line)
    * [.isEmpty()](#Line+isEmpty) ⇒ <code>boolean</code>
    * [.addItem(item)](#Line+addItem)
    * [.hasRenderableItems()](#Line+hasRenderableItems) ⇒ <code>boolean</code>
    * [.clone()](#Line+clone) ⇒ [<code>Line</code>](#Line)
    * [.isBridge()](#Line+isBridge) ⇒ <code>boolean</code>
    * [.isChorus()](#Line+isChorus) ⇒ <code>boolean</code>
    * [.isGrid()](#Line+isGrid) ⇒ <code>boolean</code>
    * [.isTab()](#Line+isTab) ⇒ <code>boolean</code>
    * [.isVerse()](#Line+isVerse) ⇒ <code>boolean</code>
    * ~~[.hasContent()](#Line+hasContent) ⇒ <code>boolean</code>~~

<a name="Line+isEmpty"></a>

### line.isEmpty() ⇒ <code>boolean</code>
<p>Indicates whether the line contains any items</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+addItem"></a>

### line.addItem(item)
<p>Adds an item ([ChordLyricsPair](#ChordLyricsPair) or [Tag](#Tag)) to the line</p>

**Kind**: instance method of [<code>Line</code>](#Line)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>ChordLyricsPair</code>](#ChordLyricsPair) \| [<code>Tag</code>](#Tag) | <p>The item to be added</p> |

<a name="Line+hasRenderableItems"></a>

### line.hasRenderableItems() ⇒ <code>boolean</code>
<p>Indicates whether the line contains items that are renderable</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+clone"></a>

### line.clone() ⇒ [<code>Line</code>](#Line)
<p>Returns a deep copy of the line and all of its items</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isBridge"></a>

### line.isBridge() ⇒ <code>boolean</code>
<p>Indicates whether the line type is [BRIDGE](#BRIDGE)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isChorus"></a>

### line.isChorus() ⇒ <code>boolean</code>
<p>Indicates whether the line type is [CHORUS](#CHORUS)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isGrid"></a>

### line.isGrid() ⇒ <code>boolean</code>
<p>Indicates whether the line type is [GRID](#GRID)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isTab"></a>

### line.isTab() ⇒ <code>boolean</code>
<p>Indicates whether the line type is [TAB](#TAB)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isVerse"></a>

### line.isVerse() ⇒ <code>boolean</code>
<p>Indicates whether the line type is [VERSE](#VERSE)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+hasContent"></a>

### ~~line.hasContent() ⇒ <code>boolean</code>~~
***Deprecated***

<p>Indicates whether the line contains items that are renderable. Please use [hasRenderableItems](hasRenderableItems)</p>

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Metadata"></a>

## Metadata
<p>Stores song metadata. Properties can be accessed using the get() method:</p>
<p>const metadata = new Metadata({ author: 'John' });
metadata.get('author')   // =&gt; 'John'</p>
<p>See [get](#Metadata+get)</p>

**Kind**: global class  

* [Metadata](#Metadata)
    * [.get(prop)](#Metadata+get) ⇒ <code>Array.&lt;String&gt;</code> \| <code>String</code>
    * [.clone()](#Metadata+clone) ⇒ [<code>Metadata</code>](#Metadata)

<a name="Metadata+get"></a>

### metadata.get(prop) ⇒ <code>Array.&lt;String&gt;</code> \| <code>String</code>
<p>Reads a metadata value by key. This method supports simple value lookup, as well as fetching single array values.</p>
<p>This method deprecates direct property access, eg: metadata['author']</p>
<p>Examples:</p>
<p>const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
metadata.get('lyricist') // =&gt; 'Pete'
metadata.get('author')   // =&gt; ['John', 'Mary']
metadata.get('author.1') // =&gt; 'John'
metadata.get('author.2') // =&gt; 'Mary'</p>
<p>Using a negative index will start counting at the end of the list:</p>
<p>const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
metadata.get('author.-1') // =&gt; 'Mary'
metadata.get('author.-2') // =&gt; 'John'</p>

**Kind**: instance method of [<code>Metadata</code>](#Metadata)  
**Returns**: <code>Array.&lt;String&gt;</code> \| <code>String</code> - <p>the metadata value(s). If there is only one value, it will return a String,
else it returns an array of strings.</p>  

| Param | Description |
| --- | --- |
| prop | <p>the property name</p> |

<a name="Metadata+clone"></a>

### metadata.clone() ⇒ [<code>Metadata</code>](#Metadata)
<p>Returns a deep clone of this Metadata object</p>

**Kind**: instance method of [<code>Metadata</code>](#Metadata)  
**Returns**: [<code>Metadata</code>](#Metadata) - <p>the cloned Metadata object</p>  
<a name="Paragraph"></a>

## Paragraph
<p>Represents a paragraph of lines in a chord sheet</p>

**Kind**: global class  

* [Paragraph](#Paragraph)
    * [.contents](#Paragraph+contents) ⇒ <code>string</code>
    * [.label](#Paragraph+label) ⇒ <code>string</code> \| <code>null</code>
    * [.type](#Paragraph+type) ⇒ <code>string</code>
    * [.isLiteral()](#Paragraph+isLiteral) ⇒ <code>boolean</code>
    * [.hasRenderableItems()](#Paragraph+hasRenderableItems) ⇒ <code>boolean</code>

<a name="Paragraph+contents"></a>

### paragraph.contents ⇒ <code>string</code>
<p>Returns the paragraph contents as one string where lines are separated by newlines</p>

**Kind**: instance property of [<code>Paragraph</code>](#Paragraph)  
<a name="Paragraph+label"></a>

### paragraph.label ⇒ <code>string</code> \| <code>null</code>
<p>Returns the label of the paragraph. The label is the value of the first section delimiter tag
in the first line.</p>

**Kind**: instance property of [<code>Paragraph</code>](#Paragraph)  
<a name="Paragraph+type"></a>

### paragraph.type ⇒ <code>string</code>
<p>Tries to determine the common type for all lines. If the types for all lines are equal, it returns that type.
If not, it returns [INDETERMINATE](#INDETERMINATE)</p>

**Kind**: instance property of [<code>Paragraph</code>](#Paragraph)  
<a name="Paragraph+isLiteral"></a>

### paragraph.isLiteral() ⇒ <code>boolean</code>
<p>Indicates whether the paragraph only contains literals. If true, [contents](contents) can be used to retrieve
the paragraph contents as one string where lines are separated by newlines.</p>

**Kind**: instance method of [<code>Paragraph</code>](#Paragraph)  
**See**: [contents](contents)  
<a name="Paragraph+hasRenderableItems"></a>

### paragraph.hasRenderableItems() ⇒ <code>boolean</code>
<p>Indicates whether the paragraph contains lines with renderable items.</p>

**Kind**: instance method of [<code>Paragraph</code>](#Paragraph)  
**See**: [Line.hasRenderableItems](Line.hasRenderableItems)  
<a name="Song"></a>

## Song
<p>Represents a song in a chord sheet. Currently a chord sheet can only have one song.</p>

**Kind**: global class  

* [Song](#Song)
    * [new Song(metadata)](#new_Song_new)
    * [.bodyLines](#Song+bodyLines) ⇒ [<code>Array.&lt;Line&gt;</code>](#Line)
    * [.bodyParagraphs](#Song+bodyParagraphs) ⇒ [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
    * [.paragraphs](#Song+paragraphs) : [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
    * [.expandedBodyParagraphs](#Song+expandedBodyParagraphs) : [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
    * [.clone()](#Song+clone) ⇒ [<code>Song</code>](#Song)
    * [.setKey(key)](#Song+setKey) ⇒ [<code>Song</code>](#Song)
    * [.setCapo(capo)](#Song+setCapo) ⇒ [<code>Song</code>](#Song)
    * [.transpose(delta, [options])](#Song+transpose) ⇒ [<code>Song</code>](#Song)
    * [.transposeUp([options])](#Song+transposeUp) ⇒ [<code>Song</code>](#Song)
    * [.transposeDown([options])](#Song+transposeDown) ⇒ [<code>Song</code>](#Song)
    * [.changeKey(newKey)](#Song+changeKey) ⇒ [<code>Song</code>](#Song)
    * [.useModifier(modifier)](#Song+useModifier) ⇒ [<code>Song</code>](#Song)
    * [.changeMetadata(name, value)](#Song+changeMetadata)
    * [.mapItems(func)](#Song+mapItems) ⇒ [<code>Song</code>](#Song)
    * [.mapLines(func)](#Song+mapLines) ⇒ [<code>Song</code>](#Song)

<a name="new_Song_new"></a>

### new Song(metadata)
<p>Creates a new {Song} instance</p>


| Param | Type | Description |
| --- | --- | --- |
| metadata | <code>Object</code> \| [<code>Metadata</code>](#Metadata) | <p>predefined metadata</p> |

<a name="Song+bodyLines"></a>

### song.bodyLines ⇒ [<code>Array.&lt;Line&gt;</code>](#Line)
<p>Returns the song lines, skipping the leading empty lines (empty as in not rendering any content). This is useful
if you want to skip the &quot;header lines&quot;: the lines that only contain meta data.</p>

**Kind**: instance property of [<code>Song</code>](#Song)  
**Returns**: [<code>Array.&lt;Line&gt;</code>](#Line) - <p>The song body lines</p>  
<a name="Song+bodyParagraphs"></a>

### song.bodyParagraphs ⇒ [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
<p>Returns the song paragraphs, skipping the paragraphs that only contain empty lines
(empty as in not rendering any content)</p>

**Kind**: instance property of [<code>Song</code>](#Song)  
**See**: [bodyLines](bodyLines)  
<a name="Song+paragraphs"></a>

### song.paragraphs : [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
<p>The [Paragraph](#Paragraph) items of which the song consists</p>

**Kind**: instance property of [<code>Song</code>](#Song)  
<a name="Song+expandedBodyParagraphs"></a>

### song.expandedBodyParagraphs : [<code>Array.&lt;Paragraph&gt;</code>](#Paragraph)
<p>The body paragraphs of the song, with any <code>{chorus}</code> tag expanded into the targeted chorus</p>

**Kind**: instance property of [<code>Song</code>](#Song)  
<a name="Song+clone"></a>

### song.clone() ⇒ [<code>Song</code>](#Song)
<p>Returns a deep clone of the song</p>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The cloned song</p>  
<a name="Song+setKey"></a>

### song.setKey(key) ⇒ [<code>Song</code>](#Song)
<p>Returns a copy of the song with the key value set to the specified key. It changes:</p>
<ul>
<li>the value for <code>key</code> in the [metadata](metadata) set</li>
<li>any existing <code>key</code> directive</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>number</code> \| <code>null</code> | <p>the key. Passing <code>null</code> will:</p> <ul> <li>remove the current key from [metadata](metadata)</li> <li>remove any <code>key</code> directive</li> </ul> |

<a name="Song+setCapo"></a>

### song.setCapo(capo) ⇒ [<code>Song</code>](#Song)
<p>Returns a copy of the song with the key value set to the specified capo. It changes:</p>
<ul>
<li>the value for <code>capo</code> in the [metadata](metadata) set</li>
<li>any existing <code>capo</code> directive</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| capo | <code>number</code> \| <code>null</code> | <p>the capo. Passing <code>null</code> will:</p> <ul> <li>remove the current key from [metadata](metadata)</li> <li>remove any <code>capo</code> directive</li> </ul> |

<a name="Song+transpose"></a>

### song.transpose(delta, [options]) ⇒ [<code>Song</code>](#Song)
<p>Transposes the song by the specified delta. It will:</p>
<ul>
<li>transpose all chords, see: [transpose](#Chord+transpose)</li>
<li>transpose the song key in [metadata](metadata)</li>
<li>update any existing <code>key</code> directive</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The transposed song</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| delta | <code>number</code> |  | <p>The number of semitones (positive or negative) to transpose with</p> |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.normalizeChordSuffix] | <code>boolean</code> | <code>false</code> | <p>whether to normalize the chord suffixes after transposing</p> |

<a name="Song+transposeUp"></a>

### song.transposeUp([options]) ⇒ [<code>Song</code>](#Song)
<p>Transposes the song up by one semitone. It will:</p>
<ul>
<li>transpose all chords, see: [transpose](#Chord+transpose)</li>
<li>transpose the song key in [metadata](metadata)</li>
<li>update any existing <code>key</code> directive</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The transposed song</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.normalizeChordSuffix] | <code>boolean</code> | <code>false</code> | <p>whether to normalize the chord suffixes after transposing</p> |

<a name="Song+transposeDown"></a>

### song.transposeDown([options]) ⇒ [<code>Song</code>](#Song)
<p>Transposes the song down by one semitone. It will:</p>
<ul>
<li>transpose all chords, see: [transpose](#Chord+transpose)</li>
<li>transpose the song key in [metadata](metadata)</li>
<li>update any existing <code>key</code> directive</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The transposed song</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.normalizeChordSuffix] | <code>boolean</code> | <code>false</code> | <p>whether to normalize the chord suffixes after transposing</p> |

<a name="Song+changeKey"></a>

### song.changeKey(newKey) ⇒ [<code>Song</code>](#Song)
<p>Returns a copy of the song with the key set to the specified key. It changes:</p>
<ul>
<li>the value for <code>key</code> in the [metadata](metadata) set</li>
<li>any existing <code>key</code> directive</li>
<li>all chords, those are transposed according to the distance between the current and the new key</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>The changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| newKey | <code>string</code> | <p>The new key.</p> |

<a name="Song+useModifier"></a>

### song.useModifier(modifier) ⇒ [<code>Song</code>](#Song)
<p>Returns a copy of the song with all chords changed to the specified modifier.</p>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>the changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| modifier | <code>Modifier</code> | <p>the new modifier</p> |

<a name="Song+changeMetadata"></a>

### song.changeMetadata(name, value)
<p>Returns a copy of the song with the directive value set to the specified value.</p>
<ul>
<li>when there is a matching directive in the song, it will update the directive</li>
<li>when there is no matching directive, it will be inserted
If <code>value</code> is <code>null</code> it will act as a delete, any directive matching <code>name</code> will be removed.</li>
</ul>

**Kind**: instance method of [<code>Song</code>](#Song)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>The directive name</p> |
| value | <code>string</code> \| <code>null</code> | <p>The value to set, or <code>null</code> to remove the directive</p> |

<a name="Song+mapItems"></a>

### song.mapItems(func) ⇒ [<code>Song</code>](#Song)
<p>Change the song contents inline. Return a new [Item](Item) to replace it. Return <code>null</code> to remove it.</p>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>the changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>MapItemsCallback</code> | <p>the callback function</p> |

**Example**  
```js
// transpose all chords:
song.mapItems((item) => {
  if (item instanceof ChordLyricsPair) {
    return item.transpose(2, 'D');
  }

  return item;
});
```
<a name="Song+mapLines"></a>

### song.mapLines(func) ⇒ [<code>Song</code>](#Song)
<p>Change the song contents inline. Return a new [Line](#Line) to replace it. Return <code>null</code> to remove it.</p>

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - <p>the changed song</p>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>MapLinesCallback</code> | <p>the callback function</p> |

**Example**  
```js
// remove lines with only Tags:
song.mapLines((line) => {
  if (line.items.every(item => item instanceof Tag)) {
    return null;
  }

  return line;
});
```
<a name="Tag"></a>

## Tag
<p>Represents a tag/directive. See https://www.chordpro.org/chordpro/chordpro-directives/</p>

**Kind**: global class  

* [Tag](#Tag)
    * [.name](#Tag+name) : <code>string</code>
    * [.originalName](#Tag+originalName) : <code>string</code>
    * [.value](#Tag+value) : <code>string</code>
    * [.hasValue()](#Tag+hasValue) ⇒ <code>boolean</code>
    * [.isRenderable()](#Tag+isRenderable) ⇒ <code>boolean</code>
    * [.hasRenderableLabel()](#Tag+hasRenderableLabel)
    * [.isMetaTag()](#Tag+isMetaTag) ⇒ <code>boolean</code>
    * [.clone()](#Tag+clone) ⇒ [<code>Tag</code>](#Tag)

<a name="Tag+name"></a>

### tag.name : <code>string</code>
<p>The tag full name. When the original tag used the short name, <code>name</code> will return the full name.</p>

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+originalName"></a>

### tag.originalName : <code>string</code>
<p>The original tag name that was used to construct the tag.</p>

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+value"></a>

### tag.value : <code>string</code>
<p>The tag value</p>

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+hasValue"></a>

### tag.hasValue() ⇒ <code>boolean</code>
<p>Checks whether the tag value is a non-empty string.</p>

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+isRenderable"></a>

### tag.isRenderable() ⇒ <code>boolean</code>
<p>Checks whether the tag is usually rendered inline. It currently only applies to comment tags.</p>

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+hasRenderableLabel"></a>

### tag.hasRenderableLabel()
<p>Check whether this tag's label (if any) should be rendered, as applicable to tags like
<code>start_of_verse</code> and <code>start_of_chorus</code>.
See https://chordpro.org/chordpro/directives-env_chorus/, https://chordpro.org/chordpro/directives-env_verse/,
https://chordpro.org/chordpro/directives-env_bridge/, https://chordpro.org/chordpro/directives-env_tab/</p>

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+isMetaTag"></a>

### tag.isMetaTag() ⇒ <code>boolean</code>
<p>Checks whether the tag is either a standard meta tag or a custom meta directive (<code>{x_some_name}</code>)</p>

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+clone"></a>

### tag.clone() ⇒ [<code>Tag</code>](#Tag)
<p>Returns a clone of the tag.</p>

**Kind**: instance method of [<code>Tag</code>](#Tag)  
**Returns**: [<code>Tag</code>](#Tag) - <p>The cloned tag</p>  
<a name="Chord"></a>

## Chord
<p>Represents a Chord, consisting of a root, suffix (quality) and bass</p>

**Kind**: global class  

* [Chord](#Chord)
    * _instance_
        * [.clone()](#Chord+clone) ⇒ [<code>Chord</code>](#Chord)
        * [.toChordSymbol([referenceKey])](#Chord+toChordSymbol) ⇒ [<code>Chord</code>](#Chord)
        * [.toChordSymbolString([referenceKey])](#Chord+toChordSymbolString) ⇒ <code>string</code>
        * [.isChordSymbol()](#Chord+isChordSymbol) ⇒ <code>boolean</code>
        * [.toChordSolfege([referenceKey])](#Chord+toChordSolfege) ⇒ [<code>Chord</code>](#Chord)
        * [.toChordSolfegeString([referenceKey])](#Chord+toChordSolfegeString) ⇒ <code>string</code>
        * [.isChordSolfege()](#Chord+isChordSolfege) ⇒ <code>boolean</code>
        * [.toNumeric([referenceKey])](#Chord+toNumeric) ⇒ [<code>Chord</code>](#Chord)
        * [.toNumeral([referenceKey])](#Chord+toNumeral) ⇒ [<code>Chord</code>](#Chord)
        * [.toNumeralString([referenceKey])](#Chord+toNumeralString) ⇒ <code>string</code>
        * [.isNumeric()](#Chord+isNumeric) ⇒ <code>boolean</code>
        * [.toNumericString([referenceKey])](#Chord+toNumericString) ⇒ <code>string</code>
        * [.isNumeral()](#Chord+isNumeral) ⇒ <code>boolean</code>
        * [.toString([configuration])](#Chord+toString) ⇒ <code>string</code>
        * [.normalize([key], [options])](#Chord+normalize) ⇒ [<code>Chord</code>](#Chord)
        * [.useModifier(newModifier)](#Chord+useModifier) ⇒ [<code>Chord</code>](#Chord)
        * [.transposeUp()](#Chord+transposeUp) ⇒ [<code>Chord</code>](#Chord)
        * [.transposeDown()](#Chord+transposeDown) ⇒ [<code>Chord</code>](#Chord)
        * [.transpose(delta)](#Chord+transpose) ⇒ [<code>Chord</code>](#Chord)
    * _static_
        * [.parse(chordString)](#Chord.parse) ⇒ [<code>Chord</code>](#Chord) \| <code>null</code>

<a name="Chord+clone"></a>

### chord.clone() ⇒ [<code>Chord</code>](#Chord)
<p>Returns a deep copy of the chord</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
<a name="Chord+toChordSymbol"></a>

### chord.toChordSymbol([referenceKey]) ⇒ [<code>Chord</code>](#Chord)
<p>Converts the chord to a chord symbol, using the supplied key as a reference.
For example, a numeric chord <code>#4</code> with reference key <code>E</code> will return the chord symbol <code>A#</code>.
When the chord is already a chord symbol, it will return a clone of the object.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the chord symbol</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a numeric or numeral.</p> |

<a name="Chord+toChordSymbolString"></a>

### chord.toChordSymbolString([referenceKey]) ⇒ <code>string</code>
<p>Converts the chord to a chord symbol string, using the supplied key as a reference.
For example, a numeric chord <code>#4</code> with reference key <code>E</code> will return the chord symbol <code>A#</code>.
When the chord is already a chord symbol, it will return a string version of the chord.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: <code>string</code> - <p>the chord symbol string</p>  
**See**: {toChordSymbol}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a numeric or numeral.</p> |

<a name="Chord+isChordSymbol"></a>

### chord.isChordSymbol() ⇒ <code>boolean</code>
<p>Determines whether the chord is a chord symbol</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
<a name="Chord+toChordSolfege"></a>

### chord.toChordSolfege([referenceKey]) ⇒ [<code>Chord</code>](#Chord)
<p>Converts the chord to a chord solfege, using the supplied key as a reference.
For example, a numeric chord <code>#4</code> with reference key <code>Mi</code> will return the chord symbol <code>La#</code>.
When the chord is already a chord solfege, it will return a clone of the object.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the chord solfege</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a numeric or numeral.</p> |

<a name="Chord+toChordSolfegeString"></a>

### chord.toChordSolfegeString([referenceKey]) ⇒ <code>string</code>
<p>Converts the chord to a chord solfege string, using the supplied key as a reference.
For example, a numeric chord <code>#4</code> with reference key <code>E</code> will return the chord solfege <code>A#</code>.
When the chord is already a chord solfege, it will return a string version of the chord.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: <code>string</code> - <p>the chord solfege string</p>  
**See**: {toChordSolfege}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a numeric or numeral.</p> |

<a name="Chord+isChordSolfege"></a>

### chord.isChordSolfege() ⇒ <code>boolean</code>
<p>Determines whether the chord is a chord solfege</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
<a name="Chord+toNumeric"></a>

### chord.toNumeric([referenceKey]) ⇒ [<code>Chord</code>](#Chord)
<p>Converts the chord to a numeric chord, using the supplied key as a reference.
For example, a chord symbol A# with reference key E will return the numeric chord #4.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the numeric chord</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a chord symbol</p> |

<a name="Chord+toNumeral"></a>

### chord.toNumeral([referenceKey]) ⇒ [<code>Chord</code>](#Chord)
<p>Converts the chord to a numeral chord, using the supplied key as a reference.
For example, a chord symbol A# with reference key E will return the numeral chord #IV.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the numeral chord</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a chord symbol</p> |

<a name="Chord+toNumeralString"></a>

### chord.toNumeralString([referenceKey]) ⇒ <code>string</code>
<p>Converts the chord to a numeral chord string, using the supplied kye as a reference.
For example, a chord symbol A# with reference key E will return the numeral chord #4.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: <code>string</code> - <p>the numeral chord string</p>  
**See**: {toNumeral}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a chord symbol</p> |

<a name="Chord+isNumeric"></a>

### chord.isNumeric() ⇒ <code>boolean</code>
<p>Determines whether the chord is numeric</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
<a name="Chord+toNumericString"></a>

### chord.toNumericString([referenceKey]) ⇒ <code>string</code>
<p>Converts the chord to a numeric chord string, using the supplied kye as a reference.
For example, a chord symbol A# with reference key E will return the numeric chord #4.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: <code>string</code> - <p>the numeric chord string</p>  
**See**: {toNumeric}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [referenceKey] | [<code>Key</code>](#Key) \| <code>string</code> \| <code>null</code> | <code></code> | <p>the reference key. The key is required when converting a chord symbol</p> |

<a name="Chord+isNumeral"></a>

### chord.isNumeral() ⇒ <code>boolean</code>
<p>Determines whether the chord is a numeral</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
<a name="Chord+toString"></a>

### chord.toString([configuration]) ⇒ <code>string</code>
<p>Converts the chord to a string, eg <code>Esus4/G#</code> or <code>1sus4/#3</code></p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: <code>string</code> - <p>the chord string</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [configuration] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [configuration.useUnicodeModifier] | <code>boolean</code> | <code>false</code> | <p>Whether or not to use unicode modifiers. This will make <code>#</code> (sharp) look like <code>♯</code> and <code>b</code> (flat) look like <code>♭</code></p> |

<a name="Chord+normalize"></a>

### chord.normalize([key], [options]) ⇒ [<code>Chord</code>](#Chord)
<p>Normalizes the chord root and bass notes:</p>
<ul>
<li>Fab becomes Mi</li>
<li>Dob becomes Si</li>
<li>Si# becomes Do</li>
<li>Mi# becomes Fa</li>
<li>Fb becomes E</li>
<li>Cb becomes B</li>
<li>B# becomes C</li>
<li>E# becomes F</li>
<li>4b becomes 3</li>
<li>1b becomes 7</li>
<li>7# becomes 1</li>
<li>3# becomes 4</li>
</ul>
<p>Besides that it normalizes the suffix if <code>normalizeSuffix</code> is <code>true</code>.
For example, <code>sus2</code> becomes <code>2</code>, <code>sus4</code> becomes <code>sus</code>.
All suffix normalizations can be found in <code>src/normalize_mappings/suffix-mapping.txt</code>.</p>
<p>When the chord is minor, bass notes are normalized off of the relative major
of the root note. For example, <code>Em/A#</code> becomes <code>Em/Bb</code>.</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the normalized chord</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | [<code>Key</code>](#Key) \| <code>string</code> | <code></code> | <p>the key to normalize to</p> |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.normalizeSuffix] | <code>boolean</code> | <code>true</code> | <p>whether to normalize the chord suffix after transposing</p> |

<a name="Chord+useModifier"></a>

### chord.useModifier(newModifier) ⇒ [<code>Chord</code>](#Chord)
<p>Switches to the specified modifier</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the new, changed chord</p>  

| Param | Description |
| --- | --- |
| newModifier | <p>the modifier to use: <code>'#'</code> or <code>'b'</code></p> |

<a name="Chord+transposeUp"></a>

### chord.transposeUp() ⇒ [<code>Chord</code>](#Chord)
<p>Transposes the chord up by 1 semitone. Eg. A becomes A#, Eb becomes E</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the new, transposed chord</p>  
<a name="Chord+transposeDown"></a>

### chord.transposeDown() ⇒ [<code>Chord</code>](#Chord)
<p>Transposes the chord down by 1 semitone. Eg. A# becomes A, E becomes Eb</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the new, transposed chord</p>  
<a name="Chord+transpose"></a>

### chord.transpose(delta) ⇒ [<code>Chord</code>](#Chord)
<p>Transposes the chord by the specified number of semitones</p>

**Kind**: instance method of [<code>Chord</code>](#Chord)  
**Returns**: [<code>Chord</code>](#Chord) - <p>the new, transposed chord</p>  

| Param | Description |
| --- | --- |
| delta | <p>de number of semitones</p> |

<a name="Chord.parse"></a>

### Chord.parse(chordString) ⇒ [<code>Chord</code>](#Chord) \| <code>null</code>
<p>Tries to parse a chord string into a chord
Any leading or trailing whitespace is removed first, so a chord like <code> \n  E/G# \r</code> is valid.</p>

**Kind**: static method of [<code>Chord</code>](#Chord)  

| Param | Description |
| --- | --- |
| chordString | <p>the chord string, eg <code>Esus4/G#</code> or <code>1sus4/#3</code>.</p> |

<a name="ChordProFormatter"></a>

## ChordProFormatter
<p>Formats a song into a ChordPro chord sheet</p>

**Kind**: global class  
<a name="ChordProFormatter+format"></a>

### chordProFormatter.format(song) ⇒ <code>string</code>
<p>Formats a song into a ChordPro chord sheet.</p>

**Kind**: instance method of [<code>ChordProFormatter</code>](#ChordProFormatter)  
**Returns**: <code>string</code> - <p>The ChordPro string</p>  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | <p>The song to be formatted</p> |

<a name="ChordsOverWordsFormatter"></a>

## ChordsOverWordsFormatter
<p>Formats a song into a plain text chord sheet</p>

**Kind**: global class  
<a name="ChordsOverWordsFormatter+format"></a>

### chordsOverWordsFormatter.format(song) ⇒ <code>string</code>
<p>Formats a song into a plain text chord sheet</p>

**Kind**: instance method of [<code>ChordsOverWordsFormatter</code>](#ChordsOverWordsFormatter)  
**Returns**: <code>string</code> - <p>the chord sheet</p>  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | <p>The song to be formatted</p> |

<a name="Formatter"></a>

## Formatter
<p>Base class for all formatters, taking care of receiving a configuration wrapping that inside a Configuration object</p>

**Kind**: global class  
<a name="new_Formatter_new"></a>

### new Formatter([configuration])
<p>Instantiate</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [configuration] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [configuration.evaluate] | <code>boolean</code> | <code>false</code> | <p>Whether or not to evaluate meta expressions. For more info about meta expressions, see: https://bit.ly/2SC9c2u</p> |
| [configuration.metadata] | <code>object</code> | <code>{}</code> |  |
| [configuration.metadata.separator] | <code>string</code> | <code>&quot;\&quot;, \&quot;&quot;</code> | <p>The separator to be used when rendering a metadata value that has multiple values. See: https://bit.ly/2SC9c2u</p> |
| [configuration.key] | [<code>Key</code>](#Key) \| <code>string</code> | <code></code> | <p>The key to use for rendering. The chord sheet will be transposed from the song's original key (as indicated by the <code>{key}</code> directive) to the specified key. Note that transposing will only work if the original song key is set.</p> |
| [configuration.expandChorusDirective] | <code>boolean</code> | <code>false</code> | <p>Whether or not to expand <code>{chorus}</code> directives by rendering the last defined chorus inline after the directive.</p> |
| [configuration.useUnicodeModifiers] | <code>boolean</code> | <code>false</code> | <p>Whether or not to use unicode flat and sharp symbols.</p> |
| [configuration.normalizeChords] | <code>boolean</code> | <code>true</code> | <p>Whether or not to automatically normalize chords</p> |

<a name="HtmlDivFormatter"></a>

## HtmlDivFormatter
<p>Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.</p>

**Kind**: global class  
<a name="HtmlFormatter"></a>

## HtmlFormatter
<p>Acts as a base class for HTML formatters</p>

**Kind**: global class  

* [HtmlFormatter](#HtmlFormatter)
    * [.cssObject](#HtmlFormatter+cssObject) ⇒ <code>Object.&lt;string, Object.&lt;string, string&gt;&gt;</code>
    * [.format(song)](#HtmlFormatter+format) ⇒ <code>string</code>
    * [.cssString(scope)](#HtmlFormatter+cssString) ⇒ <code>string</code>

<a name="HtmlFormatter+cssObject"></a>

### htmlFormatter.cssObject ⇒ <code>Object.&lt;string, Object.&lt;string, string&gt;&gt;</code>
<p>Basic CSS, in object style à la useStyles, to use with the HTML output
For a CSS string see [cssString](cssString)</p>
<p>Example:</p>
<pre><code>'.paragraph': {
  marginBottom: '1em'
}
</code></pre>

**Kind**: instance property of [<code>HtmlFormatter</code>](#HtmlFormatter)  
**Returns**: <code>Object.&lt;string, Object.&lt;string, string&gt;&gt;</code> - <p>the CSS object</p>  
<a name="HtmlFormatter+format"></a>

### htmlFormatter.format(song) ⇒ <code>string</code>
<p>Formats a song into HTML.</p>

**Kind**: instance method of [<code>HtmlFormatter</code>](#HtmlFormatter)  
**Returns**: <code>string</code> - <p>The HTML string</p>  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | <p>The song to be formatted</p> |

<a name="HtmlFormatter+cssString"></a>

### htmlFormatter.cssString(scope) ⇒ <code>string</code>
<p>Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output</p>
<p>For example, execute cssString('.chordSheetViewer') will result in CSS like:</p>
<pre><code>.chordSheetViewer .paragraph {
  margin-bottom: 1em;
}
</code></pre>

**Kind**: instance method of [<code>HtmlFormatter</code>](#HtmlFormatter)  
**Returns**: <code>string</code> - <p>the CSS string</p>  

| Param | Description |
| --- | --- |
| scope | <p>the CSS scope to use, for example <code>.chordSheetViewer</code></p> |

<a name="HtmlTableFormatter"></a>

## HtmlTableFormatter
<p>Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
PDF conversion.</p>

**Kind**: global class  
<a name="TextFormatter"></a>

## TextFormatter
<p>Formats a song into a plain text chord sheet</p>

**Kind**: global class  
<a name="TextFormatter+format"></a>

### textFormatter.format(song) ⇒ <code>string</code>
<p>Formats a song into a plain text chord sheet</p>

**Kind**: instance method of [<code>TextFormatter</code>](#TextFormatter)  
**Returns**: <code>string</code> - <p>the chord sheet</p>  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | <p>The song to be formatted</p> |

<a name="Key"></a>

## Key
<p>Represents a key, such as Eb (symbol), #3 (numeric) or VII (numeral).</p>
<p>The only function considered public API is <code>Key.distance</code></p>

**Kind**: global class  
<a name="Key.distance"></a>

### Key.distance(oneKey, otherKey) ⇒ <code>number</code>
<p>Calculates the distance in semitones between one key and another.</p>

**Kind**: static method of [<code>Key</code>](#Key)  
**Returns**: <code>number</code> - <p>the distance in semitones</p>  

| Param | Type | Description |
| --- | --- | --- |
| oneKey | [<code>Key</code>](#Key) \| <code>string</code> | <p>the key</p> |
| otherKey | [<code>Key</code>](#Key) \| <code>string</code> | <p>the other key</p> |

<a name="ChordProParser"></a>

## ChordProParser
<p>Parses a ChordPro chord sheet</p>

**Kind**: global class  

* [ChordProParser](#ChordProParser)
    * [.warnings](#ChordProParser+warnings) : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
    * [.parse(chordSheet, options)](#ChordProParser+parse) ⇒ [<code>Song</code>](#Song)

<a name="ChordProParser+warnings"></a>

### chordProParser.warnings : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
<p>All warnings raised during parsing the chord sheet</p>

**Kind**: instance property of [<code>ChordProParser</code>](#ChordProParser)  
<a name="ChordProParser+parse"></a>

### chordProParser.parse(chordSheet, options) ⇒ [<code>Song</code>](#Song)
<p>Parses a ChordPro chord sheet into a song</p>

**Kind**: instance method of [<code>ChordProParser</code>](#ChordProParser)  
**Returns**: [<code>Song</code>](#Song) - <p>The parsed song</p>  
**See**: https://peggyjs.org/documentation.html#using-the-parser  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chordSheet | <code>string</code> |  | <p>the ChordPro chord sheet</p> |
| options | <code>ChordProParserOptions</code> |  | <p>Parser options.</p> |
| options.softLineBreaks | <code>ChordProParserOptions.softLineBreaks</code> | <code>false</code> | <p>If true, a backslash followed by * a space is treated as a soft line break</p> |

<a name="ChordSheetParser"></a>

## ~~ChordSheetParser~~
***Deprecated***

<p>Parses a normal chord sheet</p>
<p>ChordSheetParser is deprecated, please use ChordsOverWordsParser.</p>
<p>ChordsOverWordsParser aims to support any kind of chord, whereas ChordSheetParser lacks
support for many variations. Besides that, some chordpro feature have been ported back
to ChordsOverWordsParser, which adds some interesting functionality.</p>

**Kind**: global class  

* ~~[ChordSheetParser](#ChordSheetParser)~~
    * [new ChordSheetParser([options])](#new_ChordSheetParser_new)
    * [.parse(chordSheet, [options])](#ChordSheetParser+parse) ⇒ [<code>Song</code>](#Song)

<a name="new_ChordSheetParser_new"></a>

### new ChordSheetParser([options])
<p>Instantiate a chord sheet parser
ChordSheetParser is deprecated, please use ChordsOverWordsParser.</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.preserveWhitespace] | <code>boolean</code> | <code>true</code> | <p>whether to preserve trailing whitespace for chords</p> |

<a name="ChordSheetParser+parse"></a>

### chordSheetParser.parse(chordSheet, [options]) ⇒ [<code>Song</code>](#Song)
<p>Parses a chord sheet into a song</p>

**Kind**: instance method of [<code>ChordSheetParser</code>](#ChordSheetParser)  
**Returns**: [<code>Song</code>](#Song) - <p>The parsed song</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chordSheet | <code>string</code> |  | <p>The ChordPro chord sheet</p> |
| [options] | <code>Object</code> | <code>{}</code> | <p>Optional parser options</p> |
| [options.song] | [<code>Song</code>](#Song) | <code></code> | <p>The [Song](#Song) to store the song data in</p> |

<a name="ChordsOverWordsParser"></a>

## ChordsOverWordsParser
<p>Parses a chords over words sheet into a song</p>
<p>It support &quot;regular&quot; chord sheets:</p>
<pre><code>       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
</code></pre>
<p>Additionally, some chordpro features have been &quot;ported back&quot;. For example, you can use chordpro directives:</p>
<pre><code>{title: Let it be}
{key: C}
Chorus 1:
       Am
Let it be
</code></pre>
<p>For convenience, you can leave out the brackets:</p>
<pre><code>title: Let it be
Chorus 1:
       Am
Let it be
</code></pre>
<p>You can even use a markdown style frontmatter separator to separate the header from the song:</p>
<pre><code>title: Let it be
key: C
---
Chorus 1:
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
</code></pre>
<p><code>ChordsOverWordsParser</code> is the better version of <code>ChordSheetParser</code>, which is deprecated.</p>

**Kind**: global class  

* [ChordsOverWordsParser](#ChordsOverWordsParser)
    * [.warnings](#ChordsOverWordsParser+warnings) : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
    * [.parse(chordSheet, options)](#ChordsOverWordsParser+parse) ⇒ [<code>Song</code>](#Song)

<a name="ChordsOverWordsParser+warnings"></a>

### chordsOverWordsParser.warnings : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
<p>All warnings raised during parsing the chord sheet</p>

**Kind**: instance property of [<code>ChordsOverWordsParser</code>](#ChordsOverWordsParser)  
<a name="ChordsOverWordsParser+parse"></a>

### chordsOverWordsParser.parse(chordSheet, options) ⇒ [<code>Song</code>](#Song)
<p>Parses a chords over words sheet into a song</p>

**Kind**: instance method of [<code>ChordsOverWordsParser</code>](#ChordsOverWordsParser)  
**Returns**: [<code>Song</code>](#Song) - <p>The parsed song</p>  
**See**: https://peggyjs.org/documentation.html#using-the-parser  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chordSheet | <code>string</code> |  | <p>the chords over words sheet</p> |
| options | <code>ChordsOverWordsParserOptions</code> |  | <p>Parser options.</p> |
| options.softLineBreaks | <code>ChordsOverWordsParserOptions.softLineBreaks</code> | <code>false</code> | <p>If true, a backslash followed by a space is treated as a soft line break</p> |

<a name="ParserWarning"></a>

## ParserWarning
<p>Represents a parser warning, currently only used by ChordProParser.</p>

**Kind**: global class  
<a name="ParserWarning+toString"></a>

### parserWarning.toString() ⇒ <code>string</code>
<p>Returns a stringified version of the warning</p>

**Kind**: instance method of [<code>ParserWarning</code>](#ParserWarning)  
**Returns**: <code>string</code> - <p>The string warning</p>  
<a name="UltimateGuitarParser"></a>

## UltimateGuitarParser
<p>Parses an Ultimate Guitar chord sheet with metadata
Inherits from [ChordSheetParser](#ChordSheetParser)</p>

**Kind**: global class  
<a name="new_UltimateGuitarParser_new"></a>

### new UltimateGuitarParser([options])
<p>Instantiate a chord sheet parser</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | <p>options</p> |
| [options.preserveWhitespace] | <code>boolean</code> | <code>true</code> | <p>whether to preserve trailing whitespace for chords</p> |

<a name="ALBUM"></a>

## ALBUM : <code>string</code>
<p>Album meta directive. See https://www.chordpro.org/chordpro/directives-album/</p>

**Kind**: global constant  
<a name="ARRANGER"></a>

## ARRANGER : <code>string</code>
<p>Arranger meta directive. See https://chordpro.org/chordpro/directives-arranger/</p>

**Kind**: global constant  
<a name="ARTIST"></a>

## ARTIST : <code>string</code>
<p>Artist meta directive. See https://www.chordpro.org/chordpro/directives-artist/</p>

**Kind**: global constant  
<a name="CAPO"></a>

## CAPO : <code>string</code>
<p>Capo meta directive. See https://www.chordpro.org/chordpro/directives-capo/</p>

**Kind**: global constant  
<a name="COMMENT"></a>

## COMMENT : <code>string</code>
<p>Comment directive. See https://www.chordpro.org/chordpro/directives-comment/</p>

**Kind**: global constant  
<a name="COMPOSER"></a>

## COMPOSER : <code>string</code>
<p>Composer meta directive. See https://www.chordpro.org/chordpro/directives-composer/</p>

**Kind**: global constant  
<a name="COPYRIGHT"></a>

## COPYRIGHT : <code>string</code>
<p>Copyright meta directive. See https://www.chordpro.org/chordpro/directives-copyright/</p>

**Kind**: global constant  
<a name="DURATION"></a>

## DURATION : <code>string</code>
<p>Duration meta directive. See https://www.chordpro.org/chordpro/directives-duration/</p>

**Kind**: global constant  
<a name="END_OF_ABC"></a>

## END\_OF\_ABC : <code>string</code>
<p>End of ABC music notation section See https://chordpro.org/chordpro/directives-env_abc/</p>

**Kind**: global constant  
<a name="END_OF_BRIDGE"></a>

## END\_OF\_BRIDGE : <code>string</code>
<p>End of bridge directive. See https://chordpro.org/chordpro/directives-env_bridge/</p>

**Kind**: global constant  
<a name="END_OF_CHORUS"></a>

## END\_OF\_CHORUS : <code>string</code>
<p>End of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/</p>

**Kind**: global constant  
<a name="END_OF_GRID"></a>

## END\_OF\_GRID : <code>string</code>
<p>End of grid directive. See https://www.chordpro.org/chordpro/directives-env_grid/</p>

**Kind**: global constant  
<a name="END_OF_LY"></a>

## END\_OF\_LY : <code>string</code>
<p>End of Lilypond music notation section See https://chordpro.org/chordpro/directives-env_ly/</p>

**Kind**: global constant  
<a name="END_OF_TAB"></a>

## END\_OF\_TAB : <code>string</code>
<p>End of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/</p>

**Kind**: global constant  
<a name="END_OF_VERSE"></a>

## END\_OF\_VERSE : <code>string</code>
<p>End of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/</p>

**Kind**: global constant  
<a name="KEY"></a>

## KEY : <code>string</code>
<p>Key meta directive. See https://www.chordpro.org/chordpro/directives-key/</p>

**Kind**: global constant  
<a name="_KEY"></a>

## \_KEY : <code>string</code>
<p>_Key meta directive. Reflects the key as transposed by the capo value
See https://www.chordpro.org/chordpro/directives-key/</p>

**Kind**: global constant  
<a name="LYRICIST"></a>

## LYRICIST : <code>string</code>
<p>Lyricist meta directive. See https://www.chordpro.org/chordpro/directives-lyricist/</p>

**Kind**: global constant  
<a name="SORTTITLE"></a>

## SORTTITLE : <code>string</code>
<p>Sorttitle meta directive. See https://chordpro.org/chordpro/directives-sorttitle/</p>

**Kind**: global constant  
<a name="START_OF_ABC"></a>

## START\_OF\_ABC : <code>string</code>
<p>Start of ABC music notation section See https://chordpro.org/chordpro/directives-env_abc/</p>

**Kind**: global constant  
<a name="START_OF_BRIDGE"></a>

## START\_OF\_BRIDGE : <code>string</code>
<p>Start of bridge directive. See https://chordpro.org/chordpro/directives-env_bridge/</p>

**Kind**: global constant  
<a name="START_OF_CHORUS"></a>

## START\_OF\_CHORUS : <code>string</code>
<p>Start of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/</p>

**Kind**: global constant  
<a name="START_OF_GRID"></a>

## START\_OF\_GRID : <code>string</code>
<p>Start of grid directive. See https://www.chordpro.org/chordpro/directives-env_grid/</p>

**Kind**: global constant  
<a name="START_OF_LY"></a>

## START\_OF\_LY : <code>string</code>
<p>Start of Lilypond music notation section See https://chordpro.org/chordpro/directives-env_ly/</p>

**Kind**: global constant  
<a name="START_OF_TAB"></a>

## START\_OF\_TAB : <code>string</code>
<p>Start of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/</p>

**Kind**: global constant  
<a name="START_OF_VERSE"></a>

## START\_OF\_VERSE : <code>string</code>
<p>Start of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/</p>

**Kind**: global constant  
<a name="SUBTITLE"></a>

## SUBTITLE : <code>string</code>
<p>Subtitle meta directive. See https://www.chordpro.org/chordpro/directives-subtitle/</p>

**Kind**: global constant  
<a name="TEMPO"></a>

## TEMPO : <code>string</code>
<p>Tempo meta directive. See https://www.chordpro.org/chordpro/directives-tempo/</p>

**Kind**: global constant  
<a name="TIME"></a>

## TIME : <code>string</code>
<p>Time meta directive. See https://www.chordpro.org/chordpro/directives-time/</p>

**Kind**: global constant  
<a name="TITLE"></a>

## TITLE : <code>string</code>
<p>Title meta directive. See https://www.chordpro.org/chordpro/directives-title/</p>

**Kind**: global constant  
<a name="TRANSPOSE"></a>

## TRANSPOSE : <code>string</code>
<p>Transpose meta directive. See: https://www.chordpro.org/chordpro/directives-transpose/</p>

**Kind**: global constant  
<a name="NEW_KEY"></a>

## NEW\_KEY : <code>string</code>
<p>New Key meta directive. See: https://github.com/PraiseCharts/ChordChartJS/issues/53</p>

**Kind**: global constant  
<a name="YEAR"></a>

## YEAR : <code>string</code>
<p>Year meta directive. See https://www.chordpro.org/chordpro/directives-year/</p>

**Kind**: global constant  
<a name="CHORDFONT"></a>

## CHORDFONT : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p>

**Kind**: global constant  
<a name="CHORDSIZE"></a>

## CHORDSIZE : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p>

**Kind**: global constant  
<a name="CHORDCOLOUR"></a>

## CHORDCOLOUR : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_chord_legacy/</p>

**Kind**: global constant  
<a name="TEXTFONT"></a>

## TEXTFONT : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p>

**Kind**: global constant  
<a name="TEXTSIZE"></a>

## TEXTSIZE : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p>

**Kind**: global constant  
<a name="TEXTCOLOUR"></a>

## TEXTCOLOUR : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_text_legacy/</p>

**Kind**: global constant  
<a name="TITLEFONT"></a>

## TITLEFONT : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p>

**Kind**: global constant  
<a name="TITLESIZE"></a>

## TITLESIZE : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p>

**Kind**: global constant  
<a name="TITLECOLOUR"></a>

## TITLECOLOUR : <code>string</code>
<p>Chordfont directive. See https://www.chordpro.org/chordpro/directives-props_title_legacy/</p>

**Kind**: global constant  
<a name="CHORUS"></a>

## CHORUS : <code>string</code>
<p>Chorus directive. Support repeating an earlier defined section.
See https://www.chordpro.org/chordpro/directives-env_chorus/</p>

**Kind**: global constant  
<a name="CHORD_STYLE"></a>

## CHORD\_STYLE : <code>string</code>
<p>Chord type directive. Determines the type of chords used in the rendered chord sheet.
Possible values are 'solfege', 'symbol', 'numeral' and 'number'</p>

**Kind**: global constant  
**See**: https://github.com/bettermusic/ChordSheetJS/issues/352  
<a name="BRIDGE"></a>

## BRIDGE : <code>string</code>
<p>Used to mark a paragraph as bridge</p>

**Kind**: global constant  
<a name="CHORUS"></a>

## CHORUS : <code>string</code>
<p>Used to mark a paragraph as chorus</p>

**Kind**: global constant  
<a name="GRID"></a>

## GRID : <code>string</code>
<p>Used to mark a paragraph as grid</p>

**Kind**: global constant  
<a name="INDETERMINATE"></a>

## INDETERMINATE : <code>string</code>
<p>Used to mark a paragraph as containing lines with both verse and chorus type</p>

**Kind**: global constant  
<a name="NONE"></a>

## NONE : <code>string</code>
<p>Used to mark a paragraph as not containing a line marked with a type</p>

**Kind**: global constant  
<a name="TAB"></a>

## TAB : <code>string</code>
<p>Used to mark a paragraph as tab</p>

**Kind**: global constant  
<a name="VERSE"></a>

## VERSE : <code>string</code>
<p>Used to mark a paragraph as verse</p>

**Kind**: global constant  
<a name="LILYPOND"></a>

## LILYPOND : <code>string</code>
<p>Used to mark a section as Lilypond notation</p>

**Kind**: global constant  
<a name="ABC"></a>

## ABC : <code>string</code>
<p>Used to mark a section as ABC music notation</p>

**Kind**: global constant  
<a name="scopedCss"></a>

## scopedCss(scope) ⇒ <code>string</code>
<p>Generates basic CSS, scoped within the provided selector, to use with output generated by [HtmlTableFormatter](#HtmlTableFormatter)</p>

**Kind**: global function  
**Returns**: <code>string</code> - <p>the CSS string</p>  

| Param | Description |
| --- | --- |
| scope | <p>the CSS scope to use, for example <code>.chordSheetViewer</code></p> |

<a name="scopedCss"></a>

## scopedCss(scope) ⇒ <code>string</code>
<p>Generates basic CSS, scoped within the provided selector, to use with output generated by [HtmlTableFormatter](#HtmlTableFormatter)</p>

**Kind**: global function  
**Returns**: <code>string</code> - <p>the CSS string</p>  

| Param | Description |
| --- | --- |
| scope | <p>the CSS scope to use, for example <code>.chordSheetViewer</code></p> |

<a name="getCapos"></a>

## getCapos(key) ⇒ <code>Object.&lt;string, string&gt;</code>
<p>Returns applicable capos for the provided key</p>

**Kind**: global function  
**Returns**: <code>Object.&lt;string, string&gt;</code> - <p>The available capos, where the keys are capo numbers and the
values are the effective key for that capo.</p>  

| Param | Type | Description |
| --- | --- | --- |
| key | [<code>Key</code>](#Key) \| <code>string</code> | <p>The key to get capos for</p> |

<a name="getKeys"></a>

## getKeys(key) ⇒ <code>Array.&lt;string&gt;</code>
<p>Returns applicable keys to transpose to from the provided key</p>

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>The available keys</p>  

| Param | Type | Description |
| --- | --- | --- |
| key | [<code>Key</code>](#Key) \| <code>string</code> | <p>The key to get keys for</p> |

