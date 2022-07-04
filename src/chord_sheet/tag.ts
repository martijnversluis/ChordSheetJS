/**
 * Album meta directive. See https://www.chordpro.org/chordpro/directives-album/
 * @type {string}
 */
import AstComponent from './ast_component';
import TraceInfo from './trace_info';

export const ALBUM = 'album';

/**
 * Artist meta directive. See https://www.chordpro.org/chordpro/directives-artist/
 * @type {string}
 */
export const ARTIST = 'artist';

/**
 * Capo meta directive. See https://www.chordpro.org/chordpro/directives-capo/
 * @type {string}
 */
export const CAPO = 'capo';

/**
 * Comment directive. See https://www.chordpro.org/chordpro/directives-comment/
 * @type {string}
 */
export const COMMENT = 'comment';

/**
 * Composer meta directive. See https://www.chordpro.org/chordpro/directives-composer/
 * @type {string}
 */
export const COMPOSER = 'composer';

/**
 * Copyright meta directive. See https://www.chordpro.org/chordpro/directives-copyright/
 * @type {string}
 */
export const COPYRIGHT = 'copyright';

/**
 * Duration meta directive. See https://www.chordpro.org/chordpro/directives-duration/
 * @type {string}
 */
export const DURATION = 'duration';

/**
 * End of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/
 * @type {string}
 */
export const END_OF_CHORUS = 'end_of_chorus';

/**
 * End of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/
 * @type {string}
 */
export const END_OF_TAB = 'end_of_tab';

/**
 * End of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/
 * @type {string}
 */
export const END_OF_VERSE = 'end_of_verse';

/**
 * Key meta directive. See https://www.chordpro.org/chordpro/directives-key/
 * @type {string}
 */
export const KEY = 'key';

/**
 * _Key meta directive. Reflects the key as transposed by the capo value
 * See https://www.chordpro.org/chordpro/directives-key/
 * @type {string}
 */
export const _KEY = '_key';

/**
 * Lyricist meta directive. See https://www.chordpro.org/chordpro/directives-lyricist/
 * @type {string}
 */
export const LYRICIST = 'lyricist';

/**
 * Start of chorus directive. See https://www.chordpro.org/chordpro/directives-env_chorus/
 * @type {string}
 */
export const START_OF_CHORUS = 'start_of_chorus';

/**
 * Start of tab directive. See https://www.chordpro.org/chordpro/directives-env_tab/
 * @type {string}
 */
export const START_OF_TAB = 'start_of_tab';

/**
 * Start of verse directive. See https://www.chordpro.org/chordpro/directives-env_verse/
 * @type {string}
 */
export const START_OF_VERSE = 'start_of_verse';

/**
 * Subtitle meta directive. See https://www.chordpro.org/chordpro/directives-subtitle/
 * @type {string}
 */
export const SUBTITLE = 'subtitle';

/**
 * Tempo meta directive. See https://www.chordpro.org/chordpro/directives-tempo/
 * @type {string}
 */
export const TEMPO = 'tempo';

/**
 * Time meta directive. See https://www.chordpro.org/chordpro/directives-time/
 * @type {string}
 */
export const TIME = 'time';

/**
 * Title meta directive. See https://www.chordpro.org/chordpro/directives-title/
 * @type {string}
 */
export const TITLE = 'title';

/**
 * Transpose meta directive. See: https://www.chordpro.org/chordpro/directives-transpose/
 * @type {string}
 */
export const TRANSPOSE = 'transpose';
/**
 * New Key meta directive. See: https://github.com/PraiseCharts/ChordChartJS/issues/53
 * @type {string}
 */
export const NEW_KEY = 'new_key';

/**
 * Year meta directive. See https://www.chordpro.org/chordpro/directives-year/
 * @type {string}
 */
export const YEAR = 'year';

const TITLE_SHORT = 't';
const SUBTITLE_SHORT = 'st';
const COMMENT_SHORT = 'c';
const START_OF_CHORUS_SHORT = 'soc';
const END_OF_CHORUS_SHORT = 'eoc';
const START_OF_TAB_SHORT = 'sot';
const END_OF_TAB_SHORT = 'eot';
const NEW_KEY_SHORT = 'nk';

const RENDERABLE_TAGS = [COMMENT];

export const META_TAGS = [
  ALBUM,
  ARTIST,
  CAPO,
  COMPOSER,
  COPYRIGHT,
  DURATION,
  KEY,
  LYRICIST,
  TEMPO,
  TIME,
  TITLE,
  SUBTITLE,
  YEAR,
];

export const READ_ONLY_TAGS = [_KEY];

const ALIASES = {
  [TITLE_SHORT]: TITLE,
  [SUBTITLE_SHORT]: SUBTITLE,
  [COMMENT_SHORT]: COMMENT,
  [START_OF_CHORUS_SHORT]: START_OF_CHORUS,
  [END_OF_CHORUS_SHORT]: END_OF_CHORUS,
  [START_OF_TAB_SHORT]: START_OF_TAB,
  [END_OF_TAB_SHORT]: END_OF_TAB,
  [NEW_KEY_SHORT]: NEW_KEY,
};

const TAG_REGEX = /^([^:\s]+)(:?\s*(.+))?$/;
const CUSTOM_META_TAG_NAME_REGEX = /^x_(.+)$/;

export function isReadonlyTag(tagName) {
  return READ_ONLY_TAGS.includes(tagName);
}

const translateTagNameAlias = (name) => {
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
  _originalName: string;

  _name: string;

  _value?: string;

  _isMetaTag: boolean = false;

  constructor(name, value = '', traceInfo: TraceInfo = null) {
    super(traceInfo);
    this.parseNameValue(name, value);
  }

  private parseNameValue(name: string, value: string | null): void {
    if (name === 'meta') {
      const [metaName, metaValue] = value.split(/\s(.+)/);
      this.name = metaName;
      this.value = metaValue || '';
      this._isMetaTag = true;
    } else {
      this.name = name;
      this.value = value || '';
    }
  }

  static parse(tag: string | Tag): Tag {
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
    this._value = value;
  }

  /**
   * The tag value
   * @member
   * @type {string|null}
   */
  get value() {
    if (this._value) {
      return `${this._value}`.trim();
    }

    return this._value || null;
  }

  /**
   * Checks whether the tag value is a non-empty string.
   * @returns {boolean}
   */
  hasValue() {
    return this.value !== null && this.value.trim().length > 0;
  }

  /**
   * Checks whether the tag is usually rendered inline. It currently only applies to comment tags.
   * @returns {boolean}
   */
  isRenderable() {
    return RENDERABLE_TAGS.indexOf(this.name) !== -1;
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
  clone() {
    return new Tag(this._originalName, this.value);
  }

  toString() {
    return `Tag(name=${this.name}, value=${this.name})`;
  }

  set({ value }) {
    return new Tag(this._originalName, value);
  }

  setValue(value: string) {
    return this.set({ value });
  }
}

export default Tag;
