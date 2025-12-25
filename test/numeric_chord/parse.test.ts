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
