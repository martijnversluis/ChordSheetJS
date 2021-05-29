import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';

export const pushNew = (collection, Klass) => {
  const newObject = new Klass();
  collection.push(newObject);
  return newObject;
};

export const hasChordContents = (line) => line.items.some((item) => item instanceof ChordLyricsPair && item.chords);

export const isEvaluatable = (item) => typeof item.evaluate === 'function';

export const hasTextContents = (line) => (
  line.items.some((item) => (
    (item instanceof ChordLyricsPair && item.lyrics)
      || (item instanceof Tag && item.isRenderable())
      || isEvaluatable(item)
  ))
);

export const padLeft = (str, length) => {
  let paddedString = str;
  for (let l = str.length; l < length; l += 1, paddedString += ' ');
  return paddedString;
};

export const deprecate = (message) => {
  if (process && process.emitWarning) {
    process.emitWarning(message);
  }
};

export const isPresent = (object) => object && object.length > 0;

export const presence = (object) => (isPresent(object) ? object : null);

function dasherize(string) {
  return string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function scopeCss(css, scope) {
  return Object
    .entries(css)
    .map(([selector, styles]) => {
      const rules = Object
        .entries(styles)
        .map(([property, value]) => `${dasherize(property)}: ${value};`)
        .join('\n  ');

      const scopedSelector = `${scope} ${selector}`.trim();

      return `
${scopedSelector} {
  ${rules}
}`.substring(1);
    })
    .join('\n\n');
}
