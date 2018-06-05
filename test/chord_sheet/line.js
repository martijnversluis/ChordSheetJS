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
});
