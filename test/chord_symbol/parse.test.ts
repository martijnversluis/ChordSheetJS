import { Chord } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('parse', () => {
      describe('chord without bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('E');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: null, bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Esus');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: 'sus', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'sus', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fma9(#11)');
          expect(chord).toBeChord({
            base: 'F', modifier: null, suffix: 'ma9(#11)', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'maj9b11', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('A7(#9)');
          expect(chord).toBeChord({
            base: 'A', modifier: null, suffix: '7(#9)', bassBase: null, bassModifier: null,
          });
        });
      });

      describe('chord with bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('E/B');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: null, bassBase: 'B', bassModifier: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Esus/B');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: 'sus', bassBase: 'B', bassModifier: null,
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'sus', bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fma9(#11)/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: null, suffix: 'ma9(#11)', bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'maj9b11', bassBase: 'C', bassModifier: '#',
          });
        });
      });

      it('allows whitespace', () => {
        const chord = Chord.parse(' \n F#/C# \r ');
        expect(chord).toBeChord({
          base: 'F', modifier: '#', suffix: null, bassBase: 'C', bassModifier: '#',
        });
      });

      describe('chord with only a bass', () => {
        it('parses a simple chord with no base', () => {
          const chord = Chord.parse('/B');
          expect(chord).toBeChord({
            base: null, modifier: null, suffix: null, bassBase: 'B', bassModifier: null,
          });
        });
      });
    });
  });
});
