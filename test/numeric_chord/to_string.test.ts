import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toString', () => {
      describe('with bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            modifier: 'b',
            suffix: 'sus',
            bassBase: 3,
            bassModifier: '#',
          });

          expect(chord.toNumericString()).toEqual('b1sus/#3');
        });

        describe('without bass modifier', () => {
          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 1,
              modifier: 'b',
              suffix: 'sus',
              bassBase: 3,
            });

            expect(chord.toNumericString()).toEqual('b1sus/3');
          });
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            modifier: 'b',
            suffix: 'sus',
          });

          expect(chord.toNumericString()).toEqual('b1sus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 1,
            suffix: 'sus',
          });

          expect(chord.toNumericString()).toEqual('1sus');
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
