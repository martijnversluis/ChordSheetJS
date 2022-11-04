import Evaluatable from './evaluatable';
import Metadata from '../metadata';

class Composite extends Evaluatable {
  expressions: Evaluatable[] = [];

  variable: string | null;

  constructor(expressions: Evaluatable[], variable: string | null = null) {
    super();
    this.expressions = expressions;
    this.variable = variable;
  }

  evaluate(metadata: Metadata, metadataSeparator: string): string {
    return this.expressions.map((expression) => (
      expression.evaluate(metadata, metadataSeparator, this.variable)
    )).join('');
  }

  isRenderable(): boolean {
    return true;
  }

  clone(): Composite {
    return new Composite(
      this.expressions.map((expression) => expression.clone()),
      this.variable,
    );
  }
}

export default Composite;
