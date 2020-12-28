function appendValue(array, key, value) {
  if (!array.includes(value)) {
    array.push(value);
  }
}

/**
 * Stores song metadata
 */
class Metadata {
  constructor(metadata = {}) {
    Object.keys(metadata).forEach((key) => {
      const value = metadata[key];
      this.add(key, value);
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

  clone() {
    const clone = new Metadata();

    Object.keys(this).forEach((key) => {
      const value = this[key];

      if (value instanceof Array) {
        clone[key] = [...value];
      } else {
        clone[key] = value;
      }
    });

    return clone;
  }
}

export default Metadata;
