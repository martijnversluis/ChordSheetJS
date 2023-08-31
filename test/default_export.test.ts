import chordsheetjs from '../src';

describe('default export', () => {
  [
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
    'NONE',
    'templateHelpers',
  ].forEach((constantName) => {
    it(`contains ${constantName}`, () => {
      expect(typeof chordsheetjs[constantName]).not.toEqual('undefined');
    });
  });
});
