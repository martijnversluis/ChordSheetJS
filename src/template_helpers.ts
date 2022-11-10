import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';
import { INDETERMINATE, NONE } from './constants';
import { isEmptyString, isEvaluatable } from './utilities';
import Item from './chord_sheet/item';
import Line from './chord_sheet/line';
import Paragraph from './chord_sheet/paragraph';
import Metadata from './chord_sheet/metadata';
import Configuration from './formatter/configuration/configuration';
import Evaluatable from './chord_sheet/chord_pro/evaluatable';

interface EachCallback {
  (_item: any): string;
}

interface WhenCallback {
  (): string;
}

export { isEvaluatable } from './utilities';

export const isChordLyricsPair = (item: Item): boolean => item instanceof ChordLyricsPair;

export const lineHasContents = (line: Line): boolean => line.items.some((item: Item) => item.isRenderable());

export const isTag = (item: Item): boolean => item instanceof Tag;

export const isComment = (item: Tag): boolean => item.name === 'comment';

export function stripHTML(string: string): string {
  return string.trim().replace(/(<\/[a-z]+>)\s+(<)/g, '$1$2').replace(/(\n)\s+/g, '');
}

export function each(collection: any[], callback: EachCallback): string {
  return collection.map(callback).join('');
}

export function when(condition: any, callback: WhenCallback): string {
  return condition ? callback() : '';
}

export const hasTextContents = (line: Line): boolean => (
  line.items.some((item) => (
    (item instanceof ChordLyricsPair && !isEmptyString(item.lyrics))
    || (item instanceof Tag && item.isRenderable())
    || isEvaluatable(item)
  ))
);

export const lineClasses = (line: Line): string => {
  const classes = ['row'];

  if (!lineHasContents(line)) {
    classes.push('empty-line');
  }

  return classes.join(' ');
};

export const paragraphClasses = (paragraph: Paragraph): string => {
  const classes = ['paragraph'];

  if (paragraph.type !== INDETERMINATE && paragraph.type !== NONE) {
    classes.push(paragraph.type);
  }

  return classes.join(' ');
};

export const evaluate = (item: Evaluatable, metadata: Metadata, configuration: Configuration): string => {
  if (!metadata) {
    throw new Error('cannot evaluate, metadata is null');
  }

  return item.evaluate(metadata, configuration.get('metadata.separator'));
};
