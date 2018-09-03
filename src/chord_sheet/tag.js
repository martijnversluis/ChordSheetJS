export const ALBUM = 'album';
export const ARTIST = 'artist';
export const CAPO = 'capo';
export const COMMENT = 'comment';
export const COMPOSER = 'composer';
export const COPYRIGHT = 'copyright';
export const DURATION = 'duration';
export const END_OF_CHORUS = 'end_of_chorus';
export const END_OF_VERSE = 'end_of_verse';
export const KEY = 'key';
export const LYRICIST = 'lyricist';
export const START_OF_CHORUS = 'start_of_chorus';
export const START_OF_VERSE = 'start_of_verse';
export const SUBTITLE = 'subtitle';
export const TEMPO = 'tempo';
export const TIME = 'time';
export const TITLE = 'title';
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

export default class Tag {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(tag) {
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

  get name() {
    return this._name.trim();
  }

  get originalName() {
    return this._originalName.trim();
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    if (this._value) {
      return this._value.trim();
    }

    return this._value || null;
  }

  hasValue() {
    return this.value !== null && this.value.trim().length > 0;
  }

  isRenderable() {
    return RENDERABLE_TAGS.indexOf(this.name) !== -1;
  }

  isMetaTag() {
    return CUSTOM_META_TAG_NAME_REGEX.test(this.name) || META_TAGS.indexOf(this.name) !== -1;
  }

  clone() {
    return new Tag(this.name, this.value);
  }

  toString() {
    return `Tag(name=${this.name}, value=${this.name})`;
  }
}
