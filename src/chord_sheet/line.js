import Item from './item';
import Tag from './tag';
import {pushNew} from '../utilities';

export default class Line {
  constructor() {
    this.items = [];
    this.currentItem = null;
  }

  addItem() {
    this.currentItem = pushNew(this.items, Item);
    return this.currentItem;
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
    const tag = (name instanceof Tag) ? name : new Tag(name, value);
    this.items.push(tag);
    return tag;
  }
}
