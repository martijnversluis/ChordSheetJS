import { Key } from '../../src/index';

import '../matchers';

describe('Key', () => {
  describe('parse', () => {
    describe('chord symbol key', () => {
      it('parses a simple key', () => {
        const key = Key.parse('E');
        expect(key).toBeKey({ note: 'E', modifier: null });
      });

      it('parses a key with modifier', () => {
        const key = Key.parse('F#');
        expect(key).toBeKey({ note: 'F', modifier: '#' });
      });
    });

    describe('numeric key', () => {
      it('parses a simple numeric key', () => {
        const key = Key.parse('4');
        expect(key).toBeKey({ note: 4, modifier: null });
      });

      it('parses a numeric key with modifier', () => {
        const key = Key.parse('#4');
        expect(key).toBeKey({ note: 4, modifier: '#' });
      });
    });

    describe('numeral key', () => {
      it('parses a simple numeral key', () => {
        const key = Key.parse('IV');
        expect(key).toBeKey({ note: 'IV', modifier: null });
      });

      it('parses a numeral key with modifier', () => {
        const key = Key.parse('#IV');
        expect(key).toBeKey({ note: 'IV', modifier: '#' });
      });
    });

    describe('when a key can not be parsed', () => {
      it('returns null', () => {
        const key = Key.parse('oobar');
        expect(key).toBeNull();
      });
    });
  });
});
