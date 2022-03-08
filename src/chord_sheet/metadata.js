import {
  _KEY,
  CAPO,
  KEY,
  isReadonlyTag,
} from './tag';

import Chord from '../chord';

function appendValue(array, key, value) {
  if (!array.includes(value)) {
    array.push(value);
  }
}

/**
 * Stores song metadata. Properties can be accessed using the get() method:
 *
 * const metadata = new Metadata({ author: 'John' });
 * metadata.get('author')   // => 'John'
 *
 * See {@link Metadata#get}
 */
class Metadata {
  constructor(metadata = {}) {
    Object
      .keys(metadata)
      .filter((key) => !isReadonlyTag(key))
      .forEach((key) => {
        const value = metadata[key];

        if (value instanceof Array) {
          this[key] = [...value];
        } else {
          this[key] = value;
        }
      });
  }

  contains(key) {
    return key in this;
  }

  add(key, value) {
    if (isReadonlyTag(key)) {
      return;
    }

    if (!(key in this)) {
      this[key] = value;
      return;
    }

    const currentValue = this[key];

    if (currentValue === value) {
      return;
    }

    if (currentValue instanceof Array) {
      appendValue(currentValue, key, value);
      return;
    }

    this[key] = [currentValue, value];
  }

  set(key, value) {
    if (value) {
      this[key] = value;
    } else {
      delete this[key];
    }
  }

  /**
   * Reads a metadata value by key. This method supports simple value lookup, as fetching single array values.
   *
   * This method deprecates direct property access, eg: metadata['author']
   *
   * Examples:
   *
   * const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
   * metadata.get('lyricist') // => 'Pete'
   * metadata.get('author')   // => ['John', 'Mary']
   * metadata.get('author.1') // => 'John'
   * metadata.get('author.2') // => 'Mary'
   *
   * Using a negative index will start counting at the end of the list:
   *
   * const metadata = new Metadata({ lyricist: 'Pete', author: ['John', 'Mary'] });
   * metadata.get('author.-1') // => 'Mary'
   * metadata.get('author.-2') // => 'John'
   *
   * @param prop the property name
   * @returns {Array<String>|String} the metadata value(s). If there is only one value, it will return a String,
   * else it returns an array of strings.
   */
  get(prop) {
    if (prop === _KEY) {
      return this.calculateKeyFromCapo();
    }

    if (prop in this) {
      return this[prop];
    }

    return this.getArrayItem(prop);
  }

  parseArrayKey(prop) {
    const match = prop.match(/(.+)\.(-?\d+)$/);

    if (!match) {
      return [];
    }

    const key = match[1];
    const index = parseInt(match[2], 10);
    return [key, index];
  }

  getArrayItem(prop) {
    const [key, index] = this.parseArrayKey(prop);

    if (!(key && index)) {
      return undefined;
    }

    const arrayValue = (this[key] || []);
    let itemIndex = index;

    if (itemIndex < 0) {
      itemIndex = arrayValue.length + itemIndex;
    } else if (itemIndex > 0) {
      itemIndex -= 1;
    }

    return arrayValue[itemIndex];
  }

  /**
   * Returns a deep clone of this Metadata object
   * @returns {Metadata} the cloned Metadata object
   */
  clone() {
    return new Metadata(this);
  }

  calculateKeyFromCapo() {
    const capo = this.get(CAPO);
    const key = this.get(KEY);

    if (capo && key) {
      return Chord.parse(key).transpose(parseInt(capo, 10)).toString();
    }

    return undefined;
  }
}

export default Metadata;
