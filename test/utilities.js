import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
import Line from '../src/chord_sheet/line';
import Tag from '../src/chord_sheet/tag';
import SongStub from './song_stub';

export function createSong(lines, metaData) {
  const song = new SongStub(metaData);
  lines.forEach(line => song.addLine(line));
  song.finish();
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
