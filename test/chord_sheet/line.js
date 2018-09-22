import { expect } from 'chai';

import Line from '../../src/chord_sheet/line';
import ItemStub from '../cloneable_stub';
import { createChordLyricsPair, createLine, createTag } from '../utilities';
import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import Tag from '../../src/chord_sheet/tag';

describe('Line', () => {
  describe('#clone', () => {
    it('returns a clone of the line', () => {
      const line = new Line();
      line.items = ['foo', 'bar'].map(value => new ItemStub(value));
      line.type = 'test_type';
      const clonedLine = line.clone();

      const actualValues = clonedLine.items.map(item => item.value);
      expect(actualValues).to.eql(['foo', 'bar']);
      expect(clonedLine.type).to.eql('test_type');
    });
  });

  describe('#isEmpty', () => {
    context('when the line has items', () => {
      it('returns false', () => {
        const item = new ChordLyricsPair('C', 'Let it be');
        const line = createLine([item]);

        expect(line.isEmpty()).to.be.false;
      });
    });

    context('when the line has no items', () => {
      it('returns false', () => {
        const line = createLine([]);

        expect(line.isEmpty()).to.be.true;
      });
    });
  });

  describe('#isVerse', () => {
    context('when the line type is "verse"', () => {
      it('returns true', () => {
        const line = new Line();
        line.type = 'verse';

        expect(line.isVerse()).to.be.true;
      });
    });

    context('when the line type is not "verse"', () => {
      it('returns false', () => {
        const line = new Line();
        line.type = 'chorus';

        expect(line.isVerse()).to.be.false;
      });
    });
  });

  describe('#isChorus', () => {
    context('when the line type is "chorus"', () => {
      it('returns true', () => {
        const line = new Line();
        line.type = 'chorus';

        expect(line.isChorus()).to.be.true;
      });
    });

    context('when the line type is not "chorus"', () => {
      it('returns false', () => {
        const line = new Line();
        line.type = 'verse';

        expect(line.isChorus()).to.be.false;
      });
    });
  });

  describe('#hasContent', () => {
    context('when the line contains chord-lyric pairs', () => {
      it('returns true', () => {
        const line = createLine([
          createTag('foo', 'bar'),
          createChordLyricsPair('C', 'Let it be'),
        ]);

        expect(line.hasContent()).to.be.true;
      });
    });

    context('when the line contains no chord-lyric pairs', () => {
      it('returns false', () => {
        const line = createLine([
          createTag('foo', 'bar'),
          createTag('bar', 'baz'),
        ]);

        expect(line.hasContent()).to.be.false;
      });
    });
  });

  describe('#hasRenderableItems', () => {
    context('when the line has renderable items', () => {
      it('returns true', () => {
        const line = createLine([
          new ChordLyricsPair('C', 'Let it'),
        ]);

        expect(line.hasRenderableItems()).to.be.true;
      });
    });

    context('when the line has no renderable items', () => {
      it('returns false', () => {
        const line = createLine([
          new Tag('x_foo', 'bar'),
        ]);

        expect(line.hasRenderableItems()).to.be.false;
      });
    });
  });
});
