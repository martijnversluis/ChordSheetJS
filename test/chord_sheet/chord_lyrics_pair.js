import expect from 'expect';
import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';

describe('ChordLyricsPair', () => {
  describe('#clone', () => {
    it('returns a clone of the chord lyrics pair', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');
      const clonedChordLyricsPair = chordLyricsPair.clone();

      expect(clonedChordLyricsPair.chords).toEqual('C');
      expect(clonedChordLyricsPair.lyrics).toEqual('Let it');
    });
  });
});
