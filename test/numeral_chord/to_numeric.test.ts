import '../matchers';

import { Chord } from '../../src';

describe('Chord', () => {
  describe('numeral', () => {
    describe('toNumeric', () => {
      it('returns a numeric version of the chord', () => {
        expect(Chord.parse('#IIIsus4/bV')?.toNumeric().toString()).toEqual('#3sus4/b5');
      });
    });
  });
});
