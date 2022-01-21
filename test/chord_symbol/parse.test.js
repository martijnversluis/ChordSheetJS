import { Chord } from '../../src/index';

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
          const chord = Chord.parse('Esus4');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: 'sus4', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus4');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'sus4', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fmaj9#11');
          expect(chord).toBeChord({
            base: 'F', modifier: null, suffix: 'maj9#11', bassBase: null, bassModifier: null,
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'maj9b11', bassBase: null, bassModifier: null,
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
          const chord = Chord.parse('Esus4/B');
          expect(chord).toBeChord({
            base: 'E', modifier: null, suffix: 'sus4', bassBase: 'B', bassModifier: null,
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: null, bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus4/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'sus4', bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fmaj9#11/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: null, suffix: 'maj9#11', bassBase: 'C', bassModifier: '#',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11/C#');
          expect(chord).toBeChord({
            base: 'F', modifier: '#', suffix: 'maj9b11', bassBase: 'C', bassModifier: '#',
          });
        });
      });
    });
  });
});
