import Key from '../../src/key';
import { FLAT, NUMERAL, SHARP } from '../../src/constants';

describe('Key', () => {
  describe('#clone', () => {
    it('returns a deep copy of the key', () => {
      const key = new Key({
        grade: 5, modifier: SHARP, preferredModifier: FLAT, minor: true, type: NUMERAL, referenceKeyGrade: 4,
      });

      const clone = key.clone();

      expect(clone.grade).toEqual(5);
      expect(clone.modifier).toEqual(SHARP);
      expect(clone.preferredModifier).toEqual(FLAT);
      expect(clone.minor).toEqual(true);
      expect(clone.type).toEqual(NUMERAL);
      expect(clone.referenceKeyGrade).toEqual(4);
    });
  });
});
