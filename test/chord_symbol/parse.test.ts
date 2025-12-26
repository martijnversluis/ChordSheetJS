import '../util/matchers';

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
            quality: null,
            extensions: null,
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
            quality: 'sus',
            extensions: null,
          });
        });

        it('parses a minor chord', () => {
          const chord = Chord.parse('Am');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: true,
              referenceKeyGrade: 9,
              originalKeyString: 'A',
            },
            bass: null,
            suffix: 'm',
            quality: 'm',
            extensions: null,
          });
        });

        it('parses a diminished chord', () => {
          const chord = Chord.parse('Bdim');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'B',
            },
            bass: null,
            suffix: 'dim',
            quality: 'dim',
            extensions: null,
          });
        });

        it('parses an augmented chord', () => {
          const chord = Chord.parse('Caug');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 0,
              originalKeyString: 'C',
            },
            bass: null,
            suffix: 'aug',
            quality: 'aug',
            extensions: null,
          });
        });

        it('parses a sus2 chord', () => {
          const chord = Chord.parse('Dsus2');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 2,
              originalKeyString: 'D',
            },
            bass: null,
            suffix: 'sus2',
            quality: 'sus2',
            extensions: null,
          });
        });

        it('parses a sus4 chord', () => {
          const chord = Chord.parse('Gsus4');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 7,
              originalKeyString: 'G',
            },
            bass: null,
            suffix: 'sus4',
            quality: 'sus4',
            extensions: null,
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
            quality: null,
            extensions: null,
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
            quality: 'sus',
            extensions: null,
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
            quality: null,
            extensions: 'ma9(#11)',
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
            quality: null,
            extensions: 'maj9b11',
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
            quality: null,
            extensions: '7(#9)',
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
            quality: null,
            extensions: null,
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
            quality: 'sus',
            extensions: null,
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
            quality: null,
            extensions: null,
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
            quality: 'sus',
            extensions: null,
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
            quality: null,
            extensions: 'ma9(#11)',
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
            quality: null,
            extensions: 'maj9b11',
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
          quality: null,
          extensions: null,
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
            quality: null,
            extensions: null,
          });

          expect(chord?.toString()).toEqual('/B');
        });
      });

      describe('optional chord', () => {
        it('parses a optional chord surrounded by parantheses', () => {
          const chord = Chord.parse('(B)');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'B',
            },
            bass: null,
            suffix: null,
            optional: true,
          });

          expect(chord?.toString()).toEqual('(B)');
        });
      });
    });
  });
});
