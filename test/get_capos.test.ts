import { Key, keyHelpers } from '../src';

describe('getCapos', () => {
  it('returns the applicable capos for the provided key object', () => {
    const key = Key.parseOrFail('Eb');
    const capos = keyHelpers.getCapos(key);

    expect(capos).toEqual({
      1: 'D', 3: 'C', 6: 'A', 8: 'G',
    });
  });

  it('returns the applicable capos for the provided key string', () => {
    const capos = keyHelpers.getCapos('eb');

    expect(capos).toEqual({
      1: 'D', 3: 'C', 6: 'A', 8: 'G',
    });
  });
});
