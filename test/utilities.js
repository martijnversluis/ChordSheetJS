import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
import Line from '../src/chord_sheet/line';
import Tag from '../src/chord_sheet/tag';
import SongStub from './song_stub';
import { NONE } from '../src/constants';
import Paragraph from '../src/chord_sheet/paragraph';

export function createSong(lines, metaData) {
  const song = new SongStub(metaData);
  lines.forEach((line) => song.addLine(line));
  song.finish();
  return song;
}

export function createLine(items, type = NONE) {
  const line = new Line();
  items.forEach((item) => line.addItem(item));
  line.type = type;
  return line;
}

export function createParagraph(lines) {
  const paragraph = new Paragraph();
  lines.forEach((line) => paragraph.addLine(line));
  return paragraph;
}

export function createChordLyricsPair(chords, lyrics) {
  const chordLyricsPair = new ChordLyricsPair();
  chordLyricsPair.chords = chords;
  chordLyricsPair.lyrics = lyrics;
  return chordLyricsPair;
}

export function createTag(name, value) {
  const tag = new Tag();
  tag.name = name;
  tag.value = value;
  return tag;
}
