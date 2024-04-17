import { Chord } from '../../src';

describe('Chord', () => {
  describe('chord solfege', () => {
    describe('isChordSolfege', () => {
      it('returns true for a chord solfege', () => {
        expect(Chord.parse('La/Do')?.isChordSolfege()).toBe(true);
      });
    });
  });
});
