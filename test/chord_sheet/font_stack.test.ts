import FontStack from '../../src/chord_sheet/font_stack';
import Tag from '../../src/chord_sheet/tag';

import {
  CHORDCOLOUR, CHORDFONT, TEXTCOLOUR, TEXTFONT, TEXTSIZE,
} from '../../src/chord_sheet/tags';

describe('FontStack', () => {
  describe('textfont', () => {
    it('sets the correct font when the tag has a value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTFONT, 'Verdana'));

      expect(fontStack.textFont.font).toEqual('Verdana');
    });

    it('resets the font when the tag has no value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTFONT, 'Verdana'));
      fontStack.applyTag(new Tag(TEXTFONT, 'Helvetica'));
      fontStack.applyTag(new Tag(TEXTFONT, ''));

      expect(fontStack.textFont.font).toEqual('Verdana');

      fontStack.applyTag(new Tag(TEXTFONT, ''));

      expect(fontStack.textFont.font).toBeNull();
    });
  });

  describe('chordfont', () => {
    it('sets the correct font when the tag has a value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(CHORDFONT, 'Verdana'));

      expect(fontStack.chordFont.font).toEqual('Verdana');
    });

    it('resets the font when the tag has no value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(CHORDFONT, 'Verdana'));
      fontStack.applyTag(new Tag(CHORDFONT, 'Helvetica'));
      fontStack.applyTag(new Tag(CHORDFONT, ''));

      expect(fontStack.chordFont.font).toEqual('Verdana');

      fontStack.applyTag(new Tag(CHORDFONT, ''));

      expect(fontStack.chordFont.font).toBeNull();
    });
  });

  describe('textcolour', () => {
    it('sets the correct colour when the tag has a value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTCOLOUR, 'red'));

      expect(fontStack.textFont.colour).toEqual('red');
    });

    it('resets the colour when the tag has no value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTCOLOUR, 'red'));
      fontStack.applyTag(new Tag(TEXTCOLOUR, 'blue'));
      fontStack.applyTag(new Tag(TEXTCOLOUR, ''));

      expect(fontStack.textFont.colour).toEqual('red');

      fontStack.applyTag(new Tag(TEXTCOLOUR, ''));

      expect(fontStack.textFont.colour).toBeNull();
    });
  });

  describe('chordcolour', () => {
    it('sets the correct colour when the tag has a value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(CHORDCOLOUR, 'red'));

      expect(fontStack.chordFont.colour).toEqual('red');
    });

    it('resets the font when the tag has no value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(CHORDCOLOUR, 'red'));
      fontStack.applyTag(new Tag(CHORDCOLOUR, 'blue'));
      fontStack.applyTag(new Tag(CHORDCOLOUR, ''));

      expect(fontStack.chordFont.colour).toEqual('red');

      fontStack.applyTag(new Tag(CHORDCOLOUR, ''));

      expect(fontStack.chordFont.colour).toBeNull();
    });
  });

  describe('textsize', () => {
    it('sets the correct text size when the tag has a value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTSIZE, '30px'));

      expect(fontStack.textFont.size?.toString()).toEqual('30px');
    });

    it('bases off the parent pixels for percentages', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTSIZE, '30px'));
      fontStack.applyTag(new Tag(TEXTSIZE, '120%'));

      expect(fontStack.textFont.size?.toString()).toEqual('36px');
    });

    it('bases off the parent percentage for percentages', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTSIZE, '160%'));
      fontStack.applyTag(new Tag(TEXTSIZE, '120%'));

      expect(fontStack.textFont.size?.toString()).toEqual('192%');
    });

    it('uses percentages when there is no parent', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTSIZE, '160%'));

      expect(fontStack.textFont.size?.toString()).toEqual('160%');
    });

    it('resets the text size when the tag has no value', () => {
      const fontStack = new FontStack();
      fontStack.applyTag(new Tag(TEXTSIZE, '16px'));
      fontStack.applyTag(new Tag(TEXTSIZE, '160%'));
      fontStack.applyTag(new Tag(TEXTSIZE, '80%'));
      fontStack.applyTag(new Tag(TEXTSIZE, ''));

      expect(fontStack.textFont.size?.toString()).toEqual('25.6px');

      fontStack.applyTag(new Tag(TEXTSIZE, ''));

      expect(fontStack.textFont.size?.toString()).toEqual('16px');

      fontStack.applyTag(new Tag(TEXTSIZE, ''));

      expect(fontStack.textFont.size).toBeNull();
    });
  });
});
