# ChordSheetJS [![Build Status](https://travis-ci.org/martijnversluis/ChordSheetJS.svg?branch=master)](https://travis-ci.org/martijnversluis/ChordSheetJS) [![npm version](https://badge.fury.io/js/chordsheetjs.svg)](https://badge.fury.io/js/chordsheetjs) [![Code Climate](https://codeclimate.com/github/martijnversluis/ChordSheetJS/badges/gpa.svg)](https://codeclimate.com/github/martijnversluis/ChordSheetJS)

A JavaScript library for parsing and formatting chord sheets

**Contents**

- [Installation](#installation)
- [How to ...?](#how-to-)
- [Supported ChordPro directives](#supported-chordpro-directives)
- [API docs](#api-docs)

## Installation

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

## How to ...?

### Parse chord sheet

#### Regular chord sheets

```javascript
const chordSheet = `
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

const parser = new ChordSheetJS.ChordSheetParser();
const song = parser.parse(chordSheet);
```

#### Chord pro format

```javascript
const chordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

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

## Supported ChordPro directives

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
| start_of_tab (short: sot)    | :heavy_multiplication_x: |
| end_of_tab (short: eot)      | :heavy_multiplication_x: |
| start_of_grid                | :heavy_multiplication_x: |
| end_of_grid                  | :heavy_multiplication_x: |

### Chord diagrams

| Directive | Support                  |
|:--------- |:------------------------:|
| define    | :heavy_multiplication_x: |
| chord     | :heavy_multiplication_x: |

### Fonts, sizes and colours

| Directive   | Support                  |
|:----------- |:------------------------:|
| textfont    | :clock2:                 |
| textsize    | :clock2:                 |
| textcolour  | :clock2:                 |
| chordfont   | :clock2:                 |
| chordsize   | :clock2:                 |
| chordcolour | :clock2:                 |
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
<dt><a href="#ChordLyricsPair">ChordLyricsPair</a></dt>
<dd><p>Represents a chord with the corresponding (partial) lyrics</p>
</dd>
<dt><a href="#Line">Line</a></dt>
<dd><p>Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag</p>
</dd>
<dt><a href="#Paragraph">Paragraph</a></dt>
<dd><p>Represents a paragraph of lines in a chord sheet</p>
</dd>
<dt><a href="#Song">Song</a></dt>
<dd><p>Represents a song in a chord sheet. Currently a chord sheet can only have one song.</p>
</dd>
<dt><a href="#Tag">Tag</a></dt>
<dd><p>Represents a tag/directive. See <a href="https://www.chordpro.org/chordpro/ChordPro-Directives.html">https://www.chordpro.org/chordpro/ChordPro-Directives.html</a></p>
</dd>
<dt><a href="#ChordProFormatter">ChordProFormatter</a></dt>
<dd><p>Formats a song into a ChordPro chord sheet</p>
</dd>
<dt><a href="#HtmlDivFormatter">HtmlDivFormatter</a></dt>
<dd><p>Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.</p>
</dd>
<dt><a href="#HtmlTableFormatter">HtmlTableFormatter</a></dt>
<dd><p>Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
PDF conversion.</p>
</dd>
<dt><a href="#TextFormatter">TextFormatter</a></dt>
<dd><p>Formats a sonf into a plain text chord sheet</p>
</dd>
<dt><a href="#ChordProParser">ChordProParser</a></dt>
<dd><p>Parses a ChordPro chord sheet</p>
</dd>
<dt><a href="#ParserWarning">ParserWarning</a></dt>
<dd><p>Represents a parser warning, currently only used by ChordProParser.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#ALBUM">ALBUM</a> : <code>string</code></dt>
<dd><p>Album meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-album.html">https://www.chordpro.org/chordpro/Directives-album.html</a></p>
</dd>
<dt><a href="#ARTIST">ARTIST</a> : <code>string</code></dt>
<dd><p>Artist meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-artist.html">https://www.chordpro.org/chordpro/Directives-artist.html</a></p>
</dd>
<dt><a href="#CAPO">CAPO</a> : <code>string</code></dt>
<dd><p>Capo meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-capo.html">https://www.chordpro.org/chordpro/Directives-capo.html</a></p>
</dd>
<dt><a href="#COMMENT">COMMENT</a> : <code>string</code></dt>
<dd><p>Comment directive. See <a href="https://www.chordpro.org/chordpro/Directives-comment.html">https://www.chordpro.org/chordpro/Directives-comment.html</a></p>
</dd>
<dt><a href="#COMPOSER">COMPOSER</a> : <code>string</code></dt>
<dd><p>Composer meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-composer.html">https://www.chordpro.org/chordpro/Directives-composer.html</a></p>
</dd>
<dt><a href="#COPYRIGHT">COPYRIGHT</a> : <code>string</code></dt>
<dd><p>Copyright meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-copyright.html">https://www.chordpro.org/chordpro/Directives-copyright.html</a></p>
</dd>
<dt><a href="#DURATION">DURATION</a> : <code>string</code></dt>
<dd><p>Duration meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-duration.html">https://www.chordpro.org/chordpro/Directives-duration.html</a></p>
</dd>
<dt><a href="#END_OF_CHORUS">END_OF_CHORUS</a> : <code>string</code></dt>
<dd><p>End of chorus directive. See <a href="https://www.chordpro.org/chordpro/Directives-env_chorus.html">https://www.chordpro.org/chordpro/Directives-env_chorus.html</a></p>
</dd>
<dt><a href="#END_OF_VERSE">END_OF_VERSE</a> : <code>string</code></dt>
<dd><p>End of verse directive. See <a href="https://www.chordpro.org/chordpro/Directives-env_verse.html">https://www.chordpro.org/chordpro/Directives-env_verse.html</a></p>
</dd>
<dt><a href="#KEY">KEY</a> : <code>string</code></dt>
<dd><p>Key meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-key.html">https://www.chordpro.org/chordpro/Directives-key.html</a></p>
</dd>
<dt><a href="#LYRICIST">LYRICIST</a> : <code>string</code></dt>
<dd><p>Lyricist meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-lyricist.html">https://www.chordpro.org/chordpro/Directives-lyricist.html</a></p>
</dd>
<dt><a href="#START_OF_CHORUS">START_OF_CHORUS</a> : <code>string</code></dt>
<dd><p>Start of chorus directive. See <a href="https://www.chordpro.org/chordpro/Directives-env_chorus.html">https://www.chordpro.org/chordpro/Directives-env_chorus.html</a></p>
</dd>
<dt><a href="#START_OF_VERSE">START_OF_VERSE</a> : <code>string</code></dt>
<dd><p>Start of verse directive. See <a href="https://www.chordpro.org/chordpro/Directives-env_verse.html">https://www.chordpro.org/chordpro/Directives-env_verse.html</a></p>
</dd>
<dt><a href="#SUBTITLE">SUBTITLE</a> : <code>string</code></dt>
<dd><p>Subtitle meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-subtitle.html">https://www.chordpro.org/chordpro/Directives-subtitle.html</a></p>
</dd>
<dt><a href="#TEMPO">TEMPO</a> : <code>string</code></dt>
<dd><p>Tempo meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-tempo.html">https://www.chordpro.org/chordpro/Directives-tempo.html</a></p>
</dd>
<dt><a href="#TIME">TIME</a> : <code>string</code></dt>
<dd><p>Time meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-time.html">https://www.chordpro.org/chordpro/Directives-time.html</a></p>
</dd>
<dt><a href="#TITLE">TITLE</a> : <code>string</code></dt>
<dd><p>Title meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-title.html">https://www.chordpro.org/chordpro/Directives-title.html</a></p>
</dd>
<dt><a href="#YEAR">YEAR</a> : <code>string</code></dt>
<dd><p>Year meta directive. See <a href="https://www.chordpro.org/chordpro/Directives-year.html">https://www.chordpro.org/chordpro/Directives-year.html</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#parse">parse(chordSheet)</a> ⇒ <code><a href="#Song">Song</a></code></dt>
<dd><p>Parses a chord sheet into a song</p>
</dd>
</dl>

<a name="ChordLyricsPair"></a>

## ChordLyricsPair
Represents a chord with the corresponding (partial) lyrics

**Kind**: global class  

* [ChordLyricsPair](#ChordLyricsPair)
    * [new ChordLyricsPair(chords, lyrics)](#new_ChordLyricsPair_new)
    * [.chords](#ChordLyricsPair+chords) : <code>string</code>
    * [.lyrics](#ChordLyricsPair+lyrics) : <code>string</code>
    * [.isRenderable()](#ChordLyricsPair+isRenderable) ⇒ <code>boolean</code>
    * [.clone()](#ChordLyricsPair+clone) ⇒ [<code>ChordLyricsPair</code>](#ChordLyricsPair)

<a name="new_ChordLyricsPair_new"></a>

### new ChordLyricsPair(chords, lyrics)
Initialises a ChordLyricsPair


| Param | Type | Description |
| --- | --- | --- |
| chords | <code>string</code> | The chords |
| lyrics | <code>string</code> | The lyrics |

<a name="ChordLyricsPair+chords"></a>

### chordLyricsPair.chords : <code>string</code>
The chords

**Kind**: instance property of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+lyrics"></a>

### chordLyricsPair.lyrics : <code>string</code>
The lyrics

**Kind**: instance property of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+isRenderable"></a>

### chordLyricsPair.isRenderable() ⇒ <code>boolean</code>
Indicates whether a ChordLyricsPair should be visible in a formatted chord sheet (except for ChordPro sheets)

**Kind**: instance method of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="ChordLyricsPair+clone"></a>

### chordLyricsPair.clone() ⇒ [<code>ChordLyricsPair</code>](#ChordLyricsPair)
Returns a deep copy of the ChordLyricsPair, useful when programmatically transforming a song

**Kind**: instance method of [<code>ChordLyricsPair</code>](#ChordLyricsPair)  
<a name="Line"></a>

## Line
Represents a line in a chord sheet, consisting of items of type ChordLyricsPair or Tag

**Kind**: global class  

* [Line](#Line)
    * [.items](#Line+items) : <code>Array.&lt;(ChordLyricsPair\|Tag)&gt;</code>
    * [.type](#Line+type) : <code>string</code>
    * [.isEmpty()](#Line+isEmpty) ⇒ <code>boolean</code>
    * [.addItem(item)](#Line+addItem)
    * [.hasRenderableItems()](#Line+hasRenderableItems) ⇒ <code>boolean</code>
    * [.clone()](#Line+clone) ⇒ [<code>Line</code>](#Line)
    * [.isVerse()](#Line+isVerse) ⇒ <code>boolean</code>
    * [.isChorus()](#Line+isChorus) ⇒ <code>boolean</code>
    * ~~[.hasContent()](#Line+hasContent) ⇒ <code>boolean</code>~~

<a name="Line+items"></a>

### line.items : <code>Array.&lt;(ChordLyricsPair\|Tag)&gt;</code>
The items ([ChordLyricsPair](#ChordLyricsPair) or [Tag](#Tag)) of which the line consists

**Kind**: instance property of [<code>Line</code>](#Line)  
<a name="Line+type"></a>

### line.type : <code>string</code>
The line type, This is set by the ChordProParser when it read tags like {start_of_chorus} or {start_of_verse}
Values can be [VERSE](VERSE), [CHORUS](CHORUS) or [NONE](NONE)

**Kind**: instance property of [<code>Line</code>](#Line)  
<a name="Line+isEmpty"></a>

### line.isEmpty() ⇒ <code>boolean</code>
Indicates whether the line contains any items

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+addItem"></a>

### line.addItem(item)
Adds an item ([ChordLyricsPair](#ChordLyricsPair) or [Tag](#Tag)) to the line

**Kind**: instance method of [<code>Line</code>](#Line)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>ChordLyricsPair</code>](#ChordLyricsPair) \| [<code>Tag</code>](#Tag) | The item to be added |

<a name="Line+hasRenderableItems"></a>

### line.hasRenderableItems() ⇒ <code>boolean</code>
Indicates whether the line contains items that are renderable

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+clone"></a>

### line.clone() ⇒ [<code>Line</code>](#Line)
Returns a deep copy of the line and all of its items

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isVerse"></a>

### line.isVerse() ⇒ <code>boolean</code>
Indicates whether the line type is [VERSE](VERSE)

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+isChorus"></a>

### line.isChorus() ⇒ <code>boolean</code>
Indicates whether the line type is [CHORUS](CHORUS)

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Line+hasContent"></a>

### ~~line.hasContent() ⇒ <code>boolean</code>~~
***Deprecated***

Indicates whether the line contains items that are renderable. Please use [hasRenderableItems](hasRenderableItems)

**Kind**: instance method of [<code>Line</code>](#Line)  
<a name="Paragraph"></a>

## Paragraph
Represents a paragraph of lines in a chord sheet

**Kind**: global class  

* [Paragraph](#Paragraph)
    * [.lines](#Paragraph+lines) : [<code>Array.&lt;Line&gt;</code>](#Line)
    * [.type](#Paragraph+type) ⇒ <code>string</code>

<a name="Paragraph+lines"></a>

### paragraph.lines : [<code>Array.&lt;Line&gt;</code>](#Line)
The [Line](#Line) items of which the paragraph consists

**Kind**: instance property of [<code>Paragraph</code>](#Paragraph)  
<a name="Paragraph+type"></a>

### paragraph.type ⇒ <code>string</code>
Tries to determine the common type for all lines. If the types for all lines are equal, it returns that type.
If not, it returns [INDETERMINATE](INDETERMINATE)

**Kind**: instance property of [<code>Paragraph</code>](#Paragraph)  
<a name="Song"></a>

## Song
Represents a song in a chord sheet. Currently a chord sheet can only have one song.

**Kind**: global class  

* [Song](#Song)
    * [.lines](#Song+lines) : [<code>Array.&lt;Line&gt;</code>](#Line)
    * [.paragraphs](#Song+paragraphs) : [<code>Array.&lt;Line&gt;</code>](#Line)
    * [.bodyLines](#Song+bodyLines) ⇒ [<code>Array.&lt;Line&gt;</code>](#Line)
    * [.metaData](#Song+metaData) ⇒ <code>object</code>
    * [.clone()](#Song+clone) ⇒ [<code>Song</code>](#Song)

<a name="Song+lines"></a>

### song.lines : [<code>Array.&lt;Line&gt;</code>](#Line)
The [Line](#Line) items of which the song consists

**Kind**: instance property of [<code>Song</code>](#Song)  
<a name="Song+paragraphs"></a>

### song.paragraphs : [<code>Array.&lt;Line&gt;</code>](#Line)
The [Paragraph](#Paragraph) items of which the song consists

**Kind**: instance property of [<code>Song</code>](#Song)  
<a name="Song+bodyLines"></a>

### song.bodyLines ⇒ [<code>Array.&lt;Line&gt;</code>](#Line)
Returns the song lines, skipping the leading empty lines (empty as in not rendering any content). This is useful
if you want to skip the "header lines": the lines that only contain meta data.

**Kind**: instance property of [<code>Song</code>](#Song)  
**Returns**: [<code>Array.&lt;Line&gt;</code>](#Line) - The song body lines  
<a name="Song+metaData"></a>

### song.metaData ⇒ <code>object</code>
Returns the song metadata. When there is only one value for an entry, the value is a string. Else, the value is
an array containing all unique values for the entry.

**Kind**: instance property of [<code>Song</code>](#Song)  
**Returns**: <code>object</code> - The metadata  
<a name="Song+clone"></a>

### song.clone() ⇒ [<code>Song</code>](#Song)
Returns a deep clone of the song

**Kind**: instance method of [<code>Song</code>](#Song)  
**Returns**: [<code>Song</code>](#Song) - The cloned song  
<a name="Tag"></a>

## Tag
Represents a tag/directive. See https://www.chordpro.org/chordpro/ChordPro-Directives.html

**Kind**: global class  

* [Tag](#Tag)
    * [.name](#Tag+name) : <code>string</code>
    * [.originalName](#Tag+originalName) : <code>string</code>
    * [.value](#Tag+value) : <code>string</code> \| <code>null</code>
    * [.hasValue()](#Tag+hasValue) ⇒ <code>boolean</code>
    * [.isRenderable()](#Tag+isRenderable) ⇒ <code>boolean</code>
    * [.isMetaTag()](#Tag+isMetaTag) ⇒ <code>boolean</code>
    * [.clone()](#Tag+clone) ⇒ [<code>Tag</code>](#Tag)

<a name="Tag+name"></a>

### tag.name : <code>string</code>
The tag full name. When the original tag used the short name, `name` will return the full name.

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+originalName"></a>

### tag.originalName : <code>string</code>
The original tag name that was used to construct the tag.

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+value"></a>

### tag.value : <code>string</code> \| <code>null</code>
The tag value

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+hasValue"></a>

### tag.hasValue() ⇒ <code>boolean</code>
Checks whether the tag value is a non-empty string.

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+isRenderable"></a>

### tag.isRenderable() ⇒ <code>boolean</code>
Checks whether the tag is usually rendered inline. It currently only applies to comment tags.

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+isMetaTag"></a>

### tag.isMetaTag() ⇒ <code>boolean</code>
Checks whether the tag is either a standard meta tag or a custom meta directive (`{x_some_name}`)

**Kind**: instance method of [<code>Tag</code>](#Tag)  
<a name="Tag+clone"></a>

### tag.clone() ⇒ [<code>Tag</code>](#Tag)
Returns a clone of the tag.

**Kind**: instance method of [<code>Tag</code>](#Tag)  
**Returns**: [<code>Tag</code>](#Tag) - The cloned tag  
<a name="ChordProFormatter"></a>

## ChordProFormatter
Formats a song into a ChordPro chord sheet

**Kind**: global class  
<a name="ChordProFormatter+format"></a>

### chordProFormatter.format(song) ⇒ <code>string</code>
Formats a song into a ChordPro chord sheet.

**Kind**: instance method of [<code>ChordProFormatter</code>](#ChordProFormatter)  
**Returns**: <code>string</code> - The ChordPro string  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | The song to be formatted |

<a name="HtmlDivFormatter"></a>

## HtmlDivFormatter
Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.

**Kind**: global class  
<a name="HtmlDivFormatter+format"></a>

### htmlDivFormatter.format(song) ⇒ <code>string</code>
Formats a song into HTML.

**Kind**: instance method of [<code>HtmlDivFormatter</code>](#HtmlDivFormatter)  
**Returns**: <code>string</code> - The HTML string  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | The song to be formatted |

<a name="HtmlTableFormatter"></a>

## HtmlTableFormatter
Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
PDF conversion.

**Kind**: global class  
<a name="HtmlTableFormatter+format"></a>

### htmlTableFormatter.format(song) ⇒ <code>string</code>
Formats a song into HTML.

**Kind**: instance method of [<code>HtmlTableFormatter</code>](#HtmlTableFormatter)  
**Returns**: <code>string</code> - The HTML string  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | The song to be formatted |

<a name="TextFormatter"></a>

## TextFormatter
Formats a sonf into a plain text chord sheet

**Kind**: global class  
<a name="TextFormatter+format"></a>

### textFormatter.format(song) ⇒ <code>string</code>
Formats a song into a plain text chord sheet

**Kind**: instance method of [<code>TextFormatter</code>](#TextFormatter)  
**Returns**: <code>string</code> - the chord sheet  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#Song) | The song to be formatted |

<a name="ChordProParser"></a>

## ChordProParser
Parses a ChordPro chord sheet

**Kind**: global class  

* [ChordProParser](#ChordProParser)
    * [.warnings](#ChordProParser+warnings) : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
    * [.parse(chordProChordSheet)](#ChordProParser+parse) ⇒ [<code>Song</code>](#Song)

<a name="ChordProParser+warnings"></a>

### chordProParser.warnings : [<code>Array.&lt;ParserWarning&gt;</code>](#ParserWarning)
All warnings raised during parsing the ChordPro chord sheet

**Kind**: instance property of [<code>ChordProParser</code>](#ChordProParser)  
<a name="ChordProParser+parse"></a>

### chordProParser.parse(chordProChordSheet) ⇒ [<code>Song</code>](#Song)
Parses a ChordPro chord sheet into a song

**Kind**: instance method of [<code>ChordProParser</code>](#ChordProParser)  
**Returns**: [<code>Song</code>](#Song) - The parsed song  

| Param | Type | Description |
| --- | --- | --- |
| chordProChordSheet | <code>string</code> | the ChordPro chord sheet |

<a name="ParserWarning"></a>

## ParserWarning
Represents a parser warning, currently only used by ChordProParser.

**Kind**: global class  

* [ParserWarning](#ParserWarning)
    * [.message](#ParserWarning+message) : <code>string</code>
    * [.lineNumber](#ParserWarning+lineNumber) : <code>integer</code>
    * [.toString()](#ParserWarning+toString) ⇒ <code>string</code>

<a name="ParserWarning+message"></a>

### parserWarning.message : <code>string</code>
The warning message

**Kind**: instance property of [<code>ParserWarning</code>](#ParserWarning)  
<a name="ParserWarning+lineNumber"></a>

### parserWarning.lineNumber : <code>integer</code>
The chord sheet line number on which the warning occurred

**Kind**: instance property of [<code>ParserWarning</code>](#ParserWarning)  
<a name="ParserWarning+toString"></a>

### parserWarning.toString() ⇒ <code>string</code>
Returns a stringified version of the warning

**Kind**: instance method of [<code>ParserWarning</code>](#ParserWarning)  
**Returns**: <code>string</code> - The string warning  
<a name="ALBUM"></a>

## ALBUM : <code>string</code>
Album meta directive. See https://www.chordpro.org/chordpro/Directives-album.html

**Kind**: global constant  
<a name="ARTIST"></a>

## ARTIST : <code>string</code>
Artist meta directive. See https://www.chordpro.org/chordpro/Directives-artist.html

**Kind**: global constant  
<a name="CAPO"></a>

## CAPO : <code>string</code>
Capo meta directive. See https://www.chordpro.org/chordpro/Directives-capo.html

**Kind**: global constant  
<a name="COMMENT"></a>

## COMMENT : <code>string</code>
Comment directive. See https://www.chordpro.org/chordpro/Directives-comment.html

**Kind**: global constant  
<a name="COMPOSER"></a>

## COMPOSER : <code>string</code>
Composer meta directive. See https://www.chordpro.org/chordpro/Directives-composer.html

**Kind**: global constant  
<a name="COPYRIGHT"></a>

## COPYRIGHT : <code>string</code>
Copyright meta directive. See https://www.chordpro.org/chordpro/Directives-copyright.html

**Kind**: global constant  
<a name="DURATION"></a>

## DURATION : <code>string</code>
Duration meta directive. See https://www.chordpro.org/chordpro/Directives-duration.html

**Kind**: global constant  
<a name="END_OF_CHORUS"></a>

## END\_OF\_CHORUS : <code>string</code>
End of chorus directive. See https://www.chordpro.org/chordpro/Directives-env_chorus.html

**Kind**: global constant  
<a name="END_OF_VERSE"></a>

## END\_OF\_VERSE : <code>string</code>
End of verse directive. See https://www.chordpro.org/chordpro/Directives-env_verse.html

**Kind**: global constant  
<a name="KEY"></a>

## KEY : <code>string</code>
Key meta directive. See https://www.chordpro.org/chordpro/Directives-key.html

**Kind**: global constant  
<a name="LYRICIST"></a>

## LYRICIST : <code>string</code>
Lyricist meta directive. See https://www.chordpro.org/chordpro/Directives-lyricist.html

**Kind**: global constant  
<a name="START_OF_CHORUS"></a>

## START\_OF\_CHORUS : <code>string</code>
Start of chorus directive. See https://www.chordpro.org/chordpro/Directives-env_chorus.html

**Kind**: global constant  
<a name="START_OF_VERSE"></a>

## START\_OF\_VERSE : <code>string</code>
Start of verse directive. See https://www.chordpro.org/chordpro/Directives-env_verse.html

**Kind**: global constant  
<a name="SUBTITLE"></a>

## SUBTITLE : <code>string</code>
Subtitle meta directive. See https://www.chordpro.org/chordpro/Directives-subtitle.html

**Kind**: global constant  
<a name="TEMPO"></a>

## TEMPO : <code>string</code>
Tempo meta directive. See https://www.chordpro.org/chordpro/Directives-tempo.html

**Kind**: global constant  
<a name="TIME"></a>

## TIME : <code>string</code>
Time meta directive. See https://www.chordpro.org/chordpro/Directives-time.html

**Kind**: global constant  
<a name="TITLE"></a>

## TITLE : <code>string</code>
Title meta directive. See https://www.chordpro.org/chordpro/Directives-title.html

**Kind**: global constant  
<a name="YEAR"></a>

## YEAR : <code>string</code>
Year meta directive. See https://www.chordpro.org/chordpro/Directives-year.html

**Kind**: global constant  
<a name="parse"></a>

## parse(chordSheet) ⇒ [<code>Song</code>](#Song)
Parses a chord sheet into a song

**Kind**: global function  
**Returns**: [<code>Song</code>](#Song) - The parsed song  

| Param | Type | Description |
| --- | --- | --- |
| chordSheet | <code>string</code> | The ChordPro chord sheet |

