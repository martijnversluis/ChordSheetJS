import Key from '../../src/key';

import '../matchers';

describe('Key', () => {
  describe('transpose', () => {
    describe('key symbol key', () => {
      describe('when delta > 0', () => {
        it('tranposes up', () => {
          const key = new Key({ note: 'D', modifier: 'b' });

          const transposedKey = key.transpose(5);
          expect(transposedKey).toBeKey({ note: 'G', modifier: 'b' });
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          const key = new Key({ note: 'A', modifier: '#' });

          const transposedKey = key.transpose(-4);
          expect(transposedKey).toBeKey({ note: 'F', modifier: '#' });
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          const key = new Key({ note: 'B', modifier: '#' });

          const tranposedKey = key.transpose(0);
          expect(tranposedKey).toBeKey({ note: 'B', modifier: '#' });
        });
      });
    });

    describe('numeric key', () => {
      describe('when delta > 0', () => {
        it('tranposes up', () => {
          const key = new Key({ note: 2, modifier: 'b' });

          const transposedKey = key.transpose(5);
          expect(transposedKey).toBeKey({ note: 5, modifier: 'b' });
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          const key = new Key({ note: 6, modifier: '#' });

          const transposedKey = key.transpose(-4);
          expect(transposedKey).toBeKey({ note: 4, modifier: '#' });
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          const key = new Key({ note: 7, modifier: '#' });

          const tranposedKey = key.transpose(0);
          expect(tranposedKey).toBeKey({ note: 7, modifier: '#' });
        });
      });
    });
  });
});
