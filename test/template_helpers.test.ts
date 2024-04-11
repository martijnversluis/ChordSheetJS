import {
  ChordLyricsPair,
  CHORUS,
  Comment,
  Line,
  Metadata,
  NONE,
  Paragraph,
  Tag,
  templateHelpers,
  Ternary,
} from '../src';

import Configuration from '../src/formatter/configuration/configuration';
import Font from '../src/chord_sheet/font';
import FontSize from '../src/chord_sheet/font_size';

const {
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
} = templateHelpers;

describe('template_helpers', () => {
  describe('isChordLyricsPair', () => {
    it('returns true when the item is a ChordLyricsPair', () => {
      expect(isChordLyricsPair(new ChordLyricsPair())).toBe(true);
    });

    it('returns false for all other items', () => {
      expect(isChordLyricsPair(new Comment('test comment'))).toBe(false);
      expect(isChordLyricsPair(new Tag('test'))).toBe(false);
      expect(isChordLyricsPair(new Ternary({}))).toBe(false);
    });
  });

  describe('lineHasContents', () => {
    it('returns true when the line has renderable items', () => {
      const line = new Line({
        type: NONE,
        items: [new ChordLyricsPair('A', 'hello')],
      });

      expect(lineHasContents(line)).toBe(true);
    });

    it('returns false when the line has no renderable items', () => {
      const line = new Line({
        type: NONE,
        items: [new Comment('hello')],
      });

      expect(lineHasContents(line)).toBe(false);
    });

    it('returns false when the line has no items', () => {
      const line = new Line({ type: NONE, items: [] });

      expect(lineHasContents(line)).toBe(false);
    });
  });

  describe('isTag', () => {
    it('returns true when the item is a ChordLyricsPair', () => {
      expect(isTag(new Tag('test'))).toBe(true);
    });

    it('returns false when the item is not a ChordLyricsPair', () => {
      expect(isTag(new ChordLyricsPair())).toBe(false);
      expect(isTag(new Comment('test comment'))).toBe(false);
      expect(isTag(new Ternary({}))).toBe(false);
    });
  });

  describe('isComment', () => {
    it('returns true when a tag is a comment', () => {
      expect(isComment(new Tag('comment', 'hello'))).toBe(true);
      expect(isComment(new Tag('c', 'hello'))).toBe(true);
    });

    it('returns false when a tag is not a comment', () => {
      expect(isComment(new Tag('start_of_chorus', 'hello'))).toBe(false);
      expect(isComment(new Tag('soc', 'hello'))).toBe(false);
    });
  });

  describe('stripHTML', () => {
    it('removes all whitespace from a HTML string', () => {
      const expandedHTML = `
        <span 
          class="foo"
        > FOO </span>
      `;

      const strippedHTML = '<span class="foo"> FOO </span>';

      expect(stripHTML(expandedHTML)).toEqual(strippedHTML);
    });
  });

  describe('each', () => {
    it('invokes the callback which each item and returns a concatenated string', () => {
      const callback = (str: string) => str.toUpperCase();
      const items = ['foo', 'bar', 'barber', 'barbarian'];
      const expectedResult = 'FOOBARBARBERBARBARIAN';

      expect(each(items, callback)).toEqual(expectedResult);
    });
  });

  describe('when', () => {
    it('returns the callback result when the condition is truthy', () => {
      const callback = () => 'foobar';

      expect(when(true, callback).toString()).toEqual('foobar');
      expect(when('string', callback).toString()).toEqual('foobar');
      expect(when({}, callback).toString()).toEqual('foobar');
      expect(when(25, callback).toString()).toEqual('foobar');
      expect(when([], callback).toString()).toEqual('foobar');
    });

    it('returns an empty string when the condition is falsy', () => {
      const callback = () => 'foobar!';

      expect(when(false, callback).toString()).toEqual('');
      expect(when(null, callback).toString()).toEqual('');
      expect(when(undefined, callback).toString()).toEqual('');
      expect(when('', callback).toString()).toEqual('');
      expect(when(0, callback).toString()).toEqual('');
    });

    it('allows chaining with then', () => {
      expect(when(true).then(() => 'foobar').toString()).toEqual('foobar');
      expect(when(false).then(() => 'foobar').toString()).toEqual('');
    });

    it('allows chaining with elseWhen', () => {
      expect(when(true).then(() => 'when').elseWhen(true, () => 'elseWhen').toString()).toEqual('when');
      expect(when(false).then(() => 'when').elseWhen(true, () => 'elseWhen').toString()).toEqual('elseWhen');
      expect(when(false).then(() => 'when').elseWhen(false, () => 'elseWhen').toString()).toEqual('');
    });

    it('allows chaining with elseWhen and else', () => {
      expect(
        when(false)
          .then(() => 'when')
          .elseWhen(false, () => 'elseWhen')
          .else(() => 'else')
          .toString(),
      ).toEqual('else');
    });

    it('allows chaining with else then', () => {
      expect(
        when(false)
          .then(() => 'when')
          .elseWhen(true)
          .then(() => 'elseThen')
          .toString(),
      ).toEqual('elseThen');
    });

    it('allows chaining with else then else', () => {
      expect(
        when(false)
          .then(() => 'when')
          .elseWhen(false)
          .then(() => 'elseThen')
          .else(() => 'else')
          .toString(),
      ).toEqual('else');
    });

    it('allows chaining with else', () => {
      expect(when(true).then(() => 'then').else(() => 'else').toString()).toEqual('then');
      expect(when(false).then(() => 'then').else(() => 'else').toString()).toEqual('else');
    });
  });

  describe('hasTextContents', () => {
    it('returns true when an item is a ChordLyricsPair with lyrics', () => {
      const line = new Line({
        type: NONE,
        items: [
          new ChordLyricsPair('G', 'hello'),
        ],
      });

      expect(hasTextContents(line)).toBe(true);
    });

    it('returns true when an item is a renderable Tag', () => {
      const line = new Line({
        type: NONE,
        items: [
          new Tag('comment', 'hello'),
        ],
      });

      expect(hasTextContents(line)).toBe(true);
    });

    it('returns true when an item is evaluatable', () => {
      const line = new Line({
        type: NONE,
        items: [
          new Ternary({ }),
        ],
      });

      expect(hasTextContents(line)).toBe(true);
    });

    it('returns false when an item is an unrenderable Tag', () => {
      const line = new Line({
        type: NONE,
        items: [
          new Tag('start_of_chorus', ''),
        ],
      });

      expect(hasTextContents(line)).toBe(false);
    });

    it('returns false when an item is a ChordLyricsPair without lyrics', () => {
      const line = new Line({
        type: NONE,
        items: [
          new ChordLyricsPair('G', ''),
        ],
      });

      expect(hasTextContents(line)).toBe(false);
    });

    it('returns false when an item is not evaluatable', () => {
      const line = new Line({
        type: NONE,
        items: [
          new Comment('test'),
        ],
      });

      expect(hasTextContents(line)).toBe(false);
    });

    it('returns false when the line does not have any items', () => {
      const line = new Line({ type: NONE, items: [] });

      expect(hasTextContents(line)).toBe(false);
    });
  });

  describe('lineClasses', () => {
    it('returns [row empty-line] when the line has no contents', () => {
      const line = new Line({
        type: NONE,
        items: [],
      });

      expect(lineClasses(line)).toEqual('row empty-line');
    });

    it('returns [row] when the line has contents', () => {
      const line = new Line({
        type: NONE,
        items: [new ChordLyricsPair('A', 'hello')],
      });

      expect(lineClasses(line)).toEqual('row');
    });
  });

  describe('paragraphClasses', () => {
    it('returns [paragraph <paragraph type>] when the paragraph has a type', () => {
      const line = new Line({ type: CHORUS, items: [] });
      const paragraph = new Paragraph();
      paragraph.addLine(line);

      expect(paragraphClasses(paragraph)).toEqual('paragraph chorus');
    });

    it('returns [paragraph] when the paragraph type is NONE', () => {
      const line = new Line({ type: NONE, items: [] });
      const paragraph = new Paragraph();
      paragraph.addLine(line);

      expect(paragraphClasses(paragraph)).toEqual('paragraph');
    });

    it('returns [paragraph] when the paragraph type is INDETERMINATE', () => {
      const paragraph = new Paragraph();

      expect(paragraphClasses(paragraph)).toEqual('paragraph');
    });
  });

  describe('evaluate', () => {
    it('evaluates the item', () => {
      const item = new Ternary({ variable: 'composer' });
      const metadata = new Metadata({ composer: ['John', 'Mary'] });
      const configuration = new Configuration({ metadata: { separator: ' and ' } });

      expect(evaluate(item, metadata, configuration)).toEqual('John and Mary');
    });
  });

  describe('fontStyleTag', () => {
    it('returns a style tag for a font with properties', () => {
      const font = new Font({ font: 'Arial', size: new FontSize(15, 'px'), colour: 'black' });

      expect(fontStyleTag(font)).toEqual(' style="color: black; font: 15px Arial"');
    });

    it('returns an empty string for a font without properties', () => {
      const font = new Font();

      expect(fontStyleTag(font)).toEqual('');
    });
  });
});
