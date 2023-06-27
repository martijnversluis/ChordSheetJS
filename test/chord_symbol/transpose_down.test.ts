import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('transposeUp', () => {
      describe('for D, E, G, A, B', () => {
        it('returns the b version', () => {
          expect(Chord.parse('A/G')?.transposeDown().toString()).toEqual('Ab/Gb');
        });
      });

      describe('for C#, D#, F#, G# and A#', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('A#/G#')?.transposeDown().toString()).toEqual('A/G');
        });
      });

      describe('for F and C', () => {
        it('returns the previous note', () => {
          expect(Chord.parse('F/C')?.transposeDown().toString()).toEqual('E/B');
        });
      });

      describe('for Db, Eb, Gb, Ab and Bb', () => {
        it('returns the previous note without b', () => {
          expect(Chord.parse('Db/Eb')?.transposeDown().toString()).toEqual('C/D');
        });
      });

      describe('for B# and E#', () => {
        it('returns the note without #', () => {
          expect(Chord.parse('B#/E#')?.transposeDown().toString()).toEqual('B/E');
        });
      });

      describe('for Fb and Cb', () => {
        it('returns the previous note with b', () => {
          expect(Chord.parse('Fb/Cb')?.transposeDown().toString()).toEqual('Eb/Bb');
        });
      });
    });
  });
});
