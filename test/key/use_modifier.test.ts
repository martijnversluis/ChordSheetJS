import { buildKey } from '../utilities';
import { NUMERIC, SYMBOL } from '../../src';
import { NUMERAL, SOLFEGE } from '../../src/constants';

describe('Key', () => {
  describe('useModifier', () => {
    describe('chord symbol', () => {
      describe('for a key without modifier', () => {
        it('does not change the key', () => {
          const key = buildKey('F', SYMBOL);

          const switchedKey = key.useModifier('b');

          expect(switchedKey.toString()).toEqual('F');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const key = buildKey('G', SYMBOL, '#');

          const switchedKey = key.useModifier('b');
          expect(switchedKey.toString()).toEqual('Ab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const key = buildKey('G', SYMBOL, 'b');

          const switchedKey = key.useModifier('#');
          expect(switchedKey.toString()).toEqual('F#');
        });
      });
    });

    describe('chord solfege', () => {
      describe('for a key without modifier', () => {
        it('does not change the key', () => {
          const key = buildKey('Fa', SOLFEGE);

          const switchedKey = key.useModifier('b');

          expect(switchedKey.toString()).toEqual('Fa');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const key = buildKey('Sol', SOLFEGE, '#');

          const switchedKey = key.useModifier('b');
          expect(switchedKey.toString()).toEqual('Lab');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const key = buildKey('Sol', SOLFEGE, 'b');

          const switchedKey = key.useModifier('#');
          expect(switchedKey.toString()).toEqual('Fa#');
        });
      });
    });

    describe('numeric', () => {
      describe('for a key without modifier', () => {
        it('does not change the key', () => {
          const key = buildKey(4, NUMERIC);

          const switchedKey = key.useModifier('b');

          expect(switchedKey.toString()).toEqual('4');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const key = buildKey(5, NUMERIC, '#');

          const switchedKey = key.useModifier('b');
          expect(switchedKey.toString()).toEqual('b6');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const key = buildKey(5, NUMERIC, 'b');

          const switchedKey = key.useModifier('#');
          expect(switchedKey.toString()).toEqual('#4');
        });
      });
    });

    describe('numeral', () => {
      describe('for a key without modifier', () => {
        it('does not change the key', () => {
          const key = buildKey('IV', NUMERAL);

          const switchedKey = key.useModifier('b');

          expect(switchedKey.toString()).toEqual('IV');
        });
      });

      describe('for #', () => {
        it('changes to b', () => {
          const key = buildKey('V', NUMERAL, '#');

          const switchedKey = key.useModifier('b');

          expect(switchedKey.toString()).toEqual('bVI');
        });
      });

      describe('for b', () => {
        it('changes to #', () => {
          const key = buildKey('V', NUMERAL, 'b');

          const switchedKey = key.useModifier('#');

          expect(switchedKey.toString()).toEqual('#IV');
        });
      });
    });
  });
});
