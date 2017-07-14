import Item from '../src/chord_sheet/item';
import Line from '../src/chord_sheet/line';
import Song from '../src/chord_sheet/song';
import Tag from '../src/chord_sheet/tag';

export function createSong(lines, metaData) {
  const song = new Song(metaData);
  song.lines = lines;
  return song;
}

export function createLine(items) {
  const line = new Line();
  line.items = items;
  return line;
}

export function createItem(chords, lyrics) {
  const item = new Item();
  item.chords = chords;
  item.lyrics = lyrics;
  return item;
}

export function createTag(name, value) {
  const tag = new Tag();
  tag.name = name;
  tag.value = value;
  return tag;
}
