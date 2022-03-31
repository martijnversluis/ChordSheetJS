import EvaluationError from './evaluation_error';
import { isPresent, presence } from '../../utilities';
import Composite from './composite';
import Metadata from '../metadata';

class Ternary {
  constructor(
    {
      variable = null,
      valueTest = null,
      trueExpression = null,
      falseExpression = null,
      line = null,
      column = null,
      offset = null,
    } = {},
  ) {
    this.variable = presence(variable);
    this.valueTest = valueTest;
    this.trueExpression = trueExpression;
    this.falseExpression = falseExpression;
    this.line = line;
    this.column = column;
    this.offset = offset;
  }

  /**
   * Evaluate the meta expression
   * @param {Metadata} metadata The metadata object to use for evaluating the expression
   * @param {string} [metadataSeparator=null] The metadata separator to use if necessary
   * @returns {string} The evaluated expression
   */
  evaluate(metadata, metadataSeparator = null, upperContext = null) {
    if (this.variable) {
      return this.evaluateWithVariable(metadata, metadataSeparator);
    }

    if (!upperContext) {
      throw new EvaluationError('Unexpected empty expression', this.line, this.column, this.offset);
    }

    return this.evaluateToString(metadata.get(upperContext), metadataSeparator);
  }

  evaluateToString(value, metadataSeparator) {
    if (Array.isArray(value)) {
      return value.join(metadataSeparator);
    }

    return value;
  }

  evaluateWithVariable(metadata, metadataSeparator) {
    const value = metadata.get(this.variable);

    if (isPresent(value) && (!this.valueTest || value === this.valueTest)) {
      return this.evaluateForTruthyValue(metadata, metadataSeparator, value);
    }

    if (this.falseExpression) {
      return new Composite(this.falseExpression, this.variable).evaluate(metadata, metadataSeparator);
    }

    return '';
  }

  evaluateForTruthyValue(metadata, metadataSeparator, value) {
    if (this.trueExpression) {
      return new Composite(this.trueExpression, this.variable).evaluate(metadata, metadataSeparator);
    }

    return value;
  }

  isRenderable() {
    return true;
  }

  clone() {
    return new Ternary({
      variable: this.variable,
      valueTest: this.valueTest,
      trueExpression: this.trueExpression?.map((part) => part.clone()),
      falseExpression: this.falseExpression?.map((part) => part.clone()),
      line: this.line,
      column: this.column,
      offset: this.offset,
    });
  }
}

export default Ternary;
