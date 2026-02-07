import ChordSheetJS, {
  CHORUS,
  Chord,
  ChordDefinition,
  ChordLyricsPair,
  ChordProFormatter,
  ChordProParser,
  ChordSheetParser,
  ChordSheetSerializer,
  ChordsOverWordsParser,
  Comment,
  Composite,
  ContentType,
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
  PartTypes,
  SOLFEGE,
  SYMBOL,
  SerializedChord,
  SerializedChordDefinition,
  SerializedChordLyricsPair,
  SerializedComment,
  SerializedComponent,
  SerializedComposite,
  SerializedItem,
  SerializedLine,
  SerializedLiteral,
  SerializedSection,
  SerializedSoftLineBreak,
  SerializedSong,
  SerializedTag,
  SerializedTernary,
  SerializedTraceInfo,
  Song,
  TAB,
  Tag,
  Ternary,
  TextFormatter,
  UltimateGuitarParser,
  VERSE,
  templateHelpers,
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

  it('exports serialized types', () => {
    const song: SerializedSong = { type: 'chordSheet', lines: [] };
    const line: SerializedLine = { type: 'line', items: [] };
    const pair: SerializedChordLyricsPair = { type: 'chordLyricsPair', chords: 'Am', lyrics: 'test' };
    const tag: SerializedTag = { type: 'tag', name: 'title', value: 'Test' };
    const comment: SerializedComment = { type: 'comment', comment: 'test' };
    const ternary: SerializedTernary = {
      type: 'ternary', variable: null, valueTest: null, trueExpression: [], falseExpression: [],
    };
    const chord: SerializedChord = {
      type: 'chord',
      base: 'A',
      accidental: null,
      suffix: 'm',
      bassBase: null,
      bassAccidental: null,
      chordType: 'symbol',
    };
    const chordDef: SerializedChordDefinition = { name: 'Am', baseFret: 1, frets: [0, 0, 2, 2, 1, 0] };
    const softBreak: SerializedSoftLineBreak = { type: 'softLineBreak' };
    const section: SerializedSection = {
      type: 'section', sectionType: 'tab', content: [], startTag: tag, endTag: tag,
    };
    const literal: SerializedLiteral = 'test';
    const composite: SerializedComposite = [literal, ternary];
    const item: SerializedItem = pair;
    const component: SerializedComponent = song;
    const traceInfo: SerializedTraceInfo = { location: { offset: 0, line: 1, column: 1 } };
    const contentType: ContentType = 'tab';
    const partType: PartTypes = 'intro';

    expect(song.type).toBe('chordSheet');
    expect(line.type).toBe('line');
    expect(pair.type).toBe('chordLyricsPair');
    expect(tag.type).toBe('tag');
    expect(comment.type).toBe('comment');
    expect(ternary.type).toBe('ternary');
    expect(chord.type).toBe('chord');
    expect(chordDef.name).toBe('Am');
    expect(softBreak.type).toBe('softLineBreak');
    expect(section.type).toBe('section');
    expect(literal).toBe('test');
    expect(composite).toHaveLength(2);
    expect(item.type).toBe('chordLyricsPair');
    expect(component.type).toBe('chordSheet');
    expect(traceInfo.location?.offset).toBe(0);
    expect(contentType).toBe('tab');
    expect(partType).toBe('intro');
  });
});
