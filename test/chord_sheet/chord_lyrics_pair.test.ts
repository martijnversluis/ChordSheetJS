import { ChordLyricsPair } from '../../src';

describe('ChordLyricsPair', () => {
  describe('#clone', () => {
    it('returns a clone of the chord lyrics pair', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');
      const clonedChordLyricsPair = chordLyricsPair.clone();

      expect(clonedChordLyricsPair.chords).toEqual('C');
      expect(clonedChordLyricsPair.lyrics).toEqual('Let it');
    });
  });

  describe('#isRenderable', () => {
    it('returns true', () => {
      const chordLyricsPair = new ChordLyricsPair();

      expect(chordLyricsPair.isRenderable()).toBe(true);
    });
  });

  describe('#transpose', () => {
    it('transposes and normalizes the chord', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1, 'Db');

      expect(transposedPair.chords).toEqual('Gb');
    });

    it('can transpose without key', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1);

      expect(transposedPair.chords).toEqual('F#');
    });
  });

  describe('#hasLyrics', () => {
    it('returns true if there are lyrics', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');

      expect(chordLyricsPair.hasLyrics()).toBe(true);
    });

    it('returns false when the lyrics are falsy', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });

    it('returns false when the lyrics are only whitespace', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '   ');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });
  });
});
