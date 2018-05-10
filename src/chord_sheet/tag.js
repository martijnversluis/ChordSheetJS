const META_TAGS = ['title', 'subtitle'];
const RENDERABLE_TAGS = ['comment'];

const ALIASES = {
  t: 'title',
  st: 'subtitle',
  c: 'comment',
};

const TAG_REGEX = /^([^:\s]+)(:?\s*(.+))?$/;

const translateTagNameAlias = (name) => {
  if (name in ALIASES) {
    return ALIASES[name];
  }

  return name;
};

export default class Tag {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(tag) {
    const matches = tag.match(TAG_REGEX);

    if (matches.length) {
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
    return META_TAGS.indexOf(this.name) !== -1;
  }

  clone() {
    return new Tag(this.name, this.value);
  }
}
