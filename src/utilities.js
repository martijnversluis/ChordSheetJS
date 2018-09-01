import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';

export const pushNew = (collection, Klass) => {
  const newObject = new Klass();
  collection.push(newObject);
  return newObject;
};

export const hasChordContents = line => line.items.some(item => item instanceof ChordLyricsPair && item.chords);

export const hasTextContents = line => (
  line.items.some(item => (
    item instanceof ChordLyricsPair && item.lyrics) || (item instanceof Tag && item.isRenderable()
  ))
);

export const padLeft = (str, length) => {
  let paddedString = str;
  for (let l = str.length; l < length; l += 1, paddedString += ' ');
  return paddedString;
};
