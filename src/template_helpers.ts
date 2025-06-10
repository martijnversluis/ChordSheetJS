import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Evaluatable from './chord_sheet/chord_pro/evaluatable';
import Font from './chord_sheet/font';
import Item from './chord_sheet/item';
import Line from './chord_sheet/line';
import Metadata from './chord_sheet/metadata';
import Paragraph from './chord_sheet/paragraph';
import Tag from './chord_sheet/tag';
import When from './template_helpers/when';
import WhenCallback from './template_helpers/when_callback';

import Configuration, { Delegate, defaultDelegate } from './formatter/configuration';

import { HtmlTemplateCssClasses } from './formatter/html_formatter';
import { Literal } from './index';
import { renderChord } from './helpers';
import { INDETERMINATE, NONE } from './constants';
import { hasChordContents, isEmptyString, isEvaluatable } from './utilities';

type EachCallback = (_item: any) => string;

export { hasChordContents, isEvaluatable } from './utilities';
export { renderChord } from './helpers';

export function isChordLyricsPair(item: Item): boolean {
  return item instanceof ChordLyricsPair;
}

export function lineHasContents(line: Line): boolean {
  return line.items.some((item: Item) => item.isRenderable());
}

export function isTag(item: Item): boolean {
  return item instanceof Tag;
}

export function isLiteral(item: Item): boolean {
  return item instanceof Literal;
}

export function isComment(item: Tag): boolean {
  return item.name === 'comment';
}

export function stripHTML(string: string): string {
  return string
    .trim()
    .replace(/(<\/[a-z]+>)\s+(<)/g, '$1$2')
    .replace(/(>)\s+(<\/[a-z]+>)/g, '$1$2')
    .replace(/(\n)\s+/g, '');
}

export function newlinesToBreaks(string: string): string {
  return string.replace(/\n/g, '<br>');
}

export function renderSection(paragraph: Paragraph, configuration: Configuration): string {
  const delegate: Delegate = configuration.delegates[paragraph.type] || defaultDelegate;

  return delegate(paragraph.contents);
}

export function each(collection: any[], callback: EachCallback): string {
  return collection.map(callback).join('');
}

export function when(condition: any, callback?: WhenCallback): When {
  return new When(condition, callback);
}

export function hasTextContents(line: Line): boolean {
  return line.items.some((item) => (
    (item instanceof ChordLyricsPair && !isEmptyString(item.lyrics)) ||
    (item instanceof Tag && item.isRenderable()) ||
    isEvaluatable(item)
  ));
}

export function lineClasses(line: Line, cssClasses: HtmlTemplateCssClasses): string {
  const classes = [cssClasses.row];

  if (!lineHasContents(line)) {
    classes.push(cssClasses.emptyLine);
  }

  return classes.join(' ');
}

export function paragraphClasses(paragraph: Paragraph, cssClasses: HtmlTemplateCssClasses): string {
  const classes = [cssClasses.paragraph];

  if (paragraph.type !== INDETERMINATE && paragraph.type !== NONE) {
    classes.push(paragraph.type);
  }

  return classes.join(' ');
}

export function evaluate(item: Evaluatable, metadata: Metadata, configuration: Configuration): string {
  return item.evaluate(metadata, configuration.metadata.separator);
}

export function fontStyleTag(font: Font): string {
  const cssString = font.toCssString();

  if (cssString) {
    return ` style="${cssString}"`;
  }

  return '';
}

export default {
  isEvaluatable,
  isChordLyricsPair,
  lineHasContents,
  isTag,
  isComment,
  stripHTML,
  each,
  when,
  hasTextContents,
  lineClasses,
  paragraphClasses,
  evaluate,
  fontStyleTag,
  renderChord,
  hasChordContents,
};
