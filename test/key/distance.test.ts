import { Key } from '../../src';

describe('Key', () => {
  describe('distance', () => {
    it('calculates the distance between two sharp keys', () => {
      expect(Key.distance('G#', 'D#')).toEqual(7);
    });

    it('calculates the distance between two flat keys', () => {
      expect(Key.distance('Ab', 'Eb')).toEqual(7);
    });

    it('calculates the distance between a flat key and a sharp key', () => {
      expect(Key.distance('Ab', 'D#')).toEqual(7);
    });

    it('calculates the distance between a sharp key and a flat key', () => {
      expect(Key.distance('G#', 'Eb')).toEqual(7);
    });

    it('calculate the distance between a Key object and a string', () => {
      expect(Key.distance(Key.parseOrFail('G#'), 'Eb')).toEqual(7);
    });

    it('calculate the distance between a string and a Key object', () => {
      expect(Key.distance('G#', Key.parseOrFail('Eb'))).toEqual(7);
    });
  });
});
