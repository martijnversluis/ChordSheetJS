import '../matchers';
import { NUMERIC } from '../../src';
import Note from '../../src/note';

describe('Note', () => {
  describe('constructor', () => {
    it('assigns the right instance variables', () => {
      const note = new Note({
        note: 5,
        type: NUMERIC,
        minor: true,
      });

      expect(note).toBeNote({
        note: 5,
        type: NUMERIC,
        minor: true,
      });
    });
  });
});
