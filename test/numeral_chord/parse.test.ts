/* eslint quote-props: 0 */

import { Chord } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('parse', () => {
    describe('simple roman symbols', () => {
      const examples = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'i',
        'ii',
        'iii',
        'iv',
        'v',
        'vi',
        'vii',
      ];

      examples.forEach((numeral) => {
        it(`parses ${numeral}`, () => {
          expect(Chord.parse(numeral)).toBeChord({
            base: numeral,
            modifier: null,
            suffix: null,
            bassBase: null,
            bassModifier: null,
          });
        });
      });
    });

    describe('numeral chord without bass', () => {
      it('parses a simple numeral chord', () => {
        const chord = Chord.parse('IV');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: null, bassBase: null, bassModifier: null,
        });
      });

      it('parses a numeral chord with suffix', () => {
        const chord = Chord.parse('IVsus');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: 'sus', bassBase: null, bassModifier: null,
        });
      });

      it('parses a numeral chord with modifier', () => {
        const chord = Chord.parse('#iv');
        expect(chord).toBeChord({
          base: 'iv', modifier: '#', suffix: null, bassBase: null, bassModifier: null,
        });
      });

      it('parses a numeral chord with modifier and suffix', () => {
        const chord = Chord.parse('#iiisus');
        expect(chord).toBeChord({
          base: 'iii', modifier: '#', suffix: 'sus', bassBase: null, bassModifier: null,
        });
      });

      it('parses a numeral chord with confusing suffix', () => {
        const chord = Chord.parse('IVmaj9#11');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: 'maj9#11', bassBase: null, bassModifier: null,
        });
      });

      it('parses a numeral chord with modifier and confusing suffix', () => {
        const chord = Chord.parse('#IVmaj9b11');
        expect(chord).toBeChord({
          base: 'IV', modifier: '#', suffix: 'maj9b11', bassBase: null, bassModifier: null,
        });
      });
    });

    describe('numeral chord with bass', () => {
      it('parses a simple numeral chord', () => {
        const chord = Chord.parse('IV/I');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: null, bassBase: 'I', bassModifier: null,
        });
      });

      it('parses a numeral chord with suffix', () => {
        const chord = Chord.parse('IVsus4/I');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: 'sus4', bassBase: 'I', bassModifier: null,
        });
      });

      it('parses a numeral chord with modifier', () => {
        const chord = Chord.parse('#IV/#I');
        expect(chord).toBeChord({
          base: 'IV', modifier: '#', suffix: null, bassBase: 'I', bassModifier: '#',
        });
      });

      it('parses a numeral chord with modifier and suffix', () => {
        const chord = Chord.parse('#IVsus4/#I');
        expect(chord).toBeChord({
          base: 'IV', modifier: '#', suffix: 'sus4', bassBase: 'I', bassModifier: '#',
        });
      });

      it('parses a numeral chord with confusing suffix', () => {
        const chord = Chord.parse('IVmaj9#11/#I');
        expect(chord).toBeChord({
          base: 'IV', modifier: null, suffix: 'maj9#11', bassBase: 'I', bassModifier: '#',
        });
      });

      it('parses a numeral chord with modifier and confusing suffix', () => {
        const chord = Chord.parse('#IVmaj9b11/#I');
        expect(chord).toBeChord({
          base: 'IV', modifier: '#', suffix: 'maj9b11', bassBase: 'I', bassModifier: '#',
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
