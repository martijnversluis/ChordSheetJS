import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeric', () => {
    describe('toNumeral', () => {
      it('returns the numeral version', () => {
        expect(Chord.parse('#6sus4/b4')?.toNumeral().toString()).toEqual('#VIsus4/bIV');
      });
    });
  });
});
