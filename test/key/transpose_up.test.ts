import Key from '../../src/key';
import '../matchers';

describe('Key', () => {
  describe('transposeUp', () => {
    describe('for 1, 2, 4, 5 and 6', () => {
      it('returns the # version', () => {
        const key = new Key({ note: 6, modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 6, modifier: '#' });
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the next note without #', () => {
        const key = new Key({ note: 6, modifier: '#' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 7, modifier: null });
      });
    });

    describe('for 3 and 7', () => {
      it('returns the next note', () => {
        const key = new Key({ note: 3, modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 4, modifier: null });
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 2, modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 2, modifier: null });
      });
    });

    describe('for b1 and b4', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 1, modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 1, modifier: null });
      });
    });

    describe('for I, II, IV, V and VI', () => {
      it('returns the # version', () => {
        const key = new Key({ note: 'VI', modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'VI', modifier: '#' });
      });
    });

    describe('for #I, #II, #IV, #V and #VI', () => {
      it('returns the next note without #', () => {
        const key = new Key({ note: 'VI', modifier: '#' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'VII', modifier: null });
      });
    });

    describe('for III and VII', () => {
      it('returns the next note', () => {
        const key = new Key({ note: 'III', modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'IV', modifier: null });
      });
    });

    describe('for bII, bIII, bV, bVI and bVII', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 'II', modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'II', modifier: null });
      });
    });

    describe('for bI and bIV', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 'I', modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'I', modifier: null });
      });
    });

    describe('for #E and #B', () => {
      it('returns the next note with #', () => {
        const key = new Key({ note: 3, modifier: '#' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 4, modifier: '#' });
      });
    });

    describe('for C, D, F, G and A', () => {
      it('returns the # version', () => {
        const key = new Key({ note: 'A', modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'A', modifier: '#' });
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the next note without #', () => {
        const key = new Key({ note: 'A', modifier: '#' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'B', modifier: null });
      });
    });

    describe('for E and B', () => {
      it('returns the next note', () => {
        const key = new Key({ note: 'E', modifier: null });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'F', modifier: null });
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 'D', modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'D', modifier: null });
      });
    });

    describe('for Cb and Fb', () => {
      it('returns the note without b', () => {
        const key = new Key({ note: 'C', modifier: 'b' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'C', modifier: null });
      });
    });

    describe('for E# and B#', () => {
      it('returns the next note with #', () => {
        const key = new Key({ note: 'E', modifier: '#' });

        const transposedKey = key.transposeUp();
        expect(transposedKey).toBeKey({ note: 'F', modifier: '#' });
      });
    });
  });
});
