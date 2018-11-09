class Metadata {
  constructor(metadata = {}) {
    this.assign(metadata);
  }

  assign(metaData) {
    this.rawMetaData = {};

    Object.keys(metaData).forEach((key) => {
      this.set(key, metaData[key]);
    });
  }

  set(name, value) {
    this.optimizedMetaData = null;

    if (value && value.constructor && value.constructor.name === 'Array') {
      this.rawMetaData[name] = new Set(value);
      return;
    }

    if (!(name in this.rawMetaData)) {
      this.rawMetaData[name] = new Set();
    }

    this.rawMetaData[name].add(value);
  }

  get(name) {
    return this.getAll()[name] || null;
  }

  getAll() {
    if (!this.optimizedMetaData) {
      this.optimizedMetaData = this.getOptimizedMetaData();
    }

    return this.optimizedMetaData;
  }

  getExtended() {
    return {
      ...this.getArrayValues(),
      ...this.getAll(),
    };
  }

  getOptimizedMetaData() {
    const optimizedMetaData = {};

    Object.keys(this.rawMetaData).forEach((key) => {
      const valueSet = this.rawMetaData[key];
      optimizedMetaData[key] = this.optimizeMetaDataValue(valueSet);
    });

    return optimizedMetaData;
  }

  getArrayValues() {
    const arrayValues = {};

    Object.keys(this.rawMetaData).forEach((key) => {
      const valueSet = this.rawMetaData[key];
      const values = [...valueSet];

      if (values.length <= 1) {
        return;
      }

      values.forEach((value, index) => arrayValues[`${key}.${index + 1}`] = value);
    });

    return arrayValues;
  }

  optimizeMetaDataValue(valueSet) {
    if (valueSet === undefined) {
      return null;
    }

    const values = [...valueSet];

    if (values.length === 1) {
      return values[0];
    }

    return values;
  }

  clone() {
    const clonedMetadata = new Metadata();
    clonedMetadata.rawMetaData = { ...this.rawMetaData };
    return clonedMetadata;
  }
}

export default Metadata;
