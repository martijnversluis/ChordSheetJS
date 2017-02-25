import Item from './item';
import Tag from './tag';

export default class Line {
  constructor() {
    this.items = [];
    this.currentItem = null;
  }

  addItem() {
    const item = new Item();
    this.items.push(item);
    this.currentItem = item;
    return item;
  }

  ensureItem() {
    if (!this.currentItem) {
      this.addItem();
    }
  }

  chords(chr) {
    this.ensureItem();
    this.currentItem.chords += chr;
  }

  lyrics(chr) {
    this.ensureItem();
    this.currentItem.lyrics += chr;
  }

  addTag(name, value) {
    const tag = new Tag(name, value);
    this.items.push(tag);
    return tag;
  }
}
