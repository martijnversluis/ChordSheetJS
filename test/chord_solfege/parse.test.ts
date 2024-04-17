import { Chord, SOLFEGE } from '../../src';
import '../matchers';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('parse', () => {
      describe('chord without bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('Mi');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'Mi',
            },
            bass: null,
            suffix: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Misus');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'Mi',
            },
            bass: null,
            suffix: 'sus',
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('Fa#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: null,
            suffix: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('Fa#sus');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: null,
            suffix: 'sus',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fama9(#11)');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 5,
              originalKeyString: 'Fa',
            },
            bass: null,
            suffix: 'ma9(#11)',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('Fa#maj9b11');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: null,
            suffix: 'maj9b11',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('La7(#9)');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 9,
              originalKeyString: 'La',
            },
            bass: null,
            suffix: '7(#9)',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('La7(#9)');
          expect(chord?.toString()).toEqual('La7(#9)');
        });
      });

      describe('chord with bass', () => {
        it('parses a simple chord', () => {
          const chord = Chord.parse('Mi/Si');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'Mi',
            },
            bass: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'Si',
            },
            suffix: null,
          });
        });

        it('parses a chord with suffix', () => {
          const chord = Chord.parse('Misus/Si');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 4,
              originalKeyString: 'Mi',
            },
            bass: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'Si',
            },
            suffix: 'sus',
          });
        });

        it('parses a chord with modifier', () => {
          const chord = Chord.parse('Fa#/Do#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'Do',
            },
            suffix: null,
          });
        });

        it('parses a chord with modifier and suffix', () => {
          const chord = Chord.parse('Fa#sus/Do#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'Do',
            },
            suffix: 'sus',
          });
        });

        it('parses a chord with confusing suffix', () => {
          const chord = Chord.parse('Fama9(#11)/Do#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 5,
              originalKeyString: 'Fa',
            },
            bass: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'Do',
            },
            suffix: 'ma9(#11)',
          });
        });

        it('parses a chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('Fa#maj9b11/Do#');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 6,
              originalKeyString: 'Fa',
            },
            bass: {
              grade: 0,
              modifier: '#',
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 1,
              originalKeyString: 'Do',
            },
            suffix: 'maj9b11',
          });
        });
      });

      it('allows whitespace', () => {
        const chord = Chord.parse(' \n Fa#/Do# \r ');

        expect(chord).toMatchObject({
          root: {
            grade: 0,
            modifier: '#',
            type: SOLFEGE,
            minor: false,
            referenceKeyGrade: 6,
            originalKeyString: 'Fa',
          },
          bass: {
            grade: 0,
            modifier: '#',
            type: SOLFEGE,
            minor: false,
            referenceKeyGrade: 1,
            originalKeyString: 'Do',
          },
          suffix: null,
        });
      });

      describe('chord with only a bass', () => {
        it('parses a simple chord with no base', () => {
          const chord = Chord.parse('/Si');

          expect(chord).toMatchObject({
            root: null,
            bass: {
              grade: 0,
              modifier: null,
              type: SOLFEGE,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'Si',
            },
            suffix: null,
          });
        });
      });

      describe('chord with only a bass', () => {
        it('parses a simple chord with no base', () => {
          const chord = Chord.parse('/Si');
          expect(chord?.toString()).toEqual('/Si');
        });
      });
    });
  });
});
