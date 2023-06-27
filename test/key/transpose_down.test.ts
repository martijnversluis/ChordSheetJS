import { buildKey } from '../utilities';
import { NUMERIC, SYMBOL } from '../../src';
import { NUMERAL } from '../../src/constants';

describe('Key', () => {
  describe('transposeDown', () => {
    describe('for 2, 3, 5, 6, 7', () => {
      it('returns the b version', () => {
        expect(buildKey('6', NUMERIC).transposeDown().toString()).toEqual('b6');
      });
    });

    describe('for II, III, V, VI, VII', () => {
      it('returns the b version', () => {
        expect(buildKey('VI', NUMERAL).transposeDown().toString()).toEqual('bVI');
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the note without #', () => {
        expect(buildKey('6', NUMERIC, '#').transposeDown().toString()).toEqual('6');
      });
    });

    describe('for #I, #II, #IV, #V and #VI', () => {
      it('returns the note without #', () => {
        expect(buildKey('VI', NUMERAL, '#').transposeDown().toString()).toEqual('VI');
      });
    });

    describe('for 4 and 1', () => {
      it('returns the previous note', () => {
        expect(buildKey('4', NUMERIC).transposeDown().toString()).toEqual('3');
      });
    });

    describe('for IV and I', () => {
      it('returns the previous note', () => {
        expect(buildKey('IV', NUMERAL).transposeDown().toString()).toEqual('III');
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the previous note without b', () => {
        expect(buildKey('2', NUMERIC, 'b').transposeDown().toString()).toEqual('1');
      });
    });

    describe('for bII, bIII, bV, bVI and bVII', () => {
      it('returns the previous note without b', () => {
        expect(buildKey('II', NUMERAL, 'b').transposeDown().toString()).toEqual('I');
      });
    });

    describe('for #7 and #3', () => {
      it('returns the note without #', () => {
        expect(buildKey('7', NUMERIC, '#').transposeDown().toString()).toEqual('7');
      });
    });

    describe('for #VII and #III', () => {
      it('returns the note without #', () => {
        expect(buildKey('VII', NUMERAL, '#').transposeDown().toString()).toEqual('VII');
      });
    });

    describe('for b4 and b1', () => {
      it('returns the previous note with b', () => {
        expect(buildKey('4', NUMERIC, 'b').transposeDown().toString()).toEqual('b3');
      });
    });

    describe('for bIV and bI', () => {
      it('returns the previous note with b', () => {
        expect(buildKey('IV', NUMERAL, 'b').transposeDown().toString()).toEqual('bIII');
      });
    });

    describe('for D, E, G, A, B', () => {
      it('returns the b version', () => {
        expect(buildKey('A', SYMBOL).transposeDown().toString()).toEqual('Ab');
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the note without #', () => {
        expect(buildKey('A', SYMBOL, '#').transposeDown().toString()).toEqual('A');
      });
    });

    describe('for F and C', () => {
      it('returns the previous note', () => {
        expect(buildKey('F', SYMBOL).transposeDown().toString()).toEqual('E');
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the previous note without b', () => {
        expect(buildKey('D', SYMBOL, 'b').transposeDown().toString()).toEqual('C');
      });
    });

    describe('for B# and E#', () => {
      it('returns the note without #', () => {
        expect(buildKey('B', SYMBOL, '#').transposeDown().toString()).toEqual('B');
      });
    });

    describe('for Fb and Cb', () => {
      it('returns the previous note with b', () => {
        expect(buildKey('F', SYMBOL, 'b').transposeDown().toString()).toEqual('Eb');
      });
    });
  });
});
