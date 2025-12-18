import { buildKey } from '../util/utilities';
import { NUMERIC, SOLFEGE } from '../../src';

describe('Key', () => {
  describe('toChordSolfegeString', () => {
    it('returns a string version of the chord solfege', () => {
      const songKey = buildKey('Mi', SOLFEGE);
      const key = buildKey(4, NUMERIC, '#');

      expect(key.toChordSolfegeString(songKey)).toEqual('La#');
    });
  });
});
