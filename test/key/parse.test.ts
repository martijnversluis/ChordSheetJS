import { Key, SYMBOL } from '../../src';
import { NUMERAL, NUMERIC, SOLFEGE } from '../../src/constants';

describe('Key', () => {
  describe('parse', () => {
    describe('chord symbol key', () => {
      it('parses a simple key', () => {
        const key = Key.parse('E');

        expect(key).toMatchObject({
          grade: 0,
          accidental: null,
          type: SYMBOL,
          minor: false,
          referenceKeyGrade: 4,
          originalKeyString: 'E',
        });
      });

      it('parses a key with modifier', () => {
        const key = Key.parse('F#');

        expect(key).toMatchObject({
          grade: 0,
          accidental: '#',
          type: SYMBOL,
          minor: false,
          referenceKeyGrade: 6,
          originalKeyString: 'F',
        });
      });
    });

    describe('chord solfege key', () => {
      it('parses a simple key', () => {
        const key = Key.parse('Mi');

        expect(key).toMatchObject({
          grade: 0,
          accidental: null,
          type: SOLFEGE,
          minor: false,
          referenceKeyGrade: 4,
          originalKeyString: 'Mi',
        });
      });

      it('parses a key with modifier', () => {
        const key = Key.parse('Fa#');

        expect(key).toMatchObject({
          grade: 0,
          accidental: '#',
          type: SOLFEGE,
          minor: false,
          referenceKeyGrade: 6,
          originalKeyString: 'Fa',
        });
      });
    });

    describe('numeric key', () => {
      it('parses a simple numeric key', () => {
        const key = Key.parse('4');

        expect(key).toMatchObject({
          number: 4,
          referenceKeyGrade: null,
          accidental: null,
          type: NUMERIC,
          minor: false,
          originalKeyString: '4',
        });
      });

      it('parses a numeric key with modifier', () => {
        const key = Key.parse('#4');

        expect(key).toMatchObject({
          number: 4,
          accidental: '#',
          type: NUMERIC,
          minor: false,
          referenceKeyGrade: null,
          originalKeyString: '4',
        });
      });
    });

    describe('numeral key', () => {
      it('parses a simple numeral key', () => {
        const key = Key.parse('IV');

        expect(key).toMatchObject({
          number: 4,
          accidental: null,
          type: NUMERAL,
          minor: false,
          referenceKeyGrade: null,
          originalKeyString: 'IV',
        });
      });

      it('parses a numeral key with modifier', () => {
        const key = Key.parse('#IV');

        expect(key).toMatchObject({
          referenceKeyGrade: null,
          number: 4,
          accidental: '#',
          type: NUMERAL,
          minor: false,
        });
      });
    });

    describe('when a key can not be parsed', () => {
      it('returns null', () => {
        const key = Key.parse('oobar');
        expect(key).toBeNull();
      });
    });
  });
});
