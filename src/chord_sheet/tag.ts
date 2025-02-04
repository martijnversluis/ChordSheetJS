import AstComponent from './ast_component';
import TraceInfo from './trace_info';
import ChordDefinition from '../chord_definition/chord_definition';
import {
  _KEY,
  ALBUM,
  ARRANGER,
  ARTIST,
  CAPO,
  CHORD_STYLE,
  CHORDCOLOUR,
  CHORDFONT,
  CHORDSIZE,
  CHORUS,
  COMMENT,
  COMPOSER,
  COPYRIGHT,
  DURATION,
  END_OF_BRIDGE,
  END_OF_CHORUS,
  END_OF_GRID,
  END_OF_PART,
  END_OF_TAB,
  END_OF_VERSE,
  KEY,
  LYRICIST, NEW_KEY,
  SORTTITLE,
  START_OF_ABC,
  START_OF_BRIDGE,
  START_OF_CHORUS,
  START_OF_GRID,
  START_OF_LY,
  START_OF_PART,
  START_OF_TAB,
  START_OF_VERSE,
  SUBTITLE,
  TEMPO,
  TEXTCOLOUR,
  TEXTFONT,
  TEXTSIZE,
  TIME,
  TITLE,
  YEAR,
} from './tags';

import TagInterpreter from './tag_interpreter';
import { END_TAG, START_TAG } from '../constants';

const CHORDFONT_SHORT = 'cf';
const CHORDSIZE_SHORT = 'cs';
const COMMENT_SHORT = 'c';
const END_OF_BRIDGE_SHORT = 'eob';
const END_OF_CHORUS_SHORT = 'eoc';
const END_OF_GRID_SHORT = 'eog';
const END_OF_TAB_SHORT = 'eot';
const END_OF_VERSE_SHORT = 'eov';
const END_OF_PART_SHORT = 'eop';
const NEW_KEY_SHORT = 'nk';
const START_OF_BRIDGE_SHORT = 'sob';
const START_OF_CHORUS_SHORT = 'soc';
const START_OF_GRID_SHORT = 'sog';
const START_OF_TAB_SHORT = 'sot';
const START_OF_VERSE_SHORT = 'sov';
const START_OF_PART_SHORT = 'sop';
const SUBTITLE_SHORT = 'st';
const TEXTFONT_SHORT = 'tf';
const TEXTSIZE_SHORT = 'ts';
const TITLE_SHORT = 't';
const START_OF_PART_SHORTER = 'p';
const END_OF_PART_SHORTER = 'ep';

const RENDERABLE_TAGS = [COMMENT];

export const META_TAGS = [
  ALBUM,
  ARRANGER,
  ARTIST,
  CAPO,
  CHORD_STYLE,
  COMPOSER,
  COPYRIGHT,
  DURATION,
  KEY,
  LYRICIST,
  SORTTITLE,
  SUBTITLE,
  TEMPO,
  TIME,
  TITLE,
  YEAR,
];

export const READ_ONLY_TAGS = [_KEY];

const INLINE_FONT_TAGS = [
  CHORDFONT,
  CHORDSIZE,
  CHORDCOLOUR,
  TEXTFONT,
  TEXTSIZE,
  TEXTCOLOUR,
];

const DIRECTIVES_WITH_RENDERABLE_LABEL = [
  CHORUS,
  START_OF_ABC,
  START_OF_BRIDGE,
  START_OF_CHORUS,
  START_OF_GRID,
  START_OF_LY,
  START_OF_TAB,
  START_OF_VERSE,
  START_OF_PART,
];

const ALIASES: Record<string, string> = {
  [CHORDFONT_SHORT]: CHORDFONT,
  [CHORDSIZE_SHORT]: CHORDSIZE,
  [COMMENT_SHORT]: COMMENT,
  [END_OF_BRIDGE_SHORT]: END_OF_BRIDGE,
  [END_OF_CHORUS_SHORT]: END_OF_CHORUS,
  [END_OF_GRID_SHORT]: END_OF_GRID,
  [END_OF_TAB_SHORT]: END_OF_TAB,
  [END_OF_VERSE_SHORT]: END_OF_VERSE,
  [END_OF_PART_SHORT]: END_OF_PART,
  [END_OF_PART_SHORTER]: END_OF_PART,
  [NEW_KEY_SHORT]: NEW_KEY,
  [START_OF_BRIDGE_SHORT]: START_OF_BRIDGE,
  [START_OF_CHORUS_SHORT]: START_OF_CHORUS,
  [START_OF_GRID_SHORT]: START_OF_GRID,
  [START_OF_TAB_SHORT]: START_OF_TAB,
  [START_OF_VERSE_SHORT]: START_OF_VERSE,
  [START_OF_PART_SHORT]: START_OF_PART,
  [START_OF_PART_SHORTER]: START_OF_PART,
  [SUBTITLE_SHORT]: SUBTITLE,
  [TEXTFONT_SHORT]: TEXTFONT,
  [TEXTSIZE_SHORT]: TEXTSIZE,
  [TITLE_SHORT]: TITLE,
};

const TAG_REGEX = /^([^:\s]+)(:?\s*(.+))?$/;
const CUSTOM_META_TAG_NAME_REGEX = /^x_(.+)$/;

export function isReadonlyTag(tagName: string) {
  return READ_ONLY_TAGS.includes(tagName);
}

const translateTagNameAlias = (name: string) => {
  if (!name) {
    return name;
  }

  const sanitizedName = name.trim();

  if (sanitizedName in ALIASES) {
    return ALIASES[sanitizedName];
  }

  return sanitizedName;
};

/**
 * Represents a tag/directive. See https://www.chordpro.org/chordpro/chordpro-directives/
 */
class Tag extends AstComponent {
  _isMetaTag = false;

  _originalName = '';

  _name = '';

  _value = '';

  chordDefinition?: ChordDefinition;

  selector: string | null = null;

  isNegated = false;

  /**
   * The tag attributes. For example, section related tags can have a label:
   * `{start_of_verse: label="Verse 1"}`
   * @type {Record<string, string>}
   */
  attributes: Record<string, string> = {};

  constructor(
    name: string,
    value: string | null = null,
    traceInfo: TraceInfo | null = null,
    attributes: Record<string, string> = {},
    selector: string | null = null,
    isNegated = false,
  ) {
    super(traceInfo);
    this.parseNameValue(name, value);
    this.attributes = attributes;
    this.selector = selector;
    this.isNegated = isNegated;
  }

  private parseNameValue(name: string, value: string | null): void {
    if (name === 'meta') {
      this.parseMetaTag(value);
    } else {
      this.name = name;
      this.value = value || '';
    }
  }

  private parseMetaTag(value: string | null) {
    if (!value) {
      throw new Error('Expected value');
    }

    const [metaName, metaValue] = value.split(/\s(.+)/);
    this.name = metaName;
    this.value = metaValue || '';
    this._isMetaTag = true;
  }

  static parse(tag: string | Tag): Tag | null {
    if (tag instanceof Tag) {
      return tag;
    }

    return this.parseWithRegex(tag, TAG_REGEX);
  }

  static parseWithRegex(tag: string, regex: RegExp): Tag | null {
    const matches = tag.match(regex);

    if (matches !== null) {
      return new Tag(matches[1], matches[3] || null);
    }

    return null;
  }

  static parseOrFail(tag: string | Tag): Tag {
    const parsed = this.parse(tag);

    if (!parsed) {
      throw new Error(`Failed to parse ${tag}`);
    }

    return parsed;
  }

  get label() {
    const labelAttribute = this.attributes.label;

    if (labelAttribute && labelAttribute.length > 0) {
      return labelAttribute;
    }

    return this.value || '';
  }

  isSectionDelimiter(): boolean {
    return this.isSectionStart() || this.isSectionEnd();
  }

  isSectionStart(): boolean {
    const [tagType] = TagInterpreter.interpret(this.name, this.value);
    return tagType === START_TAG;
  }

  isSectionEnd(): boolean {
    const [tagType] = TagInterpreter.interpret(this.name, this.value);
    return tagType === END_TAG;
  }

  isInlineFontTag(): boolean {
    return INLINE_FONT_TAGS.includes(this.name);
  }

  set name(name) {
    this._name = translateTagNameAlias(name);
    this._originalName = name;
  }

  /**
   * The tag full name. When the original tag used the short name, `name` will return the full name.
   * @member
   * @type {string}
   */
  get name() {
    return this._name.trim();
  }

  /**
   * The original tag name that was used to construct the tag.
   * @member
   * @type {string}
   */
  get originalName() {
    return this._originalName.trim();
  }

  set value(value) {
    this._value = value || '';
  }

  /**
   * The tag value
   * @member
   * @type {string}
   */
  get value(): string {
    return `${this._value}`.trim();
  }

  /**
   * Checks whether the tag value is a non-empty string.
   * @returns {boolean}
   */
  hasValue(): boolean {
    return this.value.length > 0;
  }

  hasAttributes() {
    return Object.keys(this.attributes).length > 0;
  }

  hasLabel(): boolean {
    return this.label.length > 0;
  }

  /**
   * Checks whether the tag is usually rendered inline. It currently only applies to comment tags.
   * @returns {boolean}
   */
  isRenderable(): boolean {
    return RENDERABLE_TAGS.includes(this.name) || this.hasRenderableLabel();
  }

  /**
   * Check whether this tag's label (if any) should be rendered, as applicable to tags like
   * `start_of_verse` and `start_of_chorus`.
   * See https://chordpro.org/chordpro/directives-env_chorus/, https://chordpro.org/chordpro/directives-env_verse/,
   * https://chordpro.org/chordpro/directives-env_bridge/, https://chordpro.org/chordpro/directives-env_tab/
   */
  hasRenderableLabel(): boolean {
    return (DIRECTIVES_WITH_RENDERABLE_LABEL.includes(this.name) || this.isSectionStart()) && this.hasLabel();
  }

  /**
   * Checks whether the tag is either a standard meta tag or a custom meta directive (`{x_some_name}`)
   * @returns {boolean}
   */
  isMetaTag(): boolean {
    return this._isMetaTag || CUSTOM_META_TAG_NAME_REGEX.test(this.name) || META_TAGS.indexOf(this.name) !== -1;
  }

  /**
   * Returns a clone of the tag.
   * @returns {Tag} The cloned tag
   */
  clone(): Tag {
    return new Tag(this._originalName, this.value, null, this.attributes);
  }

  toString(): string {
    return `Tag(name=${this.name}, value=${this.value})`;
  }

  set({ value }: { value: string }): Tag {
    return new Tag(this._originalName, value, null, this.attributes);
  }

  setAttribute(name: string, value: string) {
    return new Tag(
      this._originalName,
      this.value,
      null,
      {
        ...this.attributes,
        [name]: value,
      },
    );
  }
}

export default Tag;
