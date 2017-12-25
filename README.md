# ChordSheetJS [![Build Status](https://travis-ci.org/martijnversluis/ChordSheetJS.svg?branch=master)](https://travis-ci.org/martijnversluis/ChordSheetJS) [![npm version](https://badge.fury.io/js/chordsheetjs.svg)](https://badge.fury.io/js/chordsheetjs) [![codebeat badge](https://codebeat.co/badges/a729650d-a3e2-40c9-8015-1b6ea8b05cf2)](https://codebeat.co/projects/github-com-martijnversluis-chordsheetjs-master) [![Code Climate](https://codeclimate.com/github/martijnversluis/ChordSheetJS/badges/gpa.svg)](https://codeclimate.com/github/martijnversluis/ChordSheetJS)

A JavaScript library for parsing and formatting chord sheets

## Installation

`ChordSheetJS` is on npm, to install run:

```bash
npm install chordsheetjs
```

Load with `require()`:

```javascript
var ChordSheetJS = require('chordsheetjs');
```

or `import` (es2015):

```javascript
import ChordSheetJS from 'chordsheetjs';
```

## Functionalities

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

:heavy_multiplication_x: = no plans to support it in the near future

### Meta-data directives

| Directive        | Support            |
|:---------------- |:------------------:|
| title (short: t) | :heavy_check_mark: |
| subtitle         | :heavy_check_mark: |
| artist           | :clock2:           |
| composer         | :clock2:           |
| lyricist         | :clock2:           |
| copyright        | :clock2:           |
| album            | :clock2:           |
| year             | :clock2:           |
| key              | :clock2:           |
| time             | :clock2:           |
| tempo            | :clock2:           |
| duration         | :clock2:           |
| capo             | :clock2:           |
| meta             | :clock2:           |

### Formatting directives

| Directive                  | Support                  |
|:-------------------------- |:------------------------:|
| comment (short: c)         | :heavy_multiplication_x: |
| comment_italic (short: ci) | :heavy_multiplication_x: |
| comment_box (short: cb)    | :heavy_multiplication_x: |
| chorus                     | :heavy_multiplication_x: |
| image                      | :heavy_multiplication_x: |

### Environment directives

| Directive                    | Support                  |
|:---------------------------- |:------------------------:|
| start_of_chorus (short: soc) | :clock2:                 |
| end_of_chorus (short: eoc)   | :clock2:                 |
| start_of_verse               | :clock2:                 |
| end_of_verse                 | :clock2:                 |
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

| Directive | Support  |
|:--------- |:--------:|
| x_        | :clock2: |
