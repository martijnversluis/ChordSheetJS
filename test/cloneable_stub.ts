export default class CloneableStub {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  clone() {
    return new CloneableStub(this.value);
  }
}
