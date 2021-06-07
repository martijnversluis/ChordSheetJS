class Composite {
  constructor(expressions, variable = null) {
    this.expressions = expressions;
    this.variable = variable;
  }

  evaluate(metadata) {
    return this.expressions.map((expression) => (
      expression.evaluate(metadata, this.variable)
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
