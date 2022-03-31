class Composite {
  constructor(expressions, variable = null) {
    this.expressions = expressions;
    this.variable = variable;
  }

  evaluate(metadata, metadataSeparator) {
    return this.expressions.map((expression) => (
      expression.evaluate(metadata, metadataSeparator, this.variable)
    )).join('');
  }

  isRenderable() {
    return true;
  }

  clone() {
    return new Composite({
      expressions: this.expressions.map((expression) => expression.clone()),
      variable: this.variable,
    });
  }
}

export default Composite;
