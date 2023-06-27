import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('transposeUp', () => {
      describe('for C, D, F, G and A', () => {
        it('returns the # version', () => {
          expect(Chord.parse('A/G')?.transposeUp().toString()).toEqual('A#/G#');
        });
      });

      describe('for C#, D#, F#, G# and A#', () => {
        it('returns the next note without #', () => {
          expect(Chord.parse('A#/G#')?.transposeUp().toString()).toEqual('B/A');
        });
      });

      describe('for E and B', () => {
        it('returns the next note', () => {
          expect(Chord.parse('E/B')?.transposeUp().toString()).toEqual('F/C');
        });
      });

      describe('for Db, Eb, Gb, Ab and Bb', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('Db/Eb')?.transposeUp().toString()).toEqual('D/E');
        });
      });

      describe('for Cb and Fb', () => {
        it('returns the note without b', () => {
          expect(Chord.parse('Cb/Fb')?.transposeUp().toString()).toEqual('C/F');
        });
      });

      describe('for E# and B#', () => {
        it('returns the next note with #', () => {
          expect(Chord.parse('E#/B#')?.transposeUp().toString()).toEqual('F#/C#');
        });
      });
    });
  });
});
