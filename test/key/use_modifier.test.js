import Key from '../../src/key';

import '../matchers';

describe('Key', () => {
  describe('useModifier', () => {
    describe('for a key without modifier', () => {
      it('does not change the key', () => {
        const key = new Key({ note: 'F', modifier: null });

        const switchedKey = key.useModifier('b');

        expect(switchedKey).toBeKey({ note: 'F', modifier: null });
      });
    });

    describe('for #', () => {
      it('changes to b', () => {
        const key = new Key({ note: 'G', modifier: '#' });

        const switchedKey = key.useModifier('b');
        expect(switchedKey).toBeKey({ note: 'A', modifier: 'b' });
      });
    });

    describe('for b', () => {
      it('changes to #', () => {
        const key = new Key({ note: 'G', modifier: 'b' });

        const switchedKey = key.useModifier('#');
        expect(switchedKey).toBeKey({ note: 'F', modifier: '#' });
      });
    });

    describe('for a key without modifier', () => {
      it('does not change the key', () => {
        const key = new Key({ note: 4, modifier: null });

        const switchedKey = key.useModifier('b');

        expect(switchedKey).toBeKey({ note: 4, modifier: null });
      });
    });

    describe('for #', () => {
      it('changes to b', () => {
        const key = new Key({ note: 5, modifier: '#' });

        const switchedKey = key.useModifier('b');
        expect(switchedKey).toBeKey({ note: 6, modifier: 'b' });
      });
    });

    describe('for b', () => {
      it('changes to #', () => {
        const key = new Key({ note: 5, modifier: 'b' });

        const switchedKey = key.useModifier('#');
        expect(switchedKey).toBeKey({ note: 4, modifier: '#' });
      });
    });
  });
});
