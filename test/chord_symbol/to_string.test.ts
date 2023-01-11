import Chord from '../../src/chord';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toString', () => {
      it('returns the right string representation', () => {
        const chord = new Chord({
          base: 'E',
          modifier: 'b',
          suffix: 'sus',
          bassBase: 'G',
          bassModifier: '#',
        });

        expect(chord.toString()).toEqual('Ebsus/G#');
      });

      describe('without bass modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            modifier: 'b',
            suffix: 'sus',
            bassBase: 'G',
          });

          expect(chord.toString()).toEqual('Ebsus/G');
        });
      });

      describe('without bass note', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            modifier: 'b',
            suffix: 'sus',
          });

          expect(chord.toString()).toEqual('Ebsus');
        });
      });

      describe('without modifier', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            suffix: 'sus',
          });

          expect(chord.toString()).toEqual('Esus');
        });
      });

      describe('without suffix', () => {
        it('returns the right string representation', () => {
          const chord = new Chord({
            base: 'E',
            modifier: 'b',
          });

          expect(chord.toString()).toEqual('Eb');
        });
      });

      describe('with option unicodeModifer:true', () => {
        describe('with sharp modifer', () => {
          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 'E',
              modifier: 'b',
            });

            expect(chord.toString({ useUnicodeModifier: true })).toEqual('E♭');
          });

          it('returns the right string representation', () => {
            const chord = new Chord({
              base: 'F',
              modifier: '#',
            });

            expect(chord.toString({ useUnicodeModifier: true })).toEqual('F♯');
          });
        });
      });
    });
  });
});
