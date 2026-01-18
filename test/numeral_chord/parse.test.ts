/* eslint quote-props: 0 */

import '../util/matchers';

import { Chord } from '../../src';
import { NUMERAL } from '../../src/constants';

describe('Chord', () => {
  describe('parse', () => {
    describe('simple roman symbols', () => {
      const examples = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4,
        'V': 5,
        'VI': 6,
        'VII': 7,
      };

      Object.entries(examples).forEach(([chord, number]) => {
        it(`parses ${chord}`, () => {
          expect(Chord.parse(chord)).toMatchObject({
            root: {
              grade: null,
              number,
              accidental: null,
              type: NUMERAL,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: chord,
            },
            bass: null,
            suffix: null,
            quality: null,
            extensions: null,
          });
        });

        it(`parses ${chord.toLowerCase()}`, () => {
          expect(Chord.parse(chord.toLowerCase())).toMatchObject({
            root: {
              number,
              accidental: null,
              type: NUMERAL,
              minor: true,
              referenceKeyGrade: null,
              originalKeyString: chord.toLowerCase(),
            },
            bass: null,
            suffix: null,
            quality: null,
            extensions: null,
          });
        });
      });
    });

    describe('numeral chord without bass', () => {
      it('parses a simple numeral chord', () => {
        const chord = Chord.parse('IV');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: null,
          suffix: null,
          quality: null,
          extensions: null,
        });
      });

      it('parses a numeral chord with suffix', () => {
        const chord = Chord.parse('IVsus');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: null,
          suffix: 'sus',
          quality: 'sus',
          extensions: null,
        });
      });

      it('parses a diminished chord', () => {
        const chord = Chord.parse('VIIdim');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 7,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'VII',
          },
          bass: null,
          suffix: 'dim',
          quality: 'dim',
          extensions: null,
        });
      });

      it('parses an augmented chord', () => {
        const chord = Chord.parse('Iaug');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 1,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          bass: null,
          suffix: 'aug',
          quality: 'aug',
          extensions: null,
        });
      });

      it('parses a sus2 chord', () => {
        const chord = Chord.parse('IIsus2');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 2,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'II',
          },
          bass: null,
          suffix: 'sus2',
          quality: 'sus2',
          extensions: null,
        });
      });

      it('parses a sus4 chord', () => {
        const chord = Chord.parse('Vsus4');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 5,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'V',
          },
          bass: null,
          suffix: 'sus4',
          quality: 'sus4',
          extensions: null,
        });
      });

      it('parses a minor-major seventh chord (mM7)', () => {
        const chord = Chord.parse('ivmM7');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: true,
            referenceKeyGrade: null,
            originalKeyString: 'iv',
          },
          bass: null,
          suffix: 'mM7',
          quality: 'm',
          extensions: 'M7',
        });
      });

      it('parses a numeral chord with modifier', () => {
        const chord = Chord.parse('#iv');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: '#',
            type: NUMERAL,
            minor: true,
            referenceKeyGrade: null,
            originalKeyString: 'iv',
          },
          bass: null,
          suffix: null,
          quality: null,
          extensions: null,
        });
      });

      it('parses a numeral chord with modifier and suffix', () => {
        const chord = Chord.parse('#iiisus');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 3,
            accidental: '#',
            type: NUMERAL,
            minor: true,
            referenceKeyGrade: null,
            originalKeyString: 'iii',
          },
          bass: null,
          suffix: 'sus',
          quality: 'sus',
          extensions: null,
        });
      });

      it('parses a numeral chord with confusing suffix', () => {
        const chord = Chord.parse('IVmaj9#11');

        expect(chord).toMatchObject({
          root: {
            number: 4,
            grade: null,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: null,
          suffix: 'maj9#11',
          quality: null,
          extensions: 'maj9#11',
        });
      });

      it('parses a numeral chord with modifier and confusing suffix', () => {
        const chord = Chord.parse('#IVmaj9b11');

        expect(chord).toMatchObject({
          root: {
            number: 4,
            grade: null,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: null,
          suffix: 'maj9b11',
          quality: null,
          extensions: 'maj9b11',
        });
      });
    });

    describe('numeral chord with bass', () => {
      it('parses a simple numeral chord', () => {
        const chord = Chord.parse('IV/I');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            grade: null,
            number: 1,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: null,
          quality: null,
          extensions: null,
        });
      });

      it('parses a numeral chord with suffix', () => {
        const chord = Chord.parse('IVsus4/I');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            grade: null,
            number: 1,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: 'sus4',
          quality: 'sus4',
          extensions: null,
        });
      });

      it('parses a numeral chord with modifier', () => {
        const chord = Chord.parse('#IV/#I');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            grade: null,
            number: 1,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: null,
          quality: null,
          extensions: null,
        });
      });

      it('parses a numeral chord with modifier and suffix', () => {
        const chord = Chord.parse('#IVsus4/#I');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            grade: null,
            number: 1,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: 'sus4',
          quality: 'sus4',
          extensions: null,
        });
      });

      it('parses a numeral chord with confusing suffix', () => {
        const chord = Chord.parse('IVmaj9#11/#I');

        expect(chord).toMatchObject({
          root: {
            grade: null,
            number: 4,
            accidental: null,
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            grade: null,
            number: 1,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: 'maj9#11',
          quality: null,
          extensions: 'maj9#11',
        });
      });

      it('parses a numeral chord with modifier and confusing suffix', () => {
        const chord = Chord.parse('#IVmaj9b11/#I');

        expect(chord).toMatchObject({
          root: {
            number: 4,
            grade: null,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'IV',
          },
          bass: {
            number: 1,
            grade: null,
            accidental: '#',
            type: NUMERAL,
            minor: false,
            referenceKeyGrade: null,
            originalKeyString: 'I',
          },
          suffix: 'maj9b11',
          quality: null,
          extensions: 'maj9b11',
        });
      });
    });

    describe('when a chord can not be parsed', () => {
      it('returns null', () => {
        const chord = Chord.parse('oobar');
        expect(chord).toBeNull();
      });
    });
  });
});
