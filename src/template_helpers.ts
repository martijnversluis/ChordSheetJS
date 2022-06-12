import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';
import { INDETERMINATE, NONE } from './constants';
import { isEvaluatable } from './utilities';

interface EachCallback {
  (_item: any): string;
}

interface WhenCallback {
  (): string;
}

export { isEvaluatable } from './utilities';

export const isChordLyricsPair = (item) => item instanceof ChordLyricsPair;

export const lineHasContents = (line) => line.items.some((item) => item.isRenderable());

export const isTag = (item) => item instanceof Tag;

export const isComment = (item) => item.name === 'comment';

export function stripHTML(string: string): string {
  return string.trim().replace(/(<\/[a-z]+>)\s+(<)/g, '$1$2').replace(/(\n)\s+/g, '');
}

export function each(collection: any[], callback: EachCallback) {
  return collection.map(callback).join('');
}

export function when(condition: boolean, callback: WhenCallback) {
  return condition ? callback() : '';
}

export const hasTextContents = (line) => (
  line.items.some((item) => (
    (item instanceof ChordLyricsPair && item.lyrics)
    || (item instanceof Tag && item.isRenderable())
    || isEvaluatable(item)
  ))
);

export const lineClasses = (line) => {
  const classes = ['row'];

  if (!lineHasContents(line)) {
    classes.push('empty-line');
  }

  return classes.join(' ');
};

export const paragraphClasses = (paragraph) => {
  const classes = ['paragraph'];

  if (paragraph.type !== INDETERMINATE && paragraph.type !== NONE) {
    classes.push(paragraph.type);
  }

  return classes.join(' ');
};

export const evaluate = (item, metadata, configuration) => {
  if (!metadata) {
    throw new Error('cannot evaluate, metadata is null');
  }

  return item.evaluate(metadata, configuration.get('metadata.separator'));
};
