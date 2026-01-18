import { Chord, NUMERIC } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('parse', () => {
      describe('numeric chord without bass', () => {
        it('parses a simple numeric chord', () => {
          const chord = Chord.parse('4');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: null,
            quality: null,
            extensions: null,
          });
        });

        it('parses a numeric chord with suffix', () => {
          const chord = Chord.parse('4sus');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: 'sus',
            quality: 'sus',
            extensions: null,
          });
        });

        it('parses a minor chord', () => {
          const chord = Chord.parse('6m');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 6,
              accidental: null,
              type: NUMERIC,
              minor: true,
              referenceKeyGrade: null,
              originalKeyString: '6',
            },
            bass: null,
            suffix: 'm',
            quality: 'm',
            extensions: null,
          });
        });

        it('parses a minor-major seventh chord (mM7)', () => {
          const chord = Chord.parse('6mM7');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 6,
              accidental: null,
              type: NUMERIC,
              minor: true,
              referenceKeyGrade: null,
              originalKeyString: '6',
            },
            bass: null,
            suffix: 'mM7',
            quality: 'm',
            extensions: 'M7',
          });
        });

        it('parses a diminished chord', () => {
          const chord = Chord.parse('7dim');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 7,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '7',
            },
            bass: null,
            suffix: 'dim',
            quality: 'dim',
            extensions: null,
          });
        });

        it('parses an augmented chord', () => {
          const chord = Chord.parse('1aug');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 1,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            bass: null,
            suffix: 'aug',
            quality: 'aug',
            extensions: null,
          });
        });

        it('parses a sus2 chord', () => {
          const chord = Chord.parse('2sus2');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 2,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '2',
            },
            bass: null,
            suffix: 'sus2',
            quality: 'sus2',
            extensions: null,
          });
        });

        it('parses a sus4 chord', () => {
          const chord = Chord.parse('5sus4');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 5,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '5',
            },
            bass: null,
            suffix: 'sus4',
            quality: 'sus4',
            extensions: null,
          });
        });

        it('parses a numeric chord with modifier', () => {
          const chord = Chord.parse('#4');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: null,
            quality: null,
            extensions: null,
          });
        });

        it('parses a numeric chord with modifier and suffix', () => {
          const chord = Chord.parse('#4sus');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: 'sus',
            quality: 'sus',
            extensions: null,
          });
        });

        it('parses a numeric chord with confusing suffix', () => {
          const chord = Chord.parse('4ma9(#11)');
          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: 'ma9(#11)',
            quality: null,
            extensions: 'ma9(#11)',
          });
        });

        it('parses a numeric chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('#4maj9b11');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: null,
            suffix: 'maj9b11',
            quality: null,
            extensions: 'maj9b11',
          });
        });
      });

      describe('numeric chord with bass', () => {
        it('parses a simple numeric chord', () => {
          const chord = Chord.parse('4/1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            suffix: null,
            quality: null,
            extensions: null,
          });
        });

        it('parses a numeric chord with suffix', () => {
          const chord = Chord.parse('4sus/1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            suffix: 'sus',
            quality: 'sus',
            extensions: null,
          });
        });

        it('parses a numeric chord with modifier', () => {
          const chord = Chord.parse('#4/#1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            suffix: null,
            quality: null,
            extensions: null,
          });
        });

        it('parses a numeric chord with modifier and suffix', () => {
          const chord = Chord.parse('#4sus/#1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            suffix: 'sus',
            quality: 'sus',
            extensions: null,
          });
        });

        it('parses a numeric chord with confusing suffix', () => {
          const chord = Chord.parse('4ma9(#11)/#1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: null,
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
            },
            suffix: 'ma9(#11)',
            quality: null,
            extensions: 'ma9(#11)',
          });
        });

        it('parses a numeric chord with modifier and confusing suffix', () => {
          const chord = Chord.parse('#4maj9b11/#1');

          expect(chord).toMatchObject({
            root: {
              grade: null,
              number: 4,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '4',
            },
            bass: {
              grade: null,
              number: 1,
              accidental: '#',
              type: NUMERIC,
              minor: false,
              referenceKeyGrade: null,
              originalKeyString: '1',
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
});
