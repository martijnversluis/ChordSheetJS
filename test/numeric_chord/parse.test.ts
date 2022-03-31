import { Chord } from '../../src';

import '../matchers';

describe('Chord', () => {
  describe('numeric', () => {
    describe('parse', () => {
      describe('numeric chord without bass', () => {
        it('parses a simple numeric chord', () => {
          const chord = Chord.parse('4');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: null, bassBase: null, bassModifier: null,
          });
        });

        it('parses a numeric chord with suffix', () => {
          const chord = Chord.parse('4sus');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: 'sus', bassBase: null, bassModifier: null,
          });
        });

        it('parses a numeric chord with modifier', () => {
          const chord = Chord.parse('#4');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: null, bassBase: null, bassModifier: null,
          });
        });

        it('parses a numeric chord with modifier and suffix', () => {
          const chord = Chord.parse('#4sus');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: 'sus', bassBase: null, bassModifier: null,
          });
        });

        it('parses a numeric chord with confusing suffix', () => {
          const chord = Chord.parse('4ma9(#11)');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: 'ma9(#11)', bassBase: null, bassModifier: null,
          });
        });

        it('parses a numeric chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('#4maj9b11');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: 'maj9b11', bassBase: null, bassModifier: null,
          });
        });
      });

      describe('numeric chord with bass', () => {
        it('parses a simple numeric chord', () => {
          const chord = Chord.parse('4/1');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: null, bassBase: 1, bassModifier: null,
          });
        });

        it('parses a numeric chord with suffix', () => {
          const chord = Chord.parse('4sus/1');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: 'sus', bassBase: 1, bassModifier: null,
          });
        });

        it('parses a numeric chord with modifier', () => {
          const chord = Chord.parse('#4/#1');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: null, bassBase: 1, bassModifier: '#',
          });
        });

        it('parses a numeric chord with modifier and suffix', () => {
          const chord = Chord.parse('#4sus/#1');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: 'sus', bassBase: 1, bassModifier: '#',
          });
        });

        it('parses a numeric chord with confusing suffix', () => {
          const chord = Chord.parse('4ma9(#11)/#1');
          expect(chord).toBeChord({
            base: 4, modifier: null, suffix: 'ma9(#11)', bassBase: 1, bassModifier: '#',
          });
        });

        it('parses a numeric chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('#4maj9b11/#1');
          expect(chord).toBeChord({
            base: 4, modifier: '#', suffix: 'maj9b11', bassBase: 1, bassModifier: '#',
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
});
