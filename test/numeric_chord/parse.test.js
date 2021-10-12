import { parseChord } from '../../src';

import '../matchers';

describe('NumericChord', () => {
  describe('parse', () => {
    describe('numeric chord without bass', () => {
      it('parses a simple numeric chord', () => {
        const chord = parseChord('4');
        expect(chord).toBeChord(4, null, null, null, null);
      });

      it('parses a numeric chord with suffix', () => {
        const chord = parseChord('4sus4');
        expect(chord).toBeChord(4, null, 'sus4', null, null);
      });

      it('parses a numeric chord with modifier', () => {
        const chord = parseChord('#4');
        expect(chord).toBeChord(4, '#', null, null, null);
      });

      it('parses a numeric chord with modifier and suffix', () => {
        const chord = parseChord('#4sus4');
        expect(chord).toBeChord(4, '#', 'sus4', null, null);
      });

      it('parses a numeric chord with confusing suffix', () => {
        const chord = parseChord('4maj9#11');
        expect(chord).toBeChord(4, null, 'maj9#11', null, null);
      });

      it('parses a numeric chord with modifier and confusing suffix', () => {
        const chord = parseChord('#4maj9b11');
        expect(chord).toBeChord(4, '#', 'maj9b11', null, null);
      });
    });

    describe('numeric chord with bass', () => {
      it('parses a simple numeric chord', () => {
        const chord = parseChord('4/1');
        expect(chord).toBeChord(4, null, null, 1, null);
      });

      it('parses a numeric chord with suffix', () => {
        const chord = parseChord('4sus4/1');
        expect(chord).toBeChord(4, null, 'sus4', 1, null);
      });

      it('parses a numeric chord with modifier', () => {
        const chord = parseChord('#4/#1');
        expect(chord).toBeChord(4, '#', null, 1, '#');
      });

      it('parses a numeric chord with modifier and suffix', () => {
        const chord = parseChord('#4sus4/#1');
        expect(chord).toBeChord(4, '#', 'sus4', 1, '#');
      });

      it('parses a numeric chord with confusing suffix', () => {
        const chord = parseChord('4maj9#11/#1');
        expect(chord).toBeChord(4, null, 'maj9#11', 1, '#');
      });

      it('parses a numeric chord with modifier and confusing suffix', () => {
        const chord = parseChord('#4maj9b11/#1');
        expect(chord).toBeChord(4, '#', 'maj9b11', 1, '#');
      });
    });

    describe('when a chord can not be parsed', () => {
      it('returns null', () => {
        const chord = parseChord('oobar');
        expect(chord).toBeNull();
      });
    });
  });
});
