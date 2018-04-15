export default class CloneableStub {
  constructor(value) {
    this.value = value;
  }

  clone() {
    return new CloneableStub(this.value);
  }
}
