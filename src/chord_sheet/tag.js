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
    this._name = translateTagNameAlias(name);
    this._value = value;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name.trim();
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value.trim();
  }

  isMetaTag() {
    return META_TAGS.indexOf(this.name) !== -1;
  }
}
