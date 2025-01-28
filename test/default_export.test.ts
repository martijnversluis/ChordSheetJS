import chordsheetjs from '../src';

describe('default export', () => {
  [
    'Chord',
    'ChordProParser',
    'ChordSheetParser',
    'UltimateGuitarParser',
    'TextFormatter',
    'HtmlTableFormatter',
    'HtmlDivFormatter',
    'ChordProFormatter',
    'ChordLyricsPair',
    'Line',
    'Song',
    'Tag',
    'Comment',
    'Metadata',
    'Paragraph',
    'Ternary',
    'Composite',
    'Literal',
    'ChordSheetSerializer',
    'CHORUS',
    'INDETERMINATE',
    'VERSE',
    'PART',
    'NONE',
  ].forEach((constantName) => {
    it(`contains ${constantName}`, () => {
      expect(typeof chordsheetjs[constantName]).not.toEqual('undefined');
    });
  });
});
