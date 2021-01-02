/**
 * Album meta directive. See https://www.chordpro.org/chordpro/directives-album/
 * @type {string}
 */
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
 * Year meta directive. See https://www.chordpro.org/chordpro/directives-year/
 * @type {string}
 */
export const YEAR = 'year';

const TITLE_SHORT = 't';
const SUBTITLE_SHORT = 'st';
const COMMENT_SHORT = 'c';
const START_OF_CHORUS_SHORT = 'soc';
const END_OF_CHORUS_SHORT = 'eoc';

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

const ALIASES = {
  [TITLE_SHORT]: TITLE,
  [SUBTITLE_SHORT]: SUBTITLE,
  [COMMENT_SHORT]: COMMENT,
  [START_OF_CHORUS_SHORT]: START_OF_CHORUS,
  [END_OF_CHORUS_SHORT]: END_OF_CHORUS,
};

const META_TAG_REGEX = /^meta:\s*([^:\s]+)(\s*(.+))?$/;
const TAG_REGEX = /^([^:\s]+)(:?\s*(.+))?$/;
const CUSTOM_META_TAG_NAME_REGEX = /^x_(.+)$/;

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
class Tag {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(tag) {
    if (tag instanceof Tag) {
      return tag;
    }

    return this.parseWithRegex(tag, META_TAG_REGEX) || this.parseWithRegex(tag, TAG_REGEX);
  }

  static parseWithRegex(tag, regex) {
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
      return this._value.trim();
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
  isMetaTag() {
    return CUSTOM_META_TAG_NAME_REGEX.test(this.name) || META_TAGS.indexOf(this.name) !== -1;
  }

  /**
   * Returns a clone of the tag.
   * @returns {Tag} The cloned tag
   */
  clone() {
    return new Tag(this.name, this.value);
  }

  toString() {
    return `Tag(name=${this.name}, value=${this.name})`;
  }
}

export default Tag;
