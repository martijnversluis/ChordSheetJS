const META_TAGS = ['title', 'subtitle'];

const ALIASES = {
  t: 'title',
  st: 'subtitle'
};

const translateTagNameAlias = function (name) {
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
    return this._value.trim();
  }

  hasValue() {
    return !!this._value.trim().length;
  }

  isMetaTag() {
    return META_TAGS.indexOf(this.name) !== -1;
  }
}
