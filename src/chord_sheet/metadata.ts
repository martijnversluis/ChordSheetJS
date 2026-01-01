import Key from '../key';
import MetadataAccessors from './metadata_accessors';
import { isReadonlyTag } from './tag';
import { CAPO, KEY, _KEY } from './tags';

function appendValue(array: string[], value: string): void {
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
class Metadata extends MetadataAccessors implements Iterable<[string, string | string[]]> {
  metadata: Record<string, string | string[]> = {};

  constructor(metadata: Record<string, string | string[]> | Metadata = {}) {
    super();

    if (metadata instanceof Metadata) {
      this.assign(metadata.metadata);
    } else {
      this.assign(metadata);
    }
  }

  merge(metadata: Record<string, string | string[]> | Metadata = {}): Metadata {
    const clone = this.clone();
    if (metadata instanceof Metadata) {
      clone.assign(metadata.metadata);
    } else {
      clone.assign(metadata);
    }
    return clone;
  }

  contains(key: string): boolean {
    return key in this.metadata;
  }

  add(key: string, value: string): void {
    if (isReadonlyTag(key)) {
      return;
    }

    if (!(key in this.metadata)) {
      this.metadata[key] = value;
      return;
    }

    this.appendValue(key, value);
  }

  appendValue(key: string, value: string): void {
    const currentValue = this.metadata[key];

    if (currentValue === value) {
      return;
    }

    if (currentValue instanceof Array) {
      appendValue(currentValue, value);
      return;
    }

    this.metadata[key] = [currentValue, value];
  }

  set(key: string, value: string | null): void {
    if (value) {
      this.metadata[key] = value;
    } else {
      delete this.metadata[key];
    }
  }

  getMetadataValue(name: string): string | string[] | null {
    return this.get(name);
  }

  getSingleMetadataValue(name: string): string | null {
    return this.getSingle(name);
  }

  /**
   * Reads a metadata value by key. This method supports simple value lookup, as well as fetching single array values.
   *
   * This method deprecates direct property access, eg: metadata['author']
   *
   * @example
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
  get(prop: string): string | string[] | null {
    if (prop === _KEY) {
      return this.calculateKeyFromCapo();
    }

    if (prop in this.metadata) {
      return this.metadata[prop];
    }

    return this.getArrayItem(prop);
  }

  /**
   * Returns all metadata values, including generated values like `_key`.
   * @returns {Object.<string, string|string[]>} the metadata values
   */
  all(): Record<string, string | string[]> {
    const all = { ...this.metadata };
    const key = this.calculateKeyFromCapo();

    if (key) {
      all[_KEY] = key;
    }

    return all;
  }

  [Symbol.iterator](): IterableIterator<[string, string | string[]]> {
    return Object.entries(this.all())[Symbol.iterator]();
  }

  /**
   * Returns a single metadata value. If the actual value is an array, it returns the first value. Else, it returns
   * the value.
   * @ignore
   * @param {string} prop the property name
   * @returns {String} The metadata value
   */
  getSingle(prop: string): string | null {
    const value = this.get(prop);

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  parseArrayKey(prop: string): [string, number] | null {
    const match = prop.match(/(.+)\.(-?\d+)$/);

    if (!match) {
      return null;
    }

    const key = match[1];
    const index = parseInt(match[2], 10);
    return [key, index];
  }

  getArrayItem(prop: string): string | null {
    const parsedKey = this.parseArrayKey(prop);

    if (parsedKey === null) {
      return null;
    }

    const [key, index] = parsedKey;
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
  clone(): Metadata {
    return new Metadata(this.metadata);
  }

  calculateKeyFromCapo(): string | null {
    const capoString = this.getSingle(CAPO);
    const keyString = this.getSingle(KEY);

    if (capoString && keyString) {
      const key: Key | null = Key.parse(keyString);

      if (!key) {
        throw new Error(`Could not parse ${keyString}`);
      }

      const capo = parseInt(capoString, 10);
      return key.transpose(capo).normalize().toString();
    }

    return null;
  }

  assign(metadata: Record<string, string | string[] | null>): void {
    Object
      .keys(metadata)
      .filter((key) => !isReadonlyTag(key))
      .forEach((key) => {
        const value = metadata[key];

        if (value === null || value === undefined) {
          return;
        }

        if (value instanceof Array) {
          this.metadata[key] = [...value];
        } else if (value === null) {
          delete this.metadata[key];
        } else {
          this.metadata[key] = value.toString();
        }
      });
  }
}

export default Metadata;
