import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            modifier: 'b',
            suffix: 'sus4',
            bassBase: 3,
            bassModifier: '#',
          });

          expect(chord.toNumericString()).toEqual('b1sus4/#3');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 1,
              modifier: 'b',
              suffix: 'sus4',
              bassBase: 3,
            });

            expect(chord.toNumericString()).toEqual('b1sus4/3');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            modifier: 'b',
            suffix: 'sus4',
          });

          expect(chord.toNumericString()).toEqual('b1sus4');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            suffix: 'sus4',
          });

          expect(chord.toNumericString()).toEqual('1sus4');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            modifier: 'b',
          });

          expect(chord.toNumericString()).toEqual('b1');
        });
      });
    });
  });
});
