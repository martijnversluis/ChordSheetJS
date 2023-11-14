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

  describe('templateHelpers', () => {
    [
      'isEvaluatable',
      'isChordLyricsPair',
      'lineHasContents',
      'isTag',
      'isComment',
      'stripHTML',
      'each',
      'when',
      'hasTextContents',
      'lineClasses',
      'paragraphClasses',
      'evaluate',
      'fontStyleTag',
      'renderChord',
    ].forEach((helperName) => {
      it(`contains ${helperName}`, () => {
        expect(typeof chordsheetjs.templateHelpers[helperName]).not.toEqual('undefined');
      });
    });
  });
});
