import { expect } from 'chai';

import Line from '../../src/chord_sheet/line';
import ItemStub from '../cloneable_stub';
import { createLine } from '../utilities';

describe('Line', () => {
  describe('#clone', () => {
    it('returns a clone of the line', () => {
      const line = new Line();
      line.items = ['foo', 'bar'].map(value => new ItemStub(value));
      const clonedLine = line.clone();

      const actualValues = clonedLine.items.map(item => item.value);
      expect(actualValues).to.eql(['foo', 'bar']);
    });
  });

  describe('#isEmpty', () => {
    context('when the line has items', () => {
      it('returns false', () => {
        const item = new ItemStub();
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

  describe('#hasRenderableItems', () => {
    context('when the line has renderable items', () => {
      it('returns true', () => {
        const line = createLine([
          {
            isRenderable() {
              return true;
            },
          },
        ]);

        expect(line.hasRenderableItems()).to.be.true;
      });
    });

    context('when the line has no renderable items', () => {
      it('returns false', () => {
        const line = createLine([
          {
            isRenderable() {
              return false;
            },
          },
        ]);

        expect(line.hasRenderableItems()).to.be.false;
      });
    });
  });
});
