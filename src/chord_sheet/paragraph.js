import { INDETERMINATE } from '../constants';

export default class Paragraph {
  constructor() {
    this.lines = [];
  }

  addLine(line) {
    this.lines.push(line);
  }

  get type() {
    const types = this.lines.map(line => line.type);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 1) {
      return uniqueTypes[0];
    }

    return INDETERMINATE;
  }
}
