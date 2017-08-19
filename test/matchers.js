import expect from 'expect'
import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
import Tag from '../src/chord_sheet/tag';

expect.extend({
  toBeChordLyricsPair(chords, lyrics) {
    expect(this.actual).toBeA(ChordLyricsPair);
    expect(this.actual.chords).toEqual(chords);
    expect(this.actual.lyrics).toEqual(lyrics);
  },

  toBeTag(name, value) {
    expect(this.actual).toBeA(Tag);
    expect(this.actual.name).toEqual(name);
    expect(this.actual.value).toEqual(value);
  }
})
