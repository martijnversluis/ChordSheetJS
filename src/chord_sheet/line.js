import ChordLyricsPair from './chord_lyrics_pair';
import Tag from './tag';
import {pushNew} from '../utilities';

export default class Line {
  constructor() {
    this.chordLyricsPairs = [];
    this.currentChordLyricsPair = null;
  }

  addChordLyricsPair() {
    this.currentChordLyricsPair = pushNew(this.chordLyricsPairs, ChordLyricsPair);
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
    this.chordLyricsPairs.push(tag);
    return tag;
  }
}
