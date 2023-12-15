import { NUMERIC, SOLFEGE } from '../../src';
import { buildKey } from '../utilities';

describe('Key', () => {
  describe('toChordSolfegeString', () => {
    it('returns a string version of the chord solfege', () => {
      const songKey = buildKey('Mi', SOLFEGE);
      const key = buildKey(4, NUMERIC, '#');

      expect(key.toChordSolfegeString(songKey)).toEqual('La#');
    });
  });
});
