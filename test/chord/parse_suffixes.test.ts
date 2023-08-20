import { Chord } from '../../src';
import SUFFIX_MAPPING from '../../src/normalize_mappings/suffix-normalize-mapping';

describe('Chord', () => {
  describe('#parse', () => {
    const base = 'Eb';

    Object
      .keys(SUFFIX_MAPPING)
      .filter((suffix) => suffix !== '[blank]')
      .forEach((suffix) => {
        const chord = `${base}${suffix}`;

        it(`parses ${chord}`, () => {
          expect(Chord.parse(chord)?.toString()).toEqual(chord);
        });
      });
  });
});
