import { Chord } from '../../src';
import SUFFIX_MAPPING from '../../src/normalize_mappings/suffix-normalize-mapping';
import Key from '../../src/key';

const keys: Set<string> = new Set<string>();
const baseKey = Key.parse('A')!;

for (let i = 0; i < 12; i += 1) {
  keys.add(baseKey.transpose(i).toString());
  keys.add(baseKey.transpose(i).useModifier('#').toString());
  keys.add(baseKey.transpose(i).useModifier('b').toString());
  keys.add(baseKey.transpose(i).toNumeralString(baseKey));
  keys.add(baseKey.transpose(i).useModifier('#').toNumeralString(baseKey));
  keys.add(baseKey.transpose(i).useModifier('b').toNumeralString(baseKey));
  keys.add(baseKey.transpose(i).toNumericString(baseKey));
  keys.add(baseKey.transpose(i).useModifier('#').toNumericString(baseKey));
  keys.add(baseKey.transpose(i).useModifier('b').toNumericString(baseKey));
}

describe('Chord', () => {
  describe('#parse', () => {
    keys.forEach((base) => {
      Object
        .keys(SUFFIX_MAPPING)
        .filter((suffix) => suffix !== '[blank]')
        .forEach((suffix) => {
          const chord = `${base}${suffix}`;

          it(`parses ${chord}`, () => {
            expect(Chord.parseOrFail(chord).toString()).toEqual(chord);
          });
        });
    });
  });
});
