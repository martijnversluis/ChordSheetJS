import expect from 'expect'
import Item from '../lib/chord_sheet/item';
import Tag from '../lib/chord_sheet/tag';

expect.extend({
  toBeItem(chords, lyrics) {
    expect(this.actual).toBeA(Item);
    expect(this.actual.chords).toEqual(chords);
    expect(this.actual.lyrics).toEqual(lyrics);
  },

  toBeTag(name, value) {
    expect(this.actual).toBeA(Tag);
    expect(this.actual.name).toEqual(name);
    expect(this.actual.value).toEqual(value);
  }
})
