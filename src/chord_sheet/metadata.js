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
    Object.keys(metadata).forEach((key) => {
      const value = metadata[key];

      if (value instanceof Array) {
        this[key] = [...value];
      } else {
        this[key] = value;
      }
    });
  }

  add(key, value) {
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
   * @param prop the property name
   * @returns {Array<String>|String} the metadata value(s). If there is only one value, it will return a String,
   * else it returns an array of strings.
   */
  get(prop) {
    if (prop in this) {
      return this[prop];
    }

    const match = prop.match(/(.+)\.(\d+)$/);

    if (match) {
      const key = match[1];
      const index = parseInt(match[2], 10);

      if (key in this) {
        return (this[key] || [])[index - 1];
      }
    }

    return undefined;
  }

  /**
   * Returns a deep clone of this Metadata object
   * @returns {Metadata} the cloned Metadata object
   */
  clone() {
    return new Metadata(this);
  }
}

export default Metadata;
