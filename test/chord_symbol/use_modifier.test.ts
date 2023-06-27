import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('useModifier', () => {
      describe('for a chord without modifier', () => {
        it('does not change the chord', () => {
          expect(Chord.parse('F/F')?.useModifier('b').toString()).toEqual('F/F');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          expect(Chord.parse('G#/G#')?.useModifier('b').toString()).toEqual('Ab/Ab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          expect(Chord.parse('Gb/Gb')?.useModifier('#').toString()).toEqual('F#/F#');
        });
      });
    });
  });
});
