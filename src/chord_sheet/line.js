import ChordLyricsPair from './chord_lyrics_pair';
import Tag from './tag';
import { CHORUS, NONE, VERSE } from '../constants';

export default class Line {
  constructor() {
    this.items = [];
    this.currentChordLyricsPair = null;
    this.type = NONE;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  addItem(item) {
    if (item instanceof Tag) {
      this.addTag(item);
    } else if (item instanceof ChordLyricsPair) {
      this.addChordLyricsPair(item);
    }
  }

  addChordLyricsPair(chords, lyrics) {
    if (chords instanceof ChordLyricsPair) {
      this.currentChordLyricsPair = chords;
    } else {
      this.currentChordLyricsPair = new ChordLyricsPair(chords, lyrics);
    }

    this.items.push(this.currentChordLyricsPair);
    return this.currentChordLyricsPair;
  }

  ensureChordLyricsPair() {
    if (!this.currentChordLyricsPair) {
      this.addChordLyricsPair();
    }
  }

  chords(chr) {
    this.ensureChordLyricsPair();
    this.currentChordLyricsPair.chords += chr;
  }

  lyrics(chr) {
    this.ensureChordLyricsPair();
    this.currentChordLyricsPair.lyrics += chr;
  }

  addTag(name, value) {
    const tag = (name instanceof Tag) ? name : new Tag(name, value);
    this.items.push(tag);
    return tag;
  }

  hasRenderableItems() {
    return this.items.some(item => item.isRenderable());
  }

  clone() {
    const clonedLine = new Line();
    clonedLine.items = this.items.map(item => item.clone());
    return clonedLine;
  }

  isVerse() {
    return this.type === VERSE;
  }

  isChorus() {
    return this.type === CHORUS;
  }

  hasContent() {
    return this.items.some(item => (item instanceof ChordLyricsPair) || (item instanceof Tag && item.isRenderable()));
  }
}
