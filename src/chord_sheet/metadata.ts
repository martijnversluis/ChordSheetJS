import Chord from '../chord';
import MetadataAccessors from './metadata_accessors';

import {
  _KEY,
  CAPO,
  KEY,
  isReadonlyTag,
} from './tag';

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
class Metadata extends MetadataAccessors {
  metadata: Record<string, string | string[]> = {};

  constructor(metadata = null) {
    super();

    Object
      .keys(metadata || {})
      .filter((key) => !isReadonlyTag(key))
      .forEach((key) => {
        const value = metadata[key];

        if (value instanceof Array) {
          this.metadata[key] = [...value];
        } else {
          this.metadata[key] = value;
        }
      });
  }

  contains(key) {
    return key in this.metadata;
  }

  add(key, value) {
    if (isReadonlyTag(key)) {
      return;
    }

    if (!(key in this.metadata)) {
      this.metadata[key] = value;
      return;
    }

    const currentValue = this.metadata[key];

    if (currentValue === value) {
      return;
    }

    if (currentValue instanceof Array) {
      appendValue(currentValue, key, value);
      return;
    }

    this.metadata[key] = [currentValue, value];
  }

  set(key, value) {
    if (value) {
      this.metadata[key] = value;
    } else {
      delete this.metadata[key];
    }
  }

  getMetadata(name: string): string | string[] {
    return this.get(name);
  }

  getSingleMetadata(name: string): string {
    return this.getSingle(name);
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

    if (prop in this.metadata) {
      return this.metadata[prop];
    }

    return this.getArrayItem(prop);
  }

  /**
   * Returns a single metadata value. If the actual value is an array, it returns the first value. Else, it returns
   * the value.
   * @ignore
   * @param {string} prop the property name
   * @returns {String} The metadata value
   */
  getSingle(prop) {
    const value = this.get(prop);

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
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

    const arrayValue = (this.metadata[key] || []);
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
    return new Metadata(this.metadata);
  }

  calculateKeyFromCapo() {
    const capo = this.getSingle(CAPO);
    const key = this.getSingle(KEY);

    if (capo && key) {
      return Chord.parse(key).transpose(parseInt(capo, 10)).toString();
    }

    return undefined;
  }
}

export default Metadata;
