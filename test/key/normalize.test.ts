import { buildKey } from '../utilities';

import {
  NUMERAL,
  NUMERIC,
  SOLFEGE,
  SYMBOL,
} from '../../src';

describe('Key', () => {
  describe('normalize', () => {
    it('normalizes E#', () => {
      expect(buildKey('E', SYMBOL, '#').normalize().toString()).toEqual('F');
    });

    it('normalizes B#', () => {
      expect(buildKey('B', SYMBOL, '#').normalize().toString()).toEqual('C');
    });

    it('normalizes Cb', () => {
      expect(buildKey('C', SYMBOL, 'b').normalize().toString()).toEqual('B');
    });

    it('normalizes Fb', () => {
      expect(buildKey('F', SYMBOL, 'b').normalize().toString()).toEqual('E');
    });

    it('normalizes Mi#', () => {
      expect(buildKey('Mi', SOLFEGE, '#').normalize().toString()).toEqual('Fa');
    });

    it('normalizes Si#', () => {
      expect(buildKey('Si', SOLFEGE, '#').normalize().toString()).toEqual('Do');
    });

    it('normalizes Dob', () => {
      expect(buildKey('Do', SOLFEGE, 'b').normalize().toString()).toEqual('Si');
    });

    it('normalizes Fab', () => {
      expect(buildKey('Fa', SOLFEGE, 'b').normalize().toString()).toEqual('Mi');
    });

    it('normalizes #3', () => {
      expect(buildKey(3, NUMERIC, '#').normalize().toString()).toEqual('4');
    });

    it('normalizes #7', () => {
      expect(buildKey('7', NUMERIC, '#').normalize().toString()).toEqual('1');
    });

    it('normalizes b1', () => {
      expect(buildKey(1, NUMERIC, 'b').normalize().toString()).toEqual('7');
    });

    it('normalizes b4', () => {
      expect(buildKey(4, NUMERIC, 'b').normalize().toString()).toEqual('3');
    });

    it('normalizes #III', () => {
      expect(buildKey('III', NUMERAL, '#').normalize().toString()).toEqual('IV');
    });

    it('normalizes #VII', () => {
      expect(buildKey('VII', NUMERAL, '#').normalize().toString()).toEqual('I');
    });

    it('normalizes bI', () => {
      expect(buildKey('I', NUMERAL, 'b').normalize().toString()).toEqual('VII');
    });

    it('normalizes bIV', () => {
      expect(buildKey('IV', NUMERAL, 'b').normalize().toString()).toEqual('III');
    });
  });
});
