import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeric', () => {
    describe('normalize', () => {
      it('normalizes #3', () => {
        expect(Chord.parse('#3/#3')?.normalize().toString()).toEqual('4/4');
      });

      it('normalizes #7', () => {
        expect(Chord.parse('#7/#7')?.normalize().toString()).toEqual('1/1');
      });

      it('normalizes b1', () => {
        expect(Chord.parse('b1/b1')?.normalize().toString()).toEqual('7/7');
      });

      it('normalizes b4', () => {
        expect(Chord.parse('b4/b4')?.normalize().toString()).toEqual('3/3');
      });
    });
  });
});
