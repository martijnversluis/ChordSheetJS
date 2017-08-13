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
```

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
var formatter = new ChordSheetJS.TextFormatter();
var disp = formatter.format(song);
```

#### HTML format

```javascript
var formatter = new ChordSheetJS.HtmlFormatter();
var disp = formatter.format(song);
```

#### Chord pro format

```javascript
var formatter = new ChordSheetJS.ChordProFormatter();
var disp = formatter.format(song);
```
