import Composite from './composite';
import Evaluatable from './evaluatable';
import EvaluationError from './evaluation_error';
import Metadata from '../metadata';
import TraceInfo from '../trace_info';
import { isEmptyString } from '../../utilities';

export type TernaryProperties = TraceInfo & {
  variable?: string | null;
  valueTest?: string | null;
  trueExpression?: Evaluatable[];
  falseExpression?: Evaluatable[];
};

class Ternary extends Evaluatable {
  variable: string | null;

  valueTest: string | null;

  trueExpression: Evaluatable[] = [];

  falseExpression: Evaluatable[] = [];

  constructor(
    {
      variable = null,
      valueTest = null,
      trueExpression = [],
      falseExpression = [],
      line = null,
      column = null,
      offset = null,
    }: TernaryProperties,
  ) {
    super({ line, column, offset });
    this.variable = variable || null;
    this.valueTest = valueTest || null;
    this.trueExpression = trueExpression;
    this.falseExpression = falseExpression;
  }

  /**
   * Evaluate the meta expression
   * @param {Metadata} metadata The metadata object to use for evaluating the expression
   * @param {string} [metadataSeparator=null] The metadata separator to use if necessary
   * @returns {string} The evaluated expression
   */
  evaluate(metadata: Metadata, metadataSeparator: string, upperContext: string | null = null): string {
    if (this.variable) {
      return this.evaluateWithVariable(metadata, metadataSeparator);
    }

    if (!upperContext) {
      throw new EvaluationError('Unexpected empty expression', this.line, this.column, this.offset);
    }

    return this.evaluateToString(metadata.get(upperContext) || '', metadataSeparator);
  }

  evaluateToString(value: string[] | string, metadataSeparator: string): string {
    if (Array.isArray(value)) {
      return value.join(metadataSeparator);
    }

    return value;
  }

  evaluateWithVariable(metadata: Metadata, metadataSeparator: string): string {
    if (!this.variable) {
      throw new Error('Expected this.variable to be present');
    }

    const value = metadata.get(this.variable);

    if (value && (isEmptyString(this.valueTest) || value === this.valueTest)) {
      return this.evaluateForTruthyValue(metadata, metadataSeparator, value);
    }

    if (this.falseExpression.length) {
      return new Composite(this.falseExpression, this.variable).evaluate(metadata, metadataSeparator);
    }

    return '';
  }

  evaluateForTruthyValue(metadata: Metadata, metadataSeparator: string, value: string | string[]): string {
    if (this.trueExpression.length) {
      return new Composite(this.trueExpression, this.variable).evaluate(metadata, metadataSeparator);
    }

    return this.evaluateToString(value, metadataSeparator);
  }

  isRenderable(): boolean {
    return true;
  }

  clone(): Ternary {
    return new Ternary({
      variable: this.variable,
      valueTest: this.valueTest,
      trueExpression: this.trueExpression.map((part) => part.clone()),
      falseExpression: this.falseExpression.map((part) => part.clone()),
      line: this.line,
      column: this.column,
      offset: this.offset,
    });
  }
}

export default Ternary;
