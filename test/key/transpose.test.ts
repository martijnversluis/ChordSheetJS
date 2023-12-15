import { buildKey } from '../utilities';
import { 
  NUMERAL, 
  NUMERIC, 
  SOLFEGE, 
  SYMBOL, 
} from '../../src/constants';

describe('Key', () => {
  describe('transpose', () => {
    describe('chord symbol key', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(buildKey('D', SYMBOL, 'b').transpose(5).toString()).toEqual('Gb');
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('A', SYMBOL, '#').transpose(-4).toString()).toEqual('F#');
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('B', SYMBOL, '#').transpose(0).toString()).toEqual('B#');
        });
      });
    });

    describe('chord solfege key', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(buildKey('Re', SOLFEGE, 'b').transpose(5).toString()).toEqual('Solb');
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('La', SOLFEGE, '#').transpose(-4).toString()).toEqual('Fa#');
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('Si', SOLFEGE, '#').transpose(0).toString()).toEqual('Si#');
        });
      });
    });

    describe('numeric key', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(buildKey(2, NUMERIC, 'b').transpose(5).toString()).toEqual('b5');
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          expect(buildKey(6, NUMERIC, '#').transpose(-4).toString()).toEqual('#4');
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          expect(buildKey(7, NUMERIC, '#').transpose(0).toString()).toEqual('#7');
        });
      });
    });

    describe('numeral key', () => {
      describe('when delta > 0', () => {
        it('transposes up', () => {
          expect(buildKey('II', NUMERAL, 'b').transpose(5).toString()).toEqual('bV');
        });
      });

      describe('when delta < 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('VI', NUMERAL, '#').transpose(-4).toString()).toEqual('#IV');
        });
      });

      describe('when delta = 0', () => {
        it('Does not change the key', () => {
          expect(buildKey('VII', NUMERAL, '#').transpose(0).toString()).toEqual('#VII');
        });
      });
    });
  });
});
