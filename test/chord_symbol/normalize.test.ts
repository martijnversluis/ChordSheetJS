import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('normalize', () => {
      it('normalizes E#', () => {
        expect(Chord.parse('E#/E#')?.normalize().toString()).toEqual('F/F');
      });

      it('normalizes B#', () => {
        expect(Chord.parse('B#/B#')?.normalize().toString()).toEqual('C/C');
      });

      it('normalizes Cb', () => {
        expect(Chord.parse('Cb/Cb')?.normalize().toString()).toEqual('B/B');
      });

      it('normalizes Fb', () => {
        expect(Chord.parse('Fb/Fb')?.normalize().toString()).toEqual('E/E');
      });

      it('normalizes Em/A#', () => {
        expect(Chord.parse('Em/A#')?.normalize().toString()).toEqual('Em/Bb');
      });

      it('normalizes D/F#', () => {
        expect(Chord.parse('D/F#')?.normalize().toString()).toEqual('D/F#');
      });
    });
  });
});
