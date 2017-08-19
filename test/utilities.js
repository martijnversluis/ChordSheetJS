import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
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
