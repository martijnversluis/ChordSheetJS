import { buildKey } from '../utilities';
import { NUMERIC, SYMBOL } from '../../src';
import { NUMERAL, SOLFEGE } from '../../src/constants';

describe('Key', () => {
  describe('transposeUp', () => {
    describe('for 1, 2, 4, 5 and 6', () => {
      it('returns the # version', () => {
        const key = buildKey(6, NUMERIC);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('#6');
      });
    });

    describe('for #1, #2, #4, #5 and #6', () => {
      it('returns the next note without #', () => {
        const key = buildKey(6, NUMERIC, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('7');
      });
    });

    describe('for 3 and 7', () => {
      it('returns the next note', () => {
        const key = buildKey(3, NUMERIC);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('4');
      });
    });

    describe('for b2, b3, b5, b6 and b7', () => {
      it('returns the note without b', () => {
        const key = buildKey(2, NUMERIC, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('2');
      });
    });

    describe('for b1 and b4', () => {
      it('returns the note without b', () => {
        const key = buildKey(1, NUMERIC, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('1');
      });
    });

    describe('for I, II, IV, V and VI', () => {
      it('returns the # version', () => {
        const key = buildKey('VI', NUMERAL);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('#VI');
      });
    });

    describe('for #I, #II, #IV, #V and #VI', () => {
      it('returns the next note without #', () => {
        const key = buildKey('VI', NUMERAL, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('VII');
      });
    });

    describe('for III and VII', () => {
      it('returns the next note', () => {
        const key = buildKey('III', NUMERAL);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('IV');
      });
    });

    describe('for bII, bIII, bV, bVI and bVII', () => {
      it('returns the note without b', () => {
        const key = buildKey('II', NUMERAL, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('II');
      });
    });

    describe('for bI and bIV', () => {
      it('returns the note without b', () => {
        const key = buildKey('I', NUMERAL, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('I');
      });
    });

    describe('for #E and #B', () => {
      it('returns the next note with #', () => {
        const key = buildKey(3, NUMERIC, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('#4');
      });
    });

    describe('for C, D, F, G and A', () => {
      it('returns the # version', () => {
        const key = buildKey('A', SYMBOL);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('A#');
      });
    });

    describe('for C#, D#, F#, G# and A#', () => {
      it('returns the next note without #', () => {
        const key = buildKey('A', SYMBOL, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('B');
      });
    });

    describe('for E and B', () => {
      it('returns the next note', () => {
        const key = buildKey('E', SYMBOL);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('F');
      });
    });

    describe('for Db, Eb, Gb, Ab and Bb', () => {
      it('returns the note without b', () => {
        const key = buildKey('D', SYMBOL, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('D');
      });
    });

    describe('for Cb and Fb', () => {
      it('returns the note without b', () => {
        const key = buildKey('C', SYMBOL, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('C');
      });
    });

    describe('for E# and B#', () => {
      it('returns the next note with #', () => {
        const key = buildKey('E', SYMBOL, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('F#');
      });
    });

    it('correctly handles minor keys', () => {
      expect(buildKey('E', SYMBOL, '#', true).transposeUp().toString()).toEqual('F#m');
    });

    describe('for Do, Re, Fa, Sol and La', () => {
      it('returns the # version', () => {
        const key = buildKey('La', SOLFEGE);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('La#');
      });
    });

    describe('for Do#, Re#, Fa#, Sol# and La#', () => {
      it('returns the next note without #', () => {
        const key = buildKey('La', SOLFEGE, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('Si');
      });
    });

    describe('for Mi and Si', () => {
      it('returns the next note', () => {
        const key = buildKey('Mi', SOLFEGE);

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('Fa');
      });
    });

    describe('for Reb, Mib, Solb, Lab and Sib', () => {
      it('returns the note without b', () => {
        const key = buildKey('Re', SOLFEGE, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('Re');
      });
    });

    describe('for Dob and Fab', () => {
      it('returns the note without b', () => {
        const key = buildKey('Do', SOLFEGE, 'b');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('Do');
      });
    });

    describe('for Mi# and Si#', () => {
      it('returns the next note with #', () => {
        const key = buildKey('Mi', SOLFEGE, '#');

        const transposedKey = key.transposeUp();
        expect(transposedKey.toString()).toEqual('Fa#');
      });
    });

    it('correctly handles minor solfege keys', () => {
      expect(buildKey('Mi', SOLFEGE, '#', true).transposeUp().toString()).toEqual('Fa#m');
    });
  });
});
