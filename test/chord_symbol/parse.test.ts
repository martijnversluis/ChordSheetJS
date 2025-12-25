import '../matchers';

import { Chord, SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('parse', () => {
      describe('chord without bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('E');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'E',
            },
            bass: null,
            suffix: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Esus');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'E',
            },
            bass: null,
            suffix: 'sus',
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: null,
            suffix: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: null,
            suffix: 'sus',
          });
        });

        it('parses a chord with confusing suffix #11', () => {
          const chord = Chord.parse('Fma9(#11)');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 5,
              originalKeyString: 'F',
            },
            bass: null,
            suffix: 'ma9(#11)',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: null,
            suffix: 'maj9b11',
          });
        });

        it('parses a chord with confusing suffix #9', () => {
          const chord = Chord.parse('A7(#9)');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 9,
              originalKeyString: 'A',
            },
            bass: null,
            suffix: '7(#9)',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('A7(#9)');
          expect(chord?.toString()).toEqual('A7(#9)');
        });
      });

      describe('chord with bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('E/B');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'E',
            },
            bass: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'B',
            },
            suffix: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Esus/B');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'E',
            },
            bass: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'B',
            },
            suffix: 'sus',
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('F#/C#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'C',
            },
            suffix: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('F#sus/C#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'C',
            },
            suffix: 'sus',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fma9(#11)/C#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 5,
              originalKeyString: 'F',
            },
            bass: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'C',
            },
            suffix: 'ma9(#11)',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('F#maj9b11/C#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'F',
            },
            bass: {
              grade: 0,
              accidental: '#',
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'C',
            },
            suffix: 'maj9b11',
          });
        });
      });

      it('allows whitespace', () => {
        const chord = Chord.parse(' \n F#/C# \r ');

        expect(chord).toMatchObject({
          root: {
            grade: 0,
            accidental: '#',
            type: SYMBOL,
            minor: false,
            referenceKeyGrade: 6,
            originalKeyString: 'F',
          },
          bass: {
            grade: 0,
            accidental: '#',
            type: SYMBOL,
            minor: false,
            referenceKeyGrade: 1,
            originalKeyString: 'C',
          },
          suffix: null,
        });
      });

      describe('chord with only a bass', () => {
        it('parses a simple chord with no base', () => {
          const chord = Chord.parse('/B');

          expect(chord).toMatchObject({
            root: null,
            bass: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'B',
            },
            suffix: null,
          });

          expect(chord?.toString()).toEqual('/B');
        });
      });
    });
  });
});
