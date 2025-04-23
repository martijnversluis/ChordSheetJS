import ChordSheetJS, {
  Chord,
  ChordDefinition,
  ChordLyricsPair,
  ChordProFormatter,
  ChordProParser,
  ChordSheetParser,
  ChordSheetSerializer,
  ChordsOverWordsParser,
  CHORUS,
  Comment,
  Composite,
  Formatter,
  HtmlDivFormatter,
  HtmlFormatter,
  HtmlTableFormatter,
  INDETERMINATE,
  Key,
  Line,
  Literal,
  Metadata,
  NONE,
  NUMERIC,
  Paragraph,
  SOLFEGE,
  Song,
  SYMBOL,
  TAB,
  Tag,
  templateHelpers,
  Ternary,
  TextFormatter,
  UltimateGuitarParser,
  VERSE,
  version,
} from '../src';

import packageJSON from '../package.json';

const {
  isEvaluatable,
  isChordLyricsPair,
  lineHasContents,
  isTag,
  isComment,
  stripHTML,
  each,
  when,
  hasTextContents,
  lineClasses,
  paragraphClasses,
  evaluate,
  fontStyleTag,
  renderChord,
  hasChordContents,
} = templateHelpers;

describe('exports', () => {
  it('supplies all required constants as named exports', () => {
    expect(Chord).toBeDefined();
    expect(ChordDefinition).toBeDefined();
    expect(ChordLyricsPair).toBeDefined();
    expect(ChordProFormatter).toBeDefined();
    expect(ChordProParser).toBeDefined();
    expect(ChordSheetParser).toBeDefined();
    expect(ChordSheetSerializer).toBeDefined();
    expect(ChordsOverWordsParser).toBeDefined();
    expect(Comment).toBeDefined();
    expect(Composite).toBeDefined();
    expect(Formatter).toBeDefined();
    expect(HtmlFormatter).toBeDefined();
    expect(HtmlDivFormatter).toBeDefined();
    expect(HtmlTableFormatter).toBeDefined();
    expect(Key).toBeDefined();
    expect(Line).toBeDefined();
    expect(Literal).toBeDefined();
    expect(Metadata).toBeDefined();
    expect(Paragraph).toBeDefined();
    expect(Song).toBeDefined();
    expect(Tag).toBeDefined();
    expect(Ternary).toBeDefined();
    expect(TextFormatter).toBeDefined();
    expect(UltimateGuitarParser).toBeDefined();
    expect(CHORUS).toBeDefined();
    expect(INDETERMINATE).toBeDefined();
    expect(NONE).toBeDefined();
    expect(NUMERIC).toBeDefined();
    expect(SOLFEGE).toBeDefined();
    expect(SYMBOL).toBeDefined();
    expect(TAB).toBeDefined();
    expect(VERSE).toBeDefined();
    expect(templateHelpers).toBeDefined();
    expect(version).toEqual(packageJSON.version);
  });

  it('supplies all template helpers', () => {
    expect(isEvaluatable).toBeDefined();
    expect(isChordLyricsPair).toBeDefined();
    expect(lineHasContents).toBeDefined();
    expect(isTag).toBeDefined();
    expect(isComment).toBeDefined();
    expect(stripHTML).toBeDefined();
    expect(each).toBeDefined();
    expect(when).toBeDefined();
    expect(hasTextContents).toBeDefined();
    expect(lineClasses).toBeDefined();
    expect(paragraphClasses).toBeDefined();
    expect(evaluate).toBeDefined();
    expect(fontStyleTag).toBeDefined();
    expect(renderChord).toBeDefined();
    expect(hasChordContents).toBeDefined();
  });

  it('supplies all constants as properties of the default export', () => {
    expect(ChordSheetJS.ChordDefinition).toBeDefined();
    expect(ChordSheetJS.ChordProParser).toBeDefined();
    expect(ChordSheetJS.ChordSheetParser).toBeDefined();
    expect(ChordSheetJS.ChordsOverWordsParser).toBeDefined();
    expect(ChordSheetJS.UltimateGuitarParser).toBeDefined();
    expect(ChordSheetJS.TextFormatter).toBeDefined();
    expect(ChordSheetJS.HtmlTableFormatter).toBeDefined();
    expect(ChordSheetJS.HtmlDivFormatter).toBeDefined();
    expect(ChordSheetJS.ChordProFormatter).toBeDefined();
    expect(ChordSheetJS.ChordLyricsPair).toBeDefined();
    expect(ChordSheetJS.Line).toBeDefined();
    expect(ChordSheetJS.Song).toBeDefined();
    expect(ChordSheetJS.Tag).toBeDefined();
    expect(ChordSheetJS.Comment).toBeDefined();
    expect(ChordSheetJS.Metadata).toBeDefined();
    expect(ChordSheetJS.Paragraph).toBeDefined();
    expect(ChordSheetJS.Ternary).toBeDefined();
    expect(ChordSheetJS.Composite).toBeDefined();
    expect(ChordSheetJS.Literal).toBeDefined();
    expect(ChordSheetJS.ChordSheetSerializer).toBeDefined();
    expect(ChordSheetJS.CHORUS).toBeDefined();
    expect(ChordSheetJS.INDETERMINATE).toBeDefined();
    expect(ChordSheetJS.NONE).toBeDefined();
    expect(ChordSheetJS.TAB).toBeDefined();
    expect(ChordSheetJS.VERSE).toBeDefined();
    expect(ChordSheetJS.version).toEqual(packageJSON.version);
  });

  it('supplies template helpers on the default export', () => {
    expect(ChordSheetJS.templateHelpers.isEvaluatable).toBeDefined();
    expect(ChordSheetJS.templateHelpers.isChordLyricsPair).toBeDefined();
    expect(ChordSheetJS.templateHelpers.lineHasContents).toBeDefined();
    expect(ChordSheetJS.templateHelpers.isTag).toBeDefined();
    expect(ChordSheetJS.templateHelpers.isComment).toBeDefined();
    expect(ChordSheetJS.templateHelpers.stripHTML).toBeDefined();
    expect(ChordSheetJS.templateHelpers.each).toBeDefined();
    expect(ChordSheetJS.templateHelpers.when).toBeDefined();
    expect(ChordSheetJS.templateHelpers.hasTextContents).toBeDefined();
    expect(ChordSheetJS.templateHelpers.lineClasses).toBeDefined();
    expect(ChordSheetJS.templateHelpers.paragraphClasses).toBeDefined();
    expect(ChordSheetJS.templateHelpers.evaluate).toBeDefined();
    expect(ChordSheetJS.templateHelpers.fontStyleTag).toBeDefined();
    expect(ChordSheetJS.templateHelpers.renderChord).toBeDefined();
    expect(ChordSheetJS.templateHelpers.hasChordContents).toBeDefined();
  });
});
