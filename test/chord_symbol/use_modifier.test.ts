import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          expect(Chord.parse('F/F')?.useAccidental('b').toString()).toEqual('F/F');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          expect(Chord.parse('G#/G#')?.useAccidental('b').toString()).toEqual('Ab/Ab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          expect(Chord.parse('Gb/Gb')?.useAccidental('#').toString()).toEqual('F#/F#');
        });
      });
    });
  });
});
