import Chord from '../../src/chord';
import { NUMERIC } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('transpose', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(Chord.parse('b2/#6')?.transpose(5).toString()).toEqual('b5/#2');
        });
      });

      describe('when delta < 0', () => {
        it('transposes down', () => {
          expect(Chord.parse('#6/b7')?.transpose(-4).toString()).toEqual('#4/b5');
        });
      });

      describe('when delta = 0', () => {
        it('does not change the chord', () => {
          const chord = new Chord({
            base: 7,
            accidental: '#',
            suffix: null,
            bassBase: 1,
            bassAccidental: 'b',
            chordType: NUMERIC,
          });

          expect(chord.transpose(0)).toEqual(chord);
        });
      });
    });
  });
});
