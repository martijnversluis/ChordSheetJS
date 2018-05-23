import { expect } from 'chai';

import Line from '../../src/chord_sheet/line';
import ItemStub from '../cloneable_stub';

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
});
