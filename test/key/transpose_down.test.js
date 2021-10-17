import Key from '../../src/key';

import '../matchers';

describe('Key', () => {
  describe('transposeDown', () => {
    describe('for 2, 3, 5, 6, 7', () => {
      it('returns the b version', () => {
        const key = new Key({ note: 6, modifier: null });

        const transposedKey = key.transposeDown();

        expect(transposedKey).toBeKey({ note: 6, modifier: 'b' });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the note without #', () => {
        const key = new Key({ note: 6, modifier: '#' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 6, modifier: null });
      });
    });

    describe('for 4 and 1', () => {
      it('returns the previous note', () => {
        const key = new Key({ note: 4, modifier: null });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 3, modifier: null });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the previous note without b', () => {
        const key = new Key({ note: 2, modifier: 'b' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 1, modifier: null });
      });
    });

    describe('for #7 and #3', () => {
      it('returns the note without #', () => {
        const key = new Key({ note: 7, modifier: '#' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 7, modifier: null });
      });
    });

    describe('for b4 and b1', () => {
      it('returns the previous note with b', () => {
        const key = new Key({ note: 4, modifier: 'b' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 3, modifier: 'b' });
      });
    });

    describe('for D, E, G, A, B', () => {
      it('returns the b version', () => {
        const key = new Key({ note: 'A', modifier: null });

        const transposedKey = key.transposeDown();

        expect(transposedKey).toBeKey({ note: 'A', modifier: 'b' });
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the note without #', () => {
        const key = new Key({ note: 'A', modifier: '#' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 'A', modifier: null });
      });
    });

    describe('for F and C', () => {
      it('returns the previous note', () => {
        const key = new Key({ note: 'F', modifier: null });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 'E', modifier: null });
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the previous note without b', () => {
        const key = new Key({ note: 'D', modifier: 'b' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 'C', modifier: null });
      });
    });

    describe('for B# and E#', () => {
      it('returns the note without #', () => {
        const key = new Key({ note: 'B', modifier: '#' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 'B', modifier: null });
      });
    });

    describe('for Fb and Cb', () => {
      it('returns the previous note with b', () => {
        const key = new Key({ note: 'F', modifier: 'b' });

        const transposedKey = key.transposeDown();
        expect(transposedKey).toBeKey({ note: 'E', modifier: 'b' });
      });
    });
  });
});
